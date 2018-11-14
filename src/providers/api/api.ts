import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class Api {
  url: string = 'http://localhost:4000';
  apiUrl: string = this.url + '/api/v1'

  constructor(public http: Http) {
  }

  getHeaders() {
    return {
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': sessionStorage.getItem('token')
      })
    }
  }

  postAuth(endpoint: string, body: any) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    })

    return this.http.post(
      this.url + '/' + endpoint,
      JSON.stringify(body),
      { headers }
    )
  }

  get(endpoint: string) {
    return this.http.get(
      this.apiUrl + '/' + endpoint,
      this.getHeaders()
    )
  }

  post(endpoint: string, body: any) {
    return this.http.post(
      this.apiUrl + '/' + endpoint,
      JSON.stringify(body),
      this.getHeaders()
    )
  }

  put(endpoint: string, body: any) {
    return this.http.put(
      this.apiUrl + '/' + endpoint,
      JSON.stringify(body),
      this.getHeaders()
    )
  }

  delete(endpoint: string) {
    return this.http.delete(
      this.apiUrl + '/' + endpoint,
      this.getHeaders()
    )
  }
}
