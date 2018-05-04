import { Injectable } from '@angular/core';

@Injectable()
export class Validacionesservice {
  constructor() { }
  // tslint:disable-next-line:member-ordering

monto(monto, decimales) {
    var respuesta = '';
  
    if (monto != null && monto != 0 && monto != '' && monto != undefined) {


        var sep;
        if (monto.toString().lastIndexOf('.') >= 1) {
            sep = monto.split('.');
        } else {
            sep = [monto.toString()]
        }


        
        var number = sep[0].split('');

        for (var i in number) {

            if (!isNaN(number[i])) {
                respuesta = respuesta + '' + number[i];
            }
        }
        if (decimales > 0) {
            if (sep.length == 2) {
                respuesta = respuesta + ".";
                var decimal = sep[1].split('');

                for (var i in decimal) {

                    if (!isNaN(decimal[i]) && parseInt(i) <= decimales - 1) {
                        respuesta = respuesta + '' + decimal[i];
                    }
                }
            }
        }

    }
    return respuesta;
};

fecha(fecha) {
    var res = false;
    if (fecha != null && fecha != '') {
        

        if (fecha.length > 0) {
            var cadenas = fecha.split('/');

            if (cadenas.length == 3) {
                if (cadenas[0] <= 12 && cadenas[1] <= 31) {
                    var res = true;
                }
                else {
                    alert("Fecha Incorrecta asegure que tenga este formato Mes/Dia/Año");
                }
            } else {
                alert("Digite la fecha con el formato solicitado");
            }
        }
        else {
            alert("Digite la fecha con el formato solicitado");
        }

    } else {
        alert("Digite la fecha con el formato solicitado")
    }
    return res;

};

ordenfecha(fecha) {
    if (fecha != null && fecha != '') {

        var dato = fecha.split("T");

        if (dato.length == 2) {
             fecha = dato[0].split("-");

             fecha = fecha[1] + '/' + fecha[2] + '/' + fecha[0];  
        }
    }
    return fecha;

};

checkbox(estado) {
   

    var retorno = 0;
    if (estado == true) {
        retorno = 1;
    }

   
    return retorno;

};

ceros_izquierda(valor, cantidad) {
    /*concatena ceros a la izquierda*/
    var respuesta = valor.toString();

    cantidad = cantidad - respuesta.length;

    for (var i = 0; i < cantidad; i++) {
        respuesta = '0' + respuesta;
    }

    return respuesta;

};

diseño(val) {
    // var retorno='';
    // var respuesta;
    // return retorno = '';
    // if (val != null && val != 0 && val != '') {

    // }
    // return respuesta;

};
}