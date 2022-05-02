import {GoogleAnalyticsService} from './services/google-analytics.service';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthorizatedGuard} from './Guards/authorizated-guard';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './Components/login/login.component';
import {MenuComponent} from './Components/menu/menu.component';
import {PrincipalComponent} from './Components/principal/principal.component';
import {HeaderComponent} from './Components/header/header.component';
import {ContenedorBackofficeComponent} from './Components/contenedor-backoffice/contenedor-backoffice.component';
import {MovementsComponent} from './components/movements/movements.component';
import {QrvalidatorComponent, TicketDialog, TicketResultDialog} from './components/qrvalidator/qrvalidator.component';
import {AuthInterceptorService} from './services/auth-interceptor.service';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {ReportByCouponComponent} from './components/report-by-coupon/report-by-coupon.component';
import {ReportByStateComponent} from './components/report-by-state/report-by-state.component';
import {ReportByPaymentChannelComponent} from './components/report-by-payment-channel/report-by-payment-channel.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BlockUIModule} from 'ng-block-ui';
import {ToastrModule} from 'ngx-toastr';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {NgxPaginationModule} from 'ngx-pagination';
import {
  confirmationDisablePopUp,
  editSectorPopUp,
  getUrlSectorPopUp,
  SectorsComponent
} from './Components/sectors/sectors.component';
import {PerfilIndexComponent} from './Components/perfil/perfil-index/perfil-index.component';
import {PerfilVerComponent} from './Components/perfil/perfil-ver/perfil-ver.component';
import {DialogoComponent} from './Components/component/dialogo/dialogo.component';
import {ArbolPermisoComponent} from './Components/component/arbol-permiso/arbol-permiso.component';
import {TreeviewModule} from 'ngx-treeview';
import {MaterialModule} from './material';
import {PerfilFormComponent} from './Components/perfil/perfil-form/perfil-form.component';
import {LoginChangePasswordComponent} from './Components/login-change-password/login-change-password.component';
import {ChangePasswordComponent} from './Components/change-password/change-password.component';
import {UserIndexComponent} from './Components/user/user-index/user-index.component';
import {UserFormComponent} from './Components/user/user-form/user-form.component';
import {ParametersComponent} from './Components/parameters/parameters.component';
import {ParameterComponent} from './Components/parameters/parameter.component';
import {UserVerComponent} from './Components/user/user-ver/user-ver.component';
import {ClipboardModule} from 'ngx-clipboard';
import {DeliveryComponent} from './components/delivery/delivery.component';
import {NgxSmartModalModule} from 'ngx-smart-modal';
import {CancelPaymentComponent} from './Components/payment-generator/cancel-payment/cancel-payment.component';
import {DetailsComponent} from './Components/payment-generator/details/details.component';
import {PaymentGeneratorIndexComponent} from './Components/payment-generator/payment-generator-index/payment-generator-index.component';
import {NewItemComponent} from './Components/new-pay-order/new-item/new-item.component';
import {PayOrderCreatedComponent} from './Components/new-pay-order/pay-order-created/pay-order-created.component';
import {PayOrderFormComponent} from './Components/new-pay-order/pay-order-form/pay-order-form.component';
import {ReportPayedOrdersComponent} from './Components/report-payed-orders/report-payed-orders.component';
import {VoucherCompanyIndexComponent} from './Components/voucher-company/voucher-company-index/voucher-company-index.component';
import {VoucherCompanyFormComponent} from './Components/voucher-company/voucher-company-form/voucher-company-form.component';
import {VoucherPackageComponent} from './Components/voucher-package/voucher-packages/voucher-packages.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {AssignVoucherPackageComponent} from './Components/voucher-package/assign-voucher-package/assign-voucher-package.component';
import {VoucherPackageDialogComponent} from './Components/voucher-package/voucher-package-dialog/voucher-package-dialog.component';
import {DiscountVoucherIndexComponent} from './Components/discount-voucher/discount-voucher-index/discount-voucher-index.component';
import {DiscountVoucherFormComponent} from './Components/discount-voucher/discount-voucher-form/discount-voucher-form.component';
import {CancelVoucherComponent} from './Components/discount-voucher/cancel-voucher/cancel-voucher.component';
import {ExternalUserIndexComponent} from './Components/external-user/external-user-index/external-user-index.component';
import {ExternalUserFormComponent} from './Components/external-user/external-user-form/external-user-form.component';

import {TwoDigitDecimaNumberDirective} from './helper/onkey_twoDigitDecimaNumber';
import {OnlynumberDirective} from './helper/onkey_onlynumber';
import {ViewVoucherPackagesComponent} from './Components/voucher-package/view-voucher-packages/view-voucher-packages.component';
import {AmountDirective} from './directives/amount.directive';
import {DetailsVoucherComponent} from './Components/discount-voucher/details-voucher/details-voucher.component';
import {NgSelect2Module} from 'ng-select2';
import {ReportDetailedTransactionsComponent} from './Components/report-detailed-transactions/report-detailed-transactions.component';
import {ReportComissionsTransactionsComponent} from './Components/report-comissions-transactions/report-comissions-transactions.component';
import {ReportQrIndexComponent} from './Components/report-qr/report-qr-index/report-qr-index.component';
import {MatTabsModule} from '@angular/material/tabs';
import {ReportCommissionsDetailedComponent} from './Components/report-commissions-detailed/report-commissions-detailed.component';
import {AssignUserDialogComponent} from './Components/voucher-package/assign-user-dialog/assign-user-dialog.component';
import {ReportByChannelComponent} from './Components/report-by-channel/report-by-channel.component';
import {CurrencyMaskInputMode, NgxCurrencyModule} from "ngx-currency";
import {PaymentsOnDeliveryIndexComponent} from './Components/payments_on_delivery/payments-on-delivery-index/payments-on-delivery-index.component';
import {FilterPipe} from './shared/pipes/filter.pipe';
import {ToNumberPipe} from './shared/pipes/to-number.pipe';
import {SafeHtmlPipe} from './shared/pipes/safe-html.pipe';
import {PosConfigurationComponent} from './Components/pos-configuration/pos-configuration.component';
import {PosConfigurationDialogComponent} from './Components/pos-configuration-dialog/pos-configuration-dialog.component';
import {NgxMaskModule} from "ngx-mask";
import { ReportByCanjeComponent } from './Components/report-by-canje/report-by-canje.component';

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: '.',
  nullable: false,
  min: 0,
  max: 999999999,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginChangePasswordComponent,
    MenuComponent,
    PrincipalComponent,
    HeaderComponent,
    ChangePasswordComponent,
    ContenedorBackofficeComponent,
    MovementsComponent,
    QrvalidatorComponent,
    TicketDialog,
    ReportByCouponComponent,
    ReportByStateComponent,
    ReportByPaymentChannelComponent,
    SectorsComponent,
    PerfilIndexComponent,
    PerfilVerComponent,
    DialogoComponent,
    ArbolPermisoComponent,
    PerfilFormComponent,
    UserIndexComponent,
    UserFormComponent,
    ParametersComponent,
    ParameterComponent,
    UserVerComponent,
    DeliveryComponent,
    CancelPaymentComponent,
    DetailsComponent,
    PaymentGeneratorIndexComponent,
    NewItemComponent,
    PayOrderCreatedComponent,
    PayOrderFormComponent,
    ReportPayedOrdersComponent,
    VoucherCompanyIndexComponent,
    VoucherCompanyFormComponent,
    VoucherPackageComponent,
    AssignVoucherPackageComponent,
    AssignUserDialogComponent,
    VoucherPackageDialogComponent,
    DiscountVoucherIndexComponent,
    DiscountVoucherFormComponent,
    CancelVoucherComponent,
    TwoDigitDecimaNumberDirective,
    OnlynumberDirective,
    ExternalUserIndexComponent,
    ExternalUserFormComponent,
    ViewVoucherPackagesComponent,
    AmountDirective,
    DetailsVoucherComponent,
    ReportDetailedTransactionsComponent,
    ReportComissionsTransactionsComponent,
    ReportQrIndexComponent,
    ReportCommissionsDetailedComponent,
    ReportByChannelComponent,
    PaymentsOnDeliveryIndexComponent,
    FilterPipe,
    ToNumberPipe,
    SafeHtmlPipe,
    PosConfigurationComponent,
    PosConfigurationDialogComponent,
    ReportByCanjeComponent,
  ],
  imports: [
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgxMaskModule.forRoot(),
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    NgSelect2Module,
    HttpClientModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    BrowserAnimationsModule,
    TreeviewModule.forRoot(),
    ClipboardModule,
    BlockUIModule.forRoot({
      message: 'Espere un momento por favor',
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: true,
    }),
    MatDialogModule,
    MatDatepickerModule,
    NgxPaginationModule,
    NgxSmartModalModule.forRoot(),
    MatTabsModule,
  ],
  exports: [MatDialogModule, FormsModule, ReactiveFormsModule],
  providers: [
    GoogleAnalyticsService,
    AuthorizatedGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TicketDialog,
    TicketResultDialog,
    confirmationDisablePopUp,
    editSectorPopUp,
    getUrlSectorPopUp,
  ],
})
export class AppModule {
}
