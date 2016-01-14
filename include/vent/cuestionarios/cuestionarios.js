function boton_sistema_usuarios(boton,vent){
	var ventana = $("#"+vent);
	///F2 112
	switch(boton)
	{
		case 113: ///F2 113
			clearForm();
		break;
		case 115: ///F3 113
			preSaveUSR(vent);
		break;
		case 117: ///F3 113
			delsaveForm(vent);
		break;
		case 119: ///F3 113
			searchForm(vent);
		break;
		case 123: ///F3 113
			ventana.dialog('close');
		break;
	}
}
function preSaveUSR(vent){
	var pasa=false;
	if(
		($("#"+vent+" *[name='LOGIN']").val()!=""
		&&
		$("#"+vent+" *[name='NOMBRE']").val()!="")
		||
		($("#"+vent+" *[name='LOGIN']:visible").length==0)
	){
		saveForm(vent); 
	} else {
		alert("Campos incompletos.");	
	}
}