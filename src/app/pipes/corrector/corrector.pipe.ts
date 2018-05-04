import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'corrector'
})
export class CorrectorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var junk = value;
    
    
            if (value != undefined || value != "") {
                junk = junk.replace(/┴/gi, "A");
                junk = junk.replace(/¾/gi, "ó");
                junk = junk.replace(/‗/gi, "ó");
                junk = junk.replace(/&#190;/gi, "ó");
                junk = junk.replace(/&#243;/gi, "ó");
                junk = junk.replace(/Ý/gi, "í");
                junk = junk.replace(/&#221;/gi, "í");
                junk = junk.replace(/&#237;/gi, "í");
                junk = junk.replace(/&#225;/gi, "á");
                junk = junk.replace(/ß/gi, "á");
                junk = junk.replace(/&#233;/gi, "é");
                junk = junk.replace(/&#208;/gi, "Ñ");
                junk = junk.replace(/&#209;/gi, "Ñ");
                junk = junk.replace(/Ð/gi, "Ñ");
                junk = junk.replace(/Ú/gi, "é");
                junk = junk.replace(/·/gi, "u");
                junk = junk.replace(/±/gi, "ñ");
                junk = junk.replace(/&#241;/gi, "ñ");
                junk = junk.replace(/╔/gi, "E");
                junk = junk.replace(/³/gi, "ü");
                junk = junk.replace(/═/gi, "Í");
                junk = junk.replace(/┌/gi, "Ú");
                junk = junk.replace(/ð/gi, "ñ");
                junk = junk.replace(/¥/gi, "ó");
                junk = junk.replace(/Ë/gi, "Ó");
                junk = junk.replace(/&#63/gi, "v");
                junk = junk.replace(/\n/gi, "<br/>");
                
            }
            return junk;
  }

}
