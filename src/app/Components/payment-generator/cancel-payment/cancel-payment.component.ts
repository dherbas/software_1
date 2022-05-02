import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PayOrderService } from 'src/app/services/pay-order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cancel-payment',
  templateUrl: './cancel-payment.component.html',
  styleUrls: ['./cancel-payment.component.css'],
})
export class CancelPaymentComponent implements OnInit {
  _reason: string = '';
  _msgError: string = '';
  _payNumber: number = 0;
  _cancelOk = true;
  constructor(
    public dialogoRef: MatDialogRef<CancelPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private payOrder: PayOrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._payNumber = this.data['data'];
  }

  cancel() {
    this._cancelOk = false;
    this.dialogoRef.close(this._cancelOk);
  }

  processCancelPayOrder() {
    if (this._reason.trim() == '') {
      this._msgError = 'Ingrese un motivo válido';
      return;
    }

    this.payOrder.cancelPayOrder(this._payNumber, this._reason).subscribe(
      (res) => {
        this.toastr.success('Anulado correctamente.');
        this._cancelOk = true;
        this.dialogoRef.close(this._cancelOk);
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
