import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, empleados, formularios, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { CorrectorPipe, MaxLengthPipe } from '../../../pipes/export';
import { Reporteadorservice} from '../../../service/Reporteador.service';

@Component({
  selector: 'app-formulario-evaluaciones',
  templateUrl: './formulario-evaluaciones.component.html',
  styleUrls: ['./formulario-evaluaciones.component.css']
})
export class FormularioEvaluacionesComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: empleados;
  titulo_modal: string;
  encuestas_empleado: empleados;
  formularios:formularios;
  activa_btn_enviar:boolean;
  encabezado_pagina: empleados;
  mensaje:string;
  dataForm = [];
  form = [];
  filtro_opcion: any;
  datos_envio:any;
  loading:boolean;
  confirmacion:boolean;
  printPdf: string;
  breadcrumbArray = [];
  titulo:string;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService,private route: ActivatedRoute) { }

  ngOnInit() { 
    this.solicitud.idsede = sessionStorage._sede;
    this.titulo = 'Formulario de Evaluaciones'; /*Titulo de la Pagina*/
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.solicitud.idformulario = JSON.parse(atob(params['data'])).idformulario;
          this.solicitud.periodo =   JSON.parse(atob(params['data'])).periodo;
          this.solicitud.anno = JSON.parse(atob(params['data'])).anno;
          this.solicitud.idempleado = JSON.parse(atob(params['data'])).idempleado;
          this.datos_envio = JSON.parse(atob(params['data']));


          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo,ruta: '../home/Formulario-Evaluaciones', datos: JSON.parse(atob(params['data']))});
          
        }catch (error) {
          this.router.navigate(['./home/Evaluador'])
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/Evaluador'])
      }
    });

    this.solicitud.metodo = 1;
    this.solicitud.consulta = 1;
    this.run();
  }


  run(){
    this.flag_envio = true;

    this.solicitud.contesta_evaluado = (this.solicitud.contesta_evaluado) ? 1 : 0;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
        this.dataForm = [];
          this.rest.NuevoTokent(datos.tokent);
          this.encabezado_pagina = datos.data[0];
          this.consulta_opciones(datos.data);

          if(this.solicitud.consulta === 2){
            this.notify.success('Proceso exitoso', 'Registro Actualizado.', this.optionconfig);
          }

          if(datos.data[0].confirmacion === 1){
            this.confirmacion = true;
            this.printPdf = Reporteadorservice.prototype.rpt_evaluacion(this.encabezado_pagina, this.dataForm);
            // if(this.solicitud.consulta === 5){
            //     this.notify.success('Proceso exitoso', datos.mensaje, this.optionconfig);
            // }
        }else{
            if(this.valida_respuestascompletas()){
                this.activa_btn_enviar = true;
              this.notify.success('Proceso exitoso', 'Listo, ya termino de llenar el formulario.', this.optionconfig);
            }else{
                this.activa_btn_enviar = false;
            }
        }

          return datos.data;
        }
        else {
          if (datos.error === '0') {
            this.respuesta = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 1) {
              this.notify.success('Proceso exitoso', 'Registro no existe',this.optionconfig);
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error),this.optionconfig)
            this.rest.NuevoTokent(datos.tokent)
          }
          return 0;
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          // document.getElementById('area_evaluacion').style.display='none';
          // document.getElementById('eliminar').style.display='none';
          // document.getElementById('preguntas').style.display='none'
        }
      }
    )
  }

  inserte_respuesta_evaluacion(data: formularios){
      /*Edita el formulario de la solicitud las opciones de de cada pregunta */

    this.solicitud.metodo = 1;
    this.solicitud.consulta = 2;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idevaluacion = data.idevaluacion;
    this.solicitud.idtipo_respuesta_opcion = data.idtipo_respuesta_opcion;
    this.solicitud.idpregunta_formulario = data.idpregunta_formulario,
    this.solicitud.resouesta_texto = data.resouesta_texto;
    //data.envio = 1
    this.run();

  }

  consulta_opciones(a){
    for (var i in a) {
      if (this.dataForm.length == 0) {
          this.inserta_dataForm(a[i]);
      }
      else {
          //break;
          let existe = false;
          let iddata = 0;
          for (let f in this.dataForm) {
              if (this.dataForm[f].idtipo_respuesta == a[i].idtipo_respuesta) {
                  existe = true;
                  iddata = parseInt(f);
                  break;
              }
          }

          if (existe) {
            this.inserta_encabezado(iddata, a[i]);
            this.inserta_cuerpo(iddata, a[i]);
          }
          else {
            this.inserta_dataForm(a[i]);
          }

      }

    }
    var respuesta = false;

    if (this.dataForm.length > 0) {
      for (var s in a) {
          for (var c in this.dataForm) {
            this.dataForm[c].long = this.dataForm[c].encabezado.length;
              if (a[s].idtipo_respuesta == this.dataForm[c].idtipo_respuesta) {
                  for (var h in this.dataForm[c].cuerpo) {
                      if (a[s].idarea_formulario == this.dataForm[c].cuerpo[h].idarea_formulario) {
                          for (var l in this.dataForm[c].cuerpo[h].preguntas) {
                              if (a[s].idpregunta_formulario == this.dataForm[c].cuerpo[h].preguntas[l].idpregunta_formulario) {

                                  //aqui se pueden hacer los calculos de puntuacion
                                  if (a[s].respuesta != null) {
                                      respuesta = true;
                                      this.dataForm[c].cuerpo[h].preguntas[l].pts_resp = a[s].pts_resp;
                                      this.dataForm[c].puntaje = this.dataForm[c].puntaje + this.dataForm[c].cuerpo[h].preguntas[l].pts_resp;
                                      
                                  }
                                  else {
                                      respuesta = false;
                                  }

                                  this.dataForm[c].cuerpo[h].preguntas[l].opciones.push(
                                      {
                                          'respuesta': respuesta,
                                          'idevaluacion': a[s].idevaluacion,
                                          'idpregunta_formulario': a[s].idpregunta_formulario,
                                          'idtipo_respuesta_opcion': a[s].idtipo_respuesta_opcion,
                                          'ord_resp': a[s].ord_resp,
                                          'idformulario': a[s].idformulario,
                                          'anno': a[s].anno,
                                          'periodo': a[s].periodo,
                                          'idempleado': a[s].idempleado,
                                          'idtipo_respuesta': a[s].idtipo_respuesta,
                                          'resouesta_texto': a[s].resouesta_texto,
                                          'envio':0,
                                          
                                      }
                                      );
                              }   
                          }
                          
                        
                      }
                  }
                  
              }

            
          }
      }

      
    }

    this.form = this.dataForm;
  }
  inserta_dataForm(a) {
      if (a.idpregunta_formulario != null) {
          this.dataForm.push({
              'idtipo_respuesta': a.idtipo_respuesta,
              'descripcion': a.desc_tipo_resp,
              'puntaje': 0,
              
              encabezado: [
                  {
                      'nom_resp': a.nom_resp,
                      'desc_resp': a.desc_resp,
                      'ord_resp': a.ord_resp,
                      'idtipo_respuesta_opcion': a.idtipo_respuesta_opcion,
                      'pts_resp': a.pts_resp
                  }
              ],
              cuerpo: [
                  {
                      'idarea_formulario': a.idarea_formulario,
                      'area_evaluacion': a.area_evaluacion,
                      'orden': a.orden_area,
                      
                      'preguntas': [
                          {
                              'contesta_evaluado': a.contesta_evaluado,
                              'idtipo_respuesta': a.idtipo_respuesta,
                              'idarea_formulario': a.idarea_formulario,
                              'idpregunta_formulario': a.idpregunta_formulario,
                              'pregunta': a.pregunta,
                              'pts_resp':0,
                              'opciones': []
                          }
                      ]
                  }
              ]
          })
      }
  }
  inserta_encabezado(id, a) {
      var enc_existe = false;

      for (var i in this.dataForm[id].encabezado) {
          if (this.dataForm[id].encabezado[i].idtipo_respuesta_opcion == a.idtipo_respuesta_opcion) {
              enc_existe = true;
              break;
          }
      }

      if (!enc_existe) {
        this.dataForm[id].encabezado.push({
              'nom_resp': a.nom_resp,
              'desc_resp': a.desc_resp,
              'ord_resp': a.ord_resp,
              'idtipo_respuesta_opcion': a.idtipo_respuesta_opcion,
              'pts_resp': a.pts_resp
          })
      }

  }
  inserta_cuerpo(id, a) {
      var cue_existe = false;
      var idcuerpo = 0;
      for (var i in this.dataForm[id].cuerpo) {
          if (this.dataForm[id].cuerpo[i].idarea_formulario == a.idarea_formulario) {
              cue_existe = true;
              idcuerpo = parseInt(i);
              break;
          }
      }

      if (cue_existe) {
          this.inserta_preguntas(id, idcuerpo, a);
      }
      else {
        this.dataForm[id].cuerpo.push(
              {
                  'idarea_formulario': a.idarea_formulario,
                  'area_evaluacion': a.area_evaluacion,
                  'orden': a.orden_area,
                  'preguntas': [
                      {
                          'contesta_evaluado': a.contesta_evaluado,
                          'idtipo_respuesta': a.idtipo_respuesta,
                          'idarea_formulario': a.idarea_formulario,
                          'idpregunta_formulario': a.idpregunta_formulario,
                          'pregunta': a.pregunta,
                          'pts_resp': 0,
                          'opciones': []
                      }
                  ]
              }
              );
      }

  }
  inserta_preguntas(idf, idc, a) {
      var pre_existe = false;

      for (var i in this.dataForm[idf].cuerpo[idc].preguntas) {
          if (this.dataForm[idf].cuerpo[idc].preguntas[i].idpregunta_formulario == a.idpregunta_formulario) {
              pre_existe = true;
              break;
          }
      }

      if (!pre_existe) {
        this.dataForm[idf].cuerpo[idc].preguntas.push(
              {
                  'contesta_evaluado': a.contesta_evaluado,
                  'idtipo_respuesta': a.idtipo_respuesta,
                  'idarea_formulario': a.idarea_formulario,
                  'idpregunta_formulario': a.idpregunta_formulario,
                  'pregunta': a.pregunta,
                  'pts_resp': 0,
                  'opciones': []
              }
              );
      }


  }
 
  muestra_info(data:formularios){
    this.filtro_opcion = data;
    this.titulo_modal = 'Opciones';


    this.mensaje = 'Significado de las diferentes opciones de la evaluación.';
    document.getElementById('info').style.display='block';
  }

  envio_correo(a) {
    this.loading = true;
    if (this.valida_respuestascompletas()) {
        let link = window.location.origin + "/#/form/" +  this.datos_envio.hash;
        let mensaje = "<p><strong>Hola " +  this.datos_envio.nombre + "s.</strong></p> " +
                   "<p>Su evaluador <strong> " +  this.datos_envio.nombre_evaluador + " </strong>  le ha generado la <strong>“" +  this.datos_envio.nombre_from + "”</strong>  en este <a href='" + link + "'><strong>link</strong>  </a>   podrá revisarla y enviar su confirmación de satisfacción.</p>" +
                    "<p> Muchas Gracias…</p>";

        this.solicitud.metodo = 10;
        this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
        this.solicitud.email = this.datos_envio.email;
        this.solicitud.nombre = this.datos_envio.nombre;
        this.solicitud.link = mensaje
    }

    this.rest.ulat_form(this.solicitud).subscribe(
        (rs) => {
          this.flag_envio = false;
          const datos = JSON.parse(rs.text());
          if (datos.exito) {
            this.loading = false;
            this.notify.success('Proceso exitoso', datos.mensaje, this.optionconfig);
          }
          else {
            this.loading = false;
            if (datos.error === '0') {
                this.notify.success('Error', datos.mensaje, this.optionconfig);
            }
            // tslint:disable-next-line:one-line
            else if (datos.error === '-2') {
              alert('Sesión Expirada.  ' + datos.mensaje)
              //this.rest.logout();
            }
            else {
              this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig)
              this.rest.NuevoTokent(datos.tokent)
            }
            return 0;
          }
        },
        (err) => { },
        () => {
        }
      )
  }   

  valida_respuestascompletas() {
    //captura la data actual para acortar la ruta 
    var dt = this.form;
    /*
        recorre los tipos de respuestas 
        ejemplo
        1: nivel de satisfaccion 
        2: cierto y falso 
        3: respuesta caja de texto
    */
    for (var i in dt) {
        //recorremo el cuerpo que es el area y dentro del cuerpo tenemos las preguntas
        for (var e in dt[i].cuerpo) {
            //recorremos las preguntas y aqui terminamos los recorrido 
            // aqui validaremos que el valor de respuesta no sea 0 de lo contrario bloquearemos el envio del correo

            for (var f in dt[i].cuerpo[e].preguntas) {
                // importante saber que solo se evaluaran las que tengan la variable contesta_evaluado en 0
                if (dt[i].cuerpo[e].preguntas[f].contesta_evaluado == 0) {
                    if (dt[i].idtipo_respuesta == 1) {
                        if (dt[i].cuerpo[e].preguntas[f].pts_resp == 0) {
                          // notify({ message: "Por favor llenar todo el formulario, la pregunta: " + dt[i].cuerpo[e].preguntas[f].pregunta + ",  del areá de evaluación: " + dt[i].cuerpo[e].area_evaluacion + " no a sido contestada.", position: 'right', classes: 'alert-warning', timeout:10000 });
                            return false;
                        }
                    }
                    else if (dt[i].idtipo_respuesta == 2) {

                    }
                    else if (dt[i].idtipo_respuesta == 3) {
                        if (dt[i].cuerpo[e].preguntas[f].opciones[0].resouesta_texto != null) {
                            if (dt[i].cuerpo[e].preguntas[f].opciones[0].resouesta_texto.length == 0) {
                              // notify({ message: "Por favor llenar todo el formulario, la pregunta: " + dt[i].cuerpo[e].preguntas[f].pregunta + ",  del areá de evaluación: " + dt[i].cuerpo[e].area_evaluacion + " no a sido contestada.", position: 'right', classes: 'alert-warning', timeout: 10000 });
                                return false;
                            }
                        }
                        else {
                            //notify({ message: "Por favor llenar todo el formulario, la pregunta: " + dt[i].cuerpo[e].preguntas[f].pregunta + ",  del areá de evaluación: " + dt[i].cuerpo[e].area_evaluacion + " no a sido contestada.", position: 'right', classes: 'alert-warning', timeout: 10000 });
                            return false;
                        }
                    }
                    else {

                    }
                }
            }
        }

    }


    return true;

  }

}
