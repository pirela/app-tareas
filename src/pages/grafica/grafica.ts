import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Tarea } from '../../models/tarea';
import { ShowToast } from '../../components/notify';
import { Tareas } from '../../providers/providers';

import moment from 'moment';

import { Chart } from "chart.js";

@IonicPage()
@Component({
  selector: 'page-grafica',
  templateUrl: 'grafica.html',
})
export class GraficaPage {
  grafica:number = 0

  tareas:Tarea[] = []
  tareasCompletadas:Tarea[] = []
  tareasIncompletas:Tarea[] = []
  historialTareas:Tarea[] = []
  banderaHisTar:boolean = true
  textoHist:any = ''
  paginaIni:number = 0
  paginaFin:number = 10


  @ViewChild("lineCanvas") lineCanvas;
  lineChart: any;

  data1: any;
	options: any;
  datosGraf:any = []

  semana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ]
  textoGraf = ''

  icons:any = {
    historial: '',
    grafica: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public apiTareas: Tareas, public loading: LoadingController,
    public toastCtrl: ToastController) {
  }

  ionViewWillEnter(){
    const p = '<img src="assets/imgs/loading.png" width="100px" height="100px"/> <br> Cargando...'
			const loader = this.loading.create({
				spinner: 'hide',
				content: p
			});

			loader.present();
			this.apiTareas.queryAll().subscribe((res: any) => {

        this.tareas = res.data

        this.tareasCompletadas = []
        this.tareasIncompletas = []

        this.tareas.forEach(obj => {
          obj.completada ? this.tareasCompletadas.push(obj) : this.tareasIncompletas.push(obj)
        });

        this.data1 = {
          labels: this.semana,
          datasets: [
            {
              defaultFontColor: "#66BB6A",
              label: "Tarea",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#66BB6A",
              borderColor: "#66BB6A",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "#188287",
              pointBackgroundColor: "#188287",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#188287",
              pointHoverBorderColor: "#188287",
              pointHoverBorderWidth: 2,
              pointRadius: 5,
              pointHitRadius: 10,
              data: [],
              spanGaps: true
            }
          ]
        }

        this.options = {
          legend: {
            display: false,
            labels: {
              fontColor: "#188287"
            }
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: "#188287",
                  beginAtZero:true
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "#188287",
                  beginAtZero:true
                }
              }
            ]
          }
        }

        this.datosGrafica()
        this.cambiarHistorial()
        loader.dismiss()

			}, err => {
				loader.dismiss()
				ShowToast(err.json().error, null, null, this.toastCtrl);
			})
  }

  datosGrafica(){
    let datos = []
    switch (this.grafica) {
      //tareas completadas
      case 0:
        this.tareas.forEach(obj => {
          if(obj.completada)
           datos.push(obj)
        });
        this.hacerGrafica(datos)
        this.textoGraf = 'Tareas realizadas'
        this.grafica++
        this.icons.grafica = 'happy'
      break;
      //tareas no completadas
      case 1:
        this.tareas.forEach(obj => {
          if(!obj.completada)
           datos.push(obj)
        });
        this.textoGraf = 'Tareas pedidas y aún no realizadas'
        this.hacerGrafica(datos)
        this.grafica = 0
        this.icons.grafica = 'sad'
      break;

      default:
        break;
    }
  }

  hacerGrafica(datos){
    this.datosGraf = this.grupoDia(datos)
    this.data1.datasets[0].data = this.datosGraf
    if(!this.lineChart){
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: "line",
        data: this.data1,
        options: this.options
      });
    } else {
      this.lineChart.type = "line"
      this.lineChart.config.data = this.data1
      this.lineChart.config.options = this.options
      this.lineChart.update()
    }
  }

  grupoDia(datos){
    let semanaIni = moment().subtract(6, 'days').hours(0).minutes(0).seconds(0);
    let datosGrafica = [
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
    datos.forEach(obj => {
      let m
      if(this.grafica == 0)
        m = moment(obj.updatedAt)
      if(this.grafica == 1)
        m = moment(obj.createdAt)
      if(m.isAfter(semanaIni)){
        datosGrafica[m.day()] ++
      }
    });

    return datosGrafica
  }

  cambiarHistorial(){
    this.paginaIni = 0
    this.paginaFin = 10
    if(this.banderaHisTar){
      this.historialTareas = this.tareasCompletadas.slice(this.paginaIni, this.paginaFin)
      this.textoHist = 'Historial de tareas completadas'
      this.icons.historial = 'happy'
    } else {
      this.historialTareas = this.tareasIncompletas.slice(this.paginaIni, this.paginaFin)
      this.textoHist = 'Historial de tareas incompletas'
      this.icons.historial = 'sad'
    }
    this.banderaHisTar = !this.banderaHisTar
  }

  paginar(f){
    if(!this.banderaHisTar){
      this.paginarDatos(f, this.tareasCompletadas)
    } else {
      this.paginarDatos(f, this.tareasIncompletas)
    }
  }

  paginarDatos(f,datos){
    if(f){
      if((this.paginaFin)<datos.length){
        this.paginaIni +=10
        this.paginaFin +=10
        this.historialTareas = datos.slice(this.paginaIni, this.paginaFin)
      }
    }
    else{
      if(this.paginaIni>0){
        this.paginaIni -=10
        this.paginaFin -=10
        this.historialTareas = datos.slice(this.paginaIni, this.paginaFin)
      }
    }
  }

  toTime(seg){
    return moment('2000-01-01 00:00:00').add(moment.duration(seg*1000)).format('HH:mm:ss');
  }
}
