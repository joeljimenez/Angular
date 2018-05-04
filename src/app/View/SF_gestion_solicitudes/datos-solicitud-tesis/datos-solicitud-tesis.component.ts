import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, Parametros, solicitudes, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { CorrectorPipe } from '../../../pipes/export';

@Component({
  selector: 'app-datos-solicitud-tesis',
  templateUrl: './datos-solicitud-tesis.component.html',
  styleUrls: ['./datos-solicitud-tesis.component.css']
})
export class DatosSolicitudTesisComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: solicitudes;
  profesores: solicitudes;
  lineaInvestigacion: solicitudes;
  titulo_modal: string;
  titulo_padre: string;
  data:solicitudes;
  mensaje:string;
  conversacion =[];
  est_vista:boolean;
  detalleProf:number;
  historia_bitacora:solicitudes;
  estados: solicitudes;
  load: boolean;
  titulo:string;
  breadcrumbArray = [];
  constructor(private rest: RestService, private router: Router, private _service: NotificationsService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.titulo = 'Detalle de la Solicitud';
    this.load = false;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
        this.data = JSON.parse(atob(params['data']));
        this.solicitud.cod_carrera = JSON.parse(atob(params['data'])).carrera;
        this.solicitud.cod_facultad = JSON.parse(atob(params['data'])).facultad;
        this.solicitud.cod_enfasis = JSON.parse(atob(params['data'])).enfasis;
        this.solicitud.cod_plan = JSON.parse(atob(params['data'])).plan_estudio;
        this.est_vista = JSON.parse(atob(params['data'])).est_vista;
        this.detalleProf = JSON.parse(atob(params['data'])).detalleProf;

        
        this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
        this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/Datos-Solicitud-Tesis', datos: JSON.parse(atob(params['data']))});
      } catch (error) {
          window.history.back();
        }
      }
      // tslint:disable-next-line:one-line
      else {
        window.history.back();
      }
    
    });
    this.solicitud.consulta = 1;
    this.solicitud.metodo = 7;
    this.solicitud.proceso = 8;
    this.solicitud.id_linea_inv = 10
    this.consulta_linea_inv();

    this.solicitud.consulta = 1;
    this.solicitud.metodo = 7;
    this.solicitud.proceso = 6;
    this.consulta_profesores();

  }

  run() {
    this.flag_envio = true;
        if (this.solicitud.consulta === 3 || this.solicitud.consulta === 2) {
          if (!this.validacion()) {
            this.flag_envio = false;
            return false;
          }
        }

    this.rest.GestionSolicitudes(this.solicitud).subscribe(
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
          if(this.solicitud.proceso === 1 || this.solicitud.proceso === 3){
            this.titulo_modal = 'Información';
            this.mensaje =' <p>Estimado Decano / Coordinador. </p>  ' +
                          ' <p> El director y el jurado del tema han sido registrados. Aun no se le ha enviado la respuesta al estudiante. </p>   ' +
                          ' <p>Cuando esté preparado para enviar,  tendrá que presionar el botón de envío. <br/> Aparecerá un pantalla y tendrá que colocarle un mensaje al estudiante, seleccionar el tipo de respuesta. </p>   ' +
                          ' <p>Una vez enviado el contenido, no podrá ser editado hasta que el estudiante responda su solicitud. </p>   ' +
                          ' <br/>' +
                          ' <p>Saludos cordiales. </p>  ';

            document.getElementById('mensaje_informativo').style.display = 'block';
            this.Show_notificacion(1, 'Proceso exitoso', 'El director y el jurado han sido registrados');
            //this.router.navigate(['./home/Solicitud-Tesis-Prof']);
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
            if (this.solicitud.proceso === 1 || this.solicitud.proceso === 3) {
              this.Show_notificacion(2, 'Error', 'No se guardaron los cambios')
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

  consulta_linea_inv(){
    this.flag_envio = true;
    
        this.rest.GestionSolicitudes(this.solicitud).subscribe(
          (rs) => {
            this.flag_envio = false;
            const datos = JSON.parse(rs.text());
            if (datos.exito) {
              this.rest.NuevoTokent(datos.tokent)
              this.lineaInvestigacion = datos.data;
            }
            // tslint:disable-next-line:one-line
            else {
              if (datos.error === '0') {
                this.lineaInvestigacion = datos.data;
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
  consulta_profesores(){
    this.flag_envio = true;
    
        this.rest.GestionSolicitudes(this.solicitud).subscribe(
          (rs) => {
            this.flag_envio = false;
            const datos = JSON.parse(rs.text());
            if (datos.exito) {
              this.rest.NuevoTokent(datos.tokent)
              this.profesores = datos.data;
            }
            // tslint:disable-next-line:one-line
            else {
              if (datos.error === '0') {
                this.profesores = datos.data;
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
  enviar_correo() {
    this.load = true;
    this.flag_envio = true;
    this.rest.GestionSolicitudes(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.load = false;
          this.rest.NuevoTokent(datos.tokent);
          this.Show_notificacion(1, 'Proceso exitoso', 'Correo enviado con éxito');
        }
        // tslint:disable-next-line:one-line
        else {
          this.load =false;
          if (datos.error === '0') {
            this.estados = datos.data;
          }
          if (this.solicitud.consulta === 2) {
            this.Show_notificacion(2, 'Envio de correo', datos.mensaje);
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
    if (this.solicitud.consulta > 1) {
      document.getElementById('comunicar').style.display = 'none';
    }
  }
  
  editar(data: solicitudes) {
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.cod_facultad = data.facultad;
    this.solicitud.cod_carrera = data.carrera;

    this.solicitud.cod_enfasis = data.enfasis;
    this.solicitud.cod_plan = data.plan_estudio;
    
    this.solicitud.id_solicitud = data.id_solicitud;
    this.solicitud.titulo = data.titulo;
    this.solicitud.aportes = data.aportes;
    this.solicitud.obj_especifico = data.obj_especifico;
    this.solicitud.obj_general = data.obj_general;
    this.solicitud.problema_investigar = data.problema_investigar;
    this.solicitud.razon_tema = data.razon_tema;
    this.solicitud.tema = data.tema;
    this.solicitud.es_solicitante = 1;
    this.solicitud.director = data.director;
    this.solicitud.jurado = data.jurado;
    this.solicitud.jurado_alterno = data.jurado_alterno;
    this.solicitud.id_linea_inv = data.id_linea_inv;
    this.solicitud.sede = data.sede;

    
    if(this.solicitud.director === "" || this.solicitud.director === null ||this.solicitud.director.length === 0 ){
      this.solicitud.director = "";
    }
    if(this.solicitud.jurado === "" || this.solicitud.jurado === null ||this.solicitud.jurado.length === 0 ){
      this.solicitud.jurado = "";
    }
    if(this.solicitud.jurado_alterno === "" || this.solicitud.jurado_alterno === null ||this.solicitud.jurado_alterno.length === 0 ){
      this.solicitud.jurado_alterno = "";
    }
    if(this.solicitud.id_linea_inv === 0 || this.solicitud.id_linea_inv === null){
      this.solicitud.id_linea_inv = 0;
    }

    if(this.solicitud.director === this.solicitud.jurado){
      this.Show_notificacion(2, 'Error', 'El director no puede ser jurado');
      return false;
    }

    this.solicitud.estado_sol = 'PRA';
    this.solicitud.proceso = 3;
    this.run();

  }

  comunicar(a){
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.correo_destinatario ='';
    this.solicitud.envio = a.envio;
    this.solicitud.id_correos_envio = 1;
    this.solicitud.asunto = 'Universidad Latina de Panamá';
    this.solicitud.archivos = '';

    if(a.envio == 'EST'){ 
      this.solicitud.mensaje = a.mensaje_estado;
      if(a.correo_principal != null){
        this.solicitud.correo_destinatario = a.correo_principal;
      }
    }
    else
    { 
      this.solicitud.mensaje = a.mensaje_estado;      
      if(a.correo_decano != null || a.correo_decano != ""){
        this.solicitud.correo_destinatario = a.correo_decano;
      }
      if(a.correo_director != null || a.correo_decano != ""){
        this.solicitud.correo_destinatario += ';' + a.correo_director;
      }
    }
    this.solicitud.metodo = 5 // envia_correo
    this.solicitud.consulta = 2;

    document.getElementById('comunicar').style.display = 'block';
    this.titulo_modal = 'Comunicar al responsable';
    

  }

  historia(a){
    this.historia_bitacora = a.bitacoras;
    document.getElementById('historial').style.display = 'block';
    this.titulo_modal = 'Historia de la solicitud';
  }

  arma_mensajes(a){
    this.conversacion = [];
    const msj = a.split('°');
    var msj_push = [];
    for (var i in msj) {
        if (msj[i].length > 10) {
            msj_push = msj[i].split('|');
            this.conversacion.push({
                id: msj_push[0],
                nombre: msj_push[1],
                puesto: msj_push[2],
                fecha: msj_push[3],
                mensaje: msj_push[4],
            })
        }

    }
    this.titulo_modal = "Observaciones"
    document.getElementById('chat').style.display = 'block';
  }

  validacion() {
    const a = this.solicitud;
    let retorno = true;
    if (a.cedula.length < 1) {
      this.Show_notificacion(2, 'Completar campos', 'Por favor coloque un cedula a la caja.')
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
