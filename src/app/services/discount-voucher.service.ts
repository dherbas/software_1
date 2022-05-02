import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, switchMap} from 'rxjs/operators';

import {ErrorServicio} from '../helper/error-servicio';
import {ResponseAPIMultipago} from '../models/ResponseAPI';
import {StorageService} from './storage.service';
import {FilterVoucher} from '../helper/filter';
import {DiscountVoucher} from '../models/discount_voucher';
import * as Excel from 'exceljs';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import {VoucherPackage} from '../models/voucher-package';
import {EnumEstado, EnumVoucherStatus} from '../helper/enum';

@Injectable({
  providedIn: 'root',
})
export class DiscountVoucherService {
  error: any;
  handleError: any;
  VoucherURL: string = `${environment.urlServicio}` + 'external_services';

  constructor(
    private httpClient: HttpClient,
    private sessionService: StorageService
  ) {
  }

  getDVoucher(id_voucher: any): Observable<ResponseAPIMultipago> {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    let paramsService = new HttpParams();
    paramsService = paramsService.append(
      'id_voucher',
      id_voucher + ''
    );
    return this.httpClient
      .get(this.VoucherURL + '/getDiscountVoucher', {
        params: paramsService,
        headers: reqHeader,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('response discount voucher :>> ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error discount voucher :>> ', error);
          return throwError(error);
        })
      );
  }

  getDiscoutVouchers(filter: FilterVoucher) {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    let paramsService = new HttpParams();
    paramsService = paramsService.append('status', filter.state.toString());
    paramsService = paramsService.append('search', filter.search);
    paramsService = paramsService.append(
      'idVoucherPackage',
      filter.id_package_voucher + ''
    );

    return this.httpClient
      .get(this.VoucherURL + '/getDiscountVouchers', {
        params: paramsService,
        headers: reqHeader,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('response discount voucher :>> ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error discount voucher :>> ', error);
          return throwError(error);
        })
      );
  }

  cancelVoucher(idVoucher: number, reason: string, consumeServices: boolean) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    let param = JSON.stringify({
      idVoucher: idVoucher,
      reason_canceled: reason,
      consumeServices: consumeServices
    });

    return this.httpClient
      .post<ResponseAPIMultipago>(this.VoucherURL + '/cancelVoucher', param, {
        headers,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('resp cancel ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error cancel', error);
          return throwError(error);
        })
      );
  }

  saveVoucher(
    idPackageVoucher: number,
    listVouchers: DiscountVoucher[],
    start_date: Date,
    end_date: Date
  ) {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    const param = {
      voucher_packages_id: idPackageVoucher,
      list_vouchers: listVouchers,
      start_date: start_date,
      end_date: end_date
    };
    console.log('param :>> ', JSON.stringify(param));
    console.log('this.voucherURL :>> ', this.VoucherURL + '/saveVoucher');
    return this.httpClient
      .post(this.VoucherURL + '/saveVoucher', param, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return <ResponseAPIMultipago> response.body;
        }),

        catchError((error) => {
          console.log('error guardar voucher :>> ', error);
          return throwError(error);
        })
      );
  }

/* saveVoucherPersonalized
  saveVoucherPersonalized(
    idPackageVoucher: number,
    listVouchers: DiscountVoucher[],
    start_date: Date,
    end_date: Date,
    consumeServices: boolean
    ) {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    const param = {
      voucher_packages_id: idPackageVoucher,
      list_vouchers: listVouchers,
      start_date: start_date,
      end_date: end_date,
      consumeServices: consumeServices
    };
    console.log('param :>> ', JSON.stringify(param));
    // console.log('this.voucherURL :>> ', this.VoucherURL + '/saveVoucherPersonalized');
    console.log('this.voucherURL :>> ', this.VoucherURL + '/saveVoucher');
    return this.httpClient
      .post(this.VoucherURL + '/saveVoucherPersonalized', param, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return <ResponseAPIMultipago> response.body;
        }),

        catchError((error) => {
          console.log('error guardar voucher :>> ', error);
          return throwError(error);
        })
      );
  }
*/

  errorHandler(error: Response) {
    console.log('error :>> ', error);
    if (error['error'] != null || error['error'] != undefined) {
      var miError: ErrorServicio = error['error'];
      return throwError(miError);
    }
    var jsonError = JSON.stringify(error);
    return throwError(error);
  }

  async downloadXlsx(discountVouchers: DiscountVoucher[], voucherPackage: VoucherPackage) {

    const Filename = 'Vales_Generados_' + moment().format('DDMMYYYY');
    const header = ['Nombre', 'Cédula de identidad', 'Teléfono/Celular', 'Correo electrónico', 'Monto del vale (Bs.)', 'Fecha de asignación', 'Fecha de consumo', 'Estado'];

    const base64 = await this.httpClient.get('../../assets/img/logo_m_menu.png', {responseType: 'blob'})
      .pipe(switchMap(blob => this.convertBlobToBase64(blob))).toPromise();

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Vales');

    const logo = workbook.addImage({
      base64,
      extension: 'png',
    });
    worksheet.addImage(logo, 'A1:A4');
    worksheet.mergeCells('A1:A4');
    worksheet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};

    worksheet.mergeCells('A5:H5');
    worksheet.getCell('A5').border = {top: {style: 'thick', color: {argb: 'DDEBF7'}}};

    worksheet.getCell('H2').value = voucherPackage.company_name;
    worksheet.getCell('H2').font = {name: 'Calibri', family: 4, size: 14, bold: true, color: {argb: '366092'}};
    worksheet.getCell('H3').value = moment().format('DD/MM/YYYY h:mm:ss');

    worksheet.getColumn('A').fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}};
    worksheet.getColumn('B').fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}};
    worksheet.getColumn('C').fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}};
    worksheet.getColumn('D').fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}};
    worksheet.getColumn('E').fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}};
    worksheet.getColumn('F').fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}};
    worksheet.getColumn('G').fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}};
    worksheet.getColumn('H').fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF'}, bgColor: {argb: 'FFFFFF'}};

    worksheet.getColumn('E').alignment = {vertical: 'middle', horizontal: 'right'};
    worksheet.getColumn('F').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getColumn('G').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getColumn('H').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getCell('H3').alignment = {horizontal: 'right'};
    worksheet.getCell('H2').alignment = {horizontal: 'right'};

    worksheet.getColumn('A').width = 32;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 30;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 20;
    worksheet.getColumn('G').width = 20;
    worksheet.getColumn('H').width = 20;


    worksheet.getCell('A9').value = 'Empresa de canje:';
    worksheet.getCell('A9').font = {name: 'Calibri', family: 4, size: 11, bold: true};
    worksheet.getCell('B9').value = this.sessionService.getCurrentUser().list_code_service[0].name;

    const amount = Number(voucherPackage.amount).valueOf();
    const amountUsed = Number(voucherPackage.amount_used).valueOf();

    worksheet.getRow(10).alignment = {horizontal: 'left'};
    worksheet.getRow(11).alignment = {horizontal: 'left'};

    worksheet.getCell('A10').value = 'Monto asignado (Bs.):';
    worksheet.getCell('A10').font = {bold: true};
    worksheet.getCell('B10').numFmt = '0.00';
    worksheet.getCell('B10').value = amount;

    worksheet.getCell('D10').value = 'Monto disponible (Bs.):';
    worksheet.getCell('D10').font = {bold: true};
    worksheet.getCell('E10').numFmt = '0.00';
    worksheet.getCell('E10').value = amount - amountUsed;

    worksheet.getCell('G10').value = 'Monto utilizado (Bs.):';
    worksheet.getCell('G10').font = {bold: true};
    worksheet.getCell('H10').numFmt = '0.00';
    worksheet.getCell('H10').value = amountUsed;
    worksheet.getCell('H10').font = {color: {argb: 'FF0000'}};

    worksheet.getCell('A11').value = 'Fecha de inicio:';
    worksheet.getCell('A11').font = {bold: true};
    worksheet.getCell('B11').value = moment(voucherPackage.start_date).format('DD/MM/YYYY');

    worksheet.getCell('D11').value = 'Fecha de fin:';
    worksheet.getCell('D11').font = {bold: true};
    worksheet.getCell('E11').value = moment(voucherPackage.expiration_date).format('DD/MM/YYYY');

    worksheet.getCell('G11').value = 'Estado de la bolsa:';
    worksheet.getCell('G11').font = {bold: true};
    worksheet.getCell('H11').value = voucherPackage.voucher_package_parent.status == EnumEstado.Habilitado ? 'Habilitado' : 'Deshabilitado';

    if (voucherPackage.status == EnumVoucherStatus.Expired) {
      worksheet.getCell('H11').font = {color: {argb: 'FF0000'}};
    }

    worksheet.getRow(13).values = header;
    worksheet.getRow(13).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'DDEBF7'},
        bgColor: {argb: 'DDEBF7'}
      };
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}};
      cell.font = {name: 'Calibri', bold: true};
      cell.alignment = {horizontal: 'center'};
    });

    worksheet.mergeCells('A6:H6');
    worksheet.getCell('A6').value = 'Vales generados';
    worksheet.getCell('A6').font = {name: 'Calibri', family: 4, size: 18, bold: true, color: {argb: '366092'}};
    worksheet.getCell('A6').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.mergeCells('A7:H7');
    worksheet.getCell('A7').value = '"' + voucherPackage.description + '"';
    worksheet.getCell('A7').font = {name: 'Calibri', family: 4, size: 18, bold: true, color: {argb: '366092'}};
    worksheet.getCell('A7').alignment = {vertical: 'middle', horizontal: 'center'};

    let row = 14;
    discountVouchers.forEach(element => {
      worksheet.getCell('A' + row.toString()).value = element.first_name + ' ' + element.last_name;
      worksheet.getCell('B' + row.toString()).value = element.ci;
      worksheet.getCell('C' + row.toString()).value = element.phone_number;
      worksheet.getCell('D' + row.toString()).value = element.email;
      worksheet.getCell('E' + row.toString()).numFmt = '0.00';
      worksheet.getCell('E' + row.toString()).value = Number(element.amount).valueOf();
      worksheet.getCell('F' + row.toString()).value = moment(element.assigned_date).format('DD/MM/YYYY');
      worksheet.getCell('G' + row.toString()).value = element.status == EnumVoucherStatus.Used ? moment(element.updated_at).format('DD/MM/YYYY') : '';
      worksheet.getCell('H' + row.toString()).value = this.getStatus(element.status);
      worksheet.getRow(row).eachCell((cell) => {
        cell.border = {top: {style: 'dotted'}, left: {style: 'dotted'}, bottom: {style: 'dotted'}, right: {style: 'dotted'}};
      });
      row++;
    });
    worksheet.mergeCells('A' + row.toString() + ':F' + row.toString());
    worksheet.getCell('A' + row.toString()).border = {top: {style: 'thin'}};
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, Filename + '.xlsx');
    });
  }

  forwardVoucher(id: number) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    const param = {
      discount_voucher_id: id,
    };
    return this.httpClient
      .post(this.VoucherURL + '/forwardVoucher', param, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return <ResponseAPIMultipago> response.body;
        }),

        catchError((error) => {
          console.log('error forward voucher :>> ', error);
          return throwError(error);
        })
      );
  }

  private convertBlobToBase64(blob: Blob): string {
    return Observable.create(observer => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        observer.next(event.target.result);
        observer.complete();
      };

      reader.onerror = (event: any) => {
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }

  private getStatus(status): string {
    switch (status) {
      case EnumVoucherStatus.NoUsed:
        return 'No usado';
      case EnumVoucherStatus.Used:
        return 'Usada';
      case EnumVoucherStatus.Canceled:
        return 'Anulado';
      default:
        return '';
    }
  }

}
