export class Permission {
    id: number;
    name: string;
    parent_id: number;
    position: number;
    router_link: string;
    icon: string;
    permissions: Permission[];
}