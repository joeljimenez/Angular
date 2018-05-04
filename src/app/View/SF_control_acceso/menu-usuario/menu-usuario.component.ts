import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi,MenuUsuario, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-menu-usuario',
  templateUrl: './menu-usuario.component.html',
  styleUrls: ['./menu-usuario.component.css']
})
export class MenuUsuarioComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: MenuUsuario;
  Menu: MenuUsuario;
  titulo_modal: string;
  filter: any;
  titulo_padre: string;
  params: any;
  nombre_company:'';
  sede:'';
  datos=[];
  datosMenu: MenuUsuario[];
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

          this.titulo = 'Menu de Usuario: ' + this.titulo_padre ;
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/Menu-Usuario', datos: JSON.parse(atob(params['data']))});


        } catch (error) {

          this.router.navigate(['./home/colegios'])
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/colegios'])
      }
    });

    this.solicitud.consulta = 6;
    this.solicitud.metodo = 1;
    this.consulta_menus();

    this.solicitud.consulta = 1;
    this.solicitud.metodo = 5;
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
        this.solicitud.crear = (this.solicitud.crear) ? 1 : 0;
        this.solicitud.editar = (this.solicitud.editar) ? 1 : 0;
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

  consulta_menus() {
    this.flag_envio = true;

    this.rest.controlAcceso(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.Menu = datos.data;
          this.arregloMenu(this.Menu)
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.Menu = datos.data;
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

  arregloMenu(arr){
    let data = [];  let index = 0;
    
    for (let i  in this.Menu) {
      data.push(
        {'idsoftware':this.Menu[i].idsoftware,'software':this.Menu[i].software
      });
    }
    for (var l = 0;l < data.length; l++) {
      data[l].menu = [];
      for (var k = l + 1; k < data.length; k++) {
          if (data[l].idsoftware == data[k].idsoftware) {
              data.splice(k, 1);
              k--;
          }
      }
    }
    for (var i in data) {
      data[i].menu = [];
      for (var j in this.Menu){
          if(data[i].idsoftware == this.Menu[j].idsoftware){
            data[i].menu.push({'idmenu':this.Menu[j].idmenu, 'menu':this.Menu[j].menu});
          }
      }
    }

    this.datos = data;
  }

  selectMenu(id: any): void {
    this.datosMenu = [];
    this.datosMenu = this.datos.filter(value => value.idsoftware === parseInt(id))[0].menu;
  }

  crear() {
    this.solicitud.consulta = 2;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idsoftware = 0;
    this.solicitud.idmenu = 0;
    this.solicitud.estado = 0;
    this.solicitud.crear = 0;
    this.solicitud.editar = 0;
    this.solicitud.eliminar = 0;
    this.solicitud.principal = 0;

    this.titulo_modal = 'Crear';
    document.getElementById('formulario').style.display = 'block';
  }

  editar(data: MenuUsuario) {
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.idmenu = data.idmenu;
    this.solicitud.idsoftware = data.idsoftware;
    this.solicitud.estado = data.estado;
    this.solicitud.crear = data.crear;
    this.solicitud.editar = data.editar;
    this.solicitud.eliminar = data.eliminar;
    this.solicitud.principal = data.principal;
    this.run();
    this.titulo_modal = 'Editar';
  }

  eliminar(data: MenuUsuario) {
    this.solicitud.consulta = 4;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idsoftware = data.idsoftware;
    this.solicitud.idmenu = data.idmenu;
    this.solicitud.nombre = data.software;

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
    else if(a.idmenu < 1){
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