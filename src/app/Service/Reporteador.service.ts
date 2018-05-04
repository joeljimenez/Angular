import { Injectable } from '@angular/core';
import { Validacionesservice } from '../Service/Validaciones.service';
declare const jsPDF: any;

@Injectable()
export class Reporteadorservice {
tema1: any;

  constructor() {}
  // tslint:disable-next-line:member-ordering

   rpt_evaluacion(jsonencabezado, jsondata) {
      this.tema1 = {r: 0, b: 85, g: 137};
        //logo del reporte
        //var logo = $rootScope.logotext;
        //inicia el reporte *********************************************************
        var doc = new jsPDF('p', 'mm', 'Legal');
        // si se realizan cambios en el tamaño de la hoja el reporte no se ajustara. 
        //***************************************************************************

        //contiene ancho y largo de la pagina ************* 
        var ancho_page = doc.internal.pageSize.width;
        var largo_page = doc.internal.pageSize.height;
        //**************************************************

        //espacio de salto de linea en todo el reporte
        var margen_superior_espacio = 5;

        // margenes inicial del resporte "todos los margenes que se le den al reporte tienen que partir de estos"
        // ejemplo dar un espacio extra a la izquierda margen_izquierdo(10) + 50 = 60
        var margen_superior = 8;
        var margen_izquierdo = 10;
        var alto_cuadros = 5;
        var margen_cuadros_completos = (margen_izquierdo * 2);// espacio a restar para los cuadro grandes en el reporte 
        var margen_texto_cuadro = 3;// margen del texto dentro del cuadro 
        //tipo de letra del reporte
        var tipo_letra = "times";
        //se agrega logo del reporte
        //doc.addImage(logo, 'JPEG', margen_izquierdo, margen_superior - 2, 50, 17);
        doc.setDrawColor(255, 255, 255)
        doc.setFillColor(this.tema1.r, this.tema1.b, this.tema1.g);
        doc.rect(0, 0, 35 , 15, 'FD');
        doc.setFontStyle(tipo_letra);
        doc.setTextColor(255);
        doc.text("A FORMS", 5, 10);

        //doc.setFillColor(this.tema1.r, this.tema1.b, this.tema1.g);
        //doc.rect(ancho_page - 35, 0, 35, largo_page, 'FD');

        doc.setFillColor(this.tema1.r, this.tema1.b, this.tema1.g);
        doc.circle(ancho_page - 10, 10, 9, 'FD')

        doc.setFillColor(255);
        doc.circle(ancho_page - 10, 10, 8, 'FD')

        doc.setFillColor(this.tema1.r, this.tema1.b, this.tema1.g);
        doc.circle(ancho_page - 10, 10, 7, 'FD')
       
        

        doc.setFontStyle('bold');
        doc.autoTableText(jsondata[0].puntaje.toString(), ancho_page - 10, 10, { valign: 'middle', halign: 'center' });
        doc.setFontSize(9);
        doc.autoTableText("pts.", ancho_page - 10, 14, { valign: 'middle', halign: 'center' });
       
        //color del texto
        doc.setTextColor(0, 0, 0);

        //estilo del texto ej: 
        doc.setFontStyle('normal');

        // tipo de letra 
        // helvetica, times, courier, normal, bold, italic, bolditalic, zapfdingbats
        doc.setFont(tipo_letra);

        //doc.setFontType("bold");
        doc.setFontSize(12);

        // titulo del reporte centreado
        doc.autoTableText(jsonencabezado.nom_compani.toUpperCase(), ancho_page / 2, margen_superior, { valign: 'middle', halign: 'center' });

        //configuracion de la sede 
        doc.setFontSize(10); // letra 10
        margen_superior = margen_superior + margen_superior_espacio; //salto de linea
        doc.autoTableText('Sede ' + jsonencabezado.nom_sede, ancho_page / 2, margen_superior, { valign: 'middle', halign: 'center' });

        // salto de linea
        margen_superior = margen_superior + margen_superior_espacio;
        doc.setFontType("normal");
        doc.autoTableText(jsonencabezado.nom_form, ancho_page / 2, margen_superior, { valign: 'middle', halign: 'center' });

        
        //salto de linea
        //margen_superior = margen_superior + margen_superior_espacio + 5;
        //doc.text("Periodo: " + jsondata[0].Periodo, margen_izquierdo, margen_superior);
        //alinea de derecha a izquierda
       
       
        //salto de linea
        margen_superior = margen_superior + margen_superior_espacio;

        //color de bordes en las cajas
        doc.setDrawColor(this.tema1.r, this.tema1.b, this.tema1.g)
        //color de relleno de las cajas
        doc.setFillColor(this.tema1.r, this.tema1.b, this.tema1.g);
        doc.rect(11, margen_superior + 1, ancho_page - margen_cuadros_completos, alto_cuadros, 'F');
        doc.setFillColor(255, 255, 255);
        doc.rect(10, margen_superior, ancho_page - margen_cuadros_completos, alto_cuadros, 'FD');

        // decorador de letra bold 'negrita', normal

        // primer marco 
        doc.setFontType("bold");
        doc.setFontSize(8);
        doc.autoTableText('F O R M U L A R I O    D E    E V A L U A C I Ó N ', ancho_page / 2, margen_superior + margen_texto_cuadro, { valign: 'middle', halign: 'center' });
        //*******************

        doc.setFontType("normal");

        //margen para datos de formulario matricula
        var margen_resp =50;
        //datos formulario matricula
     
        margen_superior = margen_superior + margen_superior_espacio + 5;
        doc.text("Nombre del evaluado:", margen_izquierdo, margen_superior);
        doc.text(jsonencabezado.idempleado + '-' + jsonencabezado.nombre, (margen_resp + margen_izquierdo), margen_superior);

        doc.text("Nombre del evaluador:", margen_izquierdo + (margen_resp * 2), margen_superior);
        doc.text(jsonencabezado.id_emp_evaluador + '-' + jsonencabezado.nom_evaluador, (margen_resp + margen_izquierdo) + (margen_resp * 2), margen_superior);
        


        margen_superior = margen_superior + margen_superior_espacio + 1;
        doc.text("Cargo:", margen_izquierdo, margen_superior);
        doc.text(jsonencabezado.puesto, (margen_resp + margen_izquierdo), margen_superior);

        doc.text("Fecha de la evaluación:", margen_izquierdo + (margen_resp * 2), margen_superior);
        doc.text(Validacionesservice.prototype.ordenfecha(jsonencabezado.fecha_evaluacion), (margen_resp + margen_izquierdo) + (margen_resp * 2), margen_superior);
       


        margen_superior = margen_superior + margen_superior_espacio + 1;
        doc.text("Departamento:", margen_izquierdo, margen_superior);
        doc.text(jsonencabezado.departamento, (margen_resp + margen_izquierdo), margen_superior);

        doc.text("Fecha de cierre:", margen_izquierdo + (margen_resp * 2), margen_superior);
        if (jsonencabezado.fecha_aprobacion != null) {
            doc.text(Validacionesservice.prototype.ordenfecha(jsonencabezado.fecha_aprobacion), (margen_resp + margen_izquierdo) + (margen_resp * 2), margen_superior);
        }
        else {
            doc.text("En proceso.", (margen_resp + margen_izquierdo) + (margen_resp * 2), margen_superior);
        }


        margen_superior = margen_superior + margen_superior_espacio + 1;
        doc.text("Período de revisión:", margen_izquierdo, margen_superior);
        doc.text(jsonencabezado.anno + '-' + jsonencabezado.periodo, (margen_resp + margen_izquierdo), margen_superior);

        doc.text("Tipo de evaluación:", margen_izquierdo + (margen_resp * 2), margen_superior);
        doc.text(jsonencabezado.tipo_periodo, (margen_resp + margen_izquierdo) + (margen_resp * 2), margen_superior);

        
    
      
        //recorreo el armado de la evaluacion
        var margen_tabla = 0; 
        for (var i in jsondata) {
            //contenedor de columnas
            var colum = [
             {
                 "title": "Pregunta",
                 "dataKey": "pregunta"
             }
            ];
            // aqui se insetara la tabla
            var data = [];

            //creado para relacionar columnas con filas

            var referencias = ["pregunta"];
            //el numero 3 son cajas de textos
            if (jsondata[i].idtipo_respuesta != 3) {
                //recorre encabezado para crear las columnas

                for (var j in jsondata[i].encabezado) {
                    referencias.push(jsondata[i].encabezado[j].nom_resp.replace(" ", ""));
                    colum.push(
                         {
                             "title": jsondata[i].encabezado[j].nom_resp,
                             "dataKey": jsondata[i].encabezado[j].nom_resp.replace(" ","")
                         }
                        );
                }

                //coloca el tamaño de las columnas dependiendo del tipo de pregunta
                var columnStyle = "{"
                for (var z in referencias) {
                    if (parseInt(z) == 0) {
                        columnStyle = columnStyle + ' "pregunta": { "columnWidth": 81 },';
                    }
                    else {
                        if (referencias.length == 6) {
                            columnStyle = columnStyle + '"' + referencias[z] + '":{ "columnWidth": 23, "halign": "center" },'
                        }
                    }
                }
                columnStyle = columnStyle.substr(0, columnStyle.length - 1) + "}"
                columnStyle = JSON.parse(columnStyle);
                
             

                for (var k in jsondata[i].cuerpo) {
                    // qui se crearan las areas de evaluacion y se cargarán las filas
                    //margen de separacion sin calculo de filas
                    margen_superior = margen_superior + margen_superior_espacio * 2;
                    
                    //creacion de cajas 
                    //color de bordes en las cajas
                    doc.setDrawColor(this.tema1.r, this.tema1.b, this.tema1.g);
                    //color de relleno de las cajas
                    //doc.setFillColor(this.tema1.r, this.tema1.b, this.tema1.g);
                    //doc.rect(11, margen_superior + 1, ancho_page - margen_cuadros_completos, alto_cuadros, 'F');
                    doc.setFillColor(255, 255, 255);
                    doc.rect(10, margen_superior, ancho_page - margen_cuadros_completos, alto_cuadros, 'FD');

                    // decorador de letra bold 'negrita', normal

                    // primer marco 
                    doc.setFontType("bold");
                    doc.setFontSize(8);
                    doc.autoTableText(jsondata[i].cuerpo[k].area_evaluacion, ancho_page / 2, margen_superior + margen_texto_cuadro, { valign: 'middle', halign: 'center' });

                    
                    //recorremos las preguntas para ir creando la tabla 
                    var concatena_filas = '';
                    
                    for (var l in jsondata[i].cuerpo[k].preguntas) {
                        concatena_filas = '{';
                        // recorremos las referencias para colocar los datos en la columna indicada
                        for (var m in referencias) {
                            if (parseInt(m) == 0) {
                                concatena_filas = concatena_filas + '"' + referencias[m] + '":"' + jsondata[i].cuerpo[k].preguntas[l].pregunta + '",'
                            }
                            else {
                                //recorremos opciones para terminar de rellenar las filas
                                var entro = false;
                                for (var o in jsondata[i].cuerpo[k].preguntas[l].opciones) {
                                    // si la respuesta fue true entonces fue la escogida de lo contrario espacio en blanco
                                    
                                    if (jsondata[i].cuerpo[k].preguntas[l].opciones[o].respuesta == true) {
                                        if (parseInt(m) - 1 == parseInt(o)) {
                                            concatena_filas = concatena_filas + '"' + referencias[m] + '":"*",'
                                        }
                                        else {

                                        }
                                    }
                                   
                                }
                            }
                        }
                      
                        concatena_filas = concatena_filas.substr(0, concatena_filas.length - 1) + '}';
                        
                        
                        data.push(JSON.parse(concatena_filas));

                        
                        

                    }
                    margen_superior = margen_superior + margen_superior_espacio ;
                    doc.autoTable(colum, data, {
                        //theme: 'elegans',
                        startY: margen_superior,
                        margin: { horizontal: margen_izquierdo },
                        styles: { cellPadding: 1, overflow: 'linebreak' },
                        headerStyles: { rowHeight: 5, fontSize: 8, font: tipo_letra, halign: "center" },
                        bodyStyles: { rowHeight: 5, fontSize: 8, font: tipo_letra, textColor: 0 },
                        pageBreak: 'avoid',
                        columnStyles: columnStyle
                    });
                    //espacio de imprecion de la tabla para la nueva linea
                    margen_superior = margen_superior + (4 * (jsondata[i].cuerpo[k].preguntas.length));
                   
                    data = [];
                }

            }
        }

        //salto de linea
        margen_superior = margen_superior + margen_superior_espacio * 2;
        for (var a in jsondata) {
            if (jsondata[a].idtipo_respuesta == 3) {
                for (var a in jsondata[i].cuerpo) {
                   
                    
                    //color de bordes en las cajas
                    doc.setDrawColor(this.tema1.r, this.tema1.b, this.tema1.g)
                    //color de relleno de las cajas
                    doc.setFillColor(this.tema1.r, this.tema1.b, this.tema1.g);
                    doc.rect(11, margen_superior + 1, ancho_page - margen_cuadros_completos, alto_cuadros, 'F');
                    doc.setFillColor(255, 255, 255);
                    doc.rect(10, margen_superior, ancho_page - margen_cuadros_completos, alto_cuadros, 'FD');

                    // decorador de letra bold 'negrita', normal

                    // primer marco 
                    doc.setFontType("bold");
                    doc.setFontSize(8);
                    doc.autoTableText(jsondata[i].cuerpo[a].area_evaluacion, ancho_page / 2, margen_superior + margen_texto_cuadro, { valign: 'middle', halign: 'center' });

                    doc.setFontType("normal");
                    //salto de linea
                    margen_superior = margen_superior + margen_superior_espacio
                   
                    for (var b in jsondata[i].cuerpo[a].preguntas) {
                        doc.setFontType("bold");
                        margen_superior = margen_superior + margen_superior_espacio
                        doc.text(jsondata[i].cuerpo[a].preguntas[b].pregunta, margen_izquierdo, margen_superior);

                       

                        doc.setFontType("normal");
                        margen_superior = margen_superior + margen_superior_espacio
                        var text = [];
                        if (jsondata[i].cuerpo[a].preguntas[b].opciones[0].resouesta_texto != null) {
                            text = doc.splitTextToSize(jsondata[i].cuerpo[a].preguntas[b].opciones[0].resouesta_texto, doc.internal.pageSize.width - (6 + margen_izquierdo * 2), {});
                        }
                        
                       

                        var necesito = Math.round(3.7 * text.length);
                        var quedan = Math.round(largo_page - margen_superior)
                        
                       
                        if (necesito > quedan) {
                            var cantidad = Math.round((largo_page - margen_superior) / 3.7);
                            var count = 0;

                            while (count < text.length) {

                                for (count; count <= cantidad; count++) {
                                    if (count < text.length) {
                                        doc.text(text[count], margen_izquierdo + 4, margen_superior);
                                        margen_superior = margen_superior + 3.2;
                                    }
                                    else {
                                        break;
                                    }
                                }

                                cantidad = Math.round((largo_page - margen_superior) / 3.7)
                               
                                if (cantidad < 10) {
                                    margen_superior = 5;
                                    doc.addPage();
                                }
                            }
                        }
                        else if (text.length > 0) {
                            doc.setFillColor(255, 255, 255);
                            doc.rect(margen_izquierdo, margen_superior - 4, ancho_page - margen_cuadros_completos, (3.7 * text.length) + 3, 'FD');
                            doc.text(text, margen_izquierdo + 4, margen_superior);
                            margen_superior = margen_superior + (3.2 * text.length);
                        }
                        else {
                            doc.setFillColor(255, 255, 255);
                            doc.rect(margen_izquierdo, margen_superior - 4, ancho_page - margen_cuadros_completos, 5, 'FD');
                            doc.text("", margen_izquierdo + 4, margen_superior);
                            margen_superior = margen_superior + margen_superior_espacio;
                        }
                        

                        
                      

                      
                       
                    }
                    

                }
            }
        }

        
        doc.setFontSize(8);
        var f = new Date();
        var hora = f.getHours().toString() + ":" + f.getMinutes() + ' a.m.';
        if (f.getHours() > 12) {
            hora = (f.getHours() - 12).toString() + ":" + f.getMinutes() + ' p.m.';
        }
        doc.autoTableText('print: ' + f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear()  +" - "+ hora  , ancho_page - (margen_izquierdo + 1), largo_page - 3, { valign: 'middle', halign: 'right' });

        doc.setProperties({
            title: 'Comprobante de Evaluación',
            subject: 'A jspdf-autotable example pdf ()'
        });

        return doc.output('datauristring');
        //doc.save('test.pdf')
  }
}