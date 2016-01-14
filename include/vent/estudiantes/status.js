function boton_estudiantes_status(boton,vent){

}
	function onload_estudiantes_status(){
		alert("entre")
	}
	

		$.getJSON('include/sdata.php','mod=get_cuestionarios_alumnos&alumnos='+$_SESSION["server-lite-user"]["Codigo_Alumnos"]+"&periodo="+$SemActual,function(json){
		

		});