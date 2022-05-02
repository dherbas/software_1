import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { EnumCodigoRespuesta, EnumEstado } from '../../helper/enum';

@Component({
  selector: 'app-contenedor-backoffice',
  templateUrl: './contenedor-backoffice.component.html',
  styleUrls: ['./contenedor-backoffice.component.css'],
})
export class ContenedorBackofficeComponent implements OnInit, OnDestroy {
  interval: any;
  width: number;
  user: User;
  enumStatus = EnumEstado;
  public isMenuVisible: boolean;

  constructor(
    private service: UsuarioService,
    private storageService: StorageService,
    private router: Router
  ) {
    // this.interval = setInterval(() => {
    //   this.user = this.storageService.getCurrentUser();
    //   this.service.obtenerPorId(this.user.id).subscribe(
    //     (result) => {
    //       if (result.status == EnumCodigoRespuesta.Correcto) {
    //         this.user = result.data;
    //         if (this.user.status == this.enumStatus.Deshabilitado) {
    //           this.storageService.logout();
    //           this.router.navigate(['/login']);
    //         }
    //       } else {
    //         this.storageService.logout();
    //         this.router.navigate(['/login']);
    //       }
    //     },
    //     (error) => {
    //       this.storageService.logout();
    //       this.router.navigate(['/login']);
    //     }
    //   );
    // }, 5000);
  }

  ngOnInit(): void {
    this.width = window.innerWidth;
    if (this.width <= 764) {
      this.isMenuVisible = true;
    } else {
      this.isMenuVisible = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (window.innerWidth <= 764) {
      this.isMenuVisible = true;
    } else {
      this.isMenuVisible = false;
    }
  }

  onClicked() {
    this.toggleMenu();
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
