import { Component, OnInit } from '@angular/core';
import { CoreService } from './core.service';
import { AuthService } from '../login/auth.service';
import { ICore } from './icore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { remove } from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CoreAddFormComponent } from './core-add-form/core-add-form.component';
import { CoreEditFormComponent } from './core-edit-form/core-edit-form.component';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})
export class CoreComponent implements OnInit {

  bsModalRef: BsModalRef;
  items$: Observable<ICore[]>;
  activeItems = [];
  searchValue = '';
  main$: Observable<boolean>;

  constructor(private coreService: CoreService,
    private authService: AuthService, private router: Router,
    private modalService: BsModalService) { }

  ngOnInit() {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.coreService.listItems(this.coreService.page);
    this.items$ = this.coreService.getListItems$();
    this.main$ = this.coreService.getIsMain();
    
  }

  onLogout() {
    this.coreService.logout();
  }

  clickItem(elem: any) {
    if (elem[1]) {
      this.activeItems.push(elem[0]);
    }
    else {
      remove(this.activeItems, id => id === elem[0]);
    }
  }

  onEditItem(item: ICore) {
    const initialState = { item }
    this.bsModalRef = this.modalService.show(CoreEditFormComponent, { initialState });
  }

  onSearchChange(event: any) {
    const val = event.target.value;
    this.activeItems = [];
    this.coreService.getQueryList(val);
  }

  onMoreItems() {
    this.coreService.page += 1;
    this.coreService.listItems(this.coreService.page);
  }

  onAddItems() {
    this.bsModalRef = this.modalService.show(CoreAddFormComponent);
    this.searchValue = null;
    this.coreService.showReservedItems();
  }

  onDeleteItems() {
    for (let index = 0; index < this.activeItems.length; index++) {
      this.deleteItem(this.activeItems[index]);
    }
    this.activeItems = []
  }

  deleteItem(id: number) {
    this.coreService.deleteItem(id)
  }

  updateCard(item: ICore) {
    this.coreService.updateItem(item);
  }

  newItem(item: ICore) {
    this.coreService.createItem(item);
  }
}
