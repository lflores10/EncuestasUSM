<?php $mjson='[
	{
		"nombre":"Nombre Sistema",
		"link":"javascript:window.location=\'./?'.time().'\';"
	},
	{
		"nombre":"Estudiantes",
		"server_modulo":"_estudiantes",
		"submenu":[	
			{
				"nombre":"Listado de Encuestas",
				"icono":"my_documents",
				"ventana":"estudiantes_status",
				"ventana_ancho":"800",
				"ventana_alto":"500",
				"server_modulo":"_estud_encuestas"
			},{
				"nombre":"test 2",
				"icono":"view-presentation",
				"ventana":"cuestionarios_creacion",
				"ventana_ancho":"850",
				"ventana_alto":"500",
				"server_modulo":"_MaestroCitas"
			},{
				"nombre":"test 3",
				"icono":"view-presentation",
				"ventana":"cuestionarios_creacion",
				"ventana_ancho":"850",
				"ventana_alto":"500",
				"server_modulo":"_MaestroCitas"
			}
		]
	},
	{
		"nombre":"Salir",
		"link":"javascript:logOut()"
	}
]';
?>