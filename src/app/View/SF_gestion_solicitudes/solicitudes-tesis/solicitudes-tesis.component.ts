import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, solicitudes, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { CorrectorPipe } from '../../../pipes/export';

@Component({
  selector: 'app-solicitudes-tesis',
  templateUrl: './solicitudes-tesis.component.html',
  styleUrls: ['./solicitudes-tesis.component.css'],
})
export class SolicitudesTesisComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;

  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  permisos = new Permisos().access; // permisos globales de la pantalla
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: solicitudes;
  estados: solicitudes;
  bitacoras: solicitudes;
  titulo_modal: string;
  dataArr = [];
  filter: any;
  conversacion = []; 
  mensaje_estado ='';
  dias = 0;
  data:solicitudes;
  historia_bitacora:solicitudes;
  mensaje_estado_bool:boolean;
  valida_fechas: boolean;
  estado:string;
  load:boolean;
  string:string;
  titulo: string;
  breadcrumbArray = [];
  filtro: string;
  constructor( private rest: RestService, private router: Router, private _service: NotificationsService) { }

  ngOnInit() {
    this.titulo = 'Solicitud de Tesis';
    this.breadcrumbArray = [{titulo: this.titulo, nombre: this.titulo, ruta:'../home/solicitud-tesis', datos:''}];

    this.load = false;
    this.filter= "";
    this.mensaje_estado_bool= false;
    this.valida_fechas=false;
    this.estado = "";
    this.solicitud.metodo = 1;
    this.solicitud.consulta = 1;
    this.run();
  
    this.solicitud.metodo = 2;
    this.Estados();
    
  }

  // Consultas
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
         //this.respuesta = datos.data;
         let dataString = CorrectorPipe.prototype.transform(JSON.stringify(datos.data));
         this.respuesta = JSON.parse(dataString);
         this.dataArr = this.arregloSolicitud(this.respuesta);
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
  Estados() {
    this.flag_envio = true;

    this.rest.GestionSolicitudes(this.solicitud).subscribe(
      (rs) => {
        //this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.estados = datos.data;
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.estados = datos.data;
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
  buscar(){
    if (!this.validacion()) {
      this.flag_envio = false;
      return false;
    }else{
      this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
      this.solicitud.metodo = 3;
      this.run();

      this.solicitud.fecha_inicio = null;
      this.solicitud.fecha_fin = null;
      this.solicitud.cedula_est = '';
      this.filter= "";
      this.estado = '1'; 
    }
    
  }
  buscar_fecha(){
    if(this.solicitud.fecha_inicio > this.solicitud.fecha_fin){
        this.valida_fechas = true;
    }
    else{
          this.solicitud.metodo = 6;
          this.solicitud.consulta = 1
          this.run();

          this.solicitud.cedula = '';
          this.filter= "";
          this.estado = '1'; 
    }
  }
  todos(){
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_fin = null;
    this.solicitud.cedula_est = '';
    this.filter= "";
    this.estado = '1'; 
    
    this.solicitud.metodo = 1;
    this.run();
  }

  // Mostrar datos en la vista.
  arregloSolicitud(arr){
    this.dataArr = [];
    for (let i  in arr) {
      this.dataArr.push(arr[i]);
    }
    for (var l = 0;l <  this.dataArr.length; l++) {
      //data[l].bitacoras = [];
      for (var k = l + 1; k < this.dataArr.length; k++) {
          if (this.dataArr[l].id_solicitud == this.dataArr[k].id_solicitud) {
            this.dataArr.splice(k, 1);
              k--;
          }
      }
      }
      for (var i in  this.dataArr) {
      this.dataArr[i].bitacoras = [];
      for (var j in arr){
          if(this.dataArr[i].id_solicitud == arr[j].id_solicitud){
            this.dataArr[i].bitacoras.push({'id_solicitud_bitacora':arr[j].id_solicitud_bitacora,
                                    'id_secuencia_bitacora':arr[j].id_secuencia_bitacora,
                                    'estado_solicitud_bitacora':arr[j].estado_solicitud_bitacora,
                                    'fecha_bitacora':arr[j].fecha_bitacora,'estado_bitacora':arr[j].estado_bitacora
                                    });
          }
      }

      this.dataArr[i].mensaje_estado_bool = false;

      let last_conv = this.dataArr[i].bitacoras.length-1;
      var dias = this.getDias(this.dataArr[i].bitacoras[last_conv]);
      this.dataArr[i].dias = dias;
      if(this.dataArr[i].estado_solicitud == this.dataArr[i].bitacoras[last_conv].estado_solicitud_bitacora){
        
         if(dias > 3){
          this.dataArr[i].mensaje_estado_bool = true;
          this.dataArr[i].btn_estado_bool = true;
          this.dataArr[i].envio = 'EST';
          this.dataArr[i].aviso = 'Aviso para el Estudiante';

           switch(this.dataArr[i].bitacoras[last_conv].estado_solicitud_bitacora){
             case 'EMI'://correo:director, decano
             this.dataArr[i].aviso = 'Aviso para el Profesor';
             this.dataArr[i].mensaje_estado = 'El estudiante '+ this.dataArr[i].nombre_principal +' emitió la solicitud del trabajo de graduación'
                                              +' con título "'+ this.dataArr[i].titulo +'", cual lleva más de 3 días registrada en el sistema de matrícula de la Universidad Latina de Panamá '
                                              +' y se encuentra sin respuesta del decano o director. El estudiante está en espera de su respuesta.';
             this.dataArr[i].envio = 'PROF'; 
             break;
             case 'ING'://correo:estudiante
             this.dataArr[i].mensaje_estado = ' Ha registrado una solicitud de trabajo de graduación en el sistema de matrícula de la Universidad Latina de Panamá, cual lleva mas de 3 días y no ha enviado'
                                              +', por favor proceda a enviar la solicitud al coordinador(a) o decano(a) para que pueda ser revisada.';
             break;
             case 'PRA'://correo:director, decano
             this.dataArr[i].aviso = 'Aviso para el Profesor';
             this.dataArr[i].mensaje_estado = 'El estudiante '+ this.dataArr[i].nombre_principal +' emitió la solicitud del trabajo de graduación'
                                              +' con título "'+ this.dataArr[i].titulo +'",cual lleva más de 3 días registrada en el sistema de matrícula de la Universidad Latina de Panamá '
                                              +' y se encuentra sin respuesta del decano o director. El estudiante está en espera de su respuesta.';
             this.dataArr[i].envio = 'PROF';
             break;
             case 'RE1'://correo:estudiante
             this.dataArr[i].mensaje_estado = 'El profesor respondió a su solicitud y se encuentra en espera de los cambios solicitados '
                                              +'(ver comentarios de corrección por parte del profesor).';
             break;
             case 'RTO'://correo:estudiante
             this.dataArr[i].btn_estado_bool = false;
             this.dataArr[i].mensaje_estado_bool = false;
             break;
           }
     
         }
   
       }

      }
    return this.dataArr;
  }
  
  getDias(a){
    var f = new Date();
    
        let f_data = a.fecha_bitacora.split('T')[0];
        let f_1 = f_data.split('-'); 
    
        var fecha1 = new Date(parseInt(f_1[0]), parseInt(f_1[1]), parseInt(f_1[2]) );
        var fecha2 = new Date(f.getFullYear(), (f.getMonth()+1), f.getDate());
        var diasDif = fecha2.getTime() - fecha1.getTime();
        var dias = Math.round(diasDif/(1000 * 60 * 60 * 24));
        return dias;
  }

  open(data) {
    data.est_vista = false;
    data.detalleProf = 0;
    data.navegacion = this.breadcrumbArray;
    const paramatros = btoa(JSON.stringify(data));
    this.router.navigate(['./home/Datos-Solicitud-Tesis', paramatros]);
  }

  selecEstado(a){
    this.estado = '';
    this.filter = a;
  } 

  validacion() {
    const a = this.solicitud;
    let retorno = true;


    if (a.cedula_est.length < 1) {
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
