import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-diagrama-gantt',
  templateUrl: './diagrama-gantt.component.html',
  styleUrls: ['./diagrama-gantt.component.css']
})
export class DiagramaGanttComponent implements OnInit {

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  titulo_modal: string;

  dataVisor: any;
  periodos = [];
  periodo_activo: number;

  titulo: string;
  breadcrumbArray = [];
  
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) {
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_cierre = null;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.dataVisor = JSON.parse(atob(params['data'])).data;

          this.titulo = 'Diagrama de Gantt';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/diagrama-gantt', datos: JSON.parse(atob(params['data']))});

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

  insert_gantt(a: any) {
    this.solicitud.enero = a.ene;
    this.solicitud.febrero = a.feb;
    this.solicitud.marzo = a.mar;
    this.solicitud.abril = a.abr;
    this.solicitud.mayo = a.may;
    this.solicitud.junio = a.jun;
    this.solicitud.julio = a.jul;
    this.solicitud.agosto = a.ago;
    this.solicitud.septiembre = a.sep;
    this.solicitud.octubre = a.oct;
    this.solicitud.noviembre = a.nov;
    this.solicitud.diciembre = a.dic;
    this.solicitud.periodo = a.periodo;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.consulta_driagrama_gantt(11);
  }

  delete_gantt(a) {
    this.solicitud.periodo = a.periodo;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

   this.consulta_driagrama_gantt(13);
  }

  update_gantt(a, mes) {
    if (a.estatus) {
      this.solicitud.enero = a.ene;
      this.solicitud.febrero = a.feb;
      this.solicitud.marzo = a.mar;
      this.solicitud.abril = a.abr;
      this.solicitud.mayo = a.may;
      this.solicitud.junio = a.jun;
      this.solicitud.julio = a.jul;
      this.solicitud.agosto = a.ago;
      this.solicitud.septiembre = a.sep;
      this.solicitud.octubre = a.oct;
      this.solicitud.noviembre = a.nov;
      this.solicitud.diciembre = a.dic;
      this.solicitud.periodo = a.periodo;
      this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

      // edita el campo correcto

      if (mes == 1) { if (a.ene == 0) { this.solicitud.enero = 1 } else { this.solicitud.enero = 0 } }
      else if (mes == 2) { if (a.feb == 0) { this.solicitud.febrero = 1 } else { this.solicitud.febrero = 0 } }
      else if (mes == 3) { if (a.mar == 0) { this.solicitud.marzo = 1 } else { this.solicitud.marzo = 0 } }
      else if (mes == 4) { if (a.abr == 0) { this.solicitud.abril = 1 } else { this.solicitud.abril = 0 } }
      else if (mes == 5) { if (a.may == 0) { this.solicitud.mayo = 1 } else { this.solicitud.mayo = 0 } }
      else if (mes == 6) { if (a.jun == 0) { this.solicitud.junio = 1 } else { this.solicitud.junio = 0 } }
      else if (mes == 7) { if (a.jul == 0) { this.solicitud.julio = 1 } else { this.solicitud.julio = 0 } }
      else if (mes == 8) { if (a.ago == 0) { this.solicitud.agosto = 1 } else { this.solicitud.agosto = 0 } }
      else if (mes == 9) { if (a.sep == 0) { this.solicitud.septiembre = 1 } else { this.solicitud.septiembre = 0 } }
      else if (mes == 10) { if (a.oct == 0) { this.solicitud.octubre = 1 } else { this.solicitud.octubre = 0 } }
      else if (mes == 11) { if (a.nov == 0) { this.solicitud.noviembre = 1 } else { this.solicitud.noviembre = 0 } }
      else if (mes == 12) { if (a.dic == 0) { this.solicitud.diciembre = 1 } else { this.solicitud.diciembre = 0 } }
      this.solicitud.periodo = a.periodo;

      this.consulta_driagrama_gantt(12);
    }
    else {
      this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', );
      this.notify.warn('Error', 'El periodo ' + a.periodo + ' no esta activo en la ' + this.dataVisor.nombre1 + '#' + this.dataVisor.orden, this.optionconfig);
    }
  }
}
