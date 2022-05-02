export interface IParameterService {
  id: number;
  name: string;
  code: string;
  value: string;
  description: string;
  parameter_id: number;
  service_id: number;
  service_code: string;
}

export class ParameterService implements IParameterService {
  id: number = 0;
  name: string = '';
  code: string = '';
  value: string = '';
  description: string = '';
  parameter_id: number = 0;
  service_id: number = 0;
  service_code: string = '';
}

