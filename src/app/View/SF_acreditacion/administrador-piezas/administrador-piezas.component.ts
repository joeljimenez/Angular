import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, acreditacion, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-administrador-piezas',
  templateUrl: './administrador-piezas.component.html',
  styleUrls: ['./administrador-piezas.component.css']
})
export class AdministradorPiezasComponent implements OnInit {

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  titulo_modal: string;

  piezas = [];

  titulo: string;
  breadcrumbArray = [];
  prm: any;

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) {
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_cierre = null;
  }

  /*
  ** ngOnInit():  
          se ejecuta la validacion de prm.vista, esta variable contiene la vista en donde se encuentra ya sea pieza o pieza de proyecto, 
          se realizo de esta manera ya que en las dos vista se hace los mismo, 
          lo unico diferente son los marametros Metodo, consulta, anexo_3 y tres mas.. 
          Se valida para saber cual es el metodo y la consulta a ejecutar
  
  ** valida_vista(parametro): 
          recibe un parametro indicando que metodo se ejecuta para enviarle el numero de consulta correcta ç
          dependiendo la vista en que se encuenta (pieza, pieza_proyecto).

  En el HTML existen dos 'ul' con un *ngIf(prm.vista) para mostrar el correcto.
  lo demas es igual.
   */

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.prm = JSON.parse(atob(params['data']));
          this.titulo = this.prm.nombre;
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({ titulo: this.titulo, nombre: this.titulo, ruta: '../home/administrador-piezas', datos: JSON.parse(atob(params['data'])) });

        } catch (error) {
          window.history.back();
        }
      }
      // tslint:disable-next-line:one-line
      else {
        window.history.back();
      }
    });

    this.solicitud.identidad = this.prm.identidad;
    this.solicitud.idesquema = this.prm.idesquema;
    if (this.prm.vista == 'pieza') {
      this.solicitud.metodo = 2;
      this.solicitud.consulta = 500; // 6 = inset 7 = update 8 = delete
      this.Consulta_piezas();
    } else if (this.prm.vista == 'pieza_proyecto') {
      this.solicitud.metodo = 7;
      this.solicitud.consulta = 1;
      this.Consulta_piezas();
    }
  }

  Consulta_piezas() {
    this.flag_envio = true;
    if (this.solicitud.consulta === 7 || this.solicitud.consulta == 6 || this.solicitud.consulta == 3 || this.solicitud.consulta == 2) {
      if (!this.validacion()) {
        this.flag_envio = false;
        return false;
      }
    }

    this.solicitud.esmatriz = (this.solicitud.esmatriz) ? 1 : 0;
    this.solicitud.act_nombre = (this.solicitud.act_nombre) ? 1 : 0;
    this.solicitud.act_descripcion = (this.solicitud.act_descripcion) ? 1 : 0;
    this.solicitud.estado = (this.solicitud.estado) ? 1 : 0;
    this.solicitud.act_hallasgo = (this.solicitud.act_hallasgo) ? 1 : 0;
    this.solicitud.act_categoria = (this.solicitud.act_categoria) ? 1 : 0;
    this.solicitud.act_cripterio = (this.solicitud.act_cripterio) ? 1 : 0;
    this.solicitud.act_evidencia = (this.solicitud.act_evidencia) ? 1 : 0;
    this.solicitud.act_anexo_1 = (this.solicitud.act_anexo_1) ? 1 : 0;
    this.solicitud.act_anexo_2 = (this.solicitud.act_anexo_2) ? 1 : 0;

    this.solicitud.act_anexo_3 = (this.solicitud.act_anexo_3) ? 1 : 0;
    this.solicitud.act_gantt = (this.solicitud.act_gantt) ? 1 : 0;
    this.solicitud.act_objetivo = (this.solicitud.act_objetivo) ? 1 : 0;
    this.solicitud.act_presupuesto = (this.solicitud.act_presupuesto) ? 1 : 0;

    this.solicitud.act_pieza_contenedor_reporte = (this.solicitud.act_pieza_contenedor_reporte) ? 1 : 0;
    this.solicitud.act_pieza_evaluar_reporte = (this.solicitud.act_pieza_evaluar_reporte) ? 1 : 0;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); console.log(datos)
        if (datos.exito) {

          this.piezas = datos.data;

          if (this.solicitud.consulta === 7 || this.solicitud.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 6 || this.solicitud.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 8 || this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.piezas = datos.data;
            if (this.solicitud.consulta === 8) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 1) {
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
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          document.getElementById('formulario').style.display = 'none';
        }
      }
    )
  }

  crear() {
    this.limpiar();
    // this.solicitud.consulta = 6;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.titulo_modal = 'CREAR PIEZA';
    document.getElementById('formulario').style.display = 'block';
  }

  editar(a: any) {
    //this.solicitud.consulta = 7;
    this.valida_vista('editar');
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idpieza = a.idpieza;
    this.solicitud.idpieza_proyecto = a.idpieza_proyecto;

    this.solicitud.descripcion = a.descripcion;
    this.solicitud.nombre = a.nombre;
    this.solicitud.nombre_p = a.nombre_p;

    this.solicitud.esmatriz = a.esmatriz;
    this.solicitud.act_nombre = a.act_nombre;
    this.solicitud.act_descripcion = a.act_descripcion;
    this.solicitud.estado = a.estado;
    this.solicitud.act_hallasgo = a.act_hallasgo;
    this.solicitud.act_categoria = a.act_categoria;
    this.solicitud.act_cripterio = a.act_cripterio;
    this.solicitud.act_evidencia = a.act_evidencia;
    this.solicitud.act_anexo_1 = a.act_anexo_1;
    this.solicitud.act_anexo_2 = a.act_anexo_2;

    // parametros diferentes en la vista pieza_proyecto
    this.solicitud.act_anexo_3 = a.act_anexo_3;
    this.solicitud.act_presupuesto = a.act_presupuesto;
    this.solicitud.act_objetivo = a.act_objetivo;
    this.solicitud.act_gantt = a.act_gantt;


    this.solicitud.act_pieza_evaluar_reporte = a.act_pieza_evaluar_reporte;
    this.solicitud.act_pieza_contenedor_reporte = a.act_pieza_contenedor_reporte;

    if (a.nom_anexo_1 != null) {
      this.solicitud.nom_anexo_1 = a.nom_anexo_1;
    }
    else {
      this.solicitud.nom_anexo_1 = '';
    }

    if (a.nom_anexo_2 != null) {
      this.solicitud.nom_anexo_2 = a.nom_anexo_2;
    }
    else {
      this.solicitud.nom_anexo_2 = '';
    }

    if (a.nom_anexo_3 != null) {
      this.solicitud.nom_anexo_3 = a.nom_anexo_3;
    }
    else {
      this.solicitud.nom_anexo_3 = '';
    }

    this.Consulta_piezas();
  }

  eliminar(a: any) {
    if (confirm("Desea eliminar esta pieza!.")) {
      // this.solicitud.consulta = 8;
      this.valida_vista('eliminar');
      this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
      this.solicitud.idpieza = a.idpieza;
      this.solicitud.idpieza_proyecto = a.idpieza_proyecto;
      this.Consulta_piezas();
    }
  }

  limpiar() {
    this.solicitud.descripcion = '';
    this.solicitud.nombre = '';
    this.solicitud.nombre_p = '';

    this.solicitud.esmatriz = 0;
    this.solicitud.act_nombre = 0;
    this.solicitud.act_descripcion = 0;
    this.solicitud.estado = 0;
    this.solicitud.act_hallasgo = 0;
    this.solicitud.act_categoria = 0;
    this.solicitud.act_cripterio = 0;
    this.solicitud.act_evidencia = 0;
    this.solicitud.act_anexo_1 = 0;
    this.solicitud.act_anexo_2 = 0;
    this.solicitud.nom_anexo_1 = '';
    this.solicitud.nom_anexo_2 = '';

    // coloca la consulta en metodo creacion
    this.valida_vista('crear');
  }

  validacion() {
    const a = this.solicitud;
    let retorno = true;

    if (a.nombre.length < 1) {
      this.notify.error('Completar campos', 'El campo Nombre es obligatorio.', this.optionconfig);
      retorno = false;
    }
    if (a.act_anexo_1 === 1 && a.nom_anexo_1.length < 1) {
      this.notify.error('Completar campos', 'Tiene que colocarle el nombre al anexo 1.  Si no lo desea por favor desactivarlo.', this.optionconfig);
      retorno = false;
    }
    if (a.act_anexo_2 === 1 && a.nom_anexo_2.length < 1) {
      this.notify.error('Completar campos', 'Tiene que colocarle el nombre al anexo 2.  Si no lo desea por favor desactivarlo.', this.optionconfig);
      retorno = false;
    }

    // valida parametros de pieza_proyecto difentes a los de pieza
    if (a.act_anexo_3 === 1 && a.nom_anexo_3.length < 1 && this.prm.vista == 'pieza_proyecto') {
      this.notify.error('Completar campos', 'Por favor coloque el nombre del anexo 3.', this.optionconfig);
      retorno = false;
    }

    return retorno;
  }

  /*valida_vista: valida la  si esta en pieza o pieza_proyecto para asignarle el numero de la consulta, el metoso se asiga en el OnInit() */
  valida_vista(accion: string) {
    if (accion == 'crear') {

      if (this.prm.vista == 'pieza') { this.solicitud.consulta = 6; }
      else if (this.prm.vista == 'pieza_proyecto') { this.solicitud.consulta = 2; }

    }

    if (accion == 'editar') {

      if (this.prm.vista == 'pieza') { this.solicitud.consulta = 7; }
      else if (this.prm.vista == 'pieza_proyecto') { this.solicitud.consulta = 3; }

    }

    if (accion == 'eliminar') {

      if (this.prm.vista == 'pieza') { this.solicitud.consulta = 8; }
      else if (this.prm.vista == 'pieza_proyecto') { this.solicitud.consulta = 4; }

    }
  }

}
