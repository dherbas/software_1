import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Delivery } from 'src/app/models/delivery';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DeliveryService } from 'src/app/services/delivery.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { element } from 'protractor';
import { ResponseAPI } from 'src/app/models/ResponseAPI';
import { StorageService } from 'src/app/services/storage.service';
import { cmbService } from 'src/app/models/cmbService';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  deliveryList: Delivery[];
  assignedList: Delivery[];
  availableList: Delivery[];
  companies: cmbService[];
  selectedCompany: string;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    public dialog: MatDialog,
    private deliveryServices: DeliveryService,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
    private changeDetection: ChangeDetectorRef,
    private session: StorageService) {
    this.deliveryList = [];
    this.companies = session.getCurrentSession().user.list_code_service;
    this.selectedCompany = this.companies.length > 0 ? this.companies[0].code : '';
  }



  ngOnInit(): void {
    this.GetAssignedDeliveries();
  }

  GetAssignedDeliveries() {
    this.blockUI.start();
    this.deliveryServices.GetAssignedDeliveryServices(this.selectedCompany).subscribe(
      (resp) => {
        if (resp.data != undefined) {
          this.deliveryList = resp.data;
          this.assignedList = this.deliveryList.map(x => x);
        }
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
        this.toastr.error('Ocurrio un problema');
      });
  }



  OpenAssignDelivery() {
    this.blockUI.start();
    this.deliveryServices.GetAvailableServices(this.selectedCompany).subscribe(
      (resp) => {
        if (resp.data != undefined) {
          this.availableList = resp.data.filter(x => x.services_delivery_id == null);
          this.assignedList = this.deliveryList.map(x => x);
          this.ngxSmartModalService.open('modalAssignDeliveries');
          this.blockUI.stop();
        } else {
          this.toastr.error('El servicio no se encuentra habilitado.');
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        this.toastr.error(error);
      });
  }

  SelectItem(item: Delivery) {
    if (!isNullOrUndefined(item.selected)) {
      item.selected = !item.selected;
    } else {
      item.selected = true;
    }
  }

  MoveToAssigned() {
    var selected = this.availableList.filter(x => x.selected == true);
    var indices = [];
    selected.forEach(element => {
      indices.push(selected.indexOf(element));
      this.assignedList.push({ ...element });
    });

    indices.forEach(indice => {
      this.availableList.splice(indice, 1);
    });

    this.changeDetection.detectChanges();

    this.UnselectEverything();

  }

  MoveAllToAssigned() {
    var selected = this.availableList;
    var indices = [];
    selected.forEach(element => {
      indices.push(selected.indexOf(element));
      this.assignedList.push({ ...element });
    });

    indices.forEach(indice => {
      this.availableList.splice(indice, 1);
    });

    this.changeDetection.detectChanges();

    this.UnselectEverything();

  }


  MoveToAvailable() {
    var selected = this.assignedList.filter(x => x.selected == true);
    var indices = [];
    selected.forEach(element => {
      indices.push(selected.indexOf(element));
      this.availableList.push({ ...element });
    });

    indices.forEach(indice => {
      this.assignedList.splice(indice, 1);
    });

    this.changeDetection.detectChanges();

    this.UnselectEverything();

  }

  MoveAllToAvailable() {
    var selected = this.assignedList;
    var indices = [];
    selected.forEach(element => {
      indices.push(selected.indexOf(element));
      this.availableList.push({ ...element });
    });

    indices.forEach(indice => {
      this.assignedList.splice(indice, 1);
    });

    this.changeDetection.detectChanges();
    this.UnselectEverything();

  }

  UnselectEverything() {
    this.assignedList.forEach(element => {
      element.selected = false;
    });

    this.availableList.forEach(element => {
      element.selected = false;
    });
  }

  closeModal() {
    this.ngxSmartModalService.close('modalAssignDeliveries');
  }

  async AssignServices() {
    //DesAsignamos Primero
    this.blockUI.start();
    console.log(this.deliveryList);

    for (let index = 0; index < this.deliveryList.length; index++) {
      const element = this.deliveryList[index];
      await this.deliveryServices.DeleteServices(element.services_delivery_id).toPromise();
    }
    debugger;
    var idsArray = [];
    for (let index = 0; index < this.assignedList.length; index++) {
      const element = this.assignedList[index];
      idsArray.push(element.id);
    }

    await this.deliveryServices.AssignServices(idsArray, this.selectedCompany).toPromise();
    this.blockUI.stop();
    this.closeModal();
    this.GetAssignedDeliveries();
  }


  async DeleteService(item: Delivery) {
    this.blockUI.start();
    await this.deliveryServices.DeleteServices(item.services_delivery_id).toPromise();
    this.blockUI.stop();
    this.toastr.success('Se ha eliminado el servicio correctamente!');
    this.GetAssignedDeliveries();
  }

  ActualizarData() {
    this.GetAssignedDeliveries();
  }
}