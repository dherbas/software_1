export enum EnumEstado {
  Deshabilitado = 0,
  Habilitado = 1,
  Todos = 2,
  Eliminado = 3,
}

export enum EnumCodigoRespuesta {
  Correcto = 'OK',
  Error_Validacion = 'VALIDATION_ERROR',
  // Error = 0,
  // SinRegistro = 2,
  // ErrorControl = 3,
}

export enum EnumTipoBusquedaUsuario {
  Username = 1,
  Nombres = 2,
  Apellidos = 3,
}

export enum EnumVoucherStatus {
  NoUsed = 0,
  Used = 1,
  All = 2,
  Canceled = 3,
  Reserved = 4,
  Expired = 5,
}

export enum EnumTypeUser {
  Multipago = 'MULTIPAGO',
  External = 'EXTERNAL',
  Gerencia = 'GERENCIA',
  Contabilidad = 'CONTABILIDAD',
  Cobrador = 'COBRADOR',
}

export enum EnumTransactionStatus {
  Todos = 0,
  Pendiente = 1,
  Confirmado = 2,
  Cancelada = 3,
  Error = 4,
  PendienteRespuesta = 5,
  Revertido = 6,
  Reservado = 7,
}

export enum EnumPayOrderChannel {
  Presencial = 1,
  TigoMoney = 2,
  TarjetaCredito = 3,
  PagoCodigo = 5,
  BCGanadero = 6,
  QRMultipago = 7,
  PuntoFisico = 8,
  Cybersource = 9,
}

export enum EnumTypeSearchReports {
  Vale = 1,
  Vale_Corporativo = 2,
}

export enum EnumGoogleCategoria {
  Url_Multipago = 'UrlMultipago',
  Canje_Vale = 'CanjeVale',
}

export enum EnumGoogleEvento {
  Url_Multipago = 'UrlMultipago',
  Canje_Vale = 'CanjeVale',
}

export enum EnumFiltroTipoUsuario {
  Todos = '',
  Multipago = 'MULTIPAGO',
  Cobrador = 'COBRADOR',
}

export enum EnumServicioRespuesta {
  Correcto = '0',
  Error_Validacion = '1',
}

export enum EnumPayChannel {
  Presencial = 'presencial',
  PayTigoMoney = 'tigo_money',
  PayQR = 'bcp_qr',
  PayTarjetaPOS = 'tarjeta_pos',
}

export enum EnumPayOrderStatus {
  Pendiente = 1,
  Confirmada = 2,
  Cancelada = 3,
  Error = 4,
  PendienteRespuesta = 5,
  Revertido = 6,
  Reservado = 7,
}

export enum EnumPayOrderSources {
  M_OFERTA = 1,
  M_URL = 2,
  M_EVENTO = 3,
  M_QR_FACTURA = 4,
  M_INTEGRACION = 5,
  M_BCP = 6,
  M_URL_DIRECTO = 7,
}

export enum EnumCardTransaction {
  TypeChip = 'chip',
  TypeCTL = 'ctl',
}

export enum EnumCodeRedEnlace {
  OK = 0,
}

export enum EnumTypeItemPayOrder {
  Amount = 1,
  PurchaseItems = 2,
}
export enum EnumServiceCurrency {
  Dolar = '$us',
  BOB = 'Bs',
}
