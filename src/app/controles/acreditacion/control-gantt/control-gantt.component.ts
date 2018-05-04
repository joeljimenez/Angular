import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

import { ControlEvidenciaComponent, ControlCarpetasComponent } from '../../../controles/acreditacion/export_controles_acreditacion';

@Component({
  selector: 'app-control-gantt',
  templateUrl: './control-gantt.component.html',
  styleUrls: ['./control-gantt.component.css']
})
export class ControlGanttComponent implements OnInit {


  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  titulo_modal: string;

  dataVisor: any;
  periodos = [];
  periodo_activo: number;

  barra = [];
  idcarpeta: number;

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) {
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_cierre = null;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.dataVisor = JSON.parse(atob(params['data'])).data;
        } catch (error) {
          window.history.back();
        }
      }
      else {
        window.history.back();
      }
    });

    //consulta diagrama de gantt
    this.consulta_driagrama_gantt(10);
  }

  consulta_driagrama_gantt(consulta) {
    this.periodos = [];
    this.flag_envio = true;

    this.solicitud.metodo = 7;
    this.solicitud.consulta = consulta;
    this.solicitud.idsecuencia_pro = this.dataVisor.idsecuencia_pro;

    for (var i = this.dataVisor.vigencia_inicio; i <= this.dataVisor.vigencia_fin; i++) {
      this.periodos.push({ estado: false, estatus: false, periodo: i, ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, ect: 0, nov: 0, dic: 0 });
    }

    let activa_el_primero = 0;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          let periodos_actividad = datos.data;
          for (var i in periodos_actividad) {
            for (var e in this.periodos) {
              if (periodos_actividad[i].periodo == this.periodos[e].periodo) {
                activa_el_primero = activa_el_primero + 1;
                this.periodos[e].estatus = true;
                this.periodos[e].ene = periodos_actividad[i].enero;
                this.periodos[e].feb = periodos_actividad[i].febrero;
                this.periodos[e].mar = periodos_actividad[i].marzo;
                this.periodos[e].abr = periodos_actividad[i].abril;
                this.periodos[e].may = periodos_actividad[i].mayo;
                this.periodos[e].jun = periodos_actividad[i].junio;
                this.periodos[e].jul = periodos_actividad[i].julio;
                this.periodos[e].ago = periodos_actividad[i].agosto;
                this.periodos[e].sep = periodos_actividad[i].septiembre;
                this.periodos[e].oct = periodos_actividad[i].octubre;
                this.periodos[e].nov = periodos_actividad[i].noviembre;
                this.periodos[e].dic = periodos_actividad[i].diciembre;
                if (activa_el_primero == 1) {
                  this.periodos[e].estado = true;
                  this.periodos[e].color = 'w3-theme';
                  this.periodo_activo = this.periodos[e].periodo;
                }
                break;
              }
            }
          }
          ControlCarpetasComponent.prototype.cambio_periodo_activo(this.periodo_activo);
          ControlEvidenciaComponent.prototype.cambio_periodo_activo(this.periodo_activo);
        }
        else {
          if (datos.error === '0') {
            //this.respuesta = datos.data;
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

  mostrarGantt() {
    const arreglo = {
      periodos: this.periodos,
      dataVisor: this.dataVisor
    }
    const paramatros = btoa(JSON.stringify(arreglo));
    this.router.navigate(['./home/diagrama-gantt', paramatros]);
  }
  
  cambio_periodo(a: any) {
    ControlCarpetasComponent.prototype.cambio_periodo_activo(a.periodo);
    ControlEvidenciaComponent.prototype.cambio_periodo_activo(a.periodo);
    //limpiar_parametros_carpetas();
    this.barra = [];
    this.idcarpeta = 0;

    for (var i in this.periodos) {
      this.periodos[i].estado = false;
      this.periodos[i].color = '';
      if (this.periodos[i].periodo == a.periodo) {
        this.periodos[i].estado = true;
        this.periodos[i].color = 'w3-theme';
        this.periodo_activo = this.periodos[i].periodo;
      }
    }
  }
}
