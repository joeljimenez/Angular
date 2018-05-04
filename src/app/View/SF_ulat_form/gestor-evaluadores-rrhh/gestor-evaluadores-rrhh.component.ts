import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, Parametros, empleados, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { CorrectorPipe } from '../../../pipes/export';
import { Console } from '@angular/core/src/console';
import { empty } from 'rxjs/Observer';

@Component({
  selector: 'app-gestor-evaluadores-rrhh',
  templateUrl: './gestor-evaluadores-rrhh.component.html',
  styleUrls: ['./gestor-evaluadores-rrhh.component.css']
})
export class GestorEvaluadoresRrhhComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: any[];
  titulo_modal: string;
  last = [];
  dependientes_empleados: empleados;
  filtro: string;
  error: boolean;
  data: empleados;
  emp_evaluador = [];
  idempleado: string;
  idsedeSession: any;
  breadcrumbArray = [];
  titulo: string;
  departamentos = [];
  departamentos_arr = [];
  cargos = [];
  id_departamento: any;
  evaluador: string;
  departamento: string;
  evaluadores = [];
  evaluadores_Emp = [];
  nuevoEvaluadorN: string;
  eliminarEvaluadorbtn: boolean;


  data_evaluador: any;
  activa_data_evaluador: boolean;
  visor_tarjeta: any;
  btnRegresopadre: boolean;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) {
    this.visor_tarjeta = {
      apellido: '',
      apellido2: '',
      cedula: '',
      dependientes: true,
      email: '',
      estado: '',
      idempleado: 0,
      nombre: '',
      nombre2: '',
      RH09EMP: 0,
      RH27COD: '',
      RH27DES: '',
      RH28COD: '',
      RH28DES: '',
      sexo: '',
      anno: 0,
      periodo: 0,
      idformulario: 0,
      hash: '',
      nombre_evaluador: '',
      nombre_from: '',
      idevaluacion: 0,
      email2: '',
      M05COD: '',

    }
  }

  ngOnInit() {
    this.id_departamento = '';
    this.eliminarEvaluadorbtn = false;
    this.solicitud.idsede = sessionStorage._sede;

    this.titulo = 'Gestor de Evaluadores'; /*Titulo de la Pagina*/
    this.breadcrumbArray = [{ titulo: this.titulo, nombre: this.titulo, ruta: '../home/Gestor-Evaluadores-RRHH', datos: '' }];

    this.error = false;
    this.idempleado = '';
    this.activa_data_evaluador = false;
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.btnRegresopadre = true;

          this.solicitud.idempleado = JSON.parse(atob(params['data'])).idempleado;
          this.data_evaluador = JSON.parse(atob(params['data']));
          this.visor_tarjeta = JSON.parse(atob(params['data']));
          this.departamentos_arr = JSON.parse(localStorage._departamentos_arr);
          this.activa_data_evaluador = true;
          this.solicitud.metodo = 15;
          this.solicitud.consulta = 1;
          this.run();

        } catch (error) {
          this.router.navigate(['./home/Gestor-Evaluadores-RRHH'])
        }
      }
      else {
        this.btnRegresopadre = false;
        this.router.navigate(['./home/Gestor-Evaluadores-RRHH']);

        this.prm.idsede = sessionStorage._sede;
        this.prm.metodo = 13;
        this.prm.consulta = 1;
        this.consulta_departamentos();

        this.solicitud.metodo = 14;
        this.solicitud.consulta = 1;
        this.run();
      }
    });
  }

  run() {
    this.flag_envio = true;

    this.rest.ulat_form(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          if(datos.data != null){
            if(datos.data.length > 0){
              let dataString = CorrectorPipe.prototype.transform(JSON.stringify(datos.data));
              this.respuesta = this.arr_evaluadore(JSON.parse(dataString));
              //this.arr_departamentos(this.respuesta, 0);
            }
          }
          //this.respuesta = this.arr_evaluadore(datos.data);
          // if (!this.activa_data_evaluador) { this.visor_tarjeta = this.respuesta[0] };
          if (this.solicitud.consulta === 1) {
            this.departamentos = this.arr_departamentos(this.respuesta, 0);
          }
          if (this.solicitud.consulta === 3) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro actualizado con éxito');
            this.ngOnInit();
          }
          else if (this.solicitud.consulta === 2) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro insertado con éxito');
            this.ngOnInit();
          }
          if (this.solicitud.consulta === 4) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito');
            this.ngOnInit();
          }
          if (this.solicitud.consulta === 18) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito');
            window.history.back();
            alert('Se eliminó al evaluador, se le re direccionara a la vista anterior.');
          }
          /* GUARDA LOS EMPLEADOS EVALUADORES PARA UTILIZARLOS EN OTRAS ACCIONES COMO: CAMBIO DE EVALUADOR. */
          if (this.solicitud.metodo === 14) {
            localStorage.setItem('_Evaluadores', JSON.stringify(this.respuesta));
          }
        }
        else {
          if (datos.error === '0') {
            this.respuesta = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 3) {
              this.Show_notificacion(2, 'Error controlado', datos.mensaje);
            }
            if (this.solicitud.consulta === 4) {
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito')
            }
            if (this.solicitud.consulta === 1) {
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro no existe');
            }
            if (this.solicitud.consulta === 18) {
              this.Show_notificacion(2, 'Error controlado', datos.mensaje);
            }
          }
          else if(datos.numero === '0'){
            if (this.solicitud.consulta === 2) {
              this.Show_notificacion(2, 'Error controlado', datos.mensaje);
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
        document.getElementById('editar').style.display = 'none';
        document.getElementById('cambioEvaluador').style.display = 'none';
        document.getElementById('nuevoEvaluado').style.display = 'none';
        document.getElementById('eliminaEvaluador').style.display='none';
      }
    )
  }

  Cambio_sede(): void {
    if (this.solicitud.idempleado === 0) {
      this.solicitud.metodo = 14;
    }
    else {
      this.solicitud.metodo = 15;
    }
    this.solicitud.idsede = sessionStorage._sede;
    this.solicitud.consulta = 1;
    this.run();
  }

  consulta_empleadoParaEvaluador() {
    this.flag_envio = true;

    if (this.solicitud.consulta === 1) {
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

          let dataString = CorrectorPipe.prototype.transform(JSON.stringify(datos.data));
          this.emp_evaluador = this.arr_evaluadore(JSON.parse(dataString));

          //this.emp_evaluador = datos.data;
        }
        else {
          if (datos.error === '0') {
            // this.respuesta = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 1) {
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro no existe');
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
        document.getElementById('editar').style.display = 'none';
        document.getElementById('cambioEvaluador').style.display = 'none';
      }
    )


  }

  consulta_departamentos() {
    this.flag_envio = true;

    this.rest.ulat_form(this.prm).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.rest.NuevoTokent(datos.tokent);

          this.arr_departamentos(datos.data, 1);

          if (this.prm.consulta === 3) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro actualizado con éxito');
          }
          else if (this.prm.consulta === 2) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro insertado con éxito');
          }
          if (this.prm.consulta === 4) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito');
          }
        }
        else {
          if (datos.error === '0') {
            this.departamentos = datos.data;
            this.rest.NuevoTokent(datos.tokent);
            if (this.prm.consulta === 4) {
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito')
            }
            if (this.prm.consulta === 1) {
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro no existe');
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

        if (this.prm.consulta > 1) {
          document.getElementById('formulario').style.display = 'none';
          document.getElementById('eliminar').style.display = 'none';
        }
      }
    )


  }

  arr_departamentos(data, proceso) {
    let D = this.arr_filtro(data, 'RH27COD');

    if (proceso === 0) {
        this.departamentos = []
      for (const i in D) {
        this.departamentos.push({ RH27COD: D[i].RH27COD, RH27DES: D[i].RH27DES });
      }
        return this.departamentos;
    } else if (proceso === 1) {
      this.departamentos_arr = [];
      for (const i in D) {
        this.departamentos_arr.push({ RH27COD: D[i].RH27COD, departamento: D[i].departamento, cargos: [] });
      }
      for (const i in this.departamentos_arr) {
        for (const j in data) {
          if (this.departamentos_arr[i].RH27COD === data[j].RH27COD) {
            this.departamentos_arr[i].cargos.push(data[j]);
          }
        }
      }
      localStorage.setItem('_departamentos_arr', JSON.stringify(this.departamentos_arr));
    }
  }

  arr_evaluadore(data) {
    let arreglo = [];
    for (const i in data) {
      data[i].evaluadores = [];
      let cont = 0;
      for (const j in data) {
        if (data[i].idempleado === data[j].idempleado) {
          data[i].evaluadores[cont] = { idevaluador: data[j].idevaluador, evaluador_old: data[j].idevaluador };
          cont += 1;
        }
      }
    }
    let Emp = this.arr_filtro(data, 'idempleado');
    for (const i in Emp) {
      arreglo.push(Emp[i]);
    }
    return arreglo;
  }

  seccionaCargo(id): void {
    this.departamentos_arr = [];
    this.departamentos_arr = JSON.parse(localStorage._departamentos_arr);
    try {
      if (id === null || id === '') {
        id = '0';
      } else {
        this.cargos = [];
        this.cargos = this.departamentos_arr.filter(value => value.RH27COD === id)[0].cargos;
      }
    } catch (error) {
      console.log(error);
    }

  }

  arr_filtro(datos, valor) {
    let S = {};
    for (var i in datos) {
      S[datos[i][valor]] = datos[i];
    }
    return S;
  }

  dependientes(data) {
    // const arreglo = {
    //   idempleado: data.idempleado,
    //   evaluador: data.nombre +' '+ data.apellido,
    //   departamento: data.RH27DES
    // }

    const arreglo = data;
    //arreglo.navegacion = this.breadcrumbArray;
    const paramatros = btoa(JSON.stringify(arreglo));

    this.router.navigate(['./home/Gestor-Evaluadores-RRHH', paramatros]);
  }

  consulta_empleado(idempleado) {
    this.filtro = '';
    this.activa_data_evaluador = false;
    this.evaluador = '';
    this.departamento = '';

    this.solicitud.idempleado = idempleado;
    this.solicitud.metodo = 6;

    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.idempleado = '';

    this.run();
  }

  regresopadre() {
    window.history.back();
  }

  regresoHome() {
    this.ngOnInit();
    this.router.navigate(['/home/Gestor-Evaluadores-RRHH']);
    this.filtro = '';
  }

  editar(data) {
    this.seccionaCargo(data.RH27COD);

    this.solicitud.metodo = 16;
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idempleado = data.idempleado;
    this.solicitud.cedula = data.cedula;
    this.solicitud.estadoText = data.estado;
    this.solicitud.nombre = data.nombre;
    this.solicitud.nombre2 = data.nombre2;
    this.solicitud.apellido = data.apellido;
    this.solicitud.apellido2 = data.apellido2;
    this.solicitud.sexo = data.sexo;
    this.solicitud.email = data.email;
    this.solicitud.RH28COD = data.RH28COD;
    this.solicitud.RH27COD = data.RH27COD;
    document.getElementById('editar').style.display = 'block';
  }

  cambioEvaluador(data) {
    this.evaluadores = JSON.parse(localStorage._Evaluadores);
    this.evaluadores_Emp = data.evaluadores;
    if (this.evaluadores_Emp.length > 1) { this.eliminarEvaluadorbtn = true; } else { this.eliminarEvaluadorbtn = false; }

    this.solicitud.idempleado = data.idempleado;

    document.getElementById('cambioEvaluador').style.display = 'block';
  }

  guardaCambioEvaluador(a) {

    this.solicitud.metodo = 17;
    this.solicitud.consulta = 3;

    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.evaluador_old = a.evaluador_old;
    this.solicitud.evaluador = a.idevaluador;
    this.run();
  }

  eliminarEvaluador(a) {
    this.solicitud.metodo = 18;
    this.solicitud.consulta = 4;

    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.evaluador = a.idevaluador;
    this.run();
  }

  nuevoEvaluador(data) {
    this.idempleado = '';
    this.emp_evaluador = [];
    this.nuevoEvaluadorN = data.nombre + ' ' + data.apellido;
    this.solicitud.idempleado_admin = this.visor_tarjeta.idempleado;
    document.getElementById('nuevoEvaluado').style.display = 'block';
  }

  empleadoParaEvaluador(idempleado) {
    this.solicitud.idempleado = idempleado;
    this.solicitud.metodo = 6;
    this.solicitud.consulta = 1;

    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.consulta_empleadoParaEvaluador();
    this.idempleado = '';
  }

  validacion() {
    const a = this.solicitud;
    let retorno = true;


    if ((a.idempleado.toString()).length < 1) {
      this.Show_notificacion(2, 'Completar campos', 'Por favor coloque el ID de empleado.')
      retorno = false;
    }

    return retorno;
  }

  Show_notificacion(tipo, titulo, mensaje) {
    if (tipo === 1) {
      this.notify.success(titulo, mensaje, this.optionconfig);
    }
    // tslint:disable-next-line:one-line
    else if (tipo === 2) {
      this.notify.error(titulo, mensaje, this.optionconfig);
    }
  }

  openEmp(data: any): void {
    this.filtro = '';
    this.visor_tarjeta = data;
    if (data.dependientes > 0) {
      this.dependientes(data);
    }
    // this.solicitud.idempleado_admin = idempleado;
    // var i, x, tablinks;
    // x = document.getElementsByClassName("emp");
    // for (i = 0; i < x.length; i++) {
    //    x[i].style.display = "none";
    // }
    // document.getElementById(idempleado).style.display = "block";
  }


  inserta_empleado(idempleado) {
    this.solicitud.metodo = 7;
    this.solicitud.consulta = 2;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.software = JSON.parse(atob(localStorage._idsoftware));
    this.solicitud.idempleado = idempleado;
    this.solicitud.idempleado_admin = this.visor_tarjeta.idempleado;

    this.solicitud.nombre = this.visor_tarjeta.nombre;
    this.solicitud.apellido = this.visor_tarjeta.apellido;
    this.solicitud.id_departamento = parseInt(this.visor_tarjeta.RH27COD);
    this.solicitud.departamento = this.visor_tarjeta.RH27DES;
    this.solicitud.puesto = this.visor_tarjeta.RH28DES;
    this.solicitud.idpuesto = parseInt(this.visor_tarjeta.RH28COD);
    this.solicitud.cedula_evaluado = this.visor_tarjeta.cedula;
    this.solicitud.email = this.visor_tarjeta.email;

    this.run();
  }

  eliminar_evaluador(data: any): void{
    this.solicitud.metodo = 4;
    this.solicitud.consulta = 18;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.nombre = data.nombre +' '+ data.apellido;
    this.solicitud.idempleado = data.idempleado;
    this.solicitud.evaluador = data.idempleado;

    this.evaluadores = JSON.parse(localStorage._Evaluadores);
    document.getElementById('eliminaEvaluador').style.display='block';
  }



}
