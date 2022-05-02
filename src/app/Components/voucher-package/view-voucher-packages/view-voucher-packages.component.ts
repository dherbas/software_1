import { Component, OnInit, Inject } from '@angular/core';
import { VoucherPackage } from 'src/app/models/voucher-package';
import { VoucherPackageParent } from 'src/app/models/voucher-package-parent';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-voucher-packages',
  templateUrl: './view-voucher-packages.component.html',
  styleUrls: ['./view-voucher-packages.component.css']
})
export class ViewVoucherPackagesComponent implements OnInit {
  total_amount: number;
  total_amount_used: number;
  voucherPackages: VoucherPackage[];

  constructor(public dialogRef: MatDialogRef<ViewVoucherPackagesComponent>,
    @Inject(MAT_DIALOG_DATA) public voucherPackageParent: VoucherPackageParent) {
    this.voucherPackages = this.voucherPackageParent.voucher_packages;
    this.total_amount = this.voucherPackageParent.voucher_packages?.reduce((x, vp) => x += (+vp.amount), 0);
    this.total_amount_used = this.voucherPackageParent.voucher_packages?.reduce((x, vp) => x += (+vp.amount_used), 0);
  }
  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
