import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { StorageService } from 'src/app/services/storage.service';
import { Permission } from 'src/app/models/pPermission';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  _User: User;
  _permissions: Permission[];
  selectedItem: number;
  selectedSubItem: number;

  constructor(private storageService: StorageService) {
    this.selectedItem = 0;
    this.selectedSubItem = null;
  }

  private _isMenuVisible: boolean;

  get isMenuVisible(): boolean {
    return this._isMenuVisible;
  }

  @Input() set isMenuVisible(isMenuVisible: boolean) {
    this._isMenuVisible = isMenuVisible;
  }

  ngOnInit(): void {
    this._User = this.storageService.getCurrentUser();
    this._permissions = this._User.list_permissions;

    /*     if (this._User.type_code == EnumTypeUser.Multipago) {
          this._permissions = this._User.list_permissions;
        }
        if (this._User.type_code == EnumTypeUser.External) {
          this._permissions = this.getPermissionVoucher();
        } */
  }

  getPermissionVoucher(): Permission[] {
    let listPermissions: Permission[] = [];
    let home = new Permission();
    home.id = 1;
    home.icon = 'fa-home';
    home.name = 'Principal';
    home.parent_id = null;
    home.position = 1;
    home.router_link = '/backoffice/principal';
    home.permissions = [];

    let voucher = new Permission();
    voucher.id = 2;
    voucher.icon = 'fa-ticket-alt';
    voucher.name = 'Generar vales';
    voucher.parent_id = 0;
    voucher.position = 2;
    voucher.router_link = '/backoffice/generar-vales-inicio/0';
    voucher.permissions = [];

    listPermissions.push(home);
    listPermissions.push(voucher);
    return listPermissions;
  }
}
