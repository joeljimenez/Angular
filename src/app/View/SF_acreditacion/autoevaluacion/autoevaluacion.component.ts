import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos, acreditacion } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

import { Validacionesservice } from '../../../Service/Validaciones.service';
import { FormNodoComponent } from '../../../controles/acreditacion/export_controles_acreditacion';

@Component({
  selector: 'app-autoevaluacion',
  templateUrl: './autoevaluacion.component.html',
  styleUrls: ['./autoevaluacion.component.css']
})
export class AutoevaluacionComponent implements OnInit {

  @ViewChild(FormNodoComponent) FormNodo: FormNodoComponent;

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  filtro: string;
  titulo_modal: string;
  prm_solicitud = new Parametros().prm;

  matriz: acreditacion;
  matriz_completa: acreditacion;


  // hay dos formas de ver las piezas por secuencia padre e hijo
  // o por piezas false alimenta a ng-hide se muestra y la otra ng-show se esconde se puede mejorar
  vista_lineal = true;

  // esto indica cual es la pieza que se va a mostrar inicial mente y cambia cuando se selecciones una pieza diferente
  muestra_piezas = 0;

  // esto indica cual es la pieza que se va a mostrar inicial mente y cambia cuando se selecciones una pieza diferente
  muestra_pieza: number;

  // esto india cual hijo se va a mostrar, inicial mente se mostrará el hijo directo de la matriz
  muestra_hijos: number;

  // inicializa al padre del hijo jajajaa esto va en juego para ver si se muestra el boton de atras osea para retornar al nodo anterior
  // por ende si el hijo es igual al padre quiere decir que no tiene padre es huérfano
  padre: number;

  /*estas variables se cargan en Consulta_pieza() y se utilizan para los reporte*/
  pieza_contenedor_reporte = 0; // esta variable agrupa contenido
  pieza_evaluar_reporte = 0; // esta variable define la pieza a evaluar esta pieza debe contener categorias y evidencias activadas
  activa_reportes = 0; // esta variable permite activar los reportes
  /*---------------------------------------------------------------------------*/

  /*variables del encabezado*/
  imagen_encabezado: string;
  vigencia_encabezado: string;
  nombre_encabezado: string;
  descripcion_encabezado: string;

  // inicializa las piezas de la matriz
  piezas = [];
  categorias = [];
  piezas_esquema = [];
  piezas_esquema2 = [];
  cualitativa = [];
  cripterios = [];


  mat_rpt = [];
  mat_fac_evi = [];
  mat_cat_evi = {};


  nom_anexo_1 = '';
  nom_anexo_2 = '';


  vista_nombre: boolean;
  vista_descripcion: boolean;
  vista_evidencia: boolean;
  vista_categoria: boolean;
  vista_hallasgo: boolean;
  vista_anexo_1: boolean;
  vista_anexo_2: boolean;
  vista_cripterio: boolean;

  fitro_cuantitativo: any;
  breadcrumbArray = [];
  titulo: string;
  data_matriz = [];
  data_arbol = [];
  nombre_pieza_evaluada: string;
  // se activa cuando se cargan las categorias
  vista_reportes = false;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.prm_solicitud.idmatriz = JSON.parse(atob(params['data'])).idmatriz;
          this.prm_solicitud.identidad = JSON.parse(atob(params['data'])).identidad;
          this.prm_solicitud.idesquema = JSON.parse(atob(params['data'])).idesquema;
          this.prm_solicitud.idsecuencia = JSON.parse(atob(params['data'])).idsecuencia;
          this.prm_solicitud.imagen = JSON.parse(atob(params['data'])).imagen;

          this.titulo = 'Autoevaluación';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({ titulo: this.titulo, nombre: this.titulo, ruta: '../home/autoevaluacion', datos: JSON.parse(atob(params['data'])) });

          if (this.prm_solicitud.idmatriz == 0 || this.prm_solicitud.identidad == null || this.prm_solicitud.idesquema == null) {
            this.router.navigate(['./home/Matriz']);
          }

        } catch (error) {
          this.router.navigate(['./home/Matriz']);
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/Matriz']);
      }
    });

    this.solicitud = this.prm_solicitud;
    this.solicitud.metodo = 1;
    this.solicitud.consulta = 5;
    this.run(); // documentada, consulta matriz y crea proceso de ordenación

    this.prm = this.prm_solicitud;
    this.prm.metodo = 2;
    this.prm.consulta = 9;
    this.Consulta_categoria(); // consulta las categorias y activa la vista a los reportes

    this.solicitud.metodo = 2;
    this.solicitud.consulta = 5;
    this.Consulta_pieza(); // consulta piezas, asigna contenedor y piezas a evaluar, ejecuta proceso de reportes

    // consultas para parametros
    this.prm.metodo = 2;
    this.prm.consulta = 13;
    this.Consulta_cualitativa();

    this.solicitud.metodo = 2;
    this.solicitud.consulta = 17;
    this.Consulta_cripterios();
  }

  run() {
    this.flag_envio = true;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        let temp = this.muestra_hijos;
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);

          this.matriz_completa = datos.data;

          // consulta la pieza matriz y extrae titulos y mas
          this.muestra_encabezado();

          // asigna el controll siguiente y atras en false, luego reune las piezas segun el orden registrada
          // luego asigna la cantidad de piezas que se tienen por pieza, por ultimo activa el controll siguiente y atras a quien lo necesite
          this.encapsular();



          if (this.solicitud.consulta === 7) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
            this.muestra_hijos = temp;
          }
          else if (this.solicitud.consulta === 6) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
            this.muestra_hijos = temp;
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.matriz_completa = datos.data;
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 5) {
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

        if (this.solicitud.consulta > 1) {
          document.getElementById('formulario').style.display = 'none';
        }
      }
    )


  }

  muestra_encabezado() {
    for (const i in this.matriz_completa) {

      //
      if (this.matriz_completa[i].idsecuencia_padre == 0) {

        let a = this.matriz_completa[i];
        this.matriz = this.matriz_completa[i];
        /*asignamo los datos de la matriz con la cual vamos a trabajar*/
        this.solicitud.idmatriz = a.idmatriz;
        this.solicitud.identidad = a.identidad;
        this.imagen_encabezado = a.imagen;

        this.vigencia_encabezado = 'Vigencia: ' + a.vigencia_inicio + ' - ' + a.vigencia_fin;
        this.nombre_encabezado = a.nombre;
        this.descripcion_encabezado = a.descripcion;
        break;
      }
    }
  }

  encapsular() {
    /*************************************************************
     *reune todas las piezas con la que esta conformada la matriz*
    *************************************************************/
    this.piezas = [];
    /*el forin inserta y filtra las piezas de la matriz
      asigna cual es la primera pieza a mostrar en pantalla
      y dice cual es el padre de la matriz
    */
    for (const i in this.matriz_completa) {
      this.matriz_completa[i].ico = 'fa-plus';
      this.matriz_completa[i].muestra = 'w3-hide';
      /*******************************************************
       *inactiva el control para navegar adelante o siguiente*
       *******************************************************/
      this.matriz_completa[i].siguiente = false;

      /*************************************
       *concatena ceros a la izquierda para*
       *ordenar el contenido numericamente *
       *************************************/

      this.matriz_completa[i].ordenar = Validacionesservice.prototype.ceros_izquierda(this.matriz_completa[i].orden, 15)

      if (this.matriz_completa[i].idsecuencia_padre != 0) {

        /******************************************************
         * en esta condicion entra solamente si no es el padre*
         * principal de la matriz de lo contrario para al else*
         ******************************************************/

        if (this.piezas.length == 0) {
          /*
          si el arreglo de piezas esta vacio al entrar aqui
          carga la primera piezas
          */
          this.piezas.push({
            id: this.matriz_completa[i].idpieza,
            nombre: this.matriz_completa[i].nombre_pieza,
            nombre_p: this.matriz_completa[i].nombre_pieza_p,
            cantidad: 0
          })
        }
        else {
          /*de otro modo si ya existen piezas registradas
            lo primero que hace es revisar si la pieza existe
          */
          let existe = false;
          for (const a in this.piezas) {
            if (this.piezas[a].id == this.matriz_completa[i].idpieza) {
              existe = true;
            }
          }
          /*si la pieza no existe la registra*/
          if (!existe) {
            this.piezas.push({
              id: this.matriz_completa[i].idpieza,
              nombre: this.matriz_completa[i].nombre_pieza,
              nombre_p: this.matriz_completa[i].nombre_pieza_p,
              cantidad: 0
            })
          }

        }
      }
      else {
        /*********************************************************
         *cuando entra en esta condicion carga la pieza a mostrar*
          en muestra_hijos                                       *
         *********************************************************/
        this.muestra_hijos = this.matriz_completa[i].idsecuencia;
        /*asigna el padre del hijo para la validacion del boton atras si este
        es igual al hijo no se activa ya que este es huérfano. jajajajaja*/
        this.padre = this.matriz_completa[i].idsecuencia;

      }
    }

    /*
    este forin indica cuantos nodos hay por pieza
    en la matriz
    */
    for (const i in this.piezas) {
      for (const j in this.matriz_completa) {
        if (this.matriz_completa[j].idpieza == this.piezas[i].id) {
          this.piezas[i].cantidad += 1;
        }
      }
    }

    /*
     este doble forin activa el boton siguiente
     si tiene sub-nodos los nodos ose si es padre
    */
    for (const i in this.matriz_completa) {
      for (const j in this.matriz_completa) {
        if (this.matriz_completa[i].idsecuencia == this.matriz_completa[j].idsecuencia_padre) {
          this.matriz_completa[i].siguiente = true;
        }
      }
    }

    /*ejecuta procesos para crear reporteria*/


    this.organiza_matriz(this.matriz_completa)
  }



  organiza_matriz(a) {

    this.data_matriz = a;
    if (sessionStorage.select_matriz != null || sessionStorage.select_matriz !== undefined) {
      if (sessionStorage.select_matriz.length > 2) {
        const selec = JSON.parse(sessionStorage.select_matriz)
        for (const sec in this.data_matriz) {
          for (const est in selec) {
            if (this.data_matriz[sec].idsecuencia === selec[est].idsecuencia) {
              this.data_matriz[sec].muestra = selec[est].muestra;
              this.data_matriz[sec].ico = selec[est].ico;
            }
          }
        }
      }
    }


    let padre = [];

    for (const i in this.data_matriz) {
      if (this.data_matriz[i].idsecuencia_padre === 0) {
        padre.push(this.data_matriz[i]);
      }
    }


    this.buscar_hijos(padre[0]);
    this.data_arbol = padre[0].hijos;


  };

  buscar_hijos(arreglo) {
    arreglo.hijos = [];
    for (const i in this.data_matriz) {
      if (this.data_matriz[i].idsecuencia_padre === arreglo.idsecuencia) {
        arreglo.hijos.push(this.data_matriz[i]);
      }
    }

    for (const a in arreglo.hijos) {
      this.buscar_hijos(arreglo.hijos[a]);
    }
  }




  // estos reportes son temporales por un apuro de presentar el proyecto solo funcionan para la matriz 1 y quiza para otras matrices
  // pero si cambia el esquema de la matriz probablemente no funcionaran los reportes
  // hay que trabajar en la automatizacion de los reportes mas adelante



  reporte_matriz() {
    this.mat_rpt = [];
    this.mat_fac_evi = [];
    this.mat_cat_evi = {};

    for (const i in this.matriz_completa) {
      if (this.matriz_completa[i].idpieza == this.pieza_contenedor_reporte) {

        this.mat_rpt.push({
          sec: this.matriz_completa[i].idsecuencia,
          id: this.matriz_completa[i].orden,
          orden: this.matriz_completa[i].ordenar,
          nombre: this.matriz_completa[i].nombre,
          nombre_pieza: this.matriz_completa[i].nombre_pieza_p,
          nombre_pieza_s: this.matriz_completa[i].nombre_pieza,
          total_evidencias: 0,
          rpt_categorias_pieza: [],
          data: this.reporte_factor(
            this.matriz_completa[i].idsecuencia,
            this.matriz_completa[i].orden,
            this.matriz_completa[i].nombre
          )
        });
      }
    }

    for (const i in this.mat_rpt) {
      var evidencias_total = 0;
      for (var a in this.mat_rpt[i].data) {
        evidencias_total = evidencias_total + this.mat_rpt[i].data[a].cant_evidencia;
      }

      this.mat_rpt[i].total_evidencias = evidencias_total;
    }
    if (this.mat_rpt.length > 0) {
      this.fitro_cuantitativo = this.mat_rpt[0].id;
    }
  }

  reporte_factor(idsecuencia, num, nom) {
    //console.log(idsecuencia + ' @ ' + num + ' @ ' + nom);
    let nunfac = num;
    let nombrefac = nom;


    let fac_rpt = [];
    /*un reporte temporal para evaluar indicadores por factor y categoria*/
    let sec = 1;
    for (const i in this.matriz_completa) {
      if (this.matriz_completa[i].idsecuencia == idsecuencia) {
        fac_rpt.push({ id: sec, orden: this.matriz_completa[i].ordenar, data: this.matriz_completa[i] });
      }
    }


    let row = fac_rpt.length;
    let count = 1
    while (row >= count) {

      let muestra = 0;
      let pieza = 0;
      for (const a in fac_rpt) {
        if (fac_rpt[a].id == count) {
          muestra = fac_rpt[a].data.idsecuencia;
          pieza = fac_rpt[a].data.idpieza;
        }
      }

      if (pieza != this.pieza_evaluar_reporte) {

        for (const i in this.matriz_completa) {
          if (this.matriz_completa[i].idsecuencia_padre == muestra) {
            sec = sec + 1;
            fac_rpt.push({ id: sec, orden: this.matriz_completa[i].ordenar, data: this.matriz_completa[i] });
          }
        }
      }

      row = fac_rpt.length;
      count = count + 1
    }


    // this.esencial = 0;
    // this.importante = 0;
    // this.conveniente = 0;

    // this.ep = 0; this.ip = 0; this.cp = 0;
    // this.evidencias_ep = 0; this.evidencias_ip = 0; this.evidencias_cp = 0;

    const retorno = [];

    for (const i in fac_rpt) {
      if (fac_rpt[i].data.idpieza == this.pieza_evaluar_reporte) {
        retorno.push(fac_rpt[i].data);
      }
    }

    return retorno;

  }

  Consulta_categoria() {
    this.flag_envio = true;

    this.rest.acreditacion(this.prm).subscribe(
      (rs) => {
        //this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);

          this.categorias = datos.data;
          this.vista_reportes = true;

        }
        else {
          if (datos.error === '0') {
            this.categorias = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.prm.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.prm.consulta === 2) {
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

        if (this.prm.consulta > 1) {
          // document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )


  }

  Consulta_pieza() {
    this.flag_envio = true;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);
          this.piezas_esquema = datos.data;
          /* consulta las piezas e indica cual es la pieza a evaluar y la contenedora */
          for (var i in this.piezas_esquema) {
            if (this.piezas_esquema[i].act_pieza_contenedor_reporte === 1) {
              this.pieza_contenedor_reporte = this.piezas_esquema[i].idpieza;
            }
            if (this.piezas_esquema[i].act_pieza_evaluar_reporte === 1) {
              this.pieza_evaluar_reporte = this.piezas_esquema[i].idpieza;
              this.nombre_pieza_evaluada = this.piezas_esquema[i].nombre_p
            }
          }
          // si las piezas estan asignadas y completas realiza la generacion de los reportes
          // de lo contrario desactiva los reportes
          if (this.pieza_contenedor_reporte != 0 && this.pieza_evaluar_reporte != 0) {
            this.reporte_matriz();
            this.activa_reportes = 1;
          }
          else {
            this.vista_reportes = false;
          }

          if (this.solicitud.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.categorias = datos.data;
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

        if (this.solicitud.consulta > 1) {
          // document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )


  }

  Consulta_cualitativa() {
    this.flag_envio = true;

    this.rest.acreditacion(this.prm).subscribe(
      (rs) => {
        //this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);

          this.cualitativa = datos.data;
          if (this.prm.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.prm.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.prm.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.matriz_completa = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.prm.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.prm.consulta === 5) {
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

        if (this.prm.consulta > 1) {
          // document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )


  }

  Consulta_cripterios() {
    this.flag_envio = true;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        //this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent);

          this.cripterios = datos.data;
          if (this.solicitud.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.matriz_completa = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 5) {
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

        if (this.solicitud.consulta > 1) {
          // document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )


  }

  pieza_nodo(a: any) {
    /*cuando seleccionamos una de las piezas se activa
    la segunda vista.
    esto es lo que se explica en next_nodo()*/
    if (this.vista_lineal) {
      this.vista_lineal = false;
      this.muestra_piezas = a;
    }
    else {
      this.vista_lineal = true;
      this.muestra_piezas = 0;
    }

  }


  selecciona_pieza(id) {
    let valor = 0
    try {
      valor = this.piezas_esquema.filter(value => value.idpieza_padre === parseInt(id))[0].idpieza;
    } catch (error) {
      valor = null;
      console.log(error);
    }
    return valor
  }

  /**
   * En los metodos crear y editar se reunen los parametros y se le envian al componente 
   * 'FormNodoComponent' en donde se ejecuta ya se editar o crear.
   *  Al ejecutar alguna de las operaciones desde el componente hijo
   *  los valores son devueltos a 'guardar(data)' de este componente 
   * (componente padre) y ejecuta la consulta.
   */

  crear_nodo(data: acreditacion) {
    const pieza = this.selecciona_pieza(data.idpieza);
    if (pieza != null) {
      this.titulo_modal = data.nombre_pieza + ' [' + data.orden + '] ' + data.nombre.substring(0, 75);
      const arreglo = {
        idpieza: pieza,
        metodo: 1,
        consulta: 6,
        identidad: data.identidad,
        idesquema: this.prm_solicitud.idesquema,
        idsecuencia_padre: data.idsecuencia,
        idcripterio: 1,
        idmatriz: data.idmatriz,
        hijos: data.hijos
      }
      this.FormNodo.crear_nodo(arreglo);
      /**
       * ejecuta el metodo crear del componente hijo "FormNodoComponent".
       * esta funcion reune y trae de vuelta los parametros necesarios y
       * los ejecuta en la funcionm *guardar(data)* de este componente.
       */
    }
  }

  editar(data: acreditacion) {


    this.titulo_modal = data.nombre_pieza + ' [' + data.orden + '] ' + data.nombre.substring(0, 75);

    const arreglo = {
      metodo: 1,
      consulta: 7,
      idmatriz: data.idmatriz,
      orden: data.orden,
      identidad: data.identidad,
      idsecuencia_padre: data.idsecuencia_padre,
      descripcion: data.descripcion,
      nombre: data.nombre,
      idcategoria: data.idcategoria,
      idsecuencia: data.idsecuencia,
      idpieza: data.idpieza,


      hallasgo: data.hallasgo,
      hallasgo_par: data.hallasgo_par,
      idcualitativa: data.idcualitativa,
      puntuacion: data.puntuacion,
      puntuacion_par: data.puntuacion_par,

      anexo_2: data.anexo_2,
      anexo_1: data.anexo_1,
      idcripterio: data.idcripterio,
    }
    this.FormNodo.editar(arreglo);
  }

  guardar(data) {
    /*
      parametros devueltos desde el componente hijo 'FormNodoComponent'.
    */
    this.solicitud = JSON.parse(data);
    this.piezas = [];
    this.run();
  }

  open_crear(data: any) {
    const arreglo = {
      data: data,
      nombre_encabezado: this.nombre_encabezado,
      navegacion: this.breadcrumbArray
    }
    const paramatros = btoa(JSON.stringify(arreglo));

    this.router.navigate(['./home/crear-evidencias', paramatros]);
  }

  open_vista(data: any) {
    const arreglo = {
      data: data,
      nombre_encabezado: this.nombre_encabezado,
      navegacion: this.breadcrumbArray
    }
    const paramatros = btoa(JSON.stringify(arreglo));

    this.router.navigate(['./home/ver-evidencias', paramatros]);

  }

  reporte_global(modal: string) {
    // CODE
  }

  presentaciones_matriz(data: any, modal: string) {
    // CODE
  }

}
