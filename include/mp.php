<?php $mjson='[
	{
		"nombre":"Nombre Sistema",
		"link":"javascript:window.location=\'./?'.time().'\';"
	},
	{
		"nombre":"Cuestionarios",
		"server_modulo":"_OperacionesCitas",
		"submenu":[	
			{
				"nombre":"Ver creados y estatus",
				"icono":"view-presentation",
				"ventana":"cuestionarios_status",
				"ventana_ancho":"800",
				"ventana_alto":"500",
				"server_modulo":"_MaestroCitas"
			},{
				"nombre":"Crear y Editar",
				"icono":"view-presentation",
				"ventana":"cuestionarios_creacion",
				"ventana_ancho":"850",
				"ventana_alto":"500",
				"server_modulo":"_MaestroCitas"
			}
		]
	},
	{
		"nombre":"Reportes y Graficas",
		"server_modulo":"_OperacionesCitas",
		"submenu":[	
			{
				"nombre":"Consulta De Citas",
				"icono":"view-presentation",
				"ventana":"operativo_citas",
				"ventana_ancho":"800",
				"ventana_alto":"500",
				"server_modulo":"_MaestroCitas"
			}
		]
	},
	{
		"nombre":"Administracion",
		"server_modulo":"_AdminAdministracion",
		"submenu":[	
			{
				"nombre":"Usuarios",
				"icono":"view-presentation",
				"ventana":"admin_usuarios",
				"ventana_ancho":"800",
				"ventana_alto":"500",
				"server_modulo":"_AdminUsuarios"
			}
		]
	},
	{
		"nombre":"Salir",
		"link":"javascript:logOut()"
	}
]';
?>