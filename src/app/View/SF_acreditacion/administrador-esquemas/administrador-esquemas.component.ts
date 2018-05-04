import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, acreditacion, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-administrador-esquemas',
  templateUrl: './administrador-esquemas.component.html',
  styleUrls: ['./administrador-esquemas.component.css']
})
export class AdministradorEsquemasComponent implements OnInit {

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  titulo_modal: string;

  esquemas = [];
  categorias = [];

  titulo: string;
  breadcrumbArray = [];
  prm: any;


  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.prm = JSON.parse(atob(params['data']));
          this.titulo = 'Esquemas (' + this.prm.nombre + ')';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({ titulo: this.titulo, nombre: this.titulo, ruta: '../home/administrador-esquemas', datos: JSON.parse(atob(params['data'])) });

        } catch (error) {
          window.history.back();
          console.log(error)
        }
      }
      // tslint:disable-next-line:one-line
      else {
        window.history.back();
      }
    });
    this.solicitud.metodo = 2;
    this.solicitud.consulta = 21; // 22 = insert / 23 = update / 24 = delete
    this.solicitud.identidad = this.prm.identidad;
    this.Consulta_esquema();
  }

  Consulta_esquema() {
    this.flag_envio = true;

    if (this.solicitud.consulta === 3 || this.solicitud.consulta === 2) {
      if (!this.validacion()) {
        this.flag_envio = false;
        return false;
      }
    }

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.esquemas = datos.data;

          if (this.solicitud.consulta === 23) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 22) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 24) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.esquemas = datos.data;
            if (this.solicitud.consulta === 24) {
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
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  Consulta_categorias() {
    this.flag_envio = true;

    if (this.solicitud.consulta === 10) {
      if (!this.validacion()) {
        this.flag_envio = false;
        return false;
      }
    }
    this.solicitud.defaul = (this.solicitud.defaul) ? 1 : 0;
    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); 
        if (datos.exito) {

          this.categorias = datos.data;

          if (this.solicitud.consulta === 11) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 10) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 12) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
          this.limpiar();
        }
        else {
          if (datos.error === '0') {
            this.categorias = datos.data;
            if (this.solicitud.consulta === 24) {
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
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  crear() {
    this.limpiar()
    this.solicitud.metodo = 2;
    this.solicitud.consulta = 22;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.titulo_modal = 'CREAR ESQUEMA';
    document.getElementById('formulario').style.display = 'block';
  }

  editar(data: any) {
    this.limpiar()
    this.solicitud.metodo = 2;
    this.solicitud.consulta = 23;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.nombre = data.nombre;
    this.solicitud.descripcion = data.descripcion;
    this.solicitud.idesquema = data.idesquema;

    this.titulo_modal = 'EDITAR ESQUEMA';
    document.getElementById('formulario').style.display = 'block';
  }

  eliminar(data: any) {
    if (confirm("Desea eliminar este Esquema! Asegurese de que no tenga Datos enlazados.")) {
      this.solicitud.metodo = 2;
      this.solicitud.consulta = 24;
      this.solicitud.idesquema = data.idesquema;
      this.solicitud.identidad = this.prm.identidad;
      this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
      this.Consulta_esquema();
    }
  }

  crear_categorias(data: any) {
    this.solicitud.metodo = 2;
    this.solicitud.consulta = 9;
    this.solicitud.identidad = this.prm.identidad;
    this.solicitud.idesquema = data.idesquema;

    this.Consulta_categorias();
    this.titulo_modal = 'CREAR CATEGORIA';
    document.getElementById('formulario_categoria').style.display = 'block';
  }

  editar_categoria(a: any) {
    this.titulo_modal = 'EDITAR CATEGORIA';

    this.solicitud.idesquema = a.idesquema;
    this.solicitud.descripcion = a.descripcion;
    this.solicitud.nombre = a.nombre;
    this.solicitud.porcentaje = a.porcentaje;
    this.solicitud.defaul = a.defaul;
    this.solicitud.idcategoria = a.idcategoria;
    this.solicitud.consulta = 11;
  }

  eliminar_categoria(a: any) {
    if (confirm("Desea eliminar esta categoria! Asegurese de que no tenga Datos enlazados.")) {
      this.solicitud.consulta = 12;
      this.solicitud.idcategoria = a.idcategoria;
      this.solicitud.idesquema = a.idesquema;
      this.Consulta_categorias();
    }
  }

  validacion() {
    const a = this.solicitud;
    let retorno = true;

    if (a.nombre.length < 1) {
      this.notify.error('Completar campos', 'Por favor coloque un nombre a la caja.', this.optionconfig);
      retorno = false;
    }
    if (a.porcentaje === 0) {
      this.notify.error('Completar campos', 'Por favor coloque un porcentaje a la caja.', this.optionconfig);
      retorno = false;
    }

    return retorno;
  }

  limpiar() {
    this.solicitud.descripcion = '';
    this.solicitud.nombre = '';
    this.solicitud.porcentaje = 0;
    this.solicitud.defaul = 0;
    this.solicitud.consulta = 10;
    this.titulo_modal = 'CREAR CATEGORIA';
  }

  open(data: any, vista: string) {
    let arreglo = {};
    if (vista == 'pieza') {
      arreglo = {
        vista: vista,
        idesquema: data.idesquema,
        identidad: data.identidad,
        nombre: 'Pieza ' + '(' + data.nombre + ')',
        navegacion: this.breadcrumbArray
      }
    } else if (vista == 'pieza_proyecto') {
      arreglo = {
        vista: vista,
        idesquema: data.idesquema,
        identidad: data.identidad,
        nombre: 'Pieza Proyecto ' + '(' + data.nombre + ')',
        navegacion: this.breadcrumbArray
      }
    }

    const paramatros = btoa(JSON.stringify(arreglo));
    this.router.navigate(['./home/administrador-piezas', paramatros]);

  }

}
