import { Component, OnInit, Pipe } from '@angular/core';
import { RestService, Parametros, solicitudes, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { CorrectorPipe } from '../../../pipes/export';

@Component({
  selector: 'app-solicitud-tesis-prof',
  templateUrl: './solicitud-tesis-prof.component.html',
  styleUrls: ['./solicitud-tesis-prof.component.css'],
})
export class SolicitudTesisProfComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;

  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  permisos = new Permisos().access; // permisos globales de la pantalla
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: solicitudes;
  titulo_modal: string;
  estados:any;
  mensaje:string;
  load: boolean;
  titulo:string;
  breadcrumbArray = [];
  filtro: string;
  constructor(private rest: RestService, private router: Router, private _service: NotificationsService) { }

  ngOnInit() {
    this.titulo = 'Trabajo de graduación';
    this.breadcrumbArray = [{titulo: this.titulo, nombre: this.titulo, ruta:'../home/Solicitud-Tesis-Prof', datos:''}];

    this.load = false;
    this.estados = [
      { id: 'RE1', nombre: 'COMENTARIOS PARA CORRECCIÓN' },
      { id: 'APE', nombre: 'TEMA APROBADO' },
      { id: 'RTO', nombre: 'TEMA RECHAZADO' }
      ]

    this.solicitud.profesor = JSON.parse(atob(localStorage._tokentUser)).profesor.trim();
    //this.solicitud.profesor = '15334';
    this.solicitud.metodo = 7;
    this.solicitud.consulta = 1;
    this.solicitud.proceso = 5;
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

    this.rest.GestionSolicitudes(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.rest.NuevoTokent(datos.tokent);
          let dataString = CorrectorPipe.prototype.transform(JSON.stringify(datos.data));
          this.respuesta = JSON.parse(dataString);
         // this.respuesta = datos.data;

          if (this.solicitud.consulta === 3) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro actualizado con éxito')
          }
          else if (this.solicitud.consulta === 2) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro insertado con éxito')
          }
          if (this.solicitud.consulta === 4) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito')
          }
          if(this.solicitud.proceso === 7){
            this.load = false;
            this.Show_notificacion(1, 'Proceso exitoso', 'Su respuesta ha sido enviada  al estudiante')
            this.solicitud.proceso = 0;
            this.mensaje = '  <p>Estimado Decano / Coordinador. </p>  ' +
                           ' <p> Su respuesta ha sido enviada  al estudiante ' + this.solicitud.nombre_principal + '  </p>   ' +
                           ' <p>Gracias por utilizar este proceso. </p>   ' +
                           '<br/>' +
                           '<p>Saludos cordiales. </p>  ';
            document.getElementById('alerta').style.display = 'block';
          }
        }
        else {
          this.load = false;
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
          document.getElementById('mensaje').style.display = 'none';
          document.getElementById('alerta').style.display = 'none';
        }
      }
    )
  }
  
  enviar_solicitud(data: solicitudes){
    this.solicitud.proceso = 7;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.id_solicitud = data.id_solicitud;
    this.solicitud.titulo = data.titulo;
    this.solicitud.aportes = data.aportes;
    this.solicitud.obj_especifico = data.obj_especifico;
    this.solicitud.obj_general = data.obj_general;
    this.solicitud.problema_investigar = data.problema_investigar;
    this.solicitud.razon_tema = data.razon_tema;
    this.solicitud.tema = data.tema;
    this.solicitud.dir_nom = data.dir_nom;
    this.solicitud.ju_nom = data.ju_nom;
    this.solicitud.jua_nom = data.jua_nom;
    this.solicitud.es_solicitante = 1;
    this.solicitud.director = data.director;
    this.solicitud.jurado = data.jurado;
    this.solicitud.jurado_alterno = data.jurado_alterno;
    this.solicitud.id_linea_inv = data.id_linea_inv;
    this.solicitud.correo = data.correo_principal;
    this.solicitud.observacion_director = data.observacion_director;
    this.solicitud.mensaje = '';
    this.solicitud.nombre_principal = data.nombre_principal;
    this.solicitud.dec_nom = data.dec_nom;
    this.solicitud.sede = data.sede;

    this.solicitud.cod_facultad = data.facultad;
    this.solicitud.cod_carrera = data.carrera;
    this.solicitud.cod_enfasis = data.enfasis;
    this.solicitud.cod_plan = data.plan_estudio;


    this.titulo_modal = "Datos de la solicitud"
    this.mensaje =' <p>Estimado Decano / coordinador.</p>  ' +
                  ' <p>Seleccione el tipo de respuesta a enviar y detalle sus observaciones. Una vez enviada no podrá editar su contenido. </p>   ' +
                  ' <hr /> ';
    document.getElementById('mensaje').style.display = 'block';
  }
  guardar_envio_solicitud(){

    if(this.solicitud.estado_sol === null || this.solicitud.estado_sol === "")
    {
      this.Show_notificacion(2, 'Error controlado', 'Debe seleccionar un tipo de respuesta');
      return false;
    }

    if(this.solicitud.estado_sol === "RE1" && this.solicitud.mensaje === "")
    {
      this.Show_notificacion(2, 'Error controlado', 'Debe escribirle un mensaje al estudiante');
      return false;
    }

    if(this.solicitud.estado_sol === "APE"){
      if(this.solicitud.director === null  || this.solicitud.director.trim() === ""){
        this.Show_notificacion(2, 'Error controlado', 'Antes de aprobar el tema debe seleccionar el director.');
        return false;
      }
      if(this.solicitud.jurado === null || this.solicitud.jurado.trim() === ""){
        this.Show_notificacion(2, 'Error controlado', 'Antes de aprobar el tema debe seleccionar el jurado.');
        return false;
      }
      if(this.solicitud.id_linea_inv === null || this.solicitud.id_linea_inv === 0){
        this.Show_notificacion(2, 'Error controlado', 'Antes de aprobar el tema debe seleccionar la línea de investigación.');
        return false;
      }
    }

    
    if(this.solicitud.mensaje.length > 1){
      var fecha = new Date();
      if(this.solicitud.observacion_director == null){
        var count = 1;
      }else{
        var count = this.solicitud.observacion_director.split('º').length;
      }
      this.solicitud.observacion_director = this.solicitud.observacion_director + count + '|' + this.solicitud.dec_nom + '| Coordinador |' + fecha.getDate() + '/' + fecha.getMonth() + '/' + fecha.getFullYear() + '  ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds() + '|' + this.solicitud.mensaje + '°';
    }
      var fecha = new Date();


    var msj = '<p>Estimado(a) estudiante</p>' +
              '<p>Respuesta del coordinador. </p>' +
              ' <blockquote> ' +
              ' <p>' + this.solicitud.mensaje + '</p> ' +
              ' <small>Coordinador : <cite>' + this.solicitud.dec_nom + '</cite></small> ' +
              ' <small><b>' + fecha.getDate() + '/' + fecha.getMonth() + '/' + fecha.getFullYear() + '  ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds() + '</b></small> ' +
              ' </blockquote> ' +
              '<br/><br/><p>Por favor no responder a este correo. </p>' +
              '<br/><br/><p>Saludos cordiales.</p>';

    this.solicitud.mensaje = msj;
    this.solicitud.mensajeAPE = "<p>" + this.solicitud.dec_nom + " aprobó la solicitud de tesis del estudiante <b>"+ this.solicitud.nombre_principal +"</b><br>"+
                                "Título del tema: <b>"+ this.solicitud.titulo+"</b></p>"+
                                "<br/><br/><p>Por favor no responder a este correo. </p>"+
                                "<br/><br/><p>Saludos cordiales.</p>";

    this.run();
    this.load = true;
    document.getElementById('mensaje').style.display = 'none';

  }

  open(data: solicitudes) {
    data.est_vista = true;
    data.detalleProf = 1;
    data.navegacion = this.breadcrumbArray;
    const paramatros = btoa(JSON.stringify(data));
    this.router.navigate(['./home/Datos-Solicitud-Tesis', paramatros]);
  }

  detalle(data) {
    data.est_vista = false;
    data.detalleProf = 1;
    data.navegacion = this.breadcrumbArray;
    const paramatros = btoa(JSON.stringify(data));
    this.router.navigate(['./home/Datos-Solicitud-Tesis', paramatros]);
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
    else if(tipo === 3){
      this._service.warn(titulo, mensaje, this.optionconfig);
    }
  }
}
