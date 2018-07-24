import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  private loginUrl = 'http://178.62.226.144/api/login/'
  private token : string

  login(username: string, password: string) {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    let options = {
      'headers': headers
    }
    return this.http.post(this.loginUrl, JSON.stringify({ username: username, password: password }), options)
  }

  logout() {
    localStorage.clear();
    this.token = null;
    this.router.navigate(['/login']);
  }

  getToken() {
    if (this.token) {
      return this.token;
    }
    return localStorage.getItem('id_token')
  }

  setToken(token: string) {
    this.token = token;
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
        return `нужна маленькая и большая английская буковка,
                циферка и какой нибудь спецсимвол (!#$-+)`;
      }
    }
    return;
  }
}
