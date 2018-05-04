import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, Parametros, colegio, OpcionesNotifi, Permisos, periodos, empleados } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Reporteadorservice} from '../../../service/Reporteador.service';

@Component({
  selector: 'app-encuestas-empleado',
  templateUrl: './encuestas-empleado.component.html',
  styleUrls: ['./encuestas-empleado.component.css']
})
export class EncuestasEmpleadoComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  encuestas_empleado = [];
  nombreEvaluador:string;
  arreglo_retorno={};
  dataForm = [];
  encabezado_pagina:string;
  confirmacion:boolean;
  rpt_pdf:string;
  form = [];
  printPdf: string;
  titulo:string;
  breadcrumbArray = [];
  empleado_confirmado:string;
  filtro: string;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.solicitud.idsede = sessionStorage._sede;
    this.titulo = 'Encuestas de Empleados';
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.encuestas_empleado = JSON.parse(atob(params['data'])).data;
          this.nombreEvaluador =  JSON.parse(atob(params['data'])).data[0].nombre;
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo,ruta: '../home/Encuestas-Empleado', datos: JSON.parse(atob(params['data']))});

        } catch (error) {
          this.router.navigate(['./home/Formularios'])
        }
      }
      else {
        this.router.navigate(['./home/Formularios'])
      }
    });
  }

  run() {
    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.form_evaluacion(datos.data);
          this.rest.NuevoTokent(datos.tokent);
        }
        else {
          if (datos.error === '0') {
            this.rest.NuevoTokent(datos.tokent);
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
            this.notify.error('Error controlado', this.rest.Control_error(datos.error),this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {
      }
    )


  }

  consulta_form_evaluacion(data: empleados){
    this.empleado_confirmado = data.nombre_empleado;
    this.solicitud.metodo = 1;
    this.solicitud.consulta = 1;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idformulario = data.idformulario;
    this.solicitud.periodo = data.periodo;
    this.solicitud.anno = data.anno;
    this.solicitud.idempleado = data.idempleado;
    this.run();
  }

  form_evaluacion(a){
    this.dataForm = [];
    this.encabezado_pagina = a[0];
    this.consulta_opciones(a);
    this.confirmacion = false;

    this.confirmacion = true;
    this.printPdf = Reporteadorservice.prototype.rpt_evaluacion(this.encabezado_pagina,this.dataForm);
    document.getElementById('reporte').style.display='block';
  }

  consulta_opciones(a){
    for (var i in a) {
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
                                            'envio': 0,

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
                              'pts_resp': 0,
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
}
