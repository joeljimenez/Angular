import { Component, OnInit } from '@angular/core';
import {SoftwareComponent} from '../../../Software/software/software.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  nombre: String;
  menu:any;
  softwares:any;
  constructor() { }

  ngOnInit() {
    this.nombre = JSON.parse(atob(localStorage._tokentUser)).nombre.split(' ')[0];
    this.menu = JSON.parse(atob(localStorage._menuUser));
    this.softwares = JSON.parse(atob(localStorage._softwares));
  }

  // refresca el menu guardado en el localStorage en el cambio de aplicaciones.
  actualizaMenu():void{
    this.menu = JSON.parse(atob(localStorage._menuUser));
    this.app_close();
  }


  w3_open() {
    let mySidebar = document.getElementById("mySidebar");
    let overlayBg = document.getElementById("myOverlay");
    if (mySidebar.style.display === 'block') {
      mySidebar.style.display = 'none';
      overlayBg.style.display = "none";
    } else {
      mySidebar.style.display = 'block';
      overlayBg.style.display = "block";
    }
  }
  w3_close() {
    let mySidebar = document.getElementById("mySidebar");
    let overlayBg = document.getElementById("myOverlay");
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
  }
  myAccFunc(a) {
    var x = document.getElementById("demoAcc"+a);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
  
  }


  app_open(){
    let mySidebar = document.getElementById("SidebarApp");
    let overlayBg = document.getElementById("AppOverlay");
    if (mySidebar.style.display === 'block') {
      mySidebar.style.display = 'none';
      overlayBg.style.display = "none";
    } else {
      mySidebar.style.display = 'block';
      overlayBg.style.display = "block";
    }
  }
  app_close(){
    let mySidebar = document.getElementById("SidebarApp");
    let overlayBg = document.getElementById("AppOverlay");
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
  }

}
