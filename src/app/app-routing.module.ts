import { ReportCommissionsDetailedComponent } from './Components/report-commissions-detailed/report-commissions-detailed.component';
import { ReportQrIndexComponent } from './Components/report-qr/report-qr-index/report-qr-index.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { ContenedorBackofficeComponent } from './Components/contenedor-backoffice/contenedor-backoffice.component';
import { PrincipalComponent } from './Components/principal/principal.component';
import { MovementsComponent } from './components/movements/movements.component';
import { QrvalidatorComponent } from './components/qrvalidator/qrvalidator.component';
import { AuthorizatedGuard } from './Guards/authorizated-guard';
import { ReportByCouponComponent } from './components/report-by-coupon/report-by-coupon.component';
import { ReportByPaymentChannelComponent } from './components/report-by-payment-channel/report-by-payment-channel.component';
import { ReportByStateComponent } from './components/report-by-state/report-by-state.component';
import { SectorsComponent } from './Components/sectors/sectors.component';
import { PerfilIndexComponent } from './Components/perfil/perfil-index/perfil-index.component';
import { PerfilFormComponent } from './Components/perfil/perfil-form/perfil-form.component';

import { LoginChangePasswordComponent } from './Components/login-change-password/login-change-password.component';
import { ChangePasswordComponent } from './Components/change-password/change-password.component';
import { UserIndexComponent } from './Components/user/user-index/user-index.component';
import { UserFormComponent } from './Components/user/user-form/user-form.component';
import { ParametersComponent } from './Components/parameters/parameters.component';
import { ParameterComponent } from './Components/parameters/parameter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { PaymentGeneratorIndexComponent } from './Components/payment-generator/payment-generator-index/payment-generator-index.component';
import { PayOrderFormComponent } from './Components/new-pay-order/pay-order-form/pay-order-form.component';
import { ReportPayedOrdersComponent } from './Components/report-payed-orders/report-payed-orders.component';
import { VoucherCompanyIndexComponent } from './Components/voucher-company/voucher-company-index/voucher-company-index.component';
import { VoucherPackageComponent } from './Components/voucher-package/voucher-packages/voucher-packages.component';
// import { AssingVoucherPackageComponent } from './Components/voucher-package/assing-voucher-package/assing-voucher-package.component';
import { ExternalUserIndexComponent } from './Components/external-user/external-user-index/external-user-index.component';
import { ExternalUserFormComponent } from './Components/external-user/external-user-form/external-user-form.component';
import { DiscountVoucherIndexComponent } from './Components/discount-voucher/discount-voucher-index/discount-voucher-index.component';
import { DiscountVoucherFormComponent } from './Components/discount-voucher/discount-voucher-form/discount-voucher-form.component';
import { AssignVoucherPackageComponent } from './Components/voucher-package/assign-voucher-package/assign-voucher-package.component';
import { ReportDetailedTransactionsComponent } from './Components/report-detailed-transactions/report-detailed-transactions.component';
import { ReportComissionsTransactionsComponent } from './Components/report-comissions-transactions/report-comissions-transactions.component';
import { ReportByChannelComponent } from './Components/report-by-channel/report-by-channel.component';
import { PaymentsOnDeliveryIndexComponent } from './Components/payments_on_delivery/payments-on-delivery-index/payments-on-delivery-index.component';
import { PosConfigurationComponent } from './Components/pos-configuration/pos-configuration.component';
import { ReportByCanjeComponent } from './Components/report-by-canje/report-by-canje.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'password', component: LoginChangePasswordComponent },
  {
    path: 'backoffice',
    component: ContenedorBackofficeComponent,

    children: [
      {
        path: 'principal',
        component: PrincipalComponent,
        canActivate: [AuthorizatedGuard],
      },
      {
        path: '',
        component: PrincipalComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'gestion_de_seguridad',
        component: ChangePasswordComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'movimientos',
        component: MovementsComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'validador',
        component: QrvalidatorComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'vales',
        component: ReportByCouponComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'registro_canje',
        component: ReportByCanjeComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'canales',
        component: ReportByPaymentChannelComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'estados',
        component: ReportByStateComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'sectores',
        component: SectorsComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'perfil',
        component: PerfilIndexComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'perfil/perfil/:id',
        component: PerfilFormComponent,
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'usuario',
        component: UserIndexComponent,
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'usuario/usuario/:id',
        component: UserFormComponent,
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'crear_reunion', //path: 'parametro',
        component: ParametersComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'parametro/parametro/:id',
        component: ParameterComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'delivery',
        component: DeliveryComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'generacion-orden-pago',
        component: PaymentGeneratorIndexComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'nueva-orden-pago',
        component: PayOrderFormComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'configuracion-pos',
        component: PosConfigurationComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'reporte-ordenes-pagadas',
        component: ReportPayedOrdersComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'generar-vales-inicio/:id',
        component: DiscountVoucherIndexComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'generar-vales/:id_package',
        component: DiscountVoucherFormComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'empresas',
        component: VoucherCompanyIndexComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'bolsa',
        component: VoucherPackageComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'bolsa/asignar-bolsa/:id',
        component: AssignVoucherPackageComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },

      {
        path: 'usuario-externo',
        component: ExternalUserIndexComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'usuario-externo/usuario-externo/:id',
        component: ExternalUserFormComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },

      {
        path: 'transacciones-detallado',
        component: ReportDetailedTransactionsComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },

      {
        path: 'comisiones-transacciones',
        component: ReportComissionsTransactionsComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },

      {
        path: 'reportes-ordenes-pago-factura',
        component: ReportQrIndexComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'reportes-comisiones-detallado',
        component: ReportCommissionsDetailedComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'canales-producto',
        component: ReportByChannelComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      {
        path: 'transacciones-pagos-contra-entrega',
        component: PaymentsOnDeliveryIndexComponent,
        pathMatch: 'full',
        canActivate: [AuthorizatedGuard],
      },
      { path: '**', redirectTo: '/principal' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule, ReactiveFormsModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
