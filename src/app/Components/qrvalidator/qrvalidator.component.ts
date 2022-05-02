import { Component, OnInit, ViewChild, VERSION, Inject } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { QrvalidatorService } from 'src/app/services/qrvalidator.service';
import { ToastrService } from 'ngx-toastr';
import { PopUpModel, PopUpResultModel } from 'src/app/models/PopUpModel';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { $, Session } from 'protractor';
import { cmbService } from 'src/app/models/cmbService';

@Component({
  selector: 'app-qrvalidator',
  templateUrl: './qrvalidator.component.html',
  styleUrls: ['./qrvalidator.component.css'],
})
export class QrvalidatorComponent implements OnInit {
  [x: string]: any;
  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;
  qrcode: string;
  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;
  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;
  popupwidth: string = '450px';
  innerWidth: number = 0;
  service_code: string;
  manilla1: string;
  manilla2: string;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private qrCodeService: QrvalidatorService,
    private toastr: ToastrService,
    private storageService: StorageService,
    public dialog: MatDialog
  ) {
    this.qrcode = '';
    this.manilla1 = '';
    this.manilla2 = '';
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 765) {
      this.popupwidth = '90%';
    }
    this.service_code =
      this.storageService.getCurrentSession().serviceSelected.code;
  }

  setDeviceDefaultCamera() {
    for (let index = 0; index < this.availableDevices.length; index++) {
      if (
        this.availableDevices[index].label.toLowerCase().includes('front') ||
        this.availableDevices[index].label.toLowerCase().includes('rear')
      ) {
        this.scanner.device = this.availableDevices[index];
      }
    }
  }

  scanSuccessHandler(resultString) {
    if (resultString != this.qrcode) {
      this.toastr.success('Se ha detectado el codigo QR');
      this.qrcode = resultString;
    }
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasCameras = Boolean(devices && devices.length);
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find((x) => x.deviceId === selected);
    this.selectedDevice = device || null;
  }

  validarTickets(): void {
    if (this.qrcode.trim() == '') {
      this.toastr.error('Ingrese un código');
      this.qrcode = '';
      return;
    }
    this.blockUI.start();
    var codesList = this.ObtenerListServiceCodes(
      this.storageService.getCurrentSession().user.list_code_service
    );
    console.log('this.storageService:', this.storageService);
    var model = { qr: this.qrcode, list_service_codes: codesList };

    this.qrCodeService.GetQRData(model).subscribe(
      (resp) => {
        this.blockUI.stop();
        if (resp.data == null) {
          this.toastr.error('El código ingresado no es válido');
        } else {
          resp.data.service_code = this.service_code;
          const dialogRef = this.dialog.open(TicketDialog, {
            width: this.popupwidth,
            data: resp.data,
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((result) => {
            console.log('result', result);
            if (result) {
              this.blockUI.start();
              var user = this.storageService.getCurrentSession().user;
              var codesList = this.ObtenerListServiceCodes(
                user.list_code_service
              );

              var confirmationModel = {
                ticket_id: resp.data.id.toString(),
                list_service_codes: codesList,
                user_account_id: user.id,
                manilla1: result.manilla1,
                manilla2: result.manilla2,
              };

              console.log('confirmationModel :>> ', confirmationModel);
              this.qrCodeService.ValidateQR(confirmationModel).subscribe(
                (resp2) => {
                  this.blockUI.stop();
                  let title = 'Canje exitoso';
                  // if (resp2.data.status == 'error') { //ESTO ESTABA ANTES
                  //   title = 'Vale inválido';
                  // }
                  if (resp2['status'] == 'ERROR') {
                    title = resp2.data;
                    this.toastr.error(title);
                  } else {
                    const dialogRef2 = this.dialog.open(TicketResultDialog, {
                      width: '30%',
                      data: { title: title, message: resp2.data.message },
                    });
                  }
                },
                (error2) => {
                  this.blockUI.stop();
                  console.log(error2);
                  this.toastr.error('Algo ha salido mal');
                }
              );
            }
          });
        }
        this.qrcode = '';
      },
      (error) => {
        this.blockUI.stop();
        console.log(error);
        this.toastr.error('Algo ha salido mal');
      }
    );
  }
  ObtenerListServiceCodes(list_code_service: cmbService[]): string[] {
    var result = [];
    list_code_service.forEach((element) => {
      result.push(element.code);
    });
    return result;
  }
}

@Component({
  selector: 'ticket-dialog',
  templateUrl: 'TicketPopUp.component.html',
})
export class TicketDialog {
  manilla1: string;
  manilla2: string;
  service_code: string;
  type_ticket: number;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private qrCodeService: QrvalidatorService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TicketDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PopUpModel
  ) {
    console.log('data:', data);
    this.manilla1 = '';
    this.manilla2 = '';
    this.service_code = data.service_code;
    this.type_ticket = 0;

    if (this.service_code == 'JUVENTUD_CARNAVALERA_2022') {
      this.type_ticket = JSON.parse(
        data.pay_order_extra_data
      ).event_extra.item_to_payed;
    }
    if (this.service_code == 'TINI_EN_JUVENTUD_CARNAVALERA_2022') {
      this.type_ticket = 2; // solo una manilla
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    if (
      this.service_code == 'JUVENTUD_CARNAVALERA_2022' ||
      this.service_code == 'TINI_EN_JUVENTUD_CARNAVALERA_2022'
    ) {
      if (this.manilla1.trim() == '') {
        this.toastr.error('Ingrese el código de la manilla 1');
        this.manilla1 = '';
        return;
      }
      if (this.type_ticket == 1 && this.manilla2.trim() == '') {
        this.toastr.error('Ingrese el código de la manilla 2');
        this.manilla2 = '';
        return;
      }

      if (
        this.type_ticket == 1 &&
        this.manilla1.trim() == this.manilla2.trim()
      ) {
        this.toastr.error('Los codigos de manillas ingresados son iguales');
        return;
      }

      var confirmationModel = {
        service_code: this.service_code,
        manilla1: this.manilla1,
        manilla2: this.manilla2,
      };
      this.qrCodeService.validateCodeManilla(confirmationModel).subscribe(
        (resp2) => {
          this.blockUI.stop();
          if (!resp2.data) {
            this.toastr.error('Un código de manilla ingresado ya existe.');
            return;
          }

          this.dialogRef.close({
            manilla1: this.manilla1,
            manilla2: this.manilla2,
          });
        },
        (error2) => {
          this.blockUI.stop();
          console.log(error2);
          this.toastr.error('Algo ha salido mal');
        }
      );
    } else {
      //Ingresa para los otros comercios
      this.dialogRef.close({
        manilla1: this.manilla1,
        manilla2: this.manilla2,
      });
    }
  }

  hasManilla() {
    return (
      this.service_code == 'JUVENTUD_CARNAVALERA_2022' ||
      this.service_code == 'TINI_EN_JUVENTUD_CARNAVALERA_2022'
    );
  }
}

@Component({
  selector: 'ticket-result-dialog',
  templateUrl: 'TicketResult.component.html',
})
export class TicketResultDialog {
  constructor(
    public dialogRef: MatDialogRef<TicketDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PopUpResultModel
  ) {
    // this.data.message = "El canje del vale de consumo Vale de Bs. 100 (Vale por Bs. 120) se ha realizado con éxito. \n A partir de este momento el vale canjeado queda inválido para su uso."
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
