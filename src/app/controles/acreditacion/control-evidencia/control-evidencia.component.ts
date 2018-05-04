import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos, acreditacion, periodos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-control-evidencia',
  templateUrl: './control-evidencia.component.html',
  styleUrls: ['./control-evidencia.component.css']
})
export class ControlEvidenciaComponent implements OnInit {

  @Input() vistaActual: String;
  @Input() evidencias: any;
  @Input() idcarpeta: number;
  @Input() gestionar: boolean;
  @Output() guardaE: EventEmitter<any> = new EventEmitter();

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  data_visor: any;
  periodoActivo: number;
  select_evidencia: acreditacion;
  opc: string;

  pdf: boolean;
  img: boolean;
  vdo: boolean;
  nuestra_visor: boolean;
  flim: string;
  nombre_doc: string;
  barra = [];

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) {
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_cierre = null;
  }
    /*
        contiene  la lista de evidencias y el formulario para editar las evidencias.
        cuando se edita o elimina una evidencia este componente reune los paramaetros para enviarlos al componente evidencias para ejecutar la consulta;
    */
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.data_visor = JSON.parse(atob(params['data'])).data;
        } catch (error) {
          window.history.back();
        }
      }
      else {
        window.history.back();
      }
    });
  }

  visor(a: any) {
    this.pdf = false;
    this.img = false;
    this.vdo = false;
    this.nuestra_visor = false;
    this.nombre_doc = a.nombre;
    //this.registra_vista(a.idsecuencia, a.idevidencia)
    if (a.extencion == '.pdf') {
      this.pdf = true;
      this.nuestra_visor = true;
      // document.getElementById("iframe").src = '../UPLOAD/' + a.idsecuencia + '/' + a.nombre + a.extencion;
      // ./assets/UPLOAD/19/CONEAUPA_ACREDITADA.png

      if (this.vistaActual == 'proyecto') {
        document.getElementById('iframe').setAttribute('src', './assets/UPLOAD/Proyectos/' + a.idsecuencia_pro + '/' + a.periodo + '/' + a.nombre + a.extencion);
      } else if (this.vistaActual == 'autoevaluacion') {
        document.getElementById('iframe').setAttribute('src', './assets/UPLOAD/' + a.idsecuencia + '/' + a.nombre + a.extencion);
      }

      document.getElementById('reporte').style.display = 'block';

    }
    else if (a.extencion == '.png' || a.extencion == '.jpg' || a.extencion == '.jpeg' || a.extencion == '.gif') {
      this.img = true;
      this.nuestra_visor = true;
      //document.getElementById("imagenes").src = '../UPLOAD/' + a.idsecuencia + '/' + a.nombre + a.extencion;

      if (this.vistaActual == 'proyecto') {
        document.getElementById('imagenes').setAttribute('src', './assets/UPLOAD/Proyectos/' + a.idsecuencia_pro + '/' + a.periodo + '/' + a.nombre + a.extencion);
      } else if (this.vistaActual == 'autoevaluacion') {
        document.getElementById('imagenes').setAttribute('src', './assets/UPLOAD/' + a.idsecuencia + '/' + a.nombre + a.extencion);
      }

      document.getElementById('reporte').style.display = 'block';
    }
    else if (a.extencion == '.video') {
      this.vdo = true;
      // this.flim = a.script;
      //this.flim = '<iframe width="640" height="360" src="https://www.youtube.com/embed/iNmTzMSJArw?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';
      document.getElementById("vdo").innerHTML = a.script;
      this.nuestra_visor = true;
      document.getElementById('reporte').style.display = 'block';

      /*  IDEA:
          Cuando se guarda la URL de un video solo guardar el id de video 
          guardar id:
                    let url = new URL('https://www.youtube.com/watch?v=0D0LMWf93pU');
                    console.log(url.search);
                    console.log(url.search.split('=')); Id de video en la posicion [1]
                    this.idvideoEjemplo = '0D0LMWf93pU';

          colocar en el html el iframe para cuando se muestre enviar el url con el ID.
         <iframe id="ejemplo" width="100%" height="360" src="" frameborder="0" allowfullscreen></iframe>
          
          var url = 'https://www.youtube.com/embed/'+this.idvideoEjemplo+'?rel=0&amp;showinfo=0';
          document.getElementById('ejemplo').setAttribute('src', url);
        */


    }
    else if (a.extencion == '.link') {
      //this.pdf = true;
      //this.nuestra_visor = true;
      //document.getElementById("iframe").src = a.script;
      window.open(a.script, '_blank');
    }
    else {
      //document.getElementById("iframe").src = '../UPLOAD/' + a.idsecuencia + '/' + a.nombre + a.extencion;
      if (this.vistaActual == 'proyecto') {
        document.getElementById('iframe').setAttribute('src', './assets/UPLOAD/Proyectos/' + a.idsecuencia_pro + '/' + a.periodo + '/' + a.nombre + a.extencion);
      } else if (this.vistaActual == 'autoevaluacion') {
        document.getElementById('iframe').setAttribute('src', './assets/UPLOAD/' + a.idsecuencia + '/' + a.nombre + a.extencion);
      }
    }
  }

  cirre_visor() {
    document.getElementById('reporte').style.display = 'none';
    document.getElementById('formulario_evidencia').style.display = 'none';
    document.getElementById("vdo").innerHTML = '';
    /*cierra el visor y limpia los controles */
    this.nuestra_visor = false;
    this.pdf = false;
    this.img = false;
    this.vdo = false;
    this.flim = "";
  }

  editar_archivo(datos: acreditacion) {
    this.opc = 'editar_archivo';

    this.solicitud.idevidencia_pro = datos.idevidencia_pro;
    this.solicitud.idsecuencia_pro = datos.idsecuencia_pro;
    this.solicitud.idevaluacion = datos.idevidencia;
    this.solicitud.descripcion = datos.nombre;
    this.select_evidencia = datos;
    this.solicitud.periodo = this.periodoActivo;
    document.getElementById('formulario_evidencia').style.display = 'block';
  }

  eliminar_evidencia(datos: acreditacion) {
    this.opc = 'eliminar_archivo';
    this.solicitud.nombre = datos.nombre;
    this.solicitud.extencion = datos.extencion;
    this.solicitud.idevidencia = datos.idevidencia;
    this.solicitud.idevidencia_pro = datos.idevidencia_pro;
    this.solicitud.idsecuencia_pro = datos.idsecuencia_pro;
    this.solicitud.periodo = this.periodoActivo;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.metodo = 3;
    this.solicitud.consulta = 4;

    let r = confirm("Desea eliminar esta evidencia.");
    if (r == true) {
      this.guardaE.emit({ solicitud: this.solicitud, opc: this.opc });
    }
  }

  guardar() {
    this.solicitud.idsecuencia = this.select_evidencia.idsecuencia;
    this.solicitud.idevidencia = this.select_evidencia.idevidencia;
    this.solicitud.nombre = this.solicitud.descripcion; //nuevo nombre
    this.solicitud.descripcion = this.select_evidencia.nombre; // viejo nombre
    this.solicitud.extencion = this.select_evidencia.extencion;
    this.solicitud.periodo = this.periodoActivo;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    if (this.opc == 'crea_evidencia') {
      this.solicitud.metodo = 3;
      this.solicitud.consulta = 2;
      this.guardaE.emit({ solicitud: this.solicitud, opc: this.opc });
    }
    else if (this.opc == 'editar_archivo') {
      this.solicitud.metodo = 3;
      this.solicitud.consulta = 3;
      this.guardaE.emit({ solicitud: this.solicitud, opc: this.opc });
    }
  }

  cambio_periodo_activo(periodo: number) {
    // es ejecutado desde el componente control-gantt para hacer el cambio del periodo activo en proyectos.
    this.periodoActivo = periodo;
  }

}
