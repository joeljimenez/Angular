import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, RoleMenu,menus, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-menu-rol',
  templateUrl: './menu-rol.component.html',
  styleUrls: ['./menu-rol.component.css']
})
export class MenuRolComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: RoleMenu;
  menus: menus;
  titulo_modal: string;
  filter: any;
  titulo_padre: string;
  params: any;
  titulo:string;
  breadcrumbArray = [];
  filtro: string;
  constructor(private rest: RestService, private router: Router, private _service: NotificationsService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.filter = '';
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.solicitud.idsoftware = JSON.parse(atob(params['data'])).idsoftware;
          this.solicitud.idrole = JSON.parse(atob(params['data'])).idrole;
          this.solicitud.software = JSON.parse(atob(params['data'])).software;
          this.titulo_padre = JSON.parse(atob(params['data'])).nombre;
          this.params = JSON.parse(atob(params['data']));

          this.titulo = 'Roles Menu ('+this.titulo_padre+')';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/MenuRol', datos: JSON.parse(atob(params['data']))});

        } catch (error) {

          this.router.navigate(['./home/Softwares'])
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/Softwares'])
      }
    });

    this.solicitud.consulta = 1;
    this.solicitud.metodo = 4;
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
    this.solicitud.estado = (this.solicitud.estado) ? 1 : 0;
    this.solicitud.registrar = (this.solicitud.registrar) ? 1 : 0;
    this.solicitud.actualizar = (this.solicitud.actualizar) ? 1 : 0;
    this.solicitud.eliminar = (this.solicitud.eliminar) ? 1 : 0;
    this.solicitud.principal = (this.solicitud.principal) ? 1 : 0;
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

        this.solicitud.consulta = 5;
        this.menu();
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

  menu() {
    this.flag_envio = true;

    this.rest.controlAcceso(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.menus = datos.data;
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.menus = datos.data;
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

  crear() {
    this.solicitud.consulta = 2;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    
    this.titulo_modal = 'Agregar Menu';
    document.getElementById('formulario').style.display = 'block';

  }

  editar(data: RoleMenu) {
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idmenu = data.idmenu;
    this.solicitud.estado = (data.estado) ? 1 : 0;
    this.solicitud.crear = (data.crear) ? 1 : 0;
    this.solicitud.editar = (data.editar) ? 1 : 0;
    this.solicitud.eliminar = (data.eliminar) ? 1 : 0;
    this.solicitud.principal = (data.principal) ? 1 : 0;
    this.run();
  }

  eliminar(data: RoleMenu) {
    this.solicitud.consulta = 4;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idmenu = data.idmenu;
    this.solicitud.nombre = data.menu;

    document.getElementById('eliminar').style.display = 'block';
    this.titulo_modal = 'Eliminar Menu';
  }

  validacion() {
    const a = this.solicitud;
    let retorno = true;


    if (a.idmenu <= 0) {
      this.Show_notificacion(2, 'Completar campos', 'Seleccione el Menu.')
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
