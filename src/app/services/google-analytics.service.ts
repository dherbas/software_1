import { EnumGoogleEvento, EnumGoogleCategoria } from './../helper/enum';
import { Injectable } from '@angular/core';
declare let gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null
  ) {
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue,
    });
  }
  public eventUrlMultipago(eventAction: string) {
    return this.eventEmitter(
      EnumGoogleEvento.Url_Multipago,
      EnumGoogleCategoria.Url_Multipago,
      eventAction
    );
  }
  public eventCanjeVale(eventAction: string) {
    return this.eventEmitter(
      EnumGoogleEvento.Canje_Vale,
      EnumGoogleCategoria.Canje_Vale,
      eventAction
    );
  }
}
