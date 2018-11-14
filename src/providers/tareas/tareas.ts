import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Api } from '../api/api';

@Injectable()
export class Tareas {
	url = 'tarea'

  constructor(public http: Http, public api: Api) {
  }

  query(completada) {
    return this.api.get(this.url + '/completada/' + completada)
			.map(resp => resp.json())
  }

  queryAll() {
    return this.api.get(this.url + '/all')
			.map(resp => resp.json())
  }

  // consulta para ir trayendo la data por fraccion
  // queryMore(cant) {
  //   console.log("this.url + '/more/' + cant", this.url + '/more/' + cant)
  //   return this.api.get(this.url + '/more/' + cant)
	// 		.map(resp => resp.json())
	// }

	post(v){
		return this.api.post(this.url, v)
			.map(resp => resp.json())
  }

  postMasivo(v){
		return this.api.post(this.url + '/masivo', v)
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
