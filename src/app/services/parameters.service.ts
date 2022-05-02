import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { ResponseAPIMultipago } from '../models/ResponseAPI';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  ParamURL: string = environment.urlServicio + 'external_services/';
  urlRedirect: string = environment.url_redirect;
  constructor(private http: HttpClient) {}

  createMeeting(
    code: string,
    asunto: string,
    password: string,
    date: string
  ): Observable<MeetingConfig> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let param = JSON.stringify({
      code: code,
      asunto: asunto,
      password: password,
      date: date,
    });
    return this.http
      .post<zoomResp<MeetingConfig>>(
        environment.zoom_backend + 'zoom/createMeeting',
        param,
        {
          headers: headers,
        }
      )
      .pipe(
        map((response: zoomResp<MeetingConfig>) => {
          console.log('response RespToken:>> ', response);
          if (response.statusCode == 10000) {
            return response.data;
          }
          return null;
          // return throwError("Error ");
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }
  getCreateMeetingParam(asunto: string, password: string, date: string): any {
    let myParam: any = JSON.parse(
      '{"topic": "Test API Meeting","type": 2,"start_time": "2022-04-30T23:55:00","duration": 40,"timezone": "America/La_Paz","password": "8789e3","agenda": "My agenda goes here","settings": {"host_video": true,"participant_video": true,"cn_meeting": false,"in_meeting": false,"join_before_host": false,"mute_upon_entry": false,"watermark": false,"use_pmi": false,"approval_type": 2,"registration_type": 1,"audio": "both","auto_recording": "none"          "close_registration": true,"waiting_room": true,"contact_name": "MLD Foundation","contact_email": "zoom@MLDfoundation.org","registrants_email_notification": true}}'
    );
    myParam.topic = asunto;
    myParam.password = password;
    myParam.start_time = date;
    return myParam;
  }

  GetParameters(serviceCode: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('service_code', serviceCode);
    console.log('params :>> ', params);
    return this.http
      .get<MeetingConfig>(this.ParamURL + 'get_parameters', {
        headers,
        params,
      })
      .pipe(
        map((response: MeetingConfig) => {
          console.log('response  parameter :>> ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error parameter :>> ', error);
          return throwError(error.error.message);
        })
      );
  }

  UpdateParameter(
    id: number,
    name: string,
    value: string,
    description: string
  ) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let param = JSON.stringify({
      id: id,
      name: name,
      value: value,
      description: description,
    });

    return this.http
      .post<ResponseAPIMultipago>(this.ParamURL + 'update_parameter', param, {
        headers: headers,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  EditParameter(id: number) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('id', id.toString());

    return this.http
      .get<ResponseAPIMultipago>(this.ParamURL + 'get_parameter', {
        headers: headers,
        params,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }
}

export interface RespToken {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

// MeetingConfig

export interface zoomResp<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface MeetingConfig {
  uuid: string;
  id: number;
  host_id: string;
  host_email: string;
  topic: string;
  type: number;
  status: string;
  start_time: Date;
  duration: number;
  timezone: string;
  agenda: string;
  created_at: Date;
  start_url: string;
  join_url: string;
  password: string;
  h323_password: string;
  pstn_password: string;
  encrypted_password: string;
  settings: Settings;
  pre_schedule: boolean;
}

export interface Settings {
  host_video: boolean;
  participant_video: boolean;
  cn_meeting: boolean;
  in_meeting: boolean;
  join_before_host: boolean;
  jbh_time: number;
  mute_upon_entry: boolean;
  watermark: boolean;
  use_pmi: boolean;
  approval_type: number;
  audio: string;
  auto_recording: string;
  enforce_login: boolean;
  enforce_login_domains: string;
  alternative_hosts: string;
  alternative_host_update_polls: boolean;
  close_registration: boolean;
  show_share_button: boolean;
  allow_multiple_devices: boolean;
  registrants_confirmation_email: boolean;
  waiting_room: boolean;
  request_permission_to_unmute_participants: boolean;
  registrants_email_notification: boolean;
  meeting_authentication: boolean;
  encryption_type: string;
  approved_or_denied_countries_or_regions: ApprovedOrDeniedCountriesOrRegions;
  breakout_room: ApprovedOrDeniedCountriesOrRegions;
  alternative_hosts_email_notification: boolean;
  device_testing: boolean;
  focus_mode: boolean;
  private_meeting: boolean;
  email_notification: boolean;
}

export interface ApprovedOrDeniedCountriesOrRegions {
  enable: boolean;
}
