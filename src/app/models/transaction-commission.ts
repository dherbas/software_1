export interface ICommissionParent {
  name: string;
  code: string;
  commissions: Commission[];
  totalBs: number;
  totalSus: number;
  totalComissionBs: number;
  totalComissionSus: number;
  totalChargeBs: number;
  totalChargeSus: number;
  totalPayChannelComsnBs: number;
  totalPayChannelComsnSus: number;
  totalMultipagoComsnBs: number;
  totalMultipagoComsnSus: number;
}

export interface ICommission {
  payChannelName: number;
  currency: string;
  commissions: CommissionItem[];
  totalCollectionAmount: number;
  totalCommissionAmount: number;
  totalCharge: number;
  totalChannelCommission: number;
  totalMultipagoCommission: number;
}

export interface ICommissionItem {
  date: string;
  service: string;
  collection_amount: number;
  commission_amount: number;
  charge: number;
  channel_commission: number;
  multipago_commission: number;
}

export class CommissionParent implements ICommissionParent {
  name: string;
  code: string;
  commissions: Commission[];
  totalBs: number;
  totalSus: number;
  totalComissionBs: number;
  totalComissionSus: number;
  totalChargeBs: number;
  totalChargeSus: number;
  totalPayChannelComsnBs: number;
  totalPayChannelComsnSus: number;
  totalMultipagoComsnBs: number;
  totalMultipagoComsnSus: number;

  constructor() {
    this.name = '';
    this.code = '';
    this.commissions = [];
  }

  jsonToModel(value: any) {
    this.name = value.name;
    this.code = value.code;
    value.commissions.forEach((item) => {
      const commission = new Commission();
      commission.jsonToModel(item);
      this.commissions.push(commission);
    });
    this.totalBs = this.commissions.filter(({currency}) => currency === 'Bs')
      .reduce((x, c) => x += (+c.totalCollectionAmount), 0);
    this.totalSus = this.commissions.filter(({currency}) => currency === '$us')
      .reduce((x, c) => x += (+c.totalCollectionAmount), 0);
    this.totalComissionBs = this.commissions.filter(({currency}) => currency === 'Bs')
      .reduce((x, c) => x += (+c.totalCommissionAmount), 0);
    this.totalComissionSus = this.commissions.filter(({currency}) => currency === '$us')
      .reduce((x, c) => x += (+c.totalCommissionAmount), 0);
    this.totalChargeBs = this.commissions.filter(({currency}) => currency === 'Bs')
      .reduce((x, c) => x += (+c.totalCharge), 0);
    this.totalChargeSus = this.commissions.filter(({currency}) => currency === '$us')
      .reduce((x, c) => x += (+c.totalCharge), 0);
    this.totalPayChannelComsnBs = this.commissions.filter(({currency}) => currency === 'Bs')
      .reduce((x, c) => x += (+c.totalChannelCommission), 0);
    this.totalPayChannelComsnSus = this.commissions.filter(({currency}) => currency === '$us')
      .reduce((x, c) => x += (+c.totalChannelCommission), 0);
    this.totalMultipagoComsnBs = this.commissions.filter(({currency}) => currency === 'Bs')
      .reduce((x, c) => x += (+c.totalMultipagoCommission), 0);
    this.totalMultipagoComsnSus = this.commissions.filter(({currency}) => currency === '$us')
      .reduce((x, c) => x += (+c.totalMultipagoCommission), 0);
  }
}

export class Commission implements ICommission {
  payChannelName: number;
  currency: string;
  commissions: CommissionItem[];
  totalCollectionAmount: number;
  totalCommissionAmount: number;
  totalCharge: number;
  totalChannelCommission: number;
  totalMultipagoCommission: number;

  constructor() {
    this.payChannelName = 0;
    this.currency = '';
    this.commissions = [];
  }

  jsonToModel(value: any) {
    this.payChannelName = value.pay_channel_name;
    this.currency = value.currency;
    value.commissions.forEach((item) => {
      const commission = new CommissionItem();
      commission.jsonToModel(item);
      this.commissions.push(commission);
    });
    this.totalCollectionAmount = this.commissions.reduce((x, c) => x += (+c.collection_amount), 0);
    this.totalCommissionAmount = this.commissions.reduce((x, c) => x += (+c.commission_amount), 0);
    this.totalCharge = this.commissions.reduce((x, c) => x += (+c.charge), 0);
    this.totalChannelCommission = this.commissions.reduce((x, c) => x += (+c.channel_commission), 0);
    this.totalMultipagoCommission = this.commissions.reduce((x, c) => x += (+c.multipago_commission), 0);
  }
}


export class CommissionItem implements ICommissionItem {
  date: string;
  service: string;
  collection_amount: number;
  commission_amount: number;
  charge: number;
  channel_commission: number;
  multipago_commission: number;

  constructor() {
    this.date = '';
    this.service = '';
    this.collection_amount = 0;
    this.commission_amount = 0;
    this.charge = 0;
    this.channel_commission = 0;
    this.multipago_commission = 0;
  }

  jsonToModel(item: any) {
    this.service = item.service;
    this.date = item.transaction_date;
    this.collection_amount = item.original_total_amount;
    this.commission_amount = item.original_commission;
    this.charge = item.charge_service;
    this.channel_commission = item.pay_channel_commission;
    this.multipago_commission = item.multipago_commission;

  }
}
