import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos, acreditacion } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Validacionesservice } from '../../../Service/Validaciones.service';

import { FormNodoProyectoComponent } from '../../../controles/acreditacion/export_controles_acreditacion';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  @ViewChild(FormNodoProyectoComponent) FormNodoProy: FormNodoProyectoComponent;

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  prm_solicitud = new Parametros().prm;;
  flag_envio: boolean;
  mensaje_error: string;
  nombre_encabezado: string;
  titulo_modal: string;
  filtro: string;


  //variable usada para mostrar piezas la primera pieza es idsecuencia_pro_padre = 0 funcion next_nodo y after_nodo
  muestra = [0];
  muestra_hijos: number;
  //activa info proyecto funcion next_nodo y after_nodo
  act_info_pro = false;
  info_pro = [];
  encabezado_proyecto = [];
  //variable usada para consultar nodos evaluados en la matriz de autoevaluacion
  pieza_evaluada_matriz_auto: number;

  //asigna valor de piezas_matriz_autoevaluacion para registro en la actividad o pieza evaluadora del proyecto
  select_idsecuencia = null;

  //contenedor de periodos del PMI y PMC
  //datos: { estado: false, periodo activo en el proceso solo uno ala ves
  //estatus:false, periodos en la que la actividad esta vigente
  //periodo: 2000, ene:0,feb:0,mar:0,abr:0,may:0,jun:0,jul:0,ago:0,sep:0,ect:0,nov:0,dic:0 }
  periodos = []
  periodo_activo = 0;

  //barra de navegacion de archivos y carpetas
  barra = [];
  idcarpeta = 0;
  nombre_carpeta = "";
  nuestra_visor = false;


  piezas_proyecto = [];
  nodos_proyecto = [];
  piezas_matriz_autoevaluacion = [];

  matriz: any;

  titulo: string;
  breadcrumbArray = [];
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) {
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_cierre = null;
  }

  ngOnInit() {
    this.muestra_hijos = 0;
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.prm_solicitud.idmatriz = JSON.parse(atob(params['data'])).idmatriz;
          this.prm_solicitud.identidad = JSON.parse(atob(params['data'])).identidad;
          this.prm_solicitud.idesquema = JSON.parse(atob(params['data'])).idesquema;
          this.prm_solicitud.idsecuencia = JSON.parse(atob(params['data'])).idsecuencia;
          this.prm_solicitud.imagen = JSON.parse(atob(params['data'])).imagen;

          this.titulo = 'Proyectos';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({ titulo: this.titulo, nombre: this.titulo, ruta: '../home/proyectos', datos: JSON.parse(atob(params['data'])) });

        } catch (error) {
          this.router.navigate(['./home/Matriz'])
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/Matriz'])
      }
    });
    this.solicitud.metodo = 7;
    this.solicitud.consulta = 1;
    this.solicitud.identidad = this.prm_solicitud.identidad;
    this.solicitud.idesquema = this.prm_solicitud.idesquema;
    this.Consulta_piezas_proyecto();
  }

  //consulta las piezas a utilizar
  Consulta_piezas_proyecto() {
    this.flag_envio = true;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); console.log('Consulta_piezas_proyecto', datos);
        if (datos.exito) {

          this.piezas_proyecto = datos.data;
          /*en teoria si existen piezas deben existir registros en la matriz*/
          this.solicitud.metodo = 7;
          this.solicitud.consulta = 5;
          this.solicitud.idsecuencia = this.prm_solicitud.idsecuencia;
          this.Consulta_nodos_proyecto(); //PASO 2 documentada, consulta matriz y crea proceso de ordenación

          if (this.solicitud.consulta === 0) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 0) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 0) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.numero === 0) {
            this.piezas_proyecto = datos.data;
            if (this.solicitud.consulta === 4) {
              this.notify.warn('Alerta', 'Para poder gestionar proyectos primero debe configurar las piezas a usar siga las instrucciones del manual de administrador. Menú mantenimiento.', this.optionconfig);
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          // document.getElementById('formulario').style.display = 'none';
        }
      }
    )
  }

  // consulta los nodos del proyecto
  Consulta_nodos_proyecto() {
    this.flag_envio = true;
    // this.solicitud.metodo = 7;
    // this.solicitud.consulta = 5;
    // this.solicitud.idsecuencia = this.prm_solicitud.idsecuencia;
    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); console.log('Consulta_nodos_proyecto', datos);
        if (datos.exito) {

          this.nodos_proyecto = datos.data;
          //PASO 3 consulta la cantidad de proyectos
          this.consulta_cantidad_piezas();
          //PASO 4 depura la presentacion de los nodos multiples tareas
          this.Procesar_nodos_proyecto();
          //consulta los nodos avaluados en la matriz de autoevaluacion
          this.pieza_evaluada_matriz_auto = this.nodos_proyecto[0].pieza_evaluada_matriz_auto;
          this.nombre_encabezado = this.nodos_proyecto[0].nombre_matriz;

          if (this.pieza_evaluada_matriz_auto > 0) {
            this.solicitud.metodo = 1;
            this.solicitud.consulta = 15;
            this.solicitud.identidad = this.prm_solicitud.identidad;
            this.solicitud.idesquema = this.prm_solicitud.idesquema;
            this.solicitud.idmatriz = this.prm_solicitud.idmatriz
            this.solicitud.idpieza = this.pieza_evaluada_matriz_auto //esta piezas se captura en la funcion Consulta_nodos_proyecto
            this.consulta_piezas_autoevaluacion();
          }

        }
        else {
          if (datos.numero === 0) {
            this.nodos_proyecto = datos.data;
            this.consulta_cantidad_piezas();
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          //document.getElementById('formulario').style.display = 'none';
        }
      }
    )
  }

  //consulta cantidad de piezas por proyecto
  consulta_cantidad_piezas() {
    let num_pieza = null;
    for (const i in this.piezas_proyecto) {
      if (this.piezas_proyecto[i].act_pieza_contenedor_reporte == 1) {
        num_pieza = i;
        this.piezas_proyecto[i].cantidad = 0;
        break;
      }
    }

    if (num_pieza != null) {

      for (const i in this.nodos_proyecto) {
        if (this.nodos_proyecto[i].idpieza_proyecto == this.piezas_proyecto[num_pieza].idpieza_proyecto) {

          this.piezas_proyecto[num_pieza].cantidad = this.piezas_proyecto[num_pieza].cantidad + 1;
        }
      }
    }
  }

  //crea todo el tratamiento a los nodos de la matriz proyecto
  Procesar_nodos_proyecto() {
    try {
      for (var i in this.nodos_proyecto) {

        /*************************************
         *concatena ceros a la izquierda para*
         *ordenar el contenido numericamente *
         *************************************/
        this.nodos_proyecto[i].ordenar = Validacionesservice.prototype.ceros_izquierda(this.nodos_proyecto[i].orden, 15);
        /*desactiva el control siguiente*/
        this.nodos_proyecto[i].siguiente = false;

        for (var a in this.nodos_proyecto) {
          /*recorre nueva mente el arreglo para verificar
           si tiene dependientes se es asi entonces activa el boton siguiente
           y rompe el siclo
          */
          if (this.nodos_proyecto[a].idsecuencia_pro_padre == this.nodos_proyecto[i].idsecuencia_pro) {
            this.nodos_proyecto[i].siguiente = true;
            break;
          }
        }
      }
    } catch (error) {
      console.log(error)
    }

  }

  //consulta las piezas evaluadas en la matriz de autoevaluacion
  consulta_piezas_autoevaluacion() {
    this.flag_envio = true;

    // this.solicitud.metodo = 1;
    // this.solicitud.consulta = 15;
    // this.solicitud.identidad = this.prm_solicitud.identidad;
    // this.solicitud.idesquema = this.prm_solicitud.idesquema;
    // this.solicitud.idmatriz = this.prm_solicitud.idmatriz
    // this.solicitud.idpieza = this.pieza_evaluada_matriz_auto //esta piezas se captura en la funcion Consulta_nodos_proyecto

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); console.log('consulta_piezas_autoevaluacion', datos);
        if (datos.exito) {

          this.piezas_matriz_autoevaluacion = datos.data;
          for (const i in this.piezas_matriz_autoevaluacion) {
            this.piezas_matriz_autoevaluacion[i].ordenar = Validacionesservice.prototype.ceros_izquierda(this.piezas_matriz_autoevaluacion[i].orden, 15);
            this.piezas_matriz_autoevaluacion[i].asigana = false;
          }

          if (this.solicitud.consulta === 7) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 6) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.piezas_matriz_autoevaluacion = datos.data;
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 5) {
              this.notify.success('Proceso exitoso', 'Registro no existe', this.optionconfig);
            }
          }
          else if (datos.numero === 0) {
            this.notify.success('Proceso exitoso', 'No existen ' + this.nodos_proyecto[0].piezas_evaluadora_matriz + ' en la matriz de auto evaluación sin esto no se podrá asignar los referentes de la actividad', this.optionconfig);
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error', 'Error al cargar los ' + this.nodos_proyecto[0].piezas_evaluadora_matriz + ' de la matriz de auto evaluación sin esto no se podrá asignar los referentes de la actividad', this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          //document.getElementById('formulario').style.display = 'none';
        }
      }
    )
  }

  consulta_encabezado_proyecto(a: any) {
    this.flag_envio = true;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); console.log('consulta_encabezado_proyecto', datos);
        if (datos.exito) {

          for (const i in datos.data) {
            if (this.encabezado_proyecto.length == 0) {
              this.encabezado_proyecto.push(
                {
                  id: datos.data[i].idsecuencia,
                  id_p: datos.data[i].idpieza,
                  nombre: datos.data[i].nom_p_pieza,
                  orden: Validacionesservice.prototype.ceros_izquierda(datos.data[i].orden, 15),
                  data: [{ nombre: datos.data[i].nombre }]
                })
            }
            else {
              let entra = true;
              for (let a in this.encabezado_proyecto) {
                if (this.encabezado_proyecto[a].id_p == datos.data[i].idpieza) {
                  this.encabezado_proyecto[a].data.push({ nombre: datos.data[i].nombre });
                  entra = false;
                  break;
                }
              }

              if (entra) {
                this.encabezado_proyecto.push(
                  {
                    id: datos.data[i].idsecuencia,
                    id_p: datos.data[i].idpieza,
                    nombre: datos.data[i].nom_p_pieza,
                    orden: Validacionesservice.prototype.ceros_izquierda(datos.data[i].orden, 15),
                    data: [{ nombre: datos.data[i].nombre }]
                  })
              }

            }
          }

        }
        else {
          if (datos.error === '0') {
            this.piezas_matriz_autoevaluacion = datos.data;
          }
          else if (datos.numero === 0) {
            this.notify.success('Proceso exitoso', 'No existen ' + this.nodos_proyecto[0].piezas_evaluadora_matriz + ' en la matriz de auto evaluación sin esto no se podrá asignar los referentes de la actividad', this.optionconfig);
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          //document.getElementById('formulario').style.display = 'none';
        }
      }
    )
  }

  next_nodo(a) {
    this.muestra.push(a.idsecuencia_pro);
    this.muestra_hijos = a.idsecuencia_pro;

    // quiere decir que es el dueño del proyecto y se nuestra su infomacion en el panel principal
    if (a.idsecuencia_pro_padre == 0) {
      this.act_info_pro = true;
      this.info_pro = a;

      this.solicitud.metodo = 7;
      this.solicitud.consulta = 26;
      this.solicitud.identidad = this.prm_solicitud.identidad;
      this.solicitud.idesquema = this.prm_solicitud.idesquema;
      this.solicitud.idsecuencia_pro = a.idsecuencia_pro;
      this.consulta_encabezado_proyecto(a);
      // this.buscar = {
      //     orden: '',
      //     nombre:''
      // }

    }

  }

  after_nodo(a) {
    //console.log($scope.muestra);
    let last = this.muestra.length - 1;
    this.muestra.splice(last, 1)

    //console.log($scope.muestra);
    last = this.muestra.length - 1;
    this.muestra_hijos = this.muestra[last];


    if (this.muestra.length == 1) {
      this.act_info_pro = false;
      this.info_pro = [];
      this.encabezado_proyecto = [];
      // this.buscar = {
      //     orden: '',
      //     nombre: ''
      // }
    }


  }

  selecciona_pieza(id) {
    let valor = 0;
    try {
      //this.piezas_esquema2 = this.piezas_esquema.filter(value => value.idpieza_padre === parseInt(id));//[0].idpieza;
      valor = this.piezas_proyecto.filter(value => value.idpieza_proyecto === id)[0].idpieza_proyecto;
    } catch (error) {
      valor = null;
      console.log(error);
    }
    return valor
  }

  crear_nodo_contenedor(data) {
    const arreglo = {
      tituloModal: 'Pieza inical',
      idsecuencia_pro_padre: 0,
      metodo: 7,
      consulta: 6,
      es_contenedor: data
    }
    this.FormNodoProy.crear(arreglo);
  }

  crear_nodo_hijo(data) {
    const arreglo = {
      tituloModal: data.nombre1 + ' [' + data.orden + ']' + ' - ' + data.nombre.substring(0, 75),
      nombre_dato: data.nombre,
      idsecuencia_pro_padre: data.idsecuencia_pro,
      idpieza_proyecto: data.idpieza_proyecto,
      es_contenedor: 0,
      metodo: 7,
      consulta: 6
    }
    this.FormNodoProy.crear(arreglo);
  }

  actualiza_nodo_hijo(data) {
    let pieza = this.selecciona_pieza(data.idpieza_proyecto);

    if (pieza != null) {
      // this.titulo_modal = data.nombre_pieza + ' ' + data.nombre.substring(0, 75) + "";
      const arreglo = {
        tituloModal: data.nombre1 + ' [' + data.orden + ']' + ' - ' + data.nombre.substring(0, 75),
        nombre_dato: data.nombre,
        idpieza_proyecto: data.idpieza_proyecto,
        idsecuencia_pro: data.idsecuencia_pro,
        nombre: data.nombre,
        objetivo: data.objetivo,
        descripcion: data.descripcion,
        orden: data.orden,
        presupuesto: data.presupuesto,
        anexo_1: data.anexo_1,
        anexo_2: data.anexo_2,
        anexo_3: data.anexo_3,
        es_contenedor: data.act_pieza_contenedor_reporte,
        metodo: 7,
        consulta: 7
      }
      this.FormNodoProy.editar(arreglo);
    }
  }

  guardarCambios(evento: any) {
    this.solicitud = evento.solicitud;
    this.solicitud.idsecuencia = this.prm_solicitud.idsecuencia;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    if (evento.opc == 'crear') {
      this.solicitud.consulta = 6;
      this.Consulta_nodos_proyecto();
    } else if (evento.opc == 'editar') {
      this.solicitud.consulta = 28;
      this.Consulta_nodos_proyecto();
    }
    else {

    }
  }

  open(data: any, vista: string) {
    const arreglo = {
      data: data,
      nombre_encabezado: this.nombre_encabezado,
      encabezado_proyecto: this.encabezado_proyecto,
      piezas_matriz_autoevaluacion: this.piezas_matriz_autoevaluacion,
      navegacion: this.breadcrumbArray
    }
    const paramatros = btoa(JSON.stringify(arreglo));
    if (vista == 'ver-contenido') {
      this.router.navigate(['./home/ver-contenido', paramatros]);
    }
    else if (vista == 'crear-contenido') {
      this.router.navigate(['./home/crear-contenido', paramatros]);
    }
  }

  reporte_global(modal: string) {
    // CODE
  }

  presentaciones_matriz(data: any, modal: string) {
    // CODE
  }

}
