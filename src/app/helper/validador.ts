import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Validador {
  _GuionMedio: number = 45;
  _Punto: number = 46;
  _Null: number = 0;
  _BackSpace: number = 8;
  _ComillaSimple: number = 39;
  _Ampersand: number = 38;
  _Tab: number = 9;
  _Porcentaje: number = 37;
  _Coma: number = 44;
  _Space: number = 32;

  ValidarAlfabetico(event): boolean {
    var letras = /^\s*[a-zA-Z´\s,ñ,á,é,í,ó,ú]+\s*$/;
    var keycode = window.event ? event.keyCode : event.which;
    if (
      !(
        keycode == this._Tab ||
        keycode == this._Null ||
        keycode == this._BackSpace ||
        letras.test(String.fromCharCode(keycode)) == true
      )
    ) {
      return false;
    }
    return true;
  }

  ValidarSoloNumero(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ValidarSoloNumeroyPunto(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return (charCode >= 48 && charCode <= 57 || charCode == 13 || charCode == 46)
  }

  ValidarAlfaNumerico(event): boolean {
    const letras = /^\s*[a-zA-Z,0-9\s,ñ,á,é,í,ó,ú]+\s*$/;
    const keycode = window.event ? event.keyCode : event.which;
    if (
      !(
        keycode == this._Tab ||
        keycode == this._Null ||
        keycode == this._BackSpace ||
        letras.test(String.fromCharCode(keycode)) === false
      )
    ) {
      return true;
    }
    return false;
  }

  ValidarCorreo(correo: string): boolean {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(correo);
  }

  ValidarContrasenha(event): boolean {
    var letras = /^\s*[a-zA-Z,0-9\s,\[,\],\.,\,,\;,\(,\),\@]+\s*$/;
    var keycode = window.event ? event.keyCode : event.which;
    if (
      !(
        keycode == this._Tab ||
        keycode == this._Null ||
        keycode == this._BackSpace ||
        letras.test(String.fromCharCode(keycode)) == true
      )
    ) {
      return false;
    }
    return true;
  }

  ValidarAlfaNumericoSinEspacio(event): boolean {
    var letras = /^\s*[a-zA-Z,0-9\s,ñ,á,é,í,ó,ú,\;,\:,\_,\,,\.,\-,\|,\!,\",\#,\$,\%,\&,\/,\(,\),\=,\?,\¡,\',\¿,\*,\+,\@]+\s*$/;
    var keycode = window.event ? event.keyCode : event.which;
    if (keycode == this._Space) {
      return false;
    }
    if (
      !(
        keycode == this._Tab ||
        keycode == this._Null ||
        keycode == this._BackSpace ||
        letras.test(String.fromCharCode(keycode)) == true
      )
    ) {
      return false;
    }
    return true;
  }
  public numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
