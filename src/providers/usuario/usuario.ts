import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Api } from '../api/api';

@Injectable()
export class Usuario {
  url = 'usuario'

  constructor(public http: Http, public api: Api) {
  }

  saveSesionData({ token, data={} }) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(data));
  }

  removeSesionData() {
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('user', '{}');
  }

  getToken() {
    return sessionStorage.getItem('token')
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem('user'))
  }

  login(user: any) {
    return this.api.postAuth('auth', user)
      .map(resp => resp.json())
  }

  signup(user: any) {
    return this.api.postAuth('auth/signup', user)
      .map(resp => resp.json())
  }
}
