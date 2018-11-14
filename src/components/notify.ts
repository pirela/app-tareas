
import {
	AlertController,
	ToastController
} from "ionic-angular";

/**
 *
 * @param tittle titulo de la ventana, puede ser null, pondra 'Adevertencia'
 * @param msg el msj a mostrar
 * @param aceptar funcion al oprimir acepta
 * @param cancelar funcion al oprimir cancelar
 * @param alertCtrl obj AlertController
 */
export function ShowConfirm(tittle: string, msg: string, aceptar: Function, cancelar: Function, alertCtrl: AlertController) {

	let confirm = alertCtrl.create({
		title: tittle ? tittle : 'Advertencia',
		message: msg,
		cssClass:'confir',
		buttons: [
			{
				text: 'Cancelar',
				cssClass:'alert-danger',
				handler: () => {
					cancelar();
				}
			},
			{
				text: 'Aceptar',
				cssClass:'alert-danger',
				handler: () => {
					aceptar();
				}
			}
		]
	});
	confirm.present();
}

/**
 *
 * @param msg msj a mostrar, puede ser null, mostrara 'Almacenado correctamente'
 * @param position posicion a mostrar, puede evniar null, saldra abajo.
 * @param toastCtrl obj ToasController
 */
export function ShowToast(msg: string, duration: number, position: string, toastCtrl: ToastController) {
	const newMsg = msg ? msg.includes('Validation') ? 'No se pudo realizar la operacion, puede que unos de los valores ya este asignado a otro registro' : msg.includes('foreign') ? 'No se pudo realizar la operacion, puede que otro registro depende de este' : msg : 'Almacenado correctamente'
  //const newMsg = msg ?  msg : 'Almacenado correctamente'
	let toast = toastCtrl.create({
		message: newMsg,
		duration: duration ? duration : 2000,
		position: position ? position : 'bottom'
	});

	toast.present(toast);
}

