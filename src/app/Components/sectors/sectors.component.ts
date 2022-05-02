import {Component, OnInit, Inject} from "@angular/core";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SectorsService} from "src/app/services/sectors.service";
import {ToastrService} from "ngx-toastr";
import {sector} from "src/app/models/Sectors";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {StorageService} from "src/app/services/storage.service";
import {cmbService} from "src/app/models/cmbService";

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styles: []
})
export class SectorsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  sectors: sector[];

  searchText: string;
  companies: cmbService[] = [];
  selectedCompany: string;

  constructor(public dialog: MatDialog,
              private sectorsService: SectorsService,
              private toastr: ToastrService,
              private session: StorageService) {
    this.sectors = [];
    this.companies = session.getCurrentSession().user.list_code_service;
    this.selectedCompany = this.companies.length > 0 ? this.companies[0].code : '';
  }

  ngOnInit(): void {
    this.blockUI.start();
    this.sectorsService.GetAllSectors(this.selectedCompany).subscribe(
      (resp) => {
        console.log(resp.data)
        this.sectors = resp.data;
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
        this.toastr.error('No se encontraron sectores.');
      });
  }

  obtenerSectores() {
    this.blockUI.start();
    this.sectorsService.GetAllSectors(this.selectedCompany).subscribe(
      (resp) => {
        console.log(resp);
        this.sectors = resp.data;
        if (this.searchText != undefined && this.searchText.length > 0) {
          this.sectors = this.sectors.filter(x => x.name.includes(this.searchText));
        }

        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error('No se encontraron sectores.');
        this.blockUI.stop();
      });
  }

  editSector(item: sector) {
    const dialogRef = this.dialog.open(editSectorPopUp, {width: '420px', disableClose: true, data: item});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sectorsService.UpdateSector(result, this.selectedCompany).subscribe(
          (resp) => {
            this.toastr.success('El sector se actualizó correctamente.')
            this.obtenerSectores();
          },
          (error) => {
            this.toastr.error('Ha ocurrido un problema.')
            this.obtenerSectores();
          });
      }
    });
  }

  getSectorUrl(item: sector) {
    this.blockUI.start();
    this.sectorsService.GetUrlSector(item.id, this.selectedCompany).subscribe(
      (resp) => {
        console.log(resp);
        const dialogRef = this.dialog.open(getUrlSectorPopUp, {width: '420px', disableClose: true, data: resp.data});
        this.blockUI.stop();
        dialogRef.afterClosed().subscribe(result => {
        });
      },
      (error) => {
        this.blockUI.stop();
      });
  }

  disableSector(item: sector) {
    const dialogRef = this.dialog.open(confirmationDisablePopUp, {width: '420px', disableClose: true, data: item});

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          debugger;
          this.sectorsService.UpdateSector(result, this.selectedCompany).subscribe(
            (resp) => {
              this.toastr.success('El sector se actualizó correctamente.')
              this.obtenerSectores();
            },
            (error) => {
              this.toastr.error('Ha ocurrido un problema.')
              this.obtenerSectores();
            });
        }
      }
    );
  }
}


@Component({
  selector: 'editSector-dialog',
  templateUrl: 'editSectorPopUp.html',
})
export class editSectorPopUp {

  model: {
    name: string;
    price: string;
    visible_in_portal: boolean;
    enable: boolean
    sector_duration_attributes: {
      id: number;
      sector_id: string;
      initial_day: number;
      final_day: number;
    }
  };

  constructor(public dialogRef: MatDialogRef<editSectorPopUp>,
              @Inject(MAT_DIALOG_DATA) public data: sector) {
    this.model = {
      enable: data.enable,
      visible_in_portal: data.visible_in_portal,
      sector_duration_attributes: {
        id: data.sector_duration.id,
        sector_id: data.id,
        final_day: data.sector_duration.final_day,
        initial_day: data.sector_duration.initial_day
      },
      name: data.name,
      price: data.price
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(initial_day: any, final_day: any, siRadio: boolean, enable: any): void {
    this.model.sector_duration_attributes.initial_day = initial_day;
    this.model.sector_duration_attributes.final_day = final_day;
    this.model.visible_in_portal = siRadio;
    this.model.enable = enable;
    this.dialogRef.close(this.model);
  }
}

@Component({
  selector: 'getUrlSector-dialog',
  templateUrl: 'getUrlSectorPopUp.html',
})
export class getUrlSectorPopUp {

  text: string;

  constructor(public toastr: ToastrService,
              public dialogRef: MatDialogRef<getUrlSectorPopUp>,
              @Inject(MAT_DIALOG_DATA) public data: string) {

    this.text = data;

  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    this.dialogRef.close(true);
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toastr.success('Se ha copiado el link al portapapeles.')
  }
}


@Component({
  selector: 'confirmationDisable-dialog',
  templateUrl: 'disableSectorPopUp.html',
})
export class confirmationDisablePopUp {

  model: {
    name: string;
    price: string;
    visible_in_portal: boolean;
    enable: boolean
    sector_duration_attributes: {
      id: number;
      sector_id: string;
      initial_day: number;
      final_day: number;
    }
  }
  message: string;
  boldMessage: string;
  questionMark: string;

  constructor(public dialogRef: MatDialogRef<confirmationDisablePopUp>,
              @Inject(MAT_DIALOG_DATA) public data: sector) {
    this.model = {
      enable: data.enable,
      visible_in_portal: data.visible_in_portal,
      sector_duration_attributes: {
        id: data.sector_duration.id,
        sector_id: data.id,
        final_day: data.sector_duration.final_day,
        initial_day: data.sector_duration.initial_day
      },
      name: data.name,
      price: data.price
    };
    var estado = data.enable ? 'deshabilitar' : 'habilitar';
    this.message = '¿Está seguro que desea ' + estado + ' el sector';
    this.boldMessage = data.name;
    this.questionMark = '?';
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    this.model.enable = !this.model.enable;
    this.dialogRef.close(this.model);
  }

}
