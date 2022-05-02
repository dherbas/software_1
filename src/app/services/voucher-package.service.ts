import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {StorageService} from './storage.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {ResponseAPIMultipago} from '../models/ResponseAPI';
import {Observable, throwError} from 'rxjs';
import {VoucherPackageParent} from '../models/voucher-package-parent';
import * as moment from 'moment';
import * as Excel from 'exceljs';
import * as FileSaver from 'file-saver';
import {EnumCodigoRespuesta, EnumVoucherStatus} from '../helper/enum';

@Injectable({
  providedIn: 'root',
})
export class VoucherPackageService {
  error: any;
  handleError: any;
  VoucherPackageURL: string =
    `${environment.urlServicio}` + 'external_services/';

  constructor(
    private httpClient: HttpClient,
    private sessionService: StorageService
  ) {
  }

  listarAsignaciones(service_code: string, status: number, voucher_company_id: number, search: string) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params = params.append('service_code', service_code);
    params = params.append('status', status.toString());
    params = params.append('voucher_company_id', voucher_company_id.toString());
    params = params.append('search', search);
    return this.httpClient.get<ResponseAPIMultipago>(
      this.VoucherPackageURL + 'get_vpackage_parents',
      {
        params,
        headers: reqHeader,
      }
    )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  obtenerAsignacion(id: number) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('id', id.toString());

    return this.httpClient
      .get<ResponseAPIMultipago>(
        this.VoucherPackageURL + 'get_vpackage_parent_byid',
        {
          headers,
          params,
        }
      )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  listarEmpresas(service_code: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('service_code', service_code);

    return this.httpClient.get<ResponseAPIMultipago>(this.VoucherPackageURL + 'get_vcompanies', {
      headers,
      params,
    }).pipe(map((response: ResponseAPIMultipago) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  listarUsuarios(voucher_company_id: number) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('voucher_company_id', voucher_company_id.toString());

    return this.httpClient
      .get<ResponseAPIMultipago>(
        this.VoucherPackageURL + 'get_useraccounts_external',
        {
          headers,
          params,
        }
      )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  listarBolsas(voucher_package_parent_id: number) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    let params = new HttpParams();
    params = params.append(
      'voucher_package_parent_id',
      voucher_package_parent_id.toString()
    );
    return this.httpClient
      .get(this.VoucherPackageURL + 'get_vpackages', {
        params,
        headers: reqHeader,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  get_vpackagesNewVoucher(voucher_package_parent_id: number) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    let params = new HttpParams();
    params = params.append('idParent', voucher_package_parent_id.toString());
    params = params.append(
      'idUser',
      this.sessionService.getCurrentUser().id.toString()
    );
    return this.httpClient
      .get(this.VoucherPackageURL + 'get_vpackagesNewVoucher', {
        params,
        headers: reqHeader,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  obtenerBolsa(id: number) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('id', id.toString());

    return this.httpClient
      .get<ResponseAPIMultipago>(this.VoucherPackageURL + 'get_vpackage_byid', {
        headers,
        params,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  guardarBolsa(vpParent: VoucherPackageParent) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    const params = JSON.stringify({
      id: vpParent.id,
      user_account_to_id: vpParent.user_account.id,
      status: vpParent.status,
      voucher_packages: vpParent.voucher_packages,
    });

    return this.httpClient
      .post<ResponseAPIMultipago>(
        this.VoucherPackageURL + 'store_vpackage',
        params,
        {
          headers,
        }
      )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  cambiarEstadoBolsa(id: number, status: number) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    const params = JSON.stringify({
      voucher_package_id: id,
      status,
    });

    return this.httpClient
      .post<ResponseAPIMultipago>(
        this.VoucherPackageURL + 'updatestatus_vpackage',
        params,
        {
          headers,
        }
      )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  async downloadXlsx(vpParents: VoucherPackageParent[]) {

    const Filename = 'Bolsas_Asignadas_General_' + moment().format('DDMMYYYY');
    const header = ['Empresa', 'Nombre', 'Correo electrónico', 'Total monto asignado (Bs.)', 'Total monto utilizado (Bs.)', 'Estado'];

    const base64 = await this.httpClient.get('../../assets/img/logo_m_menu.png', {responseType: 'blob'})
      .pipe(switchMap(blob => this.convertBlobToBase64(blob))).toPromise();

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Bolsas de consumo');

    const logo = workbook.addImage({
      base64,
      extension: 'png',
    });
    worksheet.addImage(logo, 'A1:A3');
    worksheet.mergeCells('A1:A4');
    worksheet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};

    worksheet.mergeCells('A5:F5');
    worksheet.getCell('A5').border = {top: {style: 'thick', color: {argb: 'DDEBF7'}}};

    worksheet.mergeCells('A6:F6');
    worksheet.getCell('A6').value = 'Asignación de bolsas de consumo';
    worksheet.getCell('A6').font = {name: 'Calibri', family: 4, size: 18, bold: true, color: {argb: '366092'}};
    worksheet.getCell('A6').alignment = {vertical: 'middle', horizontal: 'center'};

    worksheet.getCell('F2').value = this.sessionService.getCurrentUser().list_code_service[0].name;
    worksheet.getCell('F2').font = {name: 'Calibri', family: 4, size: 14, bold: true, color: {argb: '366092'}};
    worksheet.getCell('F3').value = moment().format('DD/MM/YYYY');

    worksheet.getColumn('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('C').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('D').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('E').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('F').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('D').alignment = {vertical: 'middle', horizontal: 'right'};
    worksheet.getColumn('E').alignment = {vertical: 'middle', horizontal: 'right'};
    worksheet.getColumn('F').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getCell('F3').alignment = {horizontal: 'right'};
    worksheet.getCell('F2').alignment = {horizontal: 'right'};

    worksheet.getColumn('A').width = 25;
    worksheet.getColumn('B').width = 30;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 25;
    worksheet.getColumn('E').width = 25;
    worksheet.getColumn('F').width = 25;


    worksheet.getCell('A8').value = 'Total monto asignado (Bs.):';
    worksheet.getCell('A8').font = {bold: true};
    worksheet.getCell('B8').numFmt = '0.00';
    worksheet.getCell('B8').value = vpParents.reduce((x, vp) => x += (+vp.total_amount), 0);
    worksheet.getCell('B8').alignment = {horizontal: 'left'};

    worksheet.getCell('C8').value = 'Total monto utilizado (Bs.):';
    worksheet.getCell('C8').font = {bold: true};
    worksheet.getCell('D8').numFmt = '0.00';
    worksheet.getCell('D8').value = vpParents.reduce((x, vp) => x += (+vp.total_amount_used), 0);
    worksheet.getCell('D8').font = {color: {argb: 'FF0000'}};
    worksheet.getCell('D8').alignment = {horizontal: 'left'};

    worksheet.getRow(10).values = header;
    worksheet.getRow(10).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'DDEBF7'},
        bgColor: {argb: 'DDEBF7'}
      };
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}};
      cell.font = {name: 'Calibri', bold: true};
      cell.alignment = {horizontal: 'center'};
    });

    let row = 11;
    vpParents.forEach(element => {
      worksheet.getCell('A' + row.toString()).value = element.voucher_company;
      worksheet.getCell('B' + row.toString()).value = element.user_account.first_name + ' ' + element.user_account.last_name;
      worksheet.getCell('C' + row.toString()).value = element.user_account.email;
      worksheet.getCell('D' + row.toString()).numFmt = '0.00';
      worksheet.getCell('D' + row.toString()).value = Number(element.total_amount).valueOf();
      worksheet.getCell('E' + row.toString()).numFmt = '0.00';
      worksheet.getCell('E' + row.toString()).value = Number(element.total_amount_used).valueOf();
      worksheet.getCell('E' + row.toString()).font = {color: {argb: 'FF0000'}};
      worksheet.getCell('F' + row.toString()).value = element.getStatus();
      worksheet.getRow(row).eachCell((cell) => {
        cell.border = {
          top: {style: 'dotted'},
          left: {style: 'dotted'},
          bottom: {style: 'dotted'},
          right: {style: 'dotted'}
        };
      });
      row++;
    });


    worksheet.mergeCells('A' + row.toString() + ':F' + row.toString());
    worksheet.getCell('A' + row.toString()).border = {top: {style: 'thin'}};
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, Filename + '.xlsx');
    });
  }


  async downloadXlsxByVoucherPackageId(id: number) {

    const vpackageParent = new VoucherPackageParent();
    const obtenerAsignacion = await this.obtenerAsignacion(id).toPromise();
    if (obtenerAsignacion.status == EnumCodigoRespuesta.Correcto) {
      vpackageParent.jsonToModel(obtenerAsignacion.data);
    }

    const Filename = 'Bolsas_Asignadas_Detallado' + moment().format('DDMMYYYY');
    const header = ['Nombre', 'Cédula de identidad', 'Teléfono/Celular', 'Correo electrónico', 'Monto del vale (Bs.)', 'Fecha de asignación', 'Fecha de consumo', 'Estado'];

    const base64 = await this.httpClient.get('../../assets/img/logo_m_menu.png', {responseType: 'blob'})
      .pipe(switchMap(blob => this.convertBlobToBase64(blob))).toPromise();

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Vales');

    const logo = workbook.addImage({
      base64,
      extension: 'png',
    });
    worksheet.addImage(logo, 'A1:A3');
    worksheet.mergeCells('A1:A3');
    worksheet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};

    worksheet.mergeCells('A5:H5');
    worksheet.getCell('A5').border = {top: {style: 'thick', color: {argb: 'DDEBF7'}}};

    worksheet.getCell('H2').value = this.sessionService.getCurrentUser().list_code_service[0].name;
    worksheet.getCell('H2').font = {name: 'Calibri', family: 4, size: 14, bold: true, color: {argb: '366092'}};
    worksheet.getCell('H3').value = moment().format('DD/MM/YYYY');

    worksheet.mergeCells('A6:H6');
    worksheet.getCell('A6').value = 'Asignación de bolsas de consumo';
    worksheet.getCell('A6').font = {name: 'Calibri', family: 4, size: 20, bold: true, color: {argb: '366092'}};
    worksheet.getCell('A6').alignment = {vertical: 'middle', horizontal: 'center'};


    worksheet.mergeCells('A7:H7');
    worksheet.getCell('A7').value = '"' + vpackageParent.voucher_company + '"';
    worksheet.getCell('A7').font = {name: 'Calibri', family: 4, size: 20, bold: true, color: {argb: '366092'}};
    worksheet.getCell('A7').alignment = {vertical: 'middle', horizontal: 'center'};


    worksheet.getColumn('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('B').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('C').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('D').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('E').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('F').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('G').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };
    worksheet.getColumn('H').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
      bgColor: {argb: 'FFFFFF'}
    };

    worksheet.getColumn('E').alignment = {vertical: 'middle', horizontal: 'right'};
    worksheet.getColumn('F').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getColumn('G').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getColumn('H').alignment = {vertical: 'middle', horizontal: 'center'};
    worksheet.getCell('H3').alignment = {horizontal: 'right'};
    worksheet.getCell('H2').alignment = {horizontal: 'right'};

    worksheet.getColumn('A').width = 30;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 30;
    worksheet.getColumn('E').width = 25;
    worksheet.getColumn('F').width = 25;
    worksheet.getColumn('G').width = 25;
    worksheet.getColumn('H').width = 20;

    worksheet.getCell('A9').value = 'Usuario:';
    worksheet.getCell('A9').font = {bold: true};
    worksheet.getCell('B9').value = vpackageParent.user_account.first_name + ' ' + vpackageParent.user_account.last_name;

    worksheet.getCell('A10').value = 'Total monto asignado (Bs.):';
    worksheet.getCell('A10').font = {bold: true};
    worksheet.getCell('B10').numFmt = '0.00';
    worksheet.getCell('B10').value = vpackageParent.total_amount;
    worksheet.getCell('B10').alignment = {horizontal: 'left'};

    worksheet.getCell('D10').value = 'Total monto utilizado (Bs.):';
    worksheet.getCell('D10').font = {bold: true};
    worksheet.getCell('E10').numFmt = '0.00';
    worksheet.getCell('E10').value = vpackageParent.total_amount_used;
    worksheet.getCell('E10').font = {color: {argb: 'FF0000'}};
    worksheet.getCell('E10').alignment = {horizontal: 'left'};

    let row = 12;
    vpackageParent.voucher_packages.forEach(voucherPackage => {

      worksheet.mergeCells('A' + row.toString() + ':H' + row.toString());
      worksheet.getCell('A' + row.toString()).value = voucherPackage.description;
      worksheet.getCell('A' + row.toString()).font = {
        name: 'Calibri',
        family: 4,
        size: 15,
        bold: true,
        color: {argb: '366092'}
      };

      row++;
      worksheet.mergeCells('A' + row.toString() + ':H' + row.toString());
      worksheet.getCell('A' + row.toString()).border = {top: {style: 'thick', color: {argb: 'DDEBF7'}}};

      row++;

      const amount = Number(voucherPackage.amount).valueOf();
      const amountUsed = Number(voucherPackage.amount_used).valueOf();
      worksheet.getRow(row).alignment = {horizontal: 'left'};
      worksheet.getCell('A' + row.toString()).value = 'Monto asignado (Bs.):';
      worksheet.getCell('A' + row.toString()).font = {bold: true};
      worksheet.getCell('B' + row.toString()).numFmt = '0.00';
      worksheet.getCell('B' + row.toString()).value = amount;

      worksheet.getCell('D' + row.toString()).value = 'Monto disponible (Bs.):';
      worksheet.getCell('D' + row.toString()).font = {bold: true};
      worksheet.getCell('E' + row.toString()).numFmt = '0.00';
      worksheet.getCell('E' + row.toString()).value = amount - amountUsed;

      worksheet.getCell('G' + row.toString()).value = 'Monto utilizado (Bs.):';
      worksheet.getCell('G' + row.toString()).font = {bold: true};
      worksheet.getCell('H' + row.toString()).numFmt = '0.00';
      worksheet.getCell('H' + row.toString()).value = amountUsed;
      worksheet.getCell('H' + row.toString()).font = {color: {argb: 'FF0000'}};

      row++;
      worksheet.getRow(row).alignment = {horizontal: 'left'};
      worksheet.getCell('A' + row.toString()).value = 'Fecha de inicio:';
      worksheet.getCell('A' + row.toString()).font = {bold: true};
      worksheet.getCell('B' + row.toString()).value = moment(voucherPackage.start_date).format('DD/MM/YYYY');


      worksheet.getCell('D' + row.toString()).value = 'Fecha de fin:';
      worksheet.getCell('D' + row.toString()).font = {bold: true};
      worksheet.getCell('E' + row.toString()).value = moment(voucherPackage.expiration_date).format('DD/MM/YYYY');

      worksheet.getCell('G' + row.toString()).value = 'Estado de la bolsa:';
      worksheet.getCell('G' + row.toString()).font = {bold: true};
      worksheet.getCell('H' + row.toString()).value = voucherPackage.getStatus();
      if (voucherPackage.status == EnumVoucherStatus.Expired) {
        worksheet.getCell('H' + row.toString()).font = {color: {argb: 'FF0000'}};
      }

      row += 2;

      if (voucherPackage.discount_vouchers.length > 0) {
        worksheet.getRow(row).values = header;
        worksheet.getRow(row).eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'DDEBF7'},
            bgColor: {argb: 'DDEBF7'}
          };
          cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}};
          cell.font = {name: 'Calibri', bold: true};
          cell.alignment = {horizontal: 'center'};
        });

        row++;

        voucherPackage.discount_vouchers.forEach(discountVoucher => {
          worksheet.getCell('A' + row.toString()).value = discountVoucher.getFullName();
          worksheet.getCell('B' + row.toString()).value = discountVoucher.ci;
          worksheet.getCell('C' + row.toString()).value = discountVoucher.phone_number;
          worksheet.getCell('D' + row.toString()).value = discountVoucher.email;
          worksheet.getCell('E' + row.toString()).numFmt = '0.00';
          worksheet.getCell('E' + row.toString()).value = Number(discountVoucher.amount).valueOf();
          worksheet.getCell('F' + row.toString()).value = moment(discountVoucher.assigned_date).format('DD/MM/YYYY');
          worksheet.getCell('G' + row.toString()).value = discountVoucher.status == EnumVoucherStatus.Used ? moment(discountVoucher.updated_at).format('DD/MM/YYYY') : '';
          worksheet.getCell('H' + row.toString()).value = discountVoucher.getStatus();
          row++;
        });

      }
    });


    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, Filename + '.xlsx');
    });
  }

  getBusinessVoucher(contract_number: string, service_code: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    const params = JSON.stringify({
      nboe: contract_number,
      service_code: service_code,
    });

    return this.httpClient
      .post<ResponseAPIMultipago>(
        this.VoucherPackageURL + 'multipago_voucher/get_bono_empresarial',
        params,
        {
          headers,
        }
      )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  private convertBlobToBase64(blob: Blob): string {
    return Observable.create(observer => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        observer.next(event.target.result);
        observer.complete();
      };

      reader.onerror = (event: any) => {
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }

}
