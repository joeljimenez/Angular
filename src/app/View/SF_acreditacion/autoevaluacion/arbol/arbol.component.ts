import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { Permisos } from '../../../../Service/export';
@Component({
  selector: 'app-arbol',
  templateUrl: './arbol.component.html',
  styleUrls: ['./arbol.component.css']
})
export class ArbolComponent implements OnInit, AfterContentInit {

  @Input() visor = [];
  @Output() Admin = new EventEmitter();
  @Output() Crear = new EventEmitter();
  @Output() Editar = new EventEmitter();
  @Output() Vista = new EventEmitter();
  permisos = new Permisos().access;
  constructor() {

   }

  ngOnInit() {
  }
  ngAfterContentInit() {
    if (sessionStorage.select_matriz == null || sessionStorage.select_matriz === undefined) {
      sessionStorage.select_matriz = '[]';
      }
  }

  Toggle(a) {
    // const x = document.getElementById(id);
    // const fa = document.getElementById('fa' + id);
    // if (x.className.indexOf('w3-show') === -1) {
    //     x.className += ' w3-show';
    //     fa.className = fa.className.replace(' fa-plus', ' fa-minus');
    // } else {
    //     x.className = x.className.replace(' w3-show', '');
    //     fa.className = fa.className.replace(' fa-minus', ' fa-plus');
    // }

    const data = JSON.parse(sessionStorage.select_matriz);

    let entra = true;
    for (const d in data) {
        if (data[d].idsecuencia == a.idsecuencia) {
          if (a.muestra == 'w3-hide'){

            data[d].muestra = 'w3-show';
            data[d].ico = 'fa-minus';

            a.muestra =  'w3-show';
            a.ico = 'fa-minus';

          }
          else
          {
            data[d].muestra = 'w3-hide';
            data[d].ico = 'fa-plus';

            a.muestra =  'w3-hide';
            a.ico = 'fa-plus';
          }

            entra = false;
        }
    }

    if (entra) {
        data.push({ idsecuencia: a.idsecuencia,
                    muestra:  'w3-show',
                    ico: 'fa-minus'
                  });
        a.muestra =  'w3-show';
        a.ico = 'fa-minus';
    }

    sessionStorage.select_matriz = JSON.stringify(data);
  }

  admin(a) {
    this.Admin.emit(a);
  }

  crear(a) {

    this.Crear.emit(a);
  }

  editar(a) {
    this.Editar.emit(a);
  }

  vista(a) {
    this.Vista.emit(a);
  }

  seccionSelect(idsecuencia, select) {

    const data = JSON.parse(sessionStorage.select_matriz);

    let entra = true;
    for (const d in data) {
        if (data[d].idsecuencia === idsecuencia) {
            data[d].select = select;
            entra = false;
        }
    }

    if (entra) {
        data.push({ idsecuencia: idsecuencia, select: select });
    }



    sessionStorage.select_matriz = JSON.stringify(data);

}
}
