import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PayOrderService } from 'src/app/services/pay-order.service';
import { ToastrService } from 'ngx-toastr';
import { DiscountVoucherService } from 'src/app/services/discount-voucher.service';
import { EnumCodigoRespuesta } from 'src/app/helper/enum';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-cancel-voucher',
  templateUrl: './cancel-voucher.component.html',
  styleUrls: ['./cancel-voucher.component.css'],
})
export class CancelVoucherComponent implements OnInit {
  [x: string]: any;
  _reason: string = '';
  _msgError: string = '';
  _idVoucher: number = 0;
  consumeServices = false;

  constructor(
    public dialogoRef: MatDialogRef<CancelVoucherComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private voucherService: DiscountVoucherService,
    private toastr: ToastrService,
    private session: StorageService
  ) {}

  ngOnInit(): void {
    this._idVoucher = this.data.data;
    this.consumeServices = this.session.getCurrentUser().consume_services;
  }

  cancel() {
    this.dialogoRef.close();
  }

  processCancelPayOrder() {
    if (this._reason.trim() === '') {
      this._msgError = 'Ingrese un motivo válido';
      return;
    }

    this.voucherService.cancelVoucher(this._idVoucher, this._reason, this.consumeServices).subscribe(
      (res) => {
        if (res.status == EnumCodigoRespuesta.Correcto) {
          if (res.data) {
            this.toastr.success('Anulado correctamente.');
          }else{
            this.toastr.error('No se puede anular el vale por que se encuentra vinculado a un pago.');
          }
          this.dialogoRef.close(true);
        } else {
          this.toastr.success(
            'Ocurrió un error inesperado, intente nuevamente. Si el error persiste contacte con el administrador.'
          );
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error(
          'Ha ocurrido un problema, consulte con el administrador.'
        );
      }
    );
  }
}
