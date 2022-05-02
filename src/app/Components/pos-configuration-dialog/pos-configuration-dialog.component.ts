import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pos-configuration-dialog',
  templateUrl: './pos-configuration-dialog.component.html',
  styleUrls: ['./pos-configuration-dialog.component.css'],
})
export class PosConfigurationDialogComponent implements OnInit {
  item: any;
  form: FormGroup;
  formSubmitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PosConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.item = data;
  }

  get Value(): any {
    return this.form.get('value');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      value: [this.item.value, [Validators.required]],
    });
  }

  save() {
    this.formSubmitted = true;
    if (this.form.valid) {
      console.log(this.Value.value);
      this.item.value = this.Value.value;
      this.dialogRef.close(this.item);
    } else {
      this.errorMessage = this.getErrorMessage();
    }
  }

  private getErrorMessage() {
    if (this.Value.invalid) {
      return 'Ingrese un valor válido.';
    }
    return '';
  }
}
