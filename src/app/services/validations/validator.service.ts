import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  equalPasswords(password1: string, password2: string) {
    return (formGroup: FormGroup) => {
      const password1Control = formGroup.controls[password1];
      const password2Control = formGroup.controls[password2];

      if (password1Control.value === password2Control.value)
        password2Control.setErrors(null);
      else
        password2Control.setErrors({ notEqual: true });
    }
  }

  dateLessThan(startDate: string, endDate: string) {
    return (formGroup: FormGroup) => {
      const startDateControl = formGroup.controls[startDate];
      const endDateControl = formGroup.controls[endDate];

      if (!moment(startDateControl.value).isValid())
        startDateControl.setErrors({ invalidDate: true });
      else if (moment(startDateControl.value).diff(moment(), 'days') < 0)
        startDateControl.setErrors({ invalidDate: true });
      else if (!moment(endDateControl.value).isValid())
        endDateControl.setErrors({ invalidDate: true });
      else if (startDateControl.value > endDateControl.value)
        startDateControl.setErrors({ invalidDates: true });
      else startDateControl.setErrors(null);
    }
  }

  dateValidator() {
    return (formControl: FormControl): { [key: string]: any } => {
      const date = moment(formControl.value);
      if (!date.isValid()) {
        return { invalidDate: true };
      }
      return null;
    };
  }

  dateGreaterThanOrEqualToNow() {
    return (formControl: FormControl): { [key: string]: any } => {
      const date = moment(formControl.value);
      if (!date.isValid()) {
        return { invalidDate: true };
      }
      if (date.diff(moment(), 'days') < 0) {
        return { invalidDate: true };
      }
      return null;
    };
  }
}
