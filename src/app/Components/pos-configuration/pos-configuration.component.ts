import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models/user';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PosConfigurationDialogComponent } from '../pos-configuration-dialog/pos-configuration-dialog.component';
import { EnumCodigoRespuesta } from '../../helper/enum';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioExtraData } from '../../models/UsuarioExtraData';

@Component({
  selector: 'app-pos-configuration',
  templateUrl: './pos-configuration.component.html',
  styleUrls: ['./pos-configuration.component.css'],
})
export class PosConfigurationComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  dialogConfig: any;
  errorMessage = '';
  userSession: User = null;
  configuration: any;
  extraData: any;

  constructor(
    private activeteRoute: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private session: StorageService,
    private userService: UsuarioService
  ) {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = false;
    this.userSession = this.session.getCurrentUser();
    if (typeof this.userSession.extra_data === 'string') {
      this.extraData = JSON.parse(this.userSession.extra_data);
    } else if (this.userSession.extra_data == null) {
      this.extraData = new UsuarioExtraData();
    } else {
      this.extraData = this.userSession.extra_data;
    }
  }

  ngOnInit(): void {
    this.configuration = this.extraData.pos_configuration;
  }

  edit(i: number) {
    this.dialogConfig.data = this.configuration[i];
    this.dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(
      PosConfigurationDialogComponent,
      this.dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.configuration[i] = result;
        this.extraData.pos_configuration = this.configuration;
        this.userService
          .updateExtraData(this.userSession.id, this.extraData)
          .subscribe(
            (resultado) => {
              switch (resultado.status) {
                case EnumCodigoRespuesta.Correcto:
                  const session = this.session.getCurrentSession();
                  session.user.extra_data = this.extraData;
                  this.session.setCurrentSession(session);
                  break;
                case EnumCodigoRespuesta.Error_Validacion:
                  this.errorMessage = resultado.data;
                  break;
                default:
                  this.errorMessage = resultado.message;
                  break;
              }

              this.blockUI.stop();
            },
            (error) => {
              this.errorMessage = error.errorMessage;
              this.blockUI.stop();
            }
          );
      }
    });
  }
}
