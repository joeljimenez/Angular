import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, empleados, formularios, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { CorrectorPipe, MaxLengthPipe } from '../../../pipes/export';


@Component({
  selector: 'app-evaluaciones-empleado',
  templateUrl: './evaluaciones-empleado.component.html',
  styleUrls: ['./evaluaciones-empleado.component.css']
})
export class EvaluacionesEmpleadoComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: empleados;
  titulo_modal: string;
  encuestas_empleado: empleados;
  formularios:formularios;
  activa_btn_enviar:boolean;
  breadcrumbArray = [];
  titulo:string;
  filtro: string;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.solicitud.idsede = sessionStorage._sede;
    this.titulo = 'Evaluaciones del Empleado';
    this.activa_btn_enviar = false;
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.solicitud.cedula_evaluado = JSON.parse(atob(params['data'])).cedula;
          this.solicitud.idempleado =   JSON.parse(atob(params['data'])).RH09EMP;
          this.solicitud.nombre =  JSON.parse(atob(params['data'])).nombre + ' ' + JSON.parse(atob(params['data'])).apellido;
          this.solicitud.departamento = JSON.parse(atob(params['data'])).RH27DES;
          this.solicitud.iddepartamento = JSON.parse(atob(params['data'])).RH27COD;
          this.solicitud.puesto = JSON.parse(atob(params['data'])).RH28DES;
          this.solicitud.idpuesto = JSON.parse(atob(params['data'])).RH28COD;
          this.solicitud.email = JSON.parse(atob(params['data'])).email;
          this.respuesta = JSON.parse(atob(params['data']));

           this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
           this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo,ruta: '../home/Evaluaciones-Empleado', datos: JSON.parse(atob(params['data']))});
        } catch (error) {

          this.router.navigate(['./home/Evaluador'])
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/Evaluador'])
      }
    });

    this.solicitud.metodo = 1;
    this.solicitud.consulta = 3;
    this.run();
  

    this.prm.metodo = 5;
    this.prm.consulta = 4;
    this.consulta_formularios_activos();
  }
  
  run(){
   // this.flag_envio = true;

    this.solicitud.estado = (this.solicitud.estado) ? 1 : 0;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);
          this.encuestas_empleado = datos.data;
          this.respuesta = datos.data[0];
          if(this.solicitud.consulta === 4){
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito',this.optionconfig);
          }

        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 8) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito',this.optionconfig);
            }
            if (this.solicitud.consulta === 0 || this.solicitud.consulta === 3) {
              this.notify.success('Proceso exitoso', datos.mensaje, this.optionconfig);
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje);
            //this.rest.logout();
          }
          else {
            this.notify.error('Proceso exitoso',  this.rest.Control_error(datos.error),this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
          return 0;
        }
      },
      (err) => { },
      () => {
        if (this.solicitud.consulta > 1) {
          document.getElementById('formulario').style.display='none';
        }
       }
    )
  }
  
  consulta_formularios_activos(){
    this.flag_envio = true;

    this.rest.ulat_form(this.prm).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.formularios = datos.data;
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.formularios = datos.data;
            this.rest.NuevoTokent(datos.tokent)
          }
          if (this.prm.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro no existe',this.optionconfig);
          }
          // tslint:disable-next-line:one-line
          else {
            this.notify.error('Proceso exitoso', this.rest.Control_error(datos.error),this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => { }
    )
  }
  
  consulta_empleado(idempleado){
    this.solicitud.metodo = 6;
    this.solicitud.idempleado = idempleado;

    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);
        this.respuesta = datos.data[0];
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.formularios = datos.data;
            this.rest.NuevoTokent(datos.tokent);
            this.notify.success('Proceso exitoso', 'Registro no existe',this.optionconfig);
          }
          // tslint:disable-next-line:one-line
          else {
            this.notify.error('Proceso exitoso', this.rest.Control_error(datos.error),this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
        document.getElementById('evaluado').style.display='none'
      },
      (err) => { },
      () => { }
    )
  }

  edita_evaluado(){
    this.solicitud.metodo = 8;
    this.solicitud.email = this.respuesta.email;
    this.solicitud.idsede = JSON.parse(atob(localStorage._tokentUser)).idsede;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    document.getElementById('evaluado').style.display='block';
  }

  edita_empleado(){
    if (this.solicitud.email.length == 0) {
      return false;
    }

    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.consulta_empleado(this.solicitud.idempleado);
          this.notify.success('Proceso exitoso', 'Registro Actualizado con exito', this.optionconfig);
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.rest.NuevoTokent(datos.tokent)
          }
          if (this.solicitud.consulta === 8) {
            this.notify.success('Proceso exitoso', 'Registro no existe', this.optionconfig);
          }
          // tslint:disable-next-line:one-line
          else {
            this.mensaje_error = this.rest.Control_error(datos.error);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => { }
    )
  }

  formulario(){
    this.solicitud.metodo = 1;
    this.solicitud.consulta = 4;
    this.solicitud.idsede = JSON.parse(atob(localStorage._tokentUser)).idsede;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    document.getElementById('formulario').style.display='block';
  }
  
  select_formulario(data){
    for (const i in this.formularios) {
      if (this.formularios[i].idformulario === parseInt(data)) {
        this.solicitud.idformulario = this.formularios[i].idformulario;
        this.solicitud.anno = this.formularios[i].anno;
        this.solicitud.periodo = this.formularios[i].periodo;
      }
    }
  }
  
  open(data: empleados){
    const arreglo = {
      idformulario: data.idformulario,
      periodo: data.periodo,
      anno: data.anno,
      idempleado: data.idempleado,
      hash: data.hash,
      nombre:data.nombre,
      nombre_evaluador: data.nombre_evaluador,
      email:data.email,
      nombre_from: data.nombre_from,
      navegacion: this.breadcrumbArray
    }
     const paramatros = btoa(JSON.stringify(arreglo));
     this.router.navigate(['./home/Formulario-Evaluaciones', paramatros]);
     //this.breadcrumbArray = Navegacionservice.prototype.Add_Navagacion('Formulario de Evaluaciones', ['home/Formulario-Evaluaciones', paramatros]);
  }
}
