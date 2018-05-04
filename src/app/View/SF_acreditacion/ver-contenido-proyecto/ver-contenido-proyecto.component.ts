import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

import { ControlEvidenciaComponent, ListaProyectoComponent } from '../../../controles/acreditacion/export_controles_acreditacion';

@Component({
  selector: 'app-ver-contenido-proyecto',
  templateUrl: './ver-contenido-proyecto.component.html',
  styleUrls: ['./ver-contenido-proyecto.component.css']
})
export class VerContenidoProyectoComponent implements OnInit {

  @ViewChild(ControlEvidenciaComponent) cambioPerido: ControlEvidenciaComponent;
  @ViewChild(ListaProyectoComponent) muestraLista: ListaProyectoComponent;

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  titulo_modal: string;
  titulo: string;

  //contenedor de periodos del PMI y PMC  
  //datos: { estado: false, periodo activo en el proceso solo uno ala ves
  //estatus: false, periodos en la que la actividad esta vigente
  //periodo: 2000, ene:0,feb:0,mar:0,abr:0,may:0,jun:0,jul:0,ago:0,sep:0,ect:0,nov:0,dic:0 }

  lista_actividad = [];
  carpetas = [];
  evidencias = [];
  barra = [];
  nombre_lista: string;
  periodo_activo: number;
  nombre_carpeta: string;
  idcarpeta: number;
  extencion: string;
  cantidad_root: number;
  cantidad_evi: number;
  estatus_periodo: boolean;

  gesionar: boolean;
  autoevaluacion: boolean;
  proyecto: boolean;
  dataVisor: any;

  files: any;
  lista_archivo = [];
  cant_arch: number;
  cant_arch_env: number;
  vistaActual: string;
  nuestra_visor:boolean;

  breadcrumbArray=[];

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) {
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_cierre = null;
  }

  /*
      Crear, editar y eliminar evidencias o carpetas se ejecutan desde los componentes: control-carpetas, control-evidencia
      y los parametros son eviado a este componente padre por el metodo 'guardar_Cambios(datos: any)' qyuien los recibe para realizar la consulta al servidor.
  */

  ngOnInit() {
    this.vistaActual = 'proyecto';
    this.gesionar = true;
    this.proyecto = true;
    this.autoevaluacion = false;

    this.estatus_periodo = true;
    this.idcarpeta = 0;
    this.periodo_activo = 0;
    this.solicitud.metodo = 7;
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.dataVisor = JSON.parse(atob(params['data'])).data;
          
          this.titulo = 'Contenido';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/ver-contenido', datos: JSON.parse(atob(params['data']))});

        } catch (error) {
          window.history.back();
          //this.router.navigate(['./home/Matriz']);
        }
      }
      // tslint:disable-next-line:one-line
      else {
        window.history.back();
        //this.router.navigate(['./home/Matriz']);
      }
    });
    //consulta carpetas de la pieza
    this.consultar_carpeta(18);

    // //consulta evidencias de la pieza
    this.solicitud.idsecuencia_pro = this.dataVisor.idsecuencia_pro;
    this.solicitud.idcarpeta = this.idcarpeta;
    this.solicitud.extencion = this.extencion;
    this.solicitud.periodo = this.periodo_activo;
    this.consulta_evidencia(22);
  }

  consultar_carpeta(consulta: any) {
    this.flag_envio = true;

    this.solicitud.metodo = 7;
    this.solicitud.consulta = consulta;
    this.solicitud.idsecuencia_pro = this.dataVisor.idsecuencia_pro;
    //this.solicitud.periodo = this.periodo_activo;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.carpetas = datos.data;
          this.limpiar_parametros_carpetas();
        }
        else {
          
          if (datos.error === '0') {
            this.carpetas = datos.data;
            this.nombre_lista = "";
            if (this.solicitud.consulta === 4 || this.solicitud.consulta === 21) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 1) {
              this.notify.success('Proceso exitoso', 'Registro no existe', this.optionconfig);
            }
          } else if (datos.numero === 0) {
            this.notify.success('Proceso exitoso', 'La ' + this.dataVisor.nombre1 + ' no posee  ' + this.dataVisor.piezas_evaluadora_matriz + ' por favor agréguelos', this.optionconfig);
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
          document.getElementById('formulario_carpeta').style.display = 'none';
          // document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  consulta_evidencia(consulta: any) {
    this.flag_envio = true;

    this.solicitud.consulta = consulta;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.evidencias = datos.data;
          this.limpiar();
          this.enumera_evidencias_carpetas();
        }
        else {
          if (datos.error === '0') {
            this.lista_actividad = datos.data;
            this.nombre_lista = "";
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 1) {
              this.notify.success('Proceso exitoso', 'Registro no existe', this.optionconfig);
            }
            if (this.solicitud.consulta === 23) {
              this.notify.success('Proceso exitoso', 'Registro inserrado con éxito', this.optionconfig);
            }
          } else if (datos.numero === 0) {
            this.notify.success('Proceso exitoso', 'La ' + this.dataVisor.nombre1 + ' no posee  ' + this.dataVisor.piezas_evaluadora_matriz + ' por favor agréguelos', this.optionconfig);
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', datos.mensaje, this.optionconfig);
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          // document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  limpiar_parametros_carpetas() {
    this.solicitud.idcarpeta = 0;
    this.solicitud.idcarpeta_padre = 0;
    this.solicitud.periodo = 0;
    this.solicitud.nombre = '';
    this.nombre_carpeta = '';
  }

  enumera_evidencias_carpetas() {
    this.cantidad_root = 0;
    for (const i in this.carpetas) {
      this.cantidad_evi = 0;
      for (const a in this.evidencias) {
        if (this.evidencias[a].idcarpeta === this.carpetas[i].idcarpeta) {
          this.cantidad_evi = this.cantidad_evi + 1;
        }
      }
      this.carpetas[i].cantidad = this.cantidad_evi;
    }

    this.cantidad_evi = 0;
    for (const a in this.evidencias) {
      if (this.evidencias[a].idcarpeta === 0) {
        this.cantidad_root = this.cantidad_root + 1;
      }
    }
    document.getElementById('formulario_carpeta').style.display = 'none';
    document.getElementById('reporte').style.display = 'none';
    document.getElementById('formulario_evidencia').style.display = 'none';
  }

  select_file(evento: any) {
    this.idcarpeta = evento.idcarpeta;
    this.barra = evento.barra;
  }

  select_barra(a: number) {
    if (a == -1) {
      this.barra = [];
      this.idcarpeta = 0;
    }
    else {
      let temp = this.barra;
      this.barra = [];
      for (const i in temp) {

        if (a == temp[i].id) {
          this.idcarpeta = temp[i].idcarpeta;
          this.barra.push(temp[i])
        } else {
          if (temp[i].id <= a) {
            this.barra.push(temp[i])
          }
        }
      }
    }

  }

  guardar_Cambios(datos: any) {
    this.solicitud = datos.solicitud;
    let opc = datos.opc;
    this.solicitud.idsecuencia_pro = this.dataVisor.idsecuencia_pro;
    if (opc == 'crear_carpeta') {
      this.solicitud.consulta = 19;
      this.consultar_carpeta(this.solicitud.consulta);
    }
    else if (opc == 'editar_carpeta') {
      this.solicitud.consulta = 20;
      this.consultar_carpeta(this.solicitud.consulta);
    }
    else if (opc == 'eliminar_carpeta') {
      this.solicitud.consulta = 21;
      this.consultar_carpeta(this.solicitud.consulta);
    }
    else if (opc == 'crea_evidencia') {
      this.solicitud.metodo = 7;
      this.solicitud.consulta = 23;
      this.consulta_evidencia(this.solicitud.consulta);
    }
    else if (opc == 'editar_archivo') {
      this.solicitud.metodo = 8;
      this.solicitud.consulta = 24;
      this.consulta_evidencia(this.solicitud.consulta);
    }
    else if (opc == 'eliminar_archivo') {
      this.solicitud.metodo = 8;
      this.solicitud.consulta = 27;
      this.consulta_evidencia(this.solicitud.consulta);
    } else {
      alert('ERROR');
    }
  }
  
  limpiar() {
    this.solicitud.nombre = '';
    this.solicitud.script = '';
  }

}
