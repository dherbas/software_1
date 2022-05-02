import { Injectable } from '@angular/core';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class MetodoExtensionService {
  constructor() {}

  /**
   * Convierte una fecha a cadena en formato "especificado como parámetro, por defecto 'dd/MM/yyyy'". Entrada fecha: Date, formato, separador: string
   */
  public ConvertirFechaCadena(
    fecha: Date,
    formato: string = 'dd/MM/yyyy',
    separador: string = '/'
  ): string {
    let arrayFormato: Array<string> = formato.split(separador);
    let arrayResultado: Array<string> = new Array<string>();

    var fechaCadena = new Date(fecha);
    arrayFormato.forEach((formato) => {
      let auxFecha: string = '';
      if (formato.toUpperCase() === 'DD') {
        auxFecha = '' + fechaCadena.getDate();
        if (auxFecha.length < 2) auxFecha = '0' + auxFecha;
      }
      if (formato.toUpperCase() === 'MM') {
        auxFecha = '' + (fechaCadena.getMonth() + 1);
        if (auxFecha.length < 2) auxFecha = '0' + auxFecha;
      }
      if (formato.toUpperCase() === 'YYYY') {
        auxFecha = '' + fechaCadena.getFullYear();
      }
      arrayResultado.push(auxFecha);
    });

    return arrayResultado.join(separador);
  }

  /**
   * Convierte al formato 'dd/MM/yyyy' que recibe el servicio, fecha de entrada en formato 'yyyy-MM-dd'
   */
  public ConvertirFechaFormatoServicio(fecha: string): string {
    let dia: number = parseInt(fecha.split('-')[2]);
    let mes: number = parseInt(fecha.split('-')[1]) - 1;
    let anho: number = parseInt(fecha.split('-')[0]);
    return this.ConvertirFechaCadena(
      new Date(anho, mes, dia),
      'dd/MM/yyyy',
      '/'
    );
  }

  /**
   * Convierte al formato 'yyyy-MM-dd' que recibe los input, fecha de entrada en formato 'dd/MM/yyyy'
   */
  public ConvertirFechaFormatoInput(fecha: string): string {
    let dia: number = parseInt(fecha.split('/')[0]);
    let mes: number = parseInt(fecha.split('/')[1]) - 1;
    let anho: number = parseInt(fecha.split('/')[2]);
    return this.ConvertirFechaCadena(
      new Date(anho, mes, dia),
      'yyyy-MM-dd',
      '-'
    );
  }

  /**
   * Convierte una hora a cadena en formato "HH:mm", datos de entrada hora: Time, separador: string
   */
  public ConvertirHoraFormatoInput(
    horaEntrante: Date,
    separador: string = ':'
  ): string {
    let fechaCadena = new Date(horaEntrante);
    let hora: string = '' + fechaCadena.getHours();
    let minuto: string = '' + fechaCadena.getMinutes();

    if (hora.length < 2) hora = '0' + hora;
    if (minuto.length < 2) minuto = '0' + minuto;
    return [hora, minuto].join(separador);
  }

  /**
   * Convierte una hora a cadena en formato "HH:mm", datos de entrada hora: string (HH:mm:ss)
   */
  public ConvertirHoraCadenaFormatoInput(
    horaEntrante: string,
    separador: string = ':'
  ): string {
    let hora: string = horaEntrante.split(separador)[0];
    let minuto: string = horaEntrante.split(separador)[1];
    return [hora, minuto].join(separador);
  }

  /**
   * Convierte al formato HH:mm:ss la hora entrante. Formato por defecto 'HH:mm:ss', hora, separador: string
   */
  public ConvertirHoraFormatoServicio(
    hora: string,
    separador: string = ':'
  ): string {
    return hora.split(separador).length > 2 ? hora : hora + ':00';
  }

  /**
   * Devuelve true si la fecha inicial es menor o igual a la fecha final, caso contrario te devuelve false, el formato de las fechas esta en yyyy-MM-dd
   */
  public EsFechaInicialMayorFechaFinal(
    fechaI: string,
    fechaF: string
  ): boolean {
    let fechaInicial: Date = new Date(fechaI);
    let fechaFinal: Date = new Date(fechaF);
    return fechaInicial <= fechaFinal;
  }

  /**
   * Devuelve true si la fecha inicial es menor a la fecha final, caso contrario te devuelve false, el formato de las fechas esta en yyyy-MM-dd
   */
  public EsFechaInicialMenorFechaFinal(
    fechaI: string,
    fechaF: string
  ): boolean {
    let fechaInicial: Date = new Date(fechaI);
    let fechaFinal: Date = new Date(fechaF);
    return fechaInicial < fechaFinal;
  }

  /**
   * Devuelve true si la fecha inicial el igual a la fecha final, caso contrario te devuelve false, el formato de las fechas esta en yyyy-MM-dd
   */
  public EsFechaInicialIgualFechaFinal(
    fechaI: string,
    fechaF: string
  ): boolean {
    return fechaI == fechaF;
  }

  /**
   * Devuelve true si la hora inicial es menor o igual a la hora final, caso contrario te devuelve false, el formato de las horas esta en HH:mm
   */
  public EsHoraInicialMenorHoraFinal(horaI: string, horaF: string): boolean {
    return horaI <= horaF;
  }

  public EsValidaURL(url: string): boolean {
    let resultado = url.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (resultado == null) return false;
    else return true;
  }
  // ------------------------------- STRING -------------------------------
  public CortarCadena(input: string, cant: number): string {
    return input.length > cant
      ? input.substr(0, cant - 1).trim() + '...'
      : input.trim();
  }

  public CortarCadenaPorPalabra(
    input: string,
    cant: number,
    continuar: string
  ): string {
    let descripcionResult: string = '';
    if (input.length > cant) {
      let arrayWord: Array<string> = input.split(' ');
      for (let palabra of arrayWord) {
        if (descripcionResult.length + palabra.length <= cant) {
          descripcionResult = descripcionResult + palabra + ' ';
        } else {
          descripcionResult = descripcionResult.trim() + continuar;
          break;
        }
      }
    } else {
      descripcionResult = input;
    }
    return descripcionResult;
  }

  // ------------------------------- Generar llave única -------------------------------
  public GetUniqueKey(): string {
    let date: Date = new Date();
    return (
      date.getFullYear().toString() +
      date.getDate().toString() +
      date.getDay().toString() +
      date.getHours().toString() +
      date.getMinutes().toString() +
      date.getSeconds().toString() +
      date.getMilliseconds().toString()
    );
  }

  // ------------------------------- Quitar segundo hora cadena -------------------------------
  public RemoveSecond(time: string) {
    let arrayTime: Array<string> = time.split(':');
    return [arrayTime[0], arrayTime[1]].join(':');
  }
}
