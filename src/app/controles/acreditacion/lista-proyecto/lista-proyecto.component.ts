import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ControlGanttComponent } from '../export_controles_acreditacion';

@Component({
  selector: 'app-lista-proyecto',
  templateUrl: './lista-proyecto.component.html',
  styleUrls: ['./lista-proyecto.component.css']
})
export class ListaProyectoComponent implements OnInit {

  @Input() breadcrumbArray = [];

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  tituloModal: string;
  dataVisor: any;
  lista_actividad = [];
  lista_pieza_evalua_matriz = [];
  piezas_matriz_autoevaluacion = [];
  cantidad_pieza_matriz_en_actividad: number;
  select_idlista: number;
  nombre_lista: string;
  tipoEvidencia: boolean;
  select_idsecuencia: number;

  titulo: string;

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) {
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_cierre = null;
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.dataVisor = JSON.parse(atob(params['data'])).data;
          this.piezas_matriz_autoevaluacion = JSON.parse(atob(params['data'])).piezas_matriz_autoevaluacion;

        } catch (error) {
          window.history.back();
        }
      }
      else {
        window.history.back();
      }
    });

    //pieza evaluadora del proyecto
    this.consulta_relacion_piezas_matriz_evalua(this.dataVisor.idsecuencia_pro, 0, 7);

    //consulta listas 
    this.consulta_listas_proyecto(14);
  }

  consulta_listas_proyecto(consulta) {
    this.flag_envio = true;

    this.solicitud.metodo = 7;
    this.solicitud.consulta = consulta;
    this.solicitud.idsecuencia_pro = this.dataVisor.idsecuencia_pro;
    this.solicitud.idlista = this.select_idlista;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.lista_actividad = datos.data;
          this.nombre_lista = "";

          if (this.solicitud.consulta === 15) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 17) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
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
          } else if (datos.numero === 0) {
            this.notify.success('Proceso exitoso', 'La ' + this.dataVisor.nombre1 + ' no posee  ' + this.dataVisor.piezas_evaluadora_matriz + ' por favor agréguelos', this.optionconfig);
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
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

  consulta_relacion_piezas_matriz_evalua(id_pro, id_mat, consulta) {
    this.flag_envio = true;

    this.solicitud.metodo = 7;
    this.solicitud.consulta = consulta;
    this.solicitud.idsecuencia_pro = id_pro;
    this.solicitud.idsecuencia = id_mat;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); console.log(datos);
        if (datos.exito) {

          this.cantidad_pieza_matriz_en_actividad = 0;
          this.lista_pieza_evalua_matriz = datos.data;
          for (const b in this.piezas_matriz_autoevaluacion) {
            for (const a in this.lista_pieza_evalua_matriz) {

              this.piezas_matriz_autoevaluacion[b].asigana = false;
              if (this.lista_pieza_evalua_matriz[a].idsecuencia == this.piezas_matriz_autoevaluacion[b].idsecuencia) {
                this.piezas_matriz_autoevaluacion[b].asigana = true;
                this.cantidad_pieza_matriz_en_actividad = this.cantidad_pieza_matriz_en_actividad + 1;
                break;
              }
            }
          }

        }
        else {
          if (datos.error === '0') {
            this.cantidad_pieza_matriz_en_actividad = 0;
            for (const b in this.piezas_matriz_autoevaluacion) {
              this.piezas_matriz_autoevaluacion[b].asigana = false;
            }
            if (this.solicitud.consulta === 4) {
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
          // document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  mostrarLista(idlista) {
    this.select_idlista = idlista;
    //this.select_datos = idlista;
    this.tipoEvidencia = false;
    if (idlista == 0) { this.tituloModal = this.dataVisor.piezas_evaluadora_matriz + " a " + this.dataVisor.nombre1; this.tipoEvidencia = true; }
    else if (idlista === 1) { this.tituloModal = "Indicadores de seguimiento" }
    else if (idlista === 2) { this.tituloModal = "Recursos de la actividad" }
    else if (idlista === 3) { this.tituloModal = "Responsables del seguimiento" }
    else if (idlista === 4) { ControlGanttComponent.prototype.mostrarGantt(); }
    else {
      this.tituloModal = idlista;
    }
    if (idlista != 4) {
      document.getElementById('formulario').style.display = 'block';
    }
  }

  inserta_lista(nombre: string) {
    this.solicitud.metodo = 7;
    this.solicitud.consulta = 15;
    this.solicitud.idsecuencia_pro = 0;
    this.solicitud.idlista = 0;
    this.solicitud.nombre = '';
    this.solicitud.iddata_lista = 0;
    if (nombre.length > 0) {
      this.solicitud.nombre = nombre;
      this.consulta_listas_proyecto(this.solicitud.consulta);
    }
    this.nombre_lista = '';
  }

  elimina_lista(a: any) {
    this.solicitud.metodo = 7;
    this.solicitud.consulta = 17;
    this.solicitud.idsecuencia_pro = 0;
    this.solicitud.idlista = 0;
    this.solicitud.nombre = '';
    this.solicitud.iddata_lista = a.iddata_lista;
    this.consulta_listas_proyecto(this.solicitud.consulta);
  }

  asigna_idsecuencia(a: any) {
    this.select_idsecuencia = a;
  }

  inserta_relacion_piezas_matriz_evalua() {
    this.consulta_relacion_piezas_matriz_evalua(this.dataVisor.idsecuencia_pro, this.select_idsecuencia, 8);
  }

  elimina_relacion_piezas_matriz_evalua(a: any) {
    this.consulta_relacion_piezas_matriz_evalua(this.dataVisor.idsecuencia_pro, a.idsecuencia, 9);
  }

  open() {
    const arreglo = {
      data: this.dataVisor,
      navegacion: this.breadcrumbArray
    }

    const paramatros = btoa(JSON.stringify(arreglo));
    this.router.navigate(['./home/diagrama-gantt', paramatros]);
  }

}
