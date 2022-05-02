export interface Delivery {
    id: number;
    name: string;
    image: string;
    phone_reference: string;
    email: string;
    state: number;
    created_at: string;
    updated_at: string;
    services_delivery_id: number;
    selected:boolean;
}