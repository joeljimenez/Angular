import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, CompanySoftware,Roles, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
@Component({
  selector: 'app-company-software',
  templateUrl: './company-software.component.html',
  styleUrls: ['./company-software.component.css']
})
export class CompanySoftwareComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: CompanySoftware;
  Roles: Roles;
  datos: Roles[];
  datosRol: Roles[];
  titulo_modal: string;
  filter: any;
  titulo_padre: string;
  params: any;
  nombre_company:'';
  sede:'';
  titulo: string;
  breadcrumbArray = [];
  filtro: string;
  constructor(private rest: RestService, private router: Router, private _service: NotificationsService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.filter = 0;
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.solicitud.idcompany = JSON.parse(atob(params['data'])).idcompany;
          this.solicitud.idsede = JSON.parse(atob(params['data'])).idsede;
          this.solicitud.idusuario = JSON.parse(atob(params['data'])).idusuario;
          this.titulo_padre = JSON.parse(atob(params['data'])).nombre;
          this.nombre_company = JSON.parse(atob(params['data'])).nombre_company;
          this.sede = JSON.parse(atob(params['data'])).sede;
          this.params = JSON.parse(atob(params['data']));

          this.titulo = 'Usuario: ' + this.titulo_padre;
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/Company-Software', datos: JSON.parse(atob(params['data']))});


        } catch (error) {

          this.router.navigate(['./home/colegios'])
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/colegios'])
      }
    });

    this.solicitud.consulta = 1;
    this.solicitud.metodo = 1;
    this.run();

    this.prm.consulta = 5;
    this.prm.metodo = 9;
    this.consulta_roles();

  }


  run() {
    this.flag_envio = true;
    
        if (this.solicitud.consulta === 3 || this.solicitud.consulta === 2) {
          if (!this.validacion()) {
            this.flag_envio = false;
            return false;
          }
        }
    this.rest.controlAcceso(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.rest.NuevoTokent(datos.tokent);
          this.respuesta = datos.data;

          if (this.solicitud.consulta === 3) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro actualizado con éxito')
          }
          else if (this.solicitud.consulta === 2) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro insertado con éxito')
          }
          if (this.solicitud.consulta === 4) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito')
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
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro no existe')
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

  arregloSofwareRol(arr){
    let data = [];  let index = 0;
    
    for (let i  in this.Roles) {
      data.push(
        {'idsoftware':this.Roles[i].idsoftware,'software':this.Roles[i].software
      });
    }
    for (var l = 0;l < data.length; l++) {
      data[l].roles = [];
      for (var k = l + 1; k < data.length; k++) {
          if (data[l].idsoftware == data[k].idsoftware) {
              data.splice(k, 1);
              k--;
          }
      }
    }
    for (var i in data) {
      data[i].roles = [];
      for (var j in this.Roles){
          if(data[i].idsoftware == this.Roles[j].idsoftware){
            data[i].roles.push({'idrole':this.Roles[j].idrole,'role':this.Roles[j].role});
          }
      }
    }

    this.datos = data;
  }

  consulta_roles() {
    this.flag_envio = true;

    this.rest.controlAcceso(this.prm).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.Roles = datos.data;
          this.arregloSofwareRol(this.Roles)
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.Roles = datos.data;
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

  selectRol(id: any): void {
    this.datosRol = [];
    this.datosRol = this.datos.filter(value => value.idsoftware === parseInt(id))[0].roles;
  }

  crear() {
    this.solicitud.consulta = 2;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idsoftware = 0;
    this.solicitud.idrole = 0;

    this.titulo_modal = 'Crear';
    document.getElementById('formulario').style.display = 'block';
  }

  editar(data: Roles) {
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.idrole = data.idrole;
    this.solicitud.idsoftware = data.idsoftware;
    this.selectRol(data.idsoftware)

    document.getElementById('formulario').style.display = 'block';
    this.titulo_modal = 'Editar';
  }

  eliminar(data: CompanySoftware) {
    this.solicitud.consulta = 4;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idsoftware = data.idsoftware;

    document.getElementById('eliminar').style.display = 'block';
    this.titulo_modal = 'Eliminar';
  }

  validacion() {
    const a = this.solicitud;
    let retorno = true;


    if (a.idsoftware < 1) {
      this.Show_notificacion(2, 'Completar campos', 'Por favor coloque un nombre a la caja.')
      retorno = false;
    }
    else if(a.idrole < 1){
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
