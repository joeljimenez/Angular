import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';

import { routing, views } from './app.router';
import { AuthService, RestService } from './Service/export';
import { AuthGuard } from './auth/exportAuth';
import { SkinPinnerComponent } from './skin-pinner/skin-pinner.component';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import { SimpleNotificationsModule } from 'angular2-notifications';
// import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgPipesModule } from 'ngx-pipes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Md2Module } from 'md2';
import { CorrectorPipe, MaxLengthPipe } from './pipes/export';
import { HtmlConvertPipe } from '../app/pipes/export';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatrizComponent } from './View/SF_acreditacion/matriz/matriz.component';
import { ProgrebarComponent } from './controles/progrebar/progrebar.component';
import { BreadcrumbNavComponent } from './controles/breadcrumb-nav/breadcrumb-nav.component';
import { InputFileComponent } from './controles/input-file/input-file.component';
import { FormNodoComponent, EvidenciaComponent,ControlCarpetasComponent, ControlEvidenciaComponent, FormNodoProyectoComponent,
         ListaProyectoComponent, ControlGanttComponent} from './controles/acreditacion/export_controles_acreditacion';


@NgModule({
  declarations: [ AppComponent, views, SkinPinnerComponent, CorrectorPipe, 
                  MaxLengthPipe, MatrizComponent, HtmlConvertPipe, ProgrebarComponent, 
                  BreadcrumbNavComponent, FormNodoComponent,
                  EvidenciaComponent, InputFileComponent, ControlCarpetasComponent, ControlEvidenciaComponent, 
                  FormNodoProyectoComponent, ListaProyectoComponent, ControlGanttComponent],
  imports:      [ BrowserAnimationsModule, BrowserModule, routing,
                  HttpModule, FormsModule, SimpleNotificationsModule.forRoot(), NgPipesModule,
                  Md2Module],
  providers:    [ {provide: LocationStrategy, useClass: HashLocationStrategy},
                  AuthGuard, AuthService, RestService, DateValueAccessorModule],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
