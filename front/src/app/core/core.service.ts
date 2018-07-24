import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from "rxjs/index";
import { ICore } from "./icore";
import { AuthService } from "../login/auth.service";
import { findIndex, remove, find, filter } from "lodash";


@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private url = 'http://178.62.226.144/contacts/';
  private searchUrl = 'http://178.62.226.144/contacts_search/';
  private logoutUrl = 'http://178.62.226.144/logout/'
  private listSubject = new BehaviorSubject<ICore[]>(null);
  private isMain = new BehaviorSubject<boolean>(null);
  private reservedList = []
  page = 0;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getListItems$(): Observable<ICore[]> {
    return this.listSubject.asObservable();
  }

  getIsMain() {
    this.isMain.next(true);
    return this.isMain.asObservable();
  }

  listItems(page: number) {
    const options = this.generateHeaders();
    this.http.get<ICore[]>(`${this.url}?page=${page}`, options)
      .subscribe((list: ICore[]) => {
        if (list.length < 5) {
          this.isMain.next(false);
        }
        if (page == 0) {
          this.reservedList = list;
          this.listSubject.next(list);
          return;
        }
        this.reservedList = this.listSubject.value.concat(list);
        this.listSubject.next(this.reservedList);
      }, error => { console.error(error) });
  }

  createItem(item: ICore) {
    const options = this.generateHeaders();
    this.http.post(this.url, item, options)
      .subscribe((item: ICore) => {
        this.reservedList = this.reservedList.concat(item);
        this.listSubject.next(this.reservedList);
      }, error => {
        console.error(error);
      });
  }

  updateItem(item: ICore) {
    console.log(this.listSubject.value);
    console.log(find(this.listSubject.value, { "name": item.name, "surname": item.surname, "email": item.email, "phone": item.phone }));

    const options = this.generateHeaders();
    this.http.put(`${this.url}${item.id}/`, item, options)
      .subscribe((item: ICore) => {
        const resItemIndex = findIndex(this.reservedList, (val) => { return val.id == item.id });
        this.reservedList[resItemIndex] = item;
        const itemIndex = findIndex(this.listSubject.value, (val) => { return val.id == item.id });
        this.listSubject.value[itemIndex] = item;
        this.listSubject.next(this.listSubject.value);

      }, error => {
        console.error(error);
      });
  }

  deleteItem(itemId) {
    const options = this.generateHeaders();
    return this.http.delete(`${this.url}${itemId}/`, options)
      .subscribe(() => {
        remove(this.reservedList, (val) => {
          return val.id == itemId
        });
        remove(this.listSubject.value, (val) => {
          return val.id == itemId
        });
      }, error => {
        console.error(error);
      });
  }

  getQueryList(query: string) {
    if (query == '') {
      this.listSubject.next(this.reservedList);
      this.isMain.next(true);
      return;
    }

    this.isMain.next(false);
    const options = this.generateHeaders();
    this.http.get(`${this.searchUrl}${query}/`, options)
      .subscribe((list: ICore[]) => {
        this.listSubject.next(list);
      }, error => {
        console.error(error);
      });
  }

  showReservedItems() {
    this.listSubject.next(this.reservedList);
    this.isMain.next(true);
  }

  logout() {
    const options = this.generateHeaders();
    this.http.post(this.logoutUrl, null, options)
    .subscribe(() => {
      this.authService.logout()
      }, error => {
        console.error(error);
      });
  }

  generateHeaders() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Token ${token}` });
    return { 'headers': headers };
  }

  getErrors(errors: any): string {

    if (errors !== null) {
      if (errors['required']) {
        return 'Поле обязательно для заполнения';
      }
      if (errors['email']) {
        return 'Введите действительный адрес электронной почты';
      }
      if (errors['maxlength']) {
        return `максимальная длина — ${errors['maxlength']['requiredLength']}`;
      }
      if (errors['minlength']) {
        return `минимальная длина — ${errors['minlength']['requiredLength']}`;
      }
      if (errors['pattern']) {
        return 'Введите номер в +79xxxxxxxxx';
      }
    }
    return;
  }
}

