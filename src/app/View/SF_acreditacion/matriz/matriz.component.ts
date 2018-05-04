import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { RestService, Parametros, acreditacion, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

import { CrearMatrizComponent, UsuarioMatrizComponent } from './export';

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css']
})
export class MatrizComponent implements OnInit {
  /*
   ViewChild:
              Decoradores de propiedades: 
              nos permite el uso de bindings para el manejo de entrada o salida de información dentro de un componente.
  
              Se llama desde el PadreComponent queremos llamar un método que está en HijoComponent 
              entonces deberíamos importar ViewChild en PadreComponent.
  
              El decorador ViewChild no solo es para la comunicación entre componentes, 
              con este decorador también poder obtener el valor de un input, manejar directivas o etiquetas HTML
  */

  // instancia de los componentes (hijos) para ejecutar los metodos desde el actual componente (Padre).
  @ViewChild(UsuarioMatrizComponent) UsuarioMatriz: UsuarioMatrizComponent;
  @ViewChild(CrearMatrizComponent) CrearMatriz: CrearMatrizComponent;


  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  matriz: acreditacion;
  entidades: acreditacion;
  esquemas: acreditacion;
  titulo_modal: string;
  mostrar: boolean;
  filtro: string;

  breadcrumbArray = [];
  titulo: string;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService) { }

  ngOnInit() {
    this.titulo = 'Matriz';
    this.breadcrumbArray = [{ titulo: this.titulo, nombre: this.titulo, ruta: '../home/Matriz', datos: '' }];

    this.solicitud.metodo = 1;
    this.solicitud.consulta = 2;
    this.solicitud.idmatriz = 0;
    this.solicitud.identidad = null;
    this.run();
  }

  run() {
    this.flag_envio = true;
    this.solicitud.estado = (this.solicitud.estado) ? 1 : 0;
    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          if (datos.data[0][0] === 0) {
          }
          else {
            this.matriz = datos.data;
          }

          if (this.solicitud.consulta === 1) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 3 || this.solicitud.consulta === 8) {
            this.notify.success('Proceso exitoso', 'Registro Actualizado.', this.optionconfig);
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.matriz = datos.data;
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
          document.getElementById('formulario').style.display = 'none';
          document.getElementById('usuarioMatriz').style.display = 'none';
        }
      }
    )
  }

  actualiza_estado_matriz(data: acreditacion) {
    this.solicitud.metodo = 1;
    this.solicitud.consulta = 8;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.estado = (!data.estado) ? 1 : 0;
    this.solicitud.idsecuencia = data.idsecuencia;
    this.solicitud.idmatriz = data.idmatriz;
    this.run();
  }

  crear() {
    this.solicitud.metodo = 1;
    this.solicitud.consulta = 1;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.titulo_modal = 'CREAR MATRIZ';
    /* 
      Ejecuta el metodo 'crearMatriz(prm)' del componente hijo  UsuarioMatrizComponent, para reunir los parametros
    */
    this.CrearMatriz.crearMatriz(this.solicitud);
  }

  editar(data: acreditacion) {
    this.solicitud.metodo = 1;
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.vigencia_inicio = data.vigencia_inicio;
    this.solicitud.vigencia_fin = data.vigencia_fin;
    this.solicitud.idesquema = data.idesquema;
    this.solicitud.descripcion = data.descripcion;
    this.solicitud.nombre = data.nombre;
    this.solicitud.identidad = data.identidad;
    this.solicitud.idsecuencia = data.idsecuencia;

    this.titulo_modal = 'ACTUALIZAR MATRIZ';
    /* 
      Ejecuta el metodo 'editarMatriz(prm)' del componente hijo  UsuarioMatrizComponent, para reunir los parametros
    */
    this.CrearMatriz.editarMatriz(this.solicitud);
  }

  eliminar(data: acreditacion) {
    if (confirm("Desea eliminar esta Matriz! Asegurese de que no tenga Datos enlazados.")) {
      this.solicitud.consulta = 4;
      this.solicitud.idsecuencia = data.idsecuencia;
      this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

      this.run();
    }
  }

  addperson(data: acreditacion) {
    this.solicitud.metodo = 1;
    this.solicitud.consulta = 10;
    this.solicitud.idmatriz = data.idmatriz;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.titulo_modal = 'GESTOR DE USUARIOS';
    /*
        Ejecuta el metodo 'Consulta_usuarios(prm)' del componente hijo  UsuarioMatrizComponent (ubicacion: ->/controles/acreditacion).
        Consulta la lista de usuarios y gestiona los permisos a la vista desde UsuarioMatrizComponent (componente hijo).
    */
    this.UsuarioMatriz.Consulta_usuarios(this.solicitud);
  }

  guardar(data) {
    /* 
      Recibe los parametros devueltos del componente hijo CrearMatrizComponent, Este componente gestiona la Matriz(crea, edita).
    */
    this.solicitud = JSON.parse(data);
    this.run();
  }

  open(data: acreditacion, vista: string) {
    const arreglo = {
      idmatriz: data.idmatriz,
      identidad: data.identidad,
      idesquema: data.idesquema,
      idsecuencia: data.idsecuencia,
      imagen: data.imagen,
      navegacion: this.breadcrumbArray
    }

    const paramatros = btoa(JSON.stringify(arreglo));
    // Verifica a que vista se dirije.
    if (vista == 'autoevaluacion') {
      this.router.navigate(['./home/autoevaluacion', paramatros]);
    }
    else if (vista == 'proyectos') {
      this.router.navigate(['./home/proyectos', paramatros]);
    }
  }
}
