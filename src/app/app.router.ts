import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent, MenuComponent, FooterComponent, MainComponent } from './core/layout/exportLayout';
import {
    HomeComponent, ColegiosComponent,
    SoftwareComponent, SoftwaresComponent, SedesComponent, UsuarioComponent, CompanySoftwareComponent,
    RolComponent, MenusComponent, MenuRolComponent,MenuUsuarioComponent, 

    SolicitudesTesisComponent, SolicitudTesisProfComponent,
    DatosSolicitudTesisComponent, 
    
    GestorDeEvaluacionesComponent, FormulariosComponent, FormulariosPreguntasComponent,
    FormulariosPeriodosComponent, EvaluacionesEmpleadoComponent, FormularioEvaluacionesComponent,
    EvaluacionesComponent, EncuestasEmpleadoComponent, FormComponent, GestorEvaluadoresRrhhComponent,

    MatrizComponent, AutoevaluacionComponent, ProyectosComponent, VerEvidenciasComponent, CrearEvidenciasComponent,
    VerContenidoProyectoComponent, AdministradorEntidadesComponent, AdministradorPiezasComponent, AdministradorEsquemasComponent,
    DiagramaGanttComponent, CambioContrasenaComponent,CrearMatrizComponent, UsuarioMatrizComponent, ArbolComponent
} from './View/exportView';
import { AuthGuard, LoginComponent, LockedComponent } from './auth/exportAuth';



const appRoutes: Routes = [
    // tslint:disable-next-line:max-line-length
    {
        path: 'home', component: LayoutComponent, canActivateChild: [AuthGuard],
        children: [
            { path: 'dashboard', component: HomeComponent },

            // CONTROL DE ACCESO
            { path: 'colegios', component: ColegiosComponent },
            { path: 'Sedes/:data', component: SedesComponent },
            { path: 'Usuarios/:data', component: UsuarioComponent },
            { path: 'Company-Software/:data', component: CompanySoftwareComponent },
            { path: 'Menu-Usuario/:data', component: MenuUsuarioComponent },
            { path: 'Softwares', component: SoftwaresComponent },
            { path: 'Roles/:data', component: RolComponent },
            { path: 'MenuRol/:data', component: MenuRolComponent },
            { path: 'Menus/:data', component: MenusComponent },


            // GESTION DE SOLICITUDES
            { path: 'solicitud-tesis', component: SolicitudesTesisComponent },
            { path: 'Solicitud-Tesis-Prof', component: SolicitudTesisProfComponent },
            { path: 'Datos-Solicitud-Tesis/:data', component: DatosSolicitudTesisComponent },


            // ULAT FORM
             { path: 'Evaluador', component: GestorDeEvaluacionesComponent },
             { path: 'Formularios', component: FormulariosComponent },
             { path: 'Formularios-Preguntas/:data', component: FormulariosPreguntasComponent },
             { path: 'Formularios-Periodos/:data', component: FormulariosPeriodosComponent },
             { path: 'Evaluaciones-Empleado/:data', component: EvaluacionesEmpleadoComponent },
             { path: 'Formulario-Evaluaciones/:data', component: FormularioEvaluacionesComponent },
             { path: 'Evaluaciones/:data', component: EvaluacionesComponent },
             { path: 'Encuestas-Empleado/:data', component: EncuestasEmpleadoComponent },
             { path: 'Gestor-Evaluadores-RRHH', component: GestorEvaluadoresRrhhComponent },
             { path: 'Gestor-Evaluadores-RRHH/:data', component: GestorEvaluadoresRrhhComponent },



             // ACREDITACIÓN
             { path: 'Matriz', component: MatrizComponent },
             { path: 'autoevaluacion/:data', component: AutoevaluacionComponent },
             { path: 'proyectos/:data', component: ProyectosComponent },
             { path: 'ver-evidencias/:data', component: VerEvidenciasComponent },
             { path: 'crear-evidencias/:data', component: CrearEvidenciasComponent },
             { path: 'ver-contenido/:data', component: VerContenidoProyectoComponent },
             { path: 'administrador-entidades', component: AdministradorEntidadesComponent },
             { path: 'administrador-esquemas/:data', component: AdministradorEsquemasComponent },
             { path: 'administrador-piezas/:data', component: AdministradorPiezasComponent },
             { path: 'diagrama-gantt/:data', component: DiagramaGanttComponent },
             { path: 'cambio-contraseña', component: CambioContrasenaComponent },

           { path: '**', redirectTo: 'dashboard' }

         ], canActivate: [AuthGuard]
        },

    // LOGIN
    { path: 'login', component: LoginComponent },
    { path:'form/:data', component: FormComponent},
    { path: 'loked', component: LockedComponent, canActivate: [AuthGuard] },
    { path: 'software', component: SoftwareComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'software' },
    
];

export const routing = RouterModule.forRoot(appRoutes);
export const views = [
                        // LOGIN
                        LoginComponent, LockedComponent,

                        // CORE
                        LayoutComponent, MenuComponent, FooterComponent, MainComponent,
                        HomeComponent,


                        // CONTROL DE ACCESO
                        SoftwareComponent,ColegiosComponent, SoftwaresComponent, SedesComponent, UsuarioComponent, 
                        CompanySoftwareComponent,RolComponent, MenusComponent, MenuRolComponent,
                        MenuUsuarioComponent,


                        // GESTION DE SOLICITUDES
                        SolicitudesTesisComponent, SolicitudTesisProfComponent,
                        DatosSolicitudTesisComponent,

                        // ULAT FORM
                        GestorDeEvaluacionesComponent, FormulariosComponent, FormulariosPreguntasComponent,
                        FormulariosPeriodosComponent, EvaluacionesEmpleadoComponent, FormularioEvaluacionesComponent,
                        EvaluacionesComponent, EncuestasEmpleadoComponent, FormComponent, GestorEvaluadoresRrhhComponent,

                        //ACREDITACION
                        MatrizComponent, AutoevaluacionComponent, ProyectosComponent, VerEvidenciasComponent, CrearEvidenciasComponent,
                        VerContenidoProyectoComponent, AdministradorEntidadesComponent, AdministradorPiezasComponent,
                        AdministradorEsquemasComponent, DiagramaGanttComponent, CambioContrasenaComponent,
                        CrearMatrizComponent, UsuarioMatrizComponent, ArbolComponent
];
