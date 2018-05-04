import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, Parametros, empleados, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { CorrectorPipe } from '../../../pipes/export';

@Component({
  selector: 'app-gestor-de-evaluaciones',
  templateUrl: './gestor-de-evaluaciones.component.html',
  styleUrls: ['./gestor-de-evaluaciones.component.css']
})
export class GestorDeEvaluacionesComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: empleados;
  titulo_modal: string;
  last = [];
  dependientes_empleados: empleados;
  empleados = [];
  filtro: string;
  error:boolean;
  data: empleados;
  idempleado:string;
  idsedeSession:any;
  breadcrumbArray = [];
  titulo:string;

  constructor(private rest: RestService, private router: Router, private _service: NotificationsService) { }

  ngOnInit() {
    this.solicitud.idsede = sessionStorage._sede;
    this.titulo = 'Gestor de Evaluaciones'; /*Titulo de la Pagina*/
    this.breadcrumbArray = [{titulo: this.titulo, nombre: this.titulo, ruta:'../home/Evaluador', datos:''}];

    this.filtro = '';
    this.error = false;
    this.idempleado = '';
    this.solicitud.idempleado = JSON.parse(atob(localStorage._tokentUser)).idempleado;
    this.consulta_empleados(0, -1);
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
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);
          this.respuesta = datos.data;
          this.arr_empleados(datos.data, 0);

          if (this.solicitud.consulta === 3) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro actualizado con éxito');
          }
          else if (this.solicitud.consulta === 2) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro insertado con éxito');
          }
          if (this.solicitud.consulta === 4) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito');
          }
        }
        else {
          if (datos.error === '0') {
            this.respuesta = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 4) {
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito')
            }
            if (this.solicitud.consulta === 1) {
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro no existe');
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.Show_notificacion(2, 'Error controlado', this.rest.Control_error(datos.error))
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
  consulta_dependientes_empleados(){
    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.dependientes_empleados = datos.data;
          this.arr_empleados(this.respuesta, datos.data);
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.dependientes_empleados = datos.data;
          }
          if(datos.numero === '0'){
            this.Show_notificacion(1, 'Proceso exitoso', 'No existen Usuarios.')

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

  consulta_empleados(idempleado, padre){
    if (padre !== -2){
      if (idempleado !== 0){
        this.solicitud.idempleado = idempleado;
        if (padre !== -1){
          if (localStorage.padre === undefined) {
            this.last.push(padre);
            localStorage.padre = JSON.stringify(this.last);
          }
          else {
            this.last = [];
            this.last = JSON.parse(localStorage.padre);
            this.last.push(padre);
            localStorage.padre = JSON.stringify(this.last);
          }
        }
      }
      else if (idempleado === 0 && localStorage.idempleado !== undefined || localStorage.idempleado != null) {
        // opcion 0,-1 primera entrada en la pantalla
        this.solicitud.idempleado = JSON.parse(atob(localStorage._tokentUser)).idempleado;
      }
    }
    else {
      localStorage.idempleado = JSON.parse(atob(localStorage._tokentUser)).idempleado;
      this.solicitud.idempleado = localStorage.idempleado;
      localStorage.padre = '[]';
      this.last = [];
    }

    this.solicitud.metodo = 3;
    this.solicitud.idsede = sessionStorage._sede;
    this.run();

  }

  after_empleado() {
    let last = this.last.length - 1;
    this.consulta_empleados(this.last[last], -1);

    this.last.splice(last, 1)

    localStorage.padre = JSON.stringify(this.last);

  }
  open(data: empleados){
    const arreglo = {
    RH09EMP : data.RH09EMP,
    RH27COD : data.RH27COD,
    RH27DES : data.RH27DES,
    RH28COD : data.RH28COD,
    RH28DES : data.RH28DES,
    apellido : data.apellido,
    apellido2 : data.apellido2,
    cedula : data.cedula,
    dependientes : data.dependientes,
    email : data.email,
    estado : data.estado,
    idempleado : data.idempleado,
    nombre : data.nombre,
    nombre2 : data.nombre2,
    sexo : data.sexo,
    navegacion: this.breadcrumbArray
   }
    const paramatros = btoa(JSON.stringify(arreglo));
    this.router.navigate(['home/Evaluaciones-Empleado', paramatros]);
  }

  arr_empleados(empleado, dep_empleados){
    if(dep_empleados === 0){
      this.solicitud.metodo = 11;
      this.solicitud.consulta = 1;
      this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
      localStorage.idempleado = this.solicitud.idempleado;
      this.consulta_dependientes_empleados();
    }else{

      for (var i in dep_empleados) {
        for (var a in empleado) {
          if (empleado[a].RH09EMP == dep_empleados[i].RH10EMP) {
            if (dep_empleados[i].dependientes > 0) {
              empleado[a].dependientes = true;
            }
            else {
                empleado[a].dependientes = false;
            }
          }
        }
      }
      let dataString = CorrectorPipe.prototype.transform(JSON.stringify(empleado));
      this.empleados = JSON.parse(dataString);
    }
  }

  consulta_empleado(idempleado){
    this.solicitud.metodo = 6;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.idempleado = idempleado;

    if (idempleado.length === 0) {
      
      this.error = true;
      return false;

    }else{
      
      this.flag_envio = true;

      this.rest.ulat_form(this.solicitud).subscribe(
        (rs) => {
          this.flag_envio = false;
          const datos = JSON.parse(rs.text());
          if (datos.exito) {
            this.rest.NuevoTokent(datos.tokent)
            this.data = datos.data;
            for (var i in this.empleados) {
              if (this.empleados[i].cedula == this.data[0].cedula) {
                this.data[0].estado = 'R';
              }
          }
          this.error = false;
          this.idempleado = '';



          }
          // tslint:disable-next-line:one-line
          else {
            if (datos.error === '0') {
              this.data = datos.data;
            }
            if(datos.numero === '0'){
              this.Show_notificacion(1, 'Proceso exitoso', 'Este ID no existe')

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

  }

  inserta_empleado(idempleado){
    this.solicitud.metodo = 9;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.idempleado = idempleado;


    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.Show_notificacion(1, 'Proceso exitoso', 'Registrado');
          this.consulta_empleados(0,-2)
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.data = datos.data;
          }
          if(datos.numero === '0'){
            this.Show_notificacion(1, 'Proceso exitoso', 'Este ID no existe')

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

  validacion() {
    const a = this.solicitud;
    let retorno = true;


    if (a.nombre.length < 1) {
      this.Show_notificacion(2, 'Completar campos', 'Por favor coloque un nombre a la caja.')
      retorno = false;
    }

    return retorno;
  }
  
  Show_notificacion(tipo, titulo, mensaje) {
    if (tipo === 1) {
      this._service.success(titulo, mensaje, this.optionconfig);
    }
    // tslint:disable-next-line:one-line
    else if (tipo === 2) {
      this._service.error(titulo, mensaje, this.optionconfig);
    }
  }

}


