export interface ResponseAPI {
  statusCode: string;
  message: string;
  data: any;
}

export interface IResponseAPIMultipago {
  status: string;
  message: string;
  data: any;
}

export class ResponseAPIMultipago implements IResponseAPIMultipago {
  status: string;
  message: string;
  data: any;
  /**
   *
   */
  constructor() {
    this.status = '';
    this.message = '';
  }
}
