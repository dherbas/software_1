import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../models/User';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {VoucherPackageService} from '../../../services/voucher-package.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-assign-user-dialog',
  templateUrl: './assign-user-dialog.component.html',
  styleUrls: ['./assign-user-dialog.component.css']
})
export class AssignUserDialogComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  formUser: FormGroup;
  data: any;
  users: User[];
  voucherCompany: string;
  mensageError = '';

  constructor(private router: Router,
              private toastr: ToastrService,
              public dialogRef: MatDialogRef<AssignUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private formBuilder: FormBuilder,
              private vpackageService: VoucherPackageService) {

    this.formUser = this.formBuilder.group({
      choose: ['', Validators.required]
    });
    this.mensageError = '';

    this.users = data.users;
    this.voucherCompany = data.voucher_company;
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  validarGuardar(): boolean {
    if (this.formUser.get('choose').value == '') {
      this.mensageError = 'Debe seleccionar un usuario.';
      return false;
    }
    return true;
  }

  asignarUsuario(): void {
    if (!this.validarGuardar()) {
      return;
    }
    this.dialogRef.close(this.users.find(x => x.id == this.formUser.get('choose').value));
  }

}
