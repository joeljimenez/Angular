import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, Parametros, colegio, OpcionesNotifi, Permisos, evaluaciones, empleados } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.css']
})
export class EvaluacionesComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje: string;
  titulo_padre: string;
  idformulario:string;
  nombre:string;
  evaluaciones = [];
  ejemplo = [];
  breadcrumbArray = [];
  titulo:string;
  filtro:string;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.solicitud.idsede = sessionStorage._sede;
    this.titulo = 'Evaluaciones';
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.solicitud.periodo = JSON.parse(atob(params['data'])).periodo;
          this.solicitud.anno = JSON.parse(atob(params['data'])).anno;
          this.solicitud.estado = JSON.parse(atob(params['data'])).estado;
          this.idformulario = JSON.parse(atob(params['data'])).idformulario;
          this.nombre = JSON.parse(atob(params['data'])).nombre_form;
          this.titulo_padre = 'Periodo '+ this.solicitud.periodo + '-' + this.solicitud.anno;

          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo,ruta: '../home/Evaluaciones', datos: JSON.parse(atob(params['data']))});

        } catch (error) {
          const arreglo = {
            idformulario: JSON.parse(atob(params['data'])).idformulario,
            nombre: JSON.parse(atob(params['data'])).nombre_form
          }
          const paramatros = btoa(JSON.stringify(arreglo));
          this.router.navigate(['./home/Formularios-Periodos', paramatros])
        }
      }
      else {
        const arreglo = {
          idformulario: JSON.parse(atob(params['data'])).idformulario,
          nombre: JSON.parse(atob(params['data'])).nombre_form
        }
        const paramatros = btoa(JSON.stringify(arreglo));
        this.router.navigate(['./home/Formularios-Periodos', paramatros])
      }
    });

    this.solicitud.metodo = 4;
    this.solicitud.consulta = 20;
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

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);
          this.evaluaciones = this.encapsula_evaluaciones(datos.data);

          if (this.solicitud.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito',this.optionconfig);
          }
          else if (this.solicitud.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito',this.optionconfig);
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito',this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.evaluaciones = this.encapsula_evaluaciones(datos.data)
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito',this.optionconfig);
            }
            if (this.solicitud.consulta === 20) {
              this.notify.success('Proceso exitoso', 'Registro no existe',this.optionconfig);
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error),this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          // document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )


  }

  encapsula_evaluaciones(a){
    let Datos = [];
    let entro = false;

    let sedes = this.Duplicados(a, 'idsede');
    let evaluaciones = [];

    for (const key in sedes) {
      evaluaciones.push({idsede: sedes[key].idsede, sede: sedes[key].sede});
    }

    for ( const i in a) {
        if (Datos.length === 0) {
          Datos.push({
                cedula: a[i].cedula,
                nombre: a[i].nombre,
                idsede: a[i].idsede,
                sede: a[i].sede,
                departamento: a[i].departamento,
                data:[a[i]],
                confirmado: (a[i].confirmacion) ? 1 : 0
            });
        }
        else {
            entro = false;
            for (const j in Datos) {
                if (a[i].cedula == Datos[j].cedula) {
                  Datos[j].data.push(a[i]);
                  Datos[j].confirmado = (a[i].confirmacion) ? (Datos[j].confirmado + a[i].confirmacion) : Datos[j].confirmado
                    entro = true;
                    break;
                }
            }

            if (!entro) {
              Datos.push({
                    cedula: a[i].cedula,
                    nombre: a[i].nombre,
                    idsede: a[i].idsede,
                    sede: a[i].sede,
                    departamento: a[i].departamento,
                    data: [a[i]],
                    confirmado: (a[i].confirmacion) ? 1 : 0
                });
            }
        }
    }
    // for ( const d in Datos ) {
    //   for ( const f in Datos[d].data){
    //     Datos[d].confirmado = Datos[d].confirmado +  Datos[d].data[f].confirmacion;
       
    //   }
    // }

    for (var j in evaluaciones) {
        var l = 0
        evaluaciones[j].datos = [];
      for (var k in Datos) {
        if (evaluaciones[j].idsede == Datos[k].idsede) {

         // Datos[k].confirmado = ((Datos[k].confirmado / Datos[k].data.length) * 100).toString() + '%';
          evaluaciones[j].datos[l] = Datos[k];
           l += 1;
        }
      }
    }
    return evaluaciones;
  }

  Duplicados(arr, prop) {
    var nuevoArray = [];
    var lookup  = {};

    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }

    for (i in lookup) {
        nuevoArray.push(lookup[i]);
    }
    return nuevoArray;
  }

  open(data:evaluaciones){
    const arreglo = {
      data,
      //valores de retorno
      back_periodo: this.solicitud.periodo,
      back_anno: this.solicitud.anno,
      back_estado: this.solicitud.estado,
      back_idformulario: this.idformulario,
      back_nombre: this.nombre,
      navegacion: this.breadcrumbArray
    }
  
      const paramatros = btoa(JSON.stringify(arreglo));
      this.router.navigate(['./home/Encuestas-Empleado', paramatros]);
  }

  validacion(){
   //

  }

  retorno(){
    const arreglo = {
      idformulario: this.idformulario,
      nombre: this.nombre
    }
    const paramatros = btoa(JSON.stringify(arreglo));
    this.router.navigate(['./home/Formularios-Periodos', paramatros])
  }

}
