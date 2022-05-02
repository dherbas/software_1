import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Pay_Orders } from 'src/app/models/pay_Orders';
import { PayOrderService } from 'src/app/services/pay-order.service';
import { General } from 'src/app/helper/general';
import { EnumPayOrderSources } from '../../../helper/enum';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  _payOrder: Pay_Orders;
  _totalAmount: number = 0;
  _originaltotalAmount: number = 0;
  HGeneral: General = new General();
  enumPayOrderSources = EnumPayOrderSources;
  _currency: string;

  constructor(
    public dialogoRef: MatDialogRef<DetailsComponent>,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private payOrderService: PayOrderService
  ) {
    this._payOrder = this.data['data'];
    this._currency = this.HGeneral.getCurrency(storageService);
  }

  ngOnInit(): void {
    console.log('this._payOrder :>> ', this._payOrder);
    this._payOrder.pay_order_details.forEach((element) => {
      this._totalAmount += Number(element.total_amount);
      this._originaltotalAmount += Number(element.original_total_amount);
    });
    console.log('this._payOrder :>> ', this._payOrder);
    console.log('this._currency :>> ', this._currency);
    console.log('this._totalAmount :>> ', this._totalAmount);
    console.log('this._originaltotalAmount :>> ', this._originaltotalAmount);
  }

  close() {
    this.dialogoRef.close();
  }
}
