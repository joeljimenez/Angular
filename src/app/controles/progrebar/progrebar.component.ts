import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progrebar',
  templateUrl: './progrebar.component.html',
  styleUrls: ['./progrebar.component.css']
})
export class ProgrebarComponent implements OnInit {
 @Input() cantidad: number;
 @Input() confirmados: number;

 procentaje: string;
  constructor() {
   }

  ngOnInit() {
    this.procentaje =  parseFloat( ((this.confirmados / this.cantidad) * 100).toString() ).toFixed(0) + '%';
  }
 
}
