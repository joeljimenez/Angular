import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, formularios, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-formularios-preguntas',
  templateUrl: './formularios-preguntas.component.html',
  styleUrls: ['./formularios-preguntas.component.css']
})
export class FormulariosPreguntasComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: formularios;
  data: formularios;
  titulo_modal: string;
  mensaje: string;
  titulo_padre: string;
  areas = [];
  dataForm = [];
  tipo_respuesta = [];
  form: any;
  filtro_opcion: any;
  titulo: string;
  breadcrumbArray = [];
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService,private route: ActivatedRoute) { }
  
  ngOnInit() {
    this.solicitud.idsede = sessionStorage._sede;
    this.titulo = 'Editor de Formulario';
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.solicitud.idformulario = JSON.parse(atob(params['data'])).idformulario;
          this.titulo_padre = JSON.parse(atob(params['data'])).nombre;

          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo,ruta: '../home/Formularios-Preguntas', datos: JSON.parse(atob(params['data']))});

        } catch (error) {
          this.router.navigate(['./home/Home/Formularios'])
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/Home/Formularios'])
      }
    
    });
    
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 5
    this.run();

    this.solicitud.metodo = 5;
    this.solicitud.consulta = 3;
    this.Consulta_tipoRespuesta();

  }

/* 1. PROCESO DE CARGA DEL FORMULARIO*/

  run() {
    this.flag_envio = true;

    if (this.solicitud.consulta === 6 || this.solicitud.consulta === 7 || this.solicitud.consulta === 9 || this.solicitud.consulta === 10) {
      if (!this.validacion()) {
        this.flag_envio = false;
        return false;
      }
    }

    this.solicitud.contesta_evaluado = (this.solicitud.contesta_evaluado) ? 1 : 0;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);
          this.respuesta = datos.data;
          this.consulta_opciones(this.respuesta);
          if(this.solicitud.consulta === 6 || this.solicitud.consulta === 9){
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito',this.optionconfig);
          }
          if (this.solicitud.consulta === 7 || this.solicitud.consulta === 10) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito',this.optionconfig);
          }
          if (this.solicitud.consulta === 8 || this.solicitud.consulta === 11) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito',this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.respuesta = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 8) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito',this.optionconfig);
            }
            if (this.solicitud.consulta === 0) {
              this.notify.success('Proceso exitoso', 'Registro no existe',this.optionconfig);
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error),this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          document.getElementById('area_evaluacion').style.display='none';
          document.getElementById('eliminar').style.display='none';
          document.getElementById('preguntas').style.display='none'
        }
      }
    )
  }

  Consulta_tipoRespuesta(){
    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.arr_tipo_respuesta(datos.data);
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.tipo_respuesta = datos.data;
          }
          if(datos.numero === '0'){
            this.notify.success('Proceso exitoso', 'No existen opciones para crear preguntas consulte al departamento de informática o vuelva a cargar la página.',this.optionconfig);
          }
          // tslint:disable-next-line:one-line
          else {
            this.mensaje_error = this.rest.Control_error(datos.error);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => { }
    )
  }
  arr_tipo_respuesta(a){
    this.tipo_respuesta = [];
    let existe = false;

    for (var t in a) {
      existe = false;
      if (this.tipo_respuesta.length === 0) {
        this.tipo_respuesta.push(a[t]);
        this.tipo_respuesta[0].opciones = [];
        this.tipo_respuesta[0].opciones.push(a[t]);
      }else{
        for(var r in this.tipo_respuesta){
          if(this.tipo_respuesta[r].idtipo_respuesta === a[t].idtipo_respuesta){
              existe = true;
              this.tipo_respuesta[r].opciones.push(a[t]);
          }
      }
      if (!existe) {
        this.tipo_respuesta.push(a[t]);
        this.tipo_respuesta[this.tipo_respuesta.length - 1].opciones = [];
        this.tipo_respuesta[this.tipo_respuesta.length - 1].opciones.push(a[t]);
    }
      }
    }
  }

  consulta_opciones(a){
    this.areas = [];
      /*
            carga las areas creadas que no tienen preguntas aun estas areas al ser mostradas 
            se podran eliminar. 
        */
        for (var g in a) {
          if (a[g].idpregunta_formulario == null && a[g].idarea_formulario != null) {
            a[g].orden = a[g].orden_area;
              this.areas.push(a[g]);
          }

          /*
            inicio del proceso para crear formularios
        */
        this.dataForm = []; // variable de retorno
        for (var i in a) {
          /*
              si es el primer registro a insertar pasa sin visa
          */
          if (this.dataForm.length == 0) {
              this.inserta_dataForm(a[i]);
          }
          else {
              //break;
              var existe = false;
              var iddata = 0;
              for (var f in this.dataForm) {
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
                                          respuesta = true
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
                                              'ord_resp': a[s].ord_resp
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
  }
  inserta_dataForm(a){
    if (a.idpregunta_formulario != null) {
      this.dataForm.push({
          'idtipo_respuesta': a.idtipo_respuesta,
          'descripcion': a.desc_tipo_resp,
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
                  'orden':a.orden_area,
                  'preguntas': [
                      {
                          'contesta_evaluado': a.contesta_evaluado,
                          'idtipo_respuesta': a.idtipo_respuesta,
                          'idarea_formulario': a.idarea_formulario,
                          'idpregunta_formulario': a.idpregunta_formulario,
                          'pregunta': a.pregunta,
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
                'idtipo_respuesta':a.idtipo_respuesta,
                'idarea_formulario': a.idarea_formulario,
                'idpregunta_formulario': a.idpregunta_formulario,
                'pregunta': a.pregunta,
                'opciones': []
            }
            );
    }


  }


  crear_area_evaluacion(){
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 6;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.nombre = '';
    this.solicitud.orden = 0;

    this.titulo_modal = 'CREAR AREA DE EVALUACION';
    document.getElementById('area_evaluacion').style.display='block';
  }
  editar_area_evaluacion(data: formularios){
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 7;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.nombre = data.area_evaluacion;
    this.solicitud.orden = data.orden;
    this.solicitud.idarea_formulario = data.idarea_formulario;
    this.titulo_modal = 'EDITAR AREA DE EVALUACION';
    document.getElementById('area_evaluacion').style.display='block'; 
  }
  elimina_area_evaluacion(data: formularios){
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 8;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.nombre = data.area_evaluacion;
    this.solicitud.idarea_formulario = data.idarea_formulario;

    this.titulo_modal = 'ELIMINA AREA DE EVALUACION';
    this.mensaje = 'Desea eliminar el área de evaluación';
    document.getElementById('eliminar').style.display='block'; 
  }


  crear_preguntas(data: formularios){
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 9;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.nombre = '';
    this.solicitud.idtipo_respuesta = 0;
    this.solicitud.act_observacion = '';
    this.solicitud.contesta_evaluado = 0;
    this.solicitud.idarea_formulario = data.idarea_formulario; 


    this.titulo_modal = 'CREAR PREGUNTA';
    this.mensaje = data.area_evaluacion;
    document.getElementById('preguntas').style.display='block';
  }
  editar_preguntas(data: formularios){
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 10;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.nombre = data.pregunta;
    this.solicitud.idtipo_respuesta = data.idtipo_respuesta;
    this.solicitud.act_observacion = data.act_observacion;
    this.solicitud.contesta_evaluado = data.contesta_evaluado;
    this.solicitud.idarea_formulario = data.idarea_formulario; 
    this.solicitud.idpregunta_formulario = data.idpregunta_formulario;

    this.titulo_modal = 'EDITAR PREGUNTA';
    this.mensaje = '';
    document.getElementById('preguntas').style.display='block';
  }
  elimina_pregunta(data: formularios){
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 11;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.nombre = data.pregunta;
    this.solicitud.idtipo_respuesta = data.idtipo_respuesta;
    this.solicitud.idpregunta_formulario = data.idpregunta_formulario;

    this.titulo_modal = 'ELIMINA PREGUNTA';
    this.mensaje = 'Desea eliminar la pregunta'+ data.pregunta;
    document.getElementById('eliminar').style.display='block'; 
  }


  muestra_info(data:formularios){
    this.filtro_opcion = data;
    this.titulo_modal = 'Opciones';


    this.mensaje = 'Significado de las diferentes opciones de la evaluación.';
    document.getElementById('info').style.display='block';
  }
/* 1. PROCESO DE CARGA DEL FORMULARIO FIN*/


  validacion() {
    const a = this.solicitud;
    let retorno = true;
    if (a.nombre.length < 1) {
      this.notify.error('Completar campos', 'Por favor coloque un nombre a la caja.',this.optionconfig)
      retorno = false;
    }
    // if(a.idtipo_respuesta === 0){
    //   this.Show_notificacion(2, 'Completar campos', 'Por favor seleccione un tipo de respuesta.')
    //   retorno = false;
    // }
    return retorno;
  }

}