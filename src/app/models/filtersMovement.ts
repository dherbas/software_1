export class filtersMovement {
    constructor() {
        this.state = 1;
        this.ammount = 0;
        this.code = '';
        this.paymentChannel = 2;
        this.searchType = '1';

        this.searchText = '';
        this.document = '';
        this.startDate = '';
        this.endDate = '';
        this.paymentOrder = '';
        this.transactionNumber = '';
        this.transactionNumber = '';
        this.searchUserApp = '';
    }

    ammount: number;
    code: string;
    paymentChannel: number;
    document: string;
    startDate: string;
    endDate: string;
    state: number;
    searchText: string;
    searchType: string;
    paymentOrder: string;
    transactionNumber: string;
    searchUserApp: string;
}