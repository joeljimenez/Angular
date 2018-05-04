import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-ver-evidencias',
  templateUrl: './ver-evidencias.component.html',
  styleUrls: ['./ver-evidencias.component.css']
})
export class VerEvidenciasComponent implements OnInit {

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;

  gesionar: boolean;
  autoevaluacion: boolean;
  proyecto: boolean;
  dataVisor: any;

  titulo:string;
  breadcrumbArray = [];

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) { }

  ngOnInit() {
    /* 
      Se envian los siguentes parametros al componente *evidencia* en los controles.
      para determinar en que vista esta y si gestiona(edita, elimina, inserta).

      esta vista solo llama al componente app-evidencia, los procesos, consultas se realizan desde dicho componente.
    */
    this.gesionar = false;
    this.proyecto = false;
    this.autoevaluacion = true;
    
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.dataVisor = JSON.parse(atob(params['data'])).data;

          this.titulo = 'Ver las Evidencias';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/ver-evidencias', datos: JSON.parse(atob(params['data']))});
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
