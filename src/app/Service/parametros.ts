
export class Parametros {
    public server_rest = 'http://localhost:54636/';
    //public server_rest = 'https://service.ulatina.edu.pa/';
    public fecha = new Date();
    public prm = {
        consulta: 0,
        id_usuario:  0,

        registrar: 0,
        actualizar: 0,
        eliminar: 0,

        muestra: 0,
        link: '',
        titulo: '',

        principal: 0,
        autorizado: 0,
        estado: 0,
        password: '',

        nombre: '',
        cedula: '',

        tokent: ( localStorage._tokentUser !== undefined) ? JSON.parse(atob(localStorage._tokentUser)).tokent : '',
        metodo: 0,

        idusuario:  0,
        idmenu: 0,
        idtipo_menu: 0,
        idroles: 0,
        idmodulo:0,
        idsoftware:0,
        idcolegio:0,
        idcompany:0,
        descripcion: '',
        siglas: '',
        registro_fiscal: '',
        email: '',
        telefono: '',
        web: '',
        direccion: '',
        facebook: '',
        twitter: '',
        color_primario: '',
        color_secundario: '',
        color_extra: '',
        ruta_imagen: '',
        idsede:0,
        es_estudiante: 0,
        es_administrativo: 0,
        es_profesor: 0,
        apellido:'',
        mail:'',
        colegio:'',
        role:'',
        sede:'',
        software:'',
        idrole:0,
        orden:0,
        idpadre:0,
        crear: 0,
        editar:0,
        estado_solicitud: '',
        id_solicitud:0,
        mensaje:'',
        mensajeAPE:'',
        correo_decano:'',
        correo_director:'',
        envio:'',
        fecha_inicio: Date,
        fecha_fin: Date,
        proceso:0,
        profesor:'',
        cod_carrera:'',
        cod_facultad:'',
        cod_enfasis:'',
        cod_plan:'',

        estado_sol: '',
        tema:'',
        problema_investigar:'',
        razon_tema:'',
        obj_general:'',
        obj_especifico:'',
        aportes:'',
        director:'',
        observacion_director:'',
        jurado:'',
        jurado_alterno:'',
        observacion_decano:'',
        es_solicitante:0,
        id_linea_inv:0,

        dir_nom:'',
        ju_nom:'',
        jua_nom:'',
        correo_principal:'',
        nombre_principal:'',
        dec_nom:'',
        correo:'',
        cedula_est:'',





        idformulario:0,
        idtipo_formulario:0,
        idtipo_periodo:0,
        idarea_formulario:0,
        idpregunta_formulario:0,
        idtipo_respuesta:0,
        act_observacion:'',
        anno:0,
        periodo:0,
        contesta_evaluado:0,
        idempleado:0,
        cedula_evaluado:'',
        departamento:'',
        iddepartamento:'',
        puesto:'',
        idpuesto:0,
        idevaluacion: 0,
        idtipo_respuesta_opcion:0,
        resouesta_texto:'',
        hash:'',
        email2:'',


        RH28COD: '',
        RH27COD: '',
        nombre2: '',
        apellido2: '',
        sexo: '',
        estadoText: '',
        evaluador: 0,
        evaluador_old:0,
        idempleado_admin:'',
        
        id_correos_envio:0,
        correo_destinatario: '',
        asunto: '',
        cuerpo: '',
        archivos: '',
        id_departamento: 0,

        idevidencia: 0, 
        idcualitativa:  0,     
        idsecuencia:  0,      
        identidad:  0,    
        idmatriz:  0,  
        idpieza:  0,
        idsecuencia_padre:  0,
        idcategoria:  0,
        idcripterio:  0,
        idesquema:  0,
        idcarpeta: 0,
        idcarpeta_padre: 0,
        id_recolector_proyecto:  0,
        id_recolector_proyecto_evidencia:  0,
        idsecuencia_pro:  0,
        idsecuencia_pro_padre: 0,
        idpieza_proyecto:  0,
        idtarea_pro:  0,
        id_usuario_rpt:  0,
        id_colegio: 0,
        id_referencia:  0,
        idlista:  0,
        iddata_lista:  0,
        idevidencia_pro:  0,

        presupuesto:  0,
        referencia:  0,
        puntuacion: 0,
        puntuacion_par: 0,
        es_responsable:  0,
        
        esmatriz:  0,

        vigencia_inicio: 0,
        vigencia_fin:  0,
        act_nombre:  0,
        act_descripcion: 0,
        act_hallasgo:  0,
        act_categoria:  0,
        act_cripterio:  0,
        act_evidencia:  0,
        act_anexo_1:  0,
        act_anexo_2:  0,
        act_anexo_3:  0,
        act_pieza_contenedor_reporte: 0,
        act_pieza_evaluar_reporte:  0,
        act_presupuesto:  0,
        act_objetivo:  0,
        act_gantt:  0,

        fecha_cierre: '', 
        anexo_2: '',
        anexo_1: '',  
        anexo_3: '',  
        nom_anexo_1: '', 
        nom_anexo_2: '',  
        nom_anexo_3:  '',
        nombre_p: '',
        imagen:  '',  
        hallasgo:  '', 
        hallasgo_par:  '',
        script:  '',  
        extencion:  '',
        objetivo:  '',

        porcentaje: 0,  
        defaul:  0,  
        new_password:  '',


        enero:  0,  
        febrero: 0,  
        marzo:  0,  
        abril:  0,  
        mayo:  0,  
        junio:  0,  
        julio: 0,  
        agosto:  0,  
        septiembre:  0,  
        octubre:  0,  
        noviembre:  0,  
        diciembre: 0
    }

    public tema1 = { // naranja
        r: 255,
        b: 102,
        g: 51
    };
    public tema2 = { // naranja
        r: 0,
        b: 85,
        g: 137
    };

    public colegio = 'Colegio Bilingüe de Panamá '

    // tslint:disable-next-line:max-line-length
    public logo = ''
}

export class Permisos {
    public access = {
        actualizar: JSON.parse(window.atob(localStorage._acess)).actualizar,
        eliminar: JSON.parse(window.atob(localStorage._acess)).eliminar,
        registrar: JSON.parse(window.atob(localStorage._acess)).registrar
    }
}

export class OpcionesNotifi {
    public options = {
        position: ['top', 'left'],
        timeOut: 0,
        lastOnBottom: true
    }

    public config = {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
        maxLength: 250
    }
}