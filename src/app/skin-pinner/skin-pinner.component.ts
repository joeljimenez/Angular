import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'control-skin',
  templateUrl: './skin-pinner.component.html',
  styleUrls: ['./skin-pinner.component.css']
})
export class SkinPinnerComponent implements OnInit {

  @Input() estado: boolean;
  @Input() skin: number;

  constructor() { }

  ngOnInit() {
  }

}
