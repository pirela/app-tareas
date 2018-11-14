export class Tarea {

	constructor(

		public id: string,
		public descripcion: string,
		public idTiempo?: string,
		public tiempoIni?: number,
		public tiempoFin?: number,
		public tiempoRealizado?: number,
    public completada?: number,
    public cantPausa?: number,
    public createdAt?: Date
	) {

	}

}
