import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, Usuario, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;

  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  permisos = new Permisos().access; // permisos globales de la pantalla
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: Usuario;
  titulo_modal: string;
  filter: any;
  titulo_padre: string;
  params: any;
  idsede:0;
  nombre:'';
  colegio:'';
  titulo:string;
  breadcrumbArray = [];
  filtro: string;
  constructor(private rest: RestService,
    private router: Router,
    private _service: NotificationsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.filter = 0;
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.solicitud.idcompany = JSON.parse(atob(params['data'])).idcompany;
          this.solicitud.idsede = JSON.parse(atob(params['data'])).idsede;
          this.titulo_padre = JSON.parse(atob(params['data'])).nombre_sede;
          this.colegio = JSON.parse(atob(params['data'])).nombre_company;
          this.params = JSON.parse(atob(params['data']));

          this.titulo = 'Usuarios ' + ' ('+ this.colegio +' - '+ this.titulo_padre +')';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/Usuarios', datos: JSON.parse(atob(params['data']))});

        } catch (error) {

          this.router.navigate(['./home/Sedes'])
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/Sedes'])
      }
    });

    this.solicitud.consulta = 1;
    this.solicitud.metodo = 13;
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

        this.solicitud.es_estudiante = (this.solicitud.es_estudiante)? 1:0;
        this.solicitud.es_administrativo = (this.solicitud.es_administrativo)? 1:0;
        this.solicitud.es_profesor = (this.solicitud.es_profesor)? 1:0;
        this.solicitud.estado = (this.solicitud.estado)? 1:0;

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

  crear() {
    this.solicitud.consulta = 2;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.es_estudiante = 0;
    this.solicitud.es_administrativo = 0;
    this.solicitud.es_profesor = 0;
    this.solicitud.estado = 0;
    this.solicitud.nombre = '';
    this.solicitud.apellido = '';
    this.solicitud.cedula =''
    this.solicitud.mail = '';
    this.solicitud.password = '';

    this.titulo_modal = 'Crear Usuario';
    document.getElementById('formulario').style.display = 'block';
  }

  editar(data: Usuario) {
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idusuario = data.idusuario;
    this.solicitud.es_estudiante = data.es_estudiante;
    this.solicitud.es_administrativo = data.es_administrativo;
    this.solicitud.es_profesor = data.es_profesor;
    this.solicitud.estado = data.estado;
    this.solicitud.nombre = data.nombre;
    this.solicitud.apellido = data.apellido;
    this.solicitud.cedula = data.cedula;
    this.solicitud.mail = data.mail;
    this.solicitud.password = data.password;
    document.getElementById('formulario').style.display = 'block';
    this.titulo_modal = 'Editar Usuario';
  }

  eliminar(data: Usuario) {
    this.solicitud.consulta = 4;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.id_usuario = data.idusuario;
    this.solicitud.nombre = data.nombre;
    document.getElementById('eliminar').style.display = 'block';
    this.titulo_modal = 'Eliminar Software';
  }

  open(data: Usuario, numero) {

    const arreglo = {
      idcompany: data.idcompany,
      idsede: data.idsede,
      idusuario: data.idusuario,
      nombre: data.nombre +' '+ data.apellido,
      nombre_company:this.colegio,
      sede: this.titulo_padre,
      navegacion: this.breadcrumbArray
    }
    const paramatros = btoa(JSON.stringify(arreglo));
    if(numero == 1){
      this.router.navigate(['./home/Company-Software', paramatros]);
    }
    else{
      this.router.navigate(['./home/Menu-Usuario', paramatros]);
    }
  }


  validacion() {
    const a = this.solicitud;
    let retorno = true;


    if (a.nombre.length < 1) {
      this.Show_notificacion(2, 'Completar campos', 'Por favor coloque un nombre a la caja.')
      retorno = false;
    }
    else if(a.cedula.length < 1){
      this.Show_notificacion(2, 'Completar campos', 'Por favor coloque un nombre a la caja.')
      retorno = false;
    }
    else if(a.apellido.length < 1){
      this.Show_notificacion(2, 'Completar campos', 'Por favor coloque un nombre a la caja.')
      retorno = false;
    }
    else if(a.mail.length < 1){
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
