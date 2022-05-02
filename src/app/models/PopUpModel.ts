export interface PopUpModel {
    id: number;
    code: string;
    invoice_detail_id: number;
    status: number;
    pay_order_number: number;
    client_first_name: string;
    client_last_name: string;
    unit_price: string;
    glosa: string;
    concept: string;
    total_amount: number;
    unitary_amount: number;
    pay_order_extra_data: string;
    service_code: string;
    manilla1: string;
    manilla2: string;
}
export interface PopUpResultModel {
    title: string;
    message: string;
}

export interface PopUpCancelModel {
    title: string;
    message: string;
    cancel: string;
    accept: string;
}