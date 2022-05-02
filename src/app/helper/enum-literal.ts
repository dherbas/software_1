import { PayOrder } from '../models/ResponseAPI/RGeneratePO';
import { Pay_Orders } from '../models/pay_Orders';
import { EnumVoucherStatus } from './enum';

export class EnumLiteral {
  voucherStatus(valor) {
    switch (valor) {
      case EnumVoucherStatus.Canceled:
        return 'Anulado';
      case EnumVoucherStatus.Used:
        return 'Usado';
      case EnumVoucherStatus.NoUsed:
        return 'No usado';
      case EnumVoucherStatus.Reserved:
        return 'Reservado';
      case EnumVoucherStatus.Expired:
        return 'Vencido';
      default:
        return '';
    }
  }
}
