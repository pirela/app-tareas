import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Api } from '../api/api';

@Injectable()
export class Tiempos {
	url = 'tiempo'

  constructor(public http: Http, public api: Api) {
  }

  get() {
    return this.api.get(this.url)
			.map(resp => resp.json())
	}

	post(v){
		return this.api.post(this.url, v)
			.map(resp => resp.json())
  }

  put(v){
		return this.api.put(this.url, v)
			.map(resp => resp.json())
  }

  del(v){
		return this.api.delete(this.url + '/' + v)
			.map(resp => resp.json())
	}


}
