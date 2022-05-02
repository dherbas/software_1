import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Session } from 'src/app/models/Session';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  _User: User;
  @Output() clicked = new EventEmitter<string>();
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this._User = this.storageService.getCurrentUser();
  }
  CloseSession() {
    this.storageService.removeCurrentSession();
  }

  OpenMenu(){
    this.clicked.emit('');
  }

}
