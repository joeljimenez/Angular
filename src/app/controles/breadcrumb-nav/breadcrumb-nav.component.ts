import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Permisos} from '../../Service/export';

@Component({
  selector: 'app-nav',
  templateUrl: './breadcrumb-nav.component.html',
  styleUrls: ['./breadcrumb-nav.component.css']
})
export class BreadcrumbNavComponent implements OnInit {
  permisos = new Permisos().access;
  @Input() breadcrumb: any[];
  @Input() titulo: string;
  @Input() sede: boolean;
  @Input() btnCrear: boolean;
  @Output() SelectSede = new EventEmitter();
  @Output() Crear = new EventEmitter();

  sedes = [];
  idsedeSession: any;
  constructor(private router: Router) { }

  ngOnInit() {
    this.sedes =
    [
      { id: '1', nombre: 'Central', estado:0 },
      { id: '2', nombre: 'Medicina', estado: 0 },
      { id: '3', nombre: 'Santiago', estado: 0 },
      { id: '4', nombre: 'Chitré', estado: 0 },
      { id: '5', nombre: 'David', estado: 0 },
      { id: '7', nombre: 'Penonomé', estado: 0 }
    ];

    this.idsedeSession = sessionStorage._sede;
  }

  seleccionaNav(data){
    if(data.datos != ''){
        const paramatros = btoa(JSON.stringify(data.datos));
        this.router.navigate([data.ruta, paramatros]);
    }else{
      this.router.navigate([data.ruta]);
    }
    
  }

  selecSede(a){
    sessionStorage.setItem('_sede', a);
    this.SelectSede.emit();

    let url = window.location.hash.split('/')[2];
    /* 

    Ejemplo:
    let url = #/home/Gestor-Evaluadores-RRHH/eyJpZGVtcGxlYWRvIj
    url[0] = '#' , url[1] = 'home' , url[2] = 'Gestor-Evaluadores-RRHH', url[3] =eyJpZGVtcGxlYWRvIj , 
    
    */
    if(url === 'Evaluador'){
      this.router.navigate(['home/Evaluador']);
    }
    
  }

  crear(){
    this.Crear.emit();
  }
}
