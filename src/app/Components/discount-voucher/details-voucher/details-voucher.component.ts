import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumEstado, EnumVoucherStatus } from 'src/app/helper/enum';
import { EnumLiteral } from 'src/app/helper/enum-literal';
import { General } from 'src/app/helper/general';
import { DiscountVoucher } from 'src/app/models/discount_voucher';

@Component({
  selector: 'app-details-voucher',
  templateUrl: './details-voucher.component.html',
  styleUrls: ['./details-voucher.component.css'],
})
export class DetailsVoucherComponent implements OnInit {
  _disVoucher: DiscountVoucher;
  HGeneral: General = new General();
  HEnumLiteral: EnumLiteral = new EnumLiteral();
  enumVoucher = EnumVoucherStatus;
  constructor(
    public dialogoRef: MatDialogRef<DetailsVoucherComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DiscountVoucher
  ) {
    this._disVoucher = data;
  }

  ngOnInit(): void {
    // this._disVoucher = THdata;
    console.log('this._disVoucher :>> ', this._disVoucher);
    console.log(this._disVoucher.assigned_date);
  }
  close() {
    this.dialogoRef.close();
  }
  display_FechaValidez(): boolean {
    return this._disVoucher.status != EnumVoucherStatus.Used;
  }
}
