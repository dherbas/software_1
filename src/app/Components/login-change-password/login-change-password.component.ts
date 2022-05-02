import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Session } from 'src/app/models/Session';
import { ToastrService } from 'ngx-toastr';
import { ValidatorService } from 'src/app/services/validations/validator.service';

@Component({
  selector: 'app-login-change-password',
  templateUrl: './login-change-password.component.html',
  styles: [
  ]
})
export class LoginChangePasswordComponent implements OnInit {

  _Form: FormGroup;
  _User = null;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private router: Router,
    private userService: UsuarioService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private validations: ValidatorService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  onCancelClick() {
    this.router.navigate(['/login']);
  }

  onChangeClick() {
    this._User = this.storageService.getCurrentUser();
    if (this._Form.valid) {
      this.blockUI.start();
      let NewPassword = this._Form.get('_NewPassword').value;
      this.userService.ChangePassword(this._User.username, this._User.password, NewPassword, true).subscribe(
        (resp) => {
          this.router.navigate(['/login']);
          this.blockUI.stop();
          this.toastr.success('Se ha cambiando su contraseña.');
        },
        (error) => {
          this.initForm();
          this.blockUI.stop();
          this.toastr.error('Su contraseña actual es incorrecta.');
        }
      );
    }
  }

  initForm() {
    this._Form = this.formBuilder.group({
      _NewPassword: ['', [Validators.required, Validators.minLength(10)]],
      _ConfirmationPassword: ['', [Validators.required]]
    }, {
      validators: this.validations.equalPasswords('_NewPassword', '_ConfirmationPassword')
    });
  }



  get NewPassword() {
    return this._Form.get('_NewPassword');
  }

  get ConfirmationPassword() {
    return this._Form.get('_ConfirmationPassword');
  }

}



