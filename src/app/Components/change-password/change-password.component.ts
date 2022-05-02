import {Component, OnInit} from '@angular/core';
import {UsuarioService} from 'src/app/services/usuario.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Router} from '@angular/router';
import {StorageService} from 'src/app/services/storage.service';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidatorService} from 'src/app/services/validations/validator.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  pattern: string;
  Form: FormGroup;
  User = null;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private userService: UsuarioService,
    private storageService: StorageService,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private validations: ValidatorService
  ) {
    this.initForm();
  }

  get CPassword() {
    return this.Form.get('_CPassword');
  }

  get NewPassword() {
    return this.Form.get('_NewPassword');
  }

  get ConfirmationPassword() {
    return this.Form.get('_ConfirmationPassword');
  }

  ngOnInit(): void {
  }

  Change_password() {
    this.User = this.storageService.getCurrentUser();
    if (this.Form.valid) {
      this.blockUI.start('Cambiando contraseña');
      let CPassword = this.Form.get('_CPassword').value;
      let NewPassword = this.Form.get('_NewPassword').value;
      this.userService.ChangePassword(this.User.username, CPassword, NewPassword, false).subscribe(
        (resp) => {
          this.storageService.removeCurrentSession();
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

  Cancelar() {
    this.router.navigate(['/backoffice/principal']);
  }

  initForm() {
    //this.pattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{10,10}$";
    this.Form = this.formBuilder.group({
      _CPassword: [''],
      _NewPassword: ['', [Validators.required, Validators.minLength(10)]],
      _ConfirmationPassword: ['', [Validators.required]]
    }, {
      validators: this.validations.equalPasswords('_NewPassword', '_ConfirmationPassword')
    });
  }

}
