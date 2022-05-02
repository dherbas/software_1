export interface IReportChannel {
  code: string;
  description: string;
  total: number;
}

export class ReportChannel implements IReportChannel {
  code: string;
  description: string;
  total: number;

  constructor() {
    this.code = '';
    this.description = '';
    this.total = 0;
  }

  jsonToModel(value: any) {
    this.code = value.code;
    this.description = value.description;
    this.total = value.count;
  }
}
