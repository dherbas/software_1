export interface IDialogo {
  icono?: string;
  titulo: string;
  html: string;
  txBtOk: string;
  txBtCancel: string;
}

export class Dialogo implements IDialogo {
  icono? = '';
  titulo = '';
  html = '';
  txBtOk = '';
  txBtCancel = '';
}
