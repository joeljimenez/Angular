
export class Servicios {
    /** esta clase representa el arreglo de datos para la api  */
    idservicio: string;
    nombre: string;
    descripcion: string;
    monto: number;
    permite_descuento: number;
}

export class GradosAcademicos {

    idgrado_academico: number;
    nombre: string;
    descripcion: string;
}

export class Bachillerato {
    idgrado_academico: number;
    idbachillerato: number;
    nombre: string;
    descripcion: string;
}

export class BachilleratoPlan {
    idgrado_academico: number;
    idbachillerato: number;
    idbachillerato_plan: number;
    idmodalidad: number;
    idsec_plan: number;
    nombre: string;
    descripcion: string;
    vigencia_inicio: number;
    vigencia_final: number;
    estado: number;
}

export class BachilleratoPlanCosto {
    idgrado_academico: number;
    idbachillerato: number;
    idbachillerato_plan: number;
    idbachillerato_plan_costo: number;
    descripcion: string;
    vigencia_inicio: number;
    vigencia_final: number;
    estado: number;
}

export class BachilleratoPlanCostoServicio {
    idgrado_academico: number;
    idbachillerato: number;
    idbachillerato_plan: number;
    idbachillerato_plan_costo: number;
    idservicio: string;
    monto: number;
    financiamiento: number;
    servicio: string;
    permite_descuento: number;

}

export class BachilleratoPlanMateria {
    idgrado_academico: number;
    idbachillerato: number;
    idbachillerato_plan: number;
    idmateria: string;
    nombre: string;
    creditos: number;
    horas_teoricas: number;
    horas_practicas: number;
    es_ingles: number;
    tiene_laboratorio: number;
}

export class BachilleratoPlanNiveles {
    idgrado_academico: number;
    idbachillerato: number;
    idbachillerato_plan: number;
    idnivel: number;
    numero_romano: string;
    letra: string;
    nombre: string;
    idturno: number;
    cantidad: number;
    let_turno: string;
    nom_turno: string;
}

export class SecPlan {
    idsec_plan: number;
    nombre: string;
    orden: number;
}

export class Modalidades {
    idmodalidad: number;
    nombre: string;
    meses: number;
}

export class Materias {
    idmateria: string;
    nombre: string;
    descripcion: string;
    activa: string;
}

export class MateriasGrado {
    idmateria: string;
    idgrado_academico: number;
    nombre: string;
    descripcion: string;
    Gdescripcion: string;
    Gnombre: string;
}

export class Discapacidades {
    iddiscapacidad: number;
    nombre: string;
    imagen: string;
}

export class Caja {
    idcaja: number;
    nombre: string;
    descripcion: string;
}

export class Estudiante {
    cedula: string;
    nombre: string;
    nombre2: string;
    apellidop: string;
    apellidom: string;
    fecha_nacimiento: any;
    telefono: string;
    idsexo: number;
    idtipo_sangre: number;
    idnacionalidad: number;
    idpais: number;
    idprovincia: number;
    iddistrito: number;
    idcorregimiento: number;
    direccion: string;
    idmanoutilizada: number;
    sexo: string;
    tipo_sangre: string;
    mano_utilizada: string;
    nacionalidad: string;
    pais: string;
    provincia: string;
    distrito: string;
    corregimiento: string;
    correo: string;
    libreta: string;
}

export class EstudianteAcudientes {
    cedula_acudiente: string;
    idacudiente: number;
    idparentesco: number;
    nombre: string;
    direccion: string;
    telefono: string;
    principal: number;
    autorizado: number;
    estado: number;
    parentesco: number;
}

export class EstudianteBachilleratoPlan {
    cedula: string;
    idgrado_academico: number;
    idbachillerato: number;
    idbachillerato_plan: number;
    idbachillerato_plan_costo: number;
    anio_inicio: number;
    bachillerato_vigente: number;
    grado: string;
    bachillerato: string;
    plan: string;
    costo: string;
}

export class Sexo {
    idsexo: number;
    nombre: string;
    signo: string;
}

export class TipoSangre {
    idtipo_sangre: number;
    rh: string;
    letra: string;
}

export class ManoUtiliza {
    idmanoutilizada: number;
    nombre: string;
    siglas: string;
    imagen: string;
}

export class Pais {
    idpais: number;
    nombre: string;
    nacionalidad: string;
    codigo_pais: string;
}


export class Provincia {
    idpais: number;
    idprovincia: number;
    nombre: string;
}

export class Distrito {
    idpais: number;
    idprovincia: number;
    iddistrito: number;
    nombre: string;
}

export class Corregimiento {
    idpais: number;
    idprovincia: number;
    iddistrito: number;
    idcorregimiento: number;
    nombre: string;
}

export class Parentesco {
    idparentesco: number;
    nombre: string;
}

export class Becas {
    idbecas: number;
    idtipo_caracteristica: number;
    tipo_caracteristica: string;
    idtipo_certificado: number;
    tipo_certificado: string;
    descripcion: string;
    monto: number;
    estado: number;
    siglas: string;
}

export class Certificados {
    idtipo_certificado: number;
    nombre: string;
}

export class Caracteristica {
    idtipo_caracteristica: number;
    nombre: string;
}

export class BecasServicios {
    idbecas: number;
    idservicio: string;
    nombre: string;
    monto: number;
    permite_descuento: number;
}

export class Oferta {
    anio_inicio: number;
    fecha_inicio: any;
    fecha_fin: any;
}

export class OfertaCupo {
    idgrado_academico: number;
    idbachillerato: number;
    idbachillerato_plan: number;
    nombre: string;
    estado: number;
    cantidad: number;
    ocupados: number;
}

export class Turnos {
    idturno: number;
    nombre: string;
    letra: string;
}

export class Usuarios {
    id_usuario: number;
    estado: number;
    cedula: string;
    telefono: string;
    celular: string;
    nombre: string;
    apellido: string;
    direccion: string;
    correo: string;
    fecha_nacimiento: any;
    idsexo: number;
    sexo: string;
    idtipo_sangre: number;
    tipo_sangre: string;
    idmanoutilizada: number;
    mano_utilizada: string;
    password: string;
}

export class Roles {
    id_roles: number;
    idrole: number;
    nombre: string;
    idsoftware: number;
    role:string;
    software:string;
    roles :Array<Roles>;
    descripcion:string;

}

export class RolesMenu {
    id_roles: number;
    id_menu: number;
    nombre: string;
    registrar: number;
    actualizar: number;
    eliminar: number;
    estado: number;
    muestra: number;
    id_menu_padre: number;
    menu: any;
}

export class Menu {
    id_menu: number;
    id_tipo_menu: number;
    id_menu_padre: number;
    orden: number;
    muestra: number;
    nombre: string;
    descripcion: string;
    titulo: string;
    link: string;
    estado: number;
}


export class software {
    idsoftware: number;
    idrole: number;
    nombre: string;
    descripcion: string;
    modulos:any;
}

export class colegio {
    idcompany: number;
    nombre: string;
    siglas: string;
    registro_fiscal: string;
    email: string;
    telefono: string;
    web: string;
    direccion: string;
    facebook: string;
    twitter: string;
    color_primario: string;
    color_secundario: string;
    color_extra: string;
    ruta_imagen: string;
}
export class Restmenu {
    error: string;
    exito: boolean;
    mensaje: string;
    tokent: string;
    data: any;
}


export class Modulo {
    idmodulo: number;
    nombre: string;
    estado:number;
    link:string;
    descripcion:string;
}

export class Modulo_Role {
    idsoftware: number;
    idrole: number;
    idmodulo: number;
    estado: number;
    nombre: string;
    descripcion:string;
}

export class Sedes {
    nombre:string;
    descripcion:string;
    idcompany:number;
    idsede:number;
}

export class Usuario{
    idcompany:number;
    idsede:number;
    idusuario:number;
    id_usuario:number;
    es_estudiante:number;
    es_administrativo:number;
    es_profesor:number;
    nombre:string;
    apellido:string;
    cedula:string;
    mail:string;
    password:string;
    fecha_registro:Date;
    company:string;
    contidad_usuarios:number;
    sede:string;
    estado:number;    

}


export class CompanySoftware{
    idcompany:number;
    idsede:number;
    idusuario:number;
    id_usuario:number; 
    idrole:0;
    idsoftware:0;
    role:'';
    software:'';
    sede:string;
    nombre:string;
    idmenu:0;
    menu:''

}

export class menus{
    idmenu:number;
    idsoftware:number;
    idtipo_menu:number;
    idpadre:number;
    orden:number;
    estado:number;
    software:string;
    tipo_menu:string;
    nombre:string;
    link:string;
    descripcion:string;
    muestra:number;
}

export class tipoMenu{
    idmenu:number;
    nombre:string;
}

export class RoleMenu {
    idsoftware: number;
    idrole: number;
    idmenu: number;
    estado: number;
    crear: number;
    editar: number;
    eliminar: number;
    principal: number;
    menu: string;
    idtipo_menu: number;
    idpadre: number;
    orden: number;
    roles: string;
}
export class MenuUsuario{
    idsoftware: number;
    idcompany: number;
    idusuario: number;
    idmenu: number;
    estado: number;
    crear: number;
    editar: number;
    eliminar: number;
    principal: number;
    software: '';
    menu: '';
}

export class solicitudes{
    sede:string;
    id_solicitud:number;
    estado_solicitud:string;
    tema:string;
    problema_investigar:string;
    razon_tema:string;
    obj_general:string;
    obj_especifico: string;
    aportes: string;
    director: string;
    observacion_director: string;
    jurado: string;
    jurado_alterno:string;
    decano: string;
    observacion_decano: string;
    fecha_creacion:Date;
    usuario: string;
    titulo:string;
    anio: number;
    periodo:number;
    linea_investigacion: number;
    id_linea_inv: number;
    fecha:Date;
    bitacoras: Array<solicitudes>;
    fecha_bitacora:Date;
    estado_solicitud_bitacora:string;

    carrera:string;
    facultad:string;
    enfasis:string;
    plan_estudio:string;

    dir_nom:string;
    ju_nom:string;
    jua_nom:string;
    correo_principal:string;
    nombre_principal:string;
    dec_nom:string;

    est_vista:boolean;
    detalleProf:number;

    est_nom:string;
    cedula:string;
    envio:string;
    mensaje_estado:string;
    mensaje_estado_bool:boolean;
    btn_estado_bool:boolean;
    aviso:string;
    navegacion:any;
}


export class formularios{
    nombre:string;
    idformulario: number;
    idtipo_formulario:number;
    idtipo_periodo: number;
    estado:number;
    orden: number;
    idarea_formulario:number;
    area_evaluacion:string;
    orden_area:number;
    nombre_area:string;
    idtipo_respuesta : number;
    act_observacion : string;
    contesta_evaluado:number;
    idpregunta_formulario:number;
    pregunta:string;

    idevaluacion: number;
    idtipo_respuesta_opcion: number;
    resouesta_texto: string;
    envio:number;
    periodo:number;
    anno:number;
    idempleado:number;
}
export class empleados{
    apellido:string;
    apellido2:string;
    cedula:string;
    dependientes:boolean;
    email:string;
    estado:string;
    idempleado:number;
    nombre:string;
    nombre2:string;
    RH09EMP:number;
    RH27COD:string;
    RH27DES:string;
    RH28COD:string;
    RH28DES:string;
    sexo:string;
    anno:number;
    periodo:number;
    idformulario:number;
    hash:string;
    nombre_evaluador:string;
    nombre_from:string;
    idevaluacion:number;
    email2:string;
    nombre_empleado:string;
}

export class periodos{
    anno:number;
    periodo:number;
    estado:number;
    idformulario: number;
}

export class evaluaciones{
    anno: number;
    cedula: string;
    confirmacion: number;
    departamento: string;
    estado: number;
    fecha_aprobacion: string;
    fecha_evaluacion: string;
    idempleado: number;
    idevaluacion: number;
    idformulario: number;
    idsede: string;
    idsede_empleado:number;
    nombre: string;
    nombre_empleado: string;
    periodo: number;
    puesto: string;
    sede: string;
    sede_empleado: string;
    universidad: string;
}


export class acreditacion{
    hijos: any;
        idevidencia: number; 
        idcualitativa: number;     
        idsecuencia: number;      
        identidad: number;       
        idmatriz: number;       
        idpieza: number;     
        idsecuencia_padre: number;     
        idcategoria: number;     
        idcripterio: number; 
        idesquema: number; 
        idcarpeta: number; 
        idcarpeta_padre: number; 
        id_recolector_proyecto: number; 
        id_recolector_proyecto_evidencia: number; 
        idsecuencia_pro: number; 
        idsecuencia_pro_padre: number; 
        idpieza_proyecto: number; 
        idtarea_pro: number; 
        id_usuario_rpt: number; 
        id_usuario: number; 
        id_colegio: number; 
        id_referencia: number; 
        idlista: number;
        iddata_lista: number;
        idevidencia_pro: number;

        presupuesto: number;;
        referencia: number;
        orden : number;
        puntuacion: number;
        puntuacion_par: number;
        es_responsable: number;

        metodo: number;
        esmatriz: number;
        estado: number;
        periodo: number;

        vigencia_inicio: number;
        vigencia_fin: number;
        act_nombre: number;
        act_descripcion: number;
        act_hallasgo: number;
        act_categoria: number;
        act_cripterio: number;
        act_evidencia: number;
        act_anexo_1: number;
        act_anexo_2: number;
        act_anexo_3: number;
        act_pieza_contenedor_reporte: number;
        act_pieza_evaluar_reporte: number;
        act_presupuesto: number;
        act_objetivo: number;
        act_gantt: number;

        fecha_inicio: string;
        fecha_cierre: string;
        anexo_2: string;
        anexo_1: string;
        anexo_3: string;
        nom_anexo_1: string;
        nom_anexo_2: string;
        nom_anexo_3: string;
        nombre: string;
        nombre_p: string;
        descripcion: string;
        imagen: string;
        hallasgo: string;
        hallasgo_par: string;
        script: string;
        extencion: string;
        apellido: string;
        email: string;
        objetivo: string;

        porcentaje: number;
        defaul: number;
        password: string;
        new_password: string;


        enero: number;
        febrero: number;
        marzo: number;
        abril: number;
        mayo: number;
        junio: number;
        julio: number;
        agosto: number;
        septiembre: number;
        octubre: number;
        noviembre: number;
        diciembre: number;

        nombre_pieza: string;
}