import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, Parametros, colegio, OpcionesNotifi, Permisos, formularios } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.css']
})
export class FormulariosComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  respuesta: formularios;
  titulo_modal: string;
  mensaje: string;
  formularios: formularios;
  tipo_formularios: formularios;
  tipo_periodo: formularios;
  breadcrumbArray = [];
  titulo:string;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService ) { }

  ngOnInit() {
    this.solicitud.idsede = sessionStorage._sede;
    this.titulo = 'Formularios'; /*Titulo de la Pagina*/
    this.breadcrumbArray = [{titulo: this.titulo, nombre: this.titulo, ruta:'../home/Formularios', datos:''}]
    this.solicitud.metodo  = 5;
    this.solicitud.consulta = 1;
    this.Consulta_tipo_formularios();

    this.solicitud.metodo  = 5;
    this.solicitud.consulta = 2;
    this.Consulta_tipo_periodo();

    this.solicitud.metodo = 4;
    this.solicitud.consulta = 1;
    this.run();
  }

  run() {
   
    this.flag_envio = true;

    if (this.solicitud.consulta === 3 || this.solicitud.consulta === 2) {
      if (!this.validacion()) {
        this.flag_envio = false;
        return false;
      }
    }
    
    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        console.log(datos)
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);
          this.respuesta = datos.data;

          if (this.solicitud.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito',this.optionconfig);
          }
          else if (this.solicitud.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito',this.optionconfig);
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito',this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.respuesta = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 1) {
              this.notify.success('Proceso exitoso', 'Registro no existe', this.optionconfig);
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
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
          document.getElementById('formulario').style.display = 'none';
          document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  Consulta_tipo_formularios() {
    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.tipo_formularios = datos.data;
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.tipo_formularios = datos.data;
          }
          // tslint:disable-next-line:one-line
          else {
            // this.mensaje_error = this.rest.Control_error(datos.error);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => { }
    )
  }

  Consulta_tipo_periodo() {
    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.tipo_periodo = datos.data;
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.tipo_periodo = datos.data;
          }
          // tslint:disable-next-line:one-line
          else {
            //this.mensaje_error = this.rest.Control_error(datos.error);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => { }
    )
  }



  crear() {
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 2;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.idformulario = 0;
    this.solicitud.idtipo_formulario = 0;
    this.solicitud.idtipo_periodo = 0;
    this.solicitud.nombre = '';
    this.solicitud.estado = 0;

    this.titulo_modal = 'CREA FORMULARIO';
    document.getElementById('formulario').style.display = 'block';

  }

  editar(data: formularios) {
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.nombre = data.nombre,
    this.solicitud.idformulario = data.idformulario,
    this.solicitud.idtipo_formulario =  data.idtipo_formulario,
    this.solicitud.idtipo_periodo =  data.idtipo_periodo,
    this.solicitud.estado = data.estado


    document.getElementById('formulario').style.display = 'block';
    this.titulo_modal = 'EDITAR FORMULARIO';
  }
  
  eliminar(data: formularios) {
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 4;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idformulario = data.idformulario;

    document.getElementById('eliminar').style.display = 'block';
    this.titulo_modal = 'ELIMINA FORMULARIO';
    this.mensaje  = 'Desea eliminar el formulario '+ data.nombre
  }

  open(data: formularios) {

    const arreglo = {
      idformulario: data.idformulario,
      nombre: data.nombre,
      idtipo_periodo: data.idtipo_periodo,
      navegacion: this.breadcrumbArray
    }
    const paramatros = btoa(JSON.stringify(arreglo));

    this.router.navigate(['./home/Formularios-Periodos', paramatros]);
   // this.breadcrumbArray = Navegacionservice.prototype.Add_Navagacion('Periodos', ['./home/Formularios-Periodos', paramatros]);
  }

  frmOpen(data: formularios) {
        const arreglo = {
          idformulario: data.idformulario,
          nombre: data.nombre,
          navegacion: this.breadcrumbArray
        }
        const paramatros = btoa(JSON.stringify(arreglo));

        this.router.navigate(['./home/Formularios-Preguntas', paramatros]);    
  }


  validacion() {
    const a = this.solicitud;
    let retorno = true;


    if (a.nombre.length < 1) {
      this.notify.error('Completar campos', 'Por favor coloque un nombre a la caja.',this.optionconfig);
      retorno = false;
    }
    if(a.idtipo_formulario == 0){
      this.notify.error('Completar campos', 'Por favor seleccione un tipo de formulario.',this.optionconfig);
      retorno = false;
    }
    if(a.idtipo_periodo == 0){
      this.notify.error('Completar campos', 'Por favor seleccione un tipo de periodo.',this.optionconfig);
      retorno = false;
    }

    return retorno;
  }
}
