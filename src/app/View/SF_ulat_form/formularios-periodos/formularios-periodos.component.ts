import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, Parametros, colegio, OpcionesNotifi, Permisos, periodos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-formularios-periodos',
  templateUrl: './formularios-periodos.component.html',
  styleUrls: ['./formularios-periodos.component.css']
})
export class FormulariosPeriodosComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  tipo_periodo: periodos;
  titulo_modal: string;
  mensaje: string;
  periodos = [];
  titulo_padre: string;
  idtipo_periodo: number;
  num_periodo: any;
  params: any;
  filtro: any;
  correos: string;
  breadcrumbArray = [];
  titulo: string;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.solicitud.idsede = sessionStorage._sede;
    this.titulo = 'Editor de Periodos';
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.solicitud.idformulario = JSON.parse(atob(params['data'])).idformulario;
          this.titulo_padre = JSON.parse(atob(params['data'])).nombre;
          this.idtipo_periodo = JSON.parse(atob(params['data'])).idtipo_periodo;
          this.params = JSON.parse(atob(params['data']));

          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo,ruta: '../home/Formularios-Periodos', datos: JSON.parse(atob(params['data']))});

        } catch (error) {

          this.router.navigate(['./home/Formularios'])
        }
      }
      else {
        this.router.navigate(['./home/Formularios'])
      }
    });

    this.solicitud.metodo = 5;
    this.solicitud.consulta = 2;
    this.Consulta_tipo_periodo();


    this.solicitud.metodo = 4;
    this.solicitud.consulta = 12;
    this.run();


  }

  /* 1. PROCESO DE CARGA DE PERIODOS*/
  run() {
    this.flag_envio = true;

    if (this.solicitud.consulta === 3 || this.solicitud.consulta === 2) {
      if (!this.validacion()) {
        this.flag_envio = false;
        return false;
      }
    }
    this.solicitud.estado = (this.solicitud.estado) ? 1 : 0;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);
          //this.respuesta = datos.data;
          this.encapsular_periodos(datos.data)
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
            this.periodos = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito',this.optionconfig);
            }
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

        if (this.solicitud.consulta > 1) {
          document.getElementById('formulario').style.display = 'none';
          document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  _correos() {
    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.correos = '';
          this.rest.NuevoTokent(datos.tokent);
          for (var i in datos.data) {
            if(this.correos == ''){
              this.correos = datos.data[i].email;
            }else{
              this.correos = datos.data[i].email + '; ' + this.correos;
            }
          }
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.correos = datos.data;
          }
          if (datos.numero === '0') {

            
            this.notify.success('Proceso exitoso', 'No existen opciones para crear preguntas consulte al departamento de informática o vuelva a cargar la página.', this.optionconfig);

          }
          // tslint:disable-next-line:one-line
          else {
            this.notify.error('Error Controlado', this.rest.Control_error(datos.error), this.optionconfig);
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
          this.tipo_periodo = datos.data;
          this.calcula_periodo();

        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.tipo_periodo = datos.data;
          }
          // tslint:disable-next-line:one-line
          else {
            this.notify.error('Error Controlado', this.rest.Control_error(datos.error), this.optionconfig);
          }
        }
      },
      (err) => { },
      () => { }
    )
  }

  encapsular_periodos(a): void {
    this.periodos = [];
    let entra = false;
    let en = 0;
    let c: any;
    for (var b in a) {
      entra = false;
      en = 0;
      if (this.periodos.length == 0) {
        this.periodos.push({ 'idformulario': a[b].idformulario, 'anno': a[b].anno, 'cantidad': a[b].cantidad, 'periodos': [a[b]] })
      }
      else {
        for (c in this.periodos) {
          if (this.periodos[c].anno == a[b].anno) {
            entra = true;
            en = c;
          }
        }
        if (entra) {
          this.periodos[en].periodos.push(a[b]);
        }
        else {
          this.periodos.push({ 'idformulario': a[b].idformulario, 'anno': a[b].anno, 'cantidad': a[b].cantidad, 'periodos': [a[b]] })
        }
      }
    }
  }

  cambia_estado(data: periodos) {

    this.solicitud.metodo = 4;
    this.solicitud.consulta = 14;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.anno = data.anno;
    this.solicitud.periodo = data.periodo;

    if (data.estado == 1) {
      this.solicitud.estado = 0;
    } else {
      this.solicitud.estado = 1;
    }

    this.run();
  }

  calcula_periodo() {
    const meses = 12;
    for (var p in this.tipo_periodo) {
      if (this.tipo_periodo[p].idtipo_periodo == this.idtipo_periodo) {
        var cantidad = this.tipo_periodo[p].cantidad;
        this.num_periodo = [];
        for (var i = 1; i <= cantidad; i++) {
          this.num_periodo.push(i);
        }
        break;
      }
    }
  }

  /* 1. PROCESO DE CARGA DEL FORMULARIO FIN*/

  crear() {
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 13;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.periodo = 0;
    this.solicitud.anno = 0;
    this.solicitud.estado = 0;

    this.titulo_modal = 'CREA FORMULARIO';
    document.getElementById('formulario').style.display = 'block';

  }

  eliminar(data: periodos) {
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 15;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.anno = data.anno;
    this.solicitud.periodo = data.periodo;

    document.getElementById('eliminar').style.display = 'block';
    this.titulo_modal = 'ELIMINAR PERIODO';
    this.mensaje = 'Desea eliminar el periodo ' + data.periodo + ' del año ' + data.anno
  }

  aviso(data: periodos) {
    this.solicitud.anno = data.anno;
    this.solicitud.periodo = data.periodo;
    this.solicitud.estado = data.estado;

    this.consulta_correos();

    document.getElementById('aviso').style.display = 'block'
    this.titulo_modal = 'CORREOS DE EVALUADORES';
    this.mensaje = 'Desea eliminar el periodo ' + data.periodo + ' del año ' + data.anno
  }



  consulta_correos() {
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 19;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this._correos();

  }

  open(data: periodos) {
    const arreglo = {
            periodo: data.periodo,
            anno: data.anno,
            estado: data.estado,
            idformulario: data.idformulario,
            nombre_form: this.titulo_padre,
            navegacion: this.breadcrumbArray
    }
    const paramatros = btoa(JSON.stringify(arreglo));

    this.router.navigate(['./home/Evaluaciones', paramatros]);

  }

  validacion() {
    const a = this.solicitud;
    let retorno = true;

    if (a.nombre.length < 1) {
      this.notify.error('Completar campos', 'Por favor coloque un nombre a la caja.',this.optionconfig);1
      retorno = false;
    }
    if (a.idtipo_formulario == 0) {
      this.notify.error('Completar campos', 'Por favor seleccione un tipo de formulario.',this.optionconfig);
      retorno = false;
    }
    if (a.idtipo_periodo == 0) {
      this.notify.error('Completar campos', 'Por favor seleccione un tipo de periodo.', this.optionconfig);
      retorno = false;
    }

    return retorno;
  }
}
