import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  nombre:String;
  constructor() { }

  ngOnInit() {
   this.nombre = JSON.parse(atob(localStorage._tokentUser)).nombre;
  }

}
