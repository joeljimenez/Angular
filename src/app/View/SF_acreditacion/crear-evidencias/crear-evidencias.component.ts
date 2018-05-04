import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

  import { ControlCarpetasComponent } from '../../../controles/acreditacion/export_controles_acreditacion';
  
@Component({
  selector: 'app-crear-evidencias',
  templateUrl: './crear-evidencias.component.html',
  styleUrls: ['./crear-evidencias.component.css']
})
export class CrearEvidenciasComponent implements OnInit {

  @ViewChild(ControlCarpetasComponent) carpetasCtrl: ControlCarpetasComponent;
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  solicitud = new Parametros().prm;

  gesionar: boolean;
  autoevaluacion: boolean;
  proyecto: boolean;
  dataVisor: any;

  titulo:string;
  breadcrumbArray = [];

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.gesionar = true;
    this.proyecto = false;
    this.autoevaluacion = true;
    
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.dataVisor = JSON.parse(atob(params['data'])).data;

          this.titulo = 'Gestionar Evidencias';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/crear-evidencias', datos: JSON.parse(atob(params['data']))});
        } catch (error) {
          window.history.back();
        }
      }
      else {
        window.history.back();
      }
    });
  }
}
