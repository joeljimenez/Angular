import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RestService,AuthService, Parametros, software, Restmenu, Modulo } from '../../Service/export'
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {

  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: software;
  datos: software[];
  Restmenu: Restmenu;
  Modulo: Modulo[];
  nombreSoftware:string;
  contentApp:number;


    // Usamos el decorador Output
    @Output() ActMenu = new EventEmitter();
    // public nombre:string;

  constructor(private auth: AuthService, private rest: RestService, private router: Router )
  {
   // this.nombre = "Pueblo de la Toscana";

    this.Modulo = [{
      idmodulo: 0,
      nombre:'',
      descripcion:'',
      estado:0,
      link:''
    }]
    this.Restmenu = { mensaje: '', data: [], error: '', exito: false, tokent: '' };
   }


  ngOnInit() {
    this.contentApp = document.getElementById('ancho').offsetWidth;
    this.solicitud.metodo = 1;
    this.solicitud.consulta = 5;
    this.run();
  }

  run() {
    this.flag_envio = true;

    this.rest.controlAcceso(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.rest.NuevoTokent(datos.tokent)
          this.respuesta = datos.data;
          localStorage.setItem('_softwares', btoa(JSON.stringify(this.respuesta)));
        }
        // tslint:disable-next-line:one-line
        else {
          if (datos.error === '0') {
            this.respuesta = datos.data;
          }
          // tslint:disable-next-line:one-line
          else {
            this.mensaje_error = this.rest.Control_error(datos.error);
            this.rest.NuevoTokent(datos.tokent);
          }
        }
      },
      (err) => { },
      () => { }
    )
  }

  selectSoftware(a){
    sessionStorage.removeItem('breadcrumbArray');
    sessionStorage.setItem('_sede', a.idsede);
    localStorage.setItem('_idsoftware', btoa(JSON.stringify(a.idsoftware)));
    this.solicitud.idsoftware = a.idsoftware;
    this.solicitud.metodo = 4;
    this.cargaMenu();

  }

  cargaMenu() {
    this.auth.Menu(this.solicitud).subscribe(
      (rs) => {
        this.Restmenu = JSON.parse(rs.text());
        if (this.Restmenu.exito) {
          let data = [];
          let index = 0;
          let principal = 0;
          for (let i in this.Restmenu.data){
            if(this.Restmenu.data[i].principal === 1){principal = this.Restmenu.data[i].link}
            if(this.Restmenu.data[i].idpadre == 0){
              data.push(this.Restmenu.data[i]);
              index = data.length - 1;
              data[index].menu = [];
            for (var key in this.Restmenu.data) {
              if (this.Restmenu.data[key].idpadre ==  this.Restmenu.data[i].idmenu) {
                  data[index].menu.push(this.Restmenu.data[key]);
              }
            }
          }
          }
          localStorage.setItem('_menuUser', btoa(JSON.stringify(data)));
          this.router.navigate(['home/' + principal]);
          
          // Cuando se lance el método 'cargaMenu()' , Utilizamos el metodo emit para comuniacal selector'app-software'
          // y ejecutar el metodo 'actualizaMenu()', para actualizacion de menu del software seleccionado.
          this.ActMenu.emit();
        }
        else { }
      },
      (err)=>{this.Restmenu.mensaje = 'Error 404 Servidor desconectado.';}
    )
  }
}



