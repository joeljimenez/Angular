import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RestService, Parametros, acreditacion, OpcionesNotifi, Permisos, solicitudes } from '../../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-usuario-matriz',
  templateUrl: './usuario-matriz.component.html',
  styleUrls: ['./usuario-matriz.component.css']
})
export class UsuarioMatrizComponent implements OnInit {
  @Input() tituloModal: string;
  @Output() guardar: EventEmitter<any> = new EventEmitter();

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  matriz_usuario: acreditacion;
  filtro: string;

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService) {}

  ngOnInit() {
  }

  run() {
    this.flag_envio = true;
    this.solicitud.estado = (this.solicitud.estado)? 1:0;
    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.matriz_usuario = datos.data;
          if (this.solicitud.consulta === 1) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro Actualizado.', this.optionconfig);
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.matriz_usuario = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 2) {
              this.notify.success('Proceso exitoso', 'Registro no existe', this.optionconfig);
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {
        if (this.solicitud.consulta >= 1) {
          // document.getElementById('formulario').style.display = 'none';
          // document.getElementById('usuarioMatriz').style.display = 'none';
        }
      }
    )


  }

  Consulta_usuarios(data: any){
    this.solicitud = data;    
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.run();
    
    document.getElementById('usuarioMatriz').style.display = 'block';
  }

  activa_usuario(data: acreditacion){
    this.solicitud.consulta = -1;
    this.solicitud.metodo = 1;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idmatriz = data.idmatriz;
    this.solicitud.estado = (!data.estado) ? 1 : 0;
    this.solicitud.id_usuario_rpt = data.id_usuario;

    if(this.solicitud.estado === 1){
      this.solicitud.consulta = 11; //inserta
    }else{
      this.solicitud.consulta = 12; //elimina
    }

    this.run();
  }
}
