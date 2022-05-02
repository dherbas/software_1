import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemSelected } from 'src/app/models/generate_Order';
import { Validador } from 'src/app/helper/validador';
import { General } from 'src/app/helper/general';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css'],
})
export class NewItemComponent implements OnInit {
  _msgError = '';
  _item: ItemSelected;
  _validation: Validador = new Validador();
  _currency: String = 'Bs';
  _hGeneral: General = new General();

  constructor(
    private storageService: StorageService,
    public dialogoRef: MatDialogRef<NewItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._currency = this._hGeneral.getCurrency(storageService);
  }

  ngOnInit(): void {
    this._item = new ItemSelected();
  }

  change(value: any) {
    this._hGeneral.changeToNumberFormat(value);
  }

  cancel() {
    this.dialogoRef.close();
  }

  addItem() {
    this._msgError = '';
    if (this._item.description == '') {
      this._msgError = 'Ingrese una descripción válida.';
      return;
    }
    if (
      this._item.unitary_price === 0 ||
      this._item.unitary_price.toString() === ''
    ) {
      this._msgError = 'Ingrese un precio unitario válido.';
      return;
    }
    if (this._item.quantity === 0 || this._item.quantity.toString() === '') {
      this._msgError = 'Ingrese una cantidad válida.';
      return;
    }

    this.dialogoRef.close(this._item);
  }
}
