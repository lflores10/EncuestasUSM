function boton_cuestionarios_creacion(boton,vent){
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


var nextinput = 0;

function addlISTfORMAR(){
	campo = '';
	nextinput++;
	//campo = '<tr id="tb'+nextinput+'"><td><input type="text" size="10" id="campo1" name="Codigo_Preguntas_'+nextinput+'" readonly="readonly"/></td><td><input type="text" size="50" id="campo2" name="pregunta_cuestionario2_'+nextinput+'" readonly="readonly"/></td><td><input type="text" size="20" id="campo3" name="tipo_cuestionario2_'+nextinput+'" readonly="readonly"/></td><td><input type="text" size="10" id="campo4" name="orden_cuestionario2_'+nextinput+'" readonly="readonly"/></td><td><input type="button" class="boton" onclick="EliminarCampos('+nextinput+')" name="delete" value="Borrar"></td></tr>';
	campo = '<tr id="tb'+nextinput+'"><td><input style="border: 0;" type="text" size="5" id="campo0" readonly="readonly"/></td><td><input style="border: 0;" type="text" size="10" id="campo1" name="Codigo_Preguntas_'+nextinput+'" readonly="readonly"/></td><td><input style="border: 0;" type="text" size="50" id="campo2" name="pregunta_cuestionario2_'+nextinput+'" readonly="readonly"/></td><td><input style="border: 0;" type="text" size="20" id="campo3" name="tipo_cuestionario2_'+nextinput+'" readonly="readonly"/></td><td><input style="border: 0;" type="text" size="10" id="campo4" name="orden_cuestionario2_'+nextinput+'" readonly="readonly"/></td><td><input type="button" class="boton" onclick="EliminarCampos('+nextinput+')" name="delete" value="Borrar"></td></tr>';
	$( "form .gridform tbody" ).append(campo);

	$( "tbody #tb2 #campo1" ).val();
	$( "tbody #tb"+nextinput+" #campo2" ).val($("#preguntas_cuestionarios_creacion form  *[name='CAMPO_FOR']").val());
	$("#preguntas_cuestionarios_creacion form  *[name='CAMPO_FOR']").val("");
	$( "tbody #tb"+nextinput+" #campo3" ).val($("#preguntas_cuestionarios_creacion form  *[name='TIPO_FOR']").val());
	$("#preguntas_cuestionarios_creacion form  *[name='CAMPO_FOR']").val("");
	$( "tbody #tb"+nextinput+" #campo4" ).val(0);
}

function EliminarCampos(val){
	//$( "tbody #tb"+val ).remove();
	$( "tbody #tb"+val ).find("#campo0" ).val("X")
}

function preSaveUSR(vent){
	//var pasa=false;
	var active = $( "#tabs" ).tabs( "option", "active" );
	if (active===1) {
		saveFormCuestionario2()
	}else{
		if($("#"+vent+" *[name='Nombre_Cuestionario']").val()!=""){
		saveForm(vent); 
		} else {
			alert("Campos incompletos.");	
		}
	}

}

function saveFormCuestionario2(){
		console.log($.ajax({
				url:'include/jqdata.php?mod=savecuestionario&id='+$("#preguntas_cuestionarios_creacion form").attr('server-form-data-id'),
				data:$("#preguntas_cuestionarios_creacion form").serialize(),
				type:'GET'
		}))
}

function LoadFormCuestionario2(id){
	var nextloadinput = 0;
	if (id!="") {
			$.getJSON('include/jqdata.php','mod=loadcuestionario&id='+id,function(j){
			$( "form .gridform tbody" ).html('');
			if(j.count>0){
				for(var jk in j.data){
					//campo = '<tr id="tb'+nextloadinput+'"><td><input style="border: 0; type="text" size="10" id="campo1" name="Codigo_Preguntas_'+nextloadinput+'" readonly="readonly"/></td><td><input style="border: 0; type="text" size="50" id="campo2" name="pregunta_cuestionario2_'+nextloadinput+'" readonly="readonly"/></td><td><input style="border: 0; type="text" size="20" id="campo3" name="tipo_cuestionario2_'+nextloadinput+'" readonly="readonly"/></td><td><input style="border: 0; type="text" size="10" id="campo4" name="orden_cuestionario2_'+nextloadinput+'" readonly="readonly"/></td><td><input type="button" class="boton" onclick="EliminarCampos('+nextloadinput+')" name="delete" value="Borrar"></td></tr>';
					campo = '<tr id="tb'+nextloadinput+'"><td><input style="border: 0;" type="text" size="5" id="campo0" readonly="readonly"/></td><td><input style="border: 0;" type="text" size="10" id="campo1" name="Codigo_Preguntas_'+nextloadinput+'" readonly="readonly"/></td><td><input style="border: 0;" type="text" size="50" id="campo2" name="pregunta_cuestionario2_'+nextloadinput+'" readonly="readonly"/></td><td><input style="border: 0;" type="text" size="20" id="campo3" name="tipo_cuestionario2_'+nextloadinput+'" readonly="readonly"/></td><td><input style="border: 0;" type="text" size="10" id="campo4" name="orden_cuestionario2_'+nextloadinput+'" readonly="readonly"/></td><td><input type="button" class="boton" onclick="EliminarCampos('+nextloadinput+')" name="delete" value="Borrar"></td></tr>';
					$( "form .gridform tbody" ).append(campo);
					$( "tbody #tb"+nextloadinput+" #campo0" ).val(".");
					$( "tbody #tb"+nextloadinput+" #campo1" ).val(j.data[jk].Codigo_Preguntas);
					$( "tbody #tb"+nextloadinput+" #campo2" ).val(j.data[jk].pregunta_cuestionario2);
					$( "tbody #tb"+nextloadinput+" #campo3" ).val(j.data[jk].tipo_cuestionario2);
					$( "tbody #tb"+nextloadinput+" #campo4" ).val(j.data[jk].orden_cuestionario2);
					nextloadinput++;
				}
			}
		});
	}else {alert("vacio")}	
}

//$(".ui-dialog-active")

// $(".ui-dialog-active").delegate('.gridform tbody tr','dblclick',function(e){
	
// 	//console.log(e);
// 	console.log($(this).find("#campo0" ).val("X"));
// 	var ak = $("#menu_principal a[xenx-frm=operativo_ods]:first").get(0);
// 	loadWin($(ak).attr('xenx-frm'),{
// 			local:false,
// 			data:$(ak).attr('xenx-data'),
// 			ancho:$(ak).attr('xenx-ancho')?$(ak).attr('xenx-ancho'):770,
// 			alto:$(ak).attr('xenx-alto')?$(ak).attr('xenx-alto'):480,
// 			titulo:$(ak).attr('xenx-titulo')?$(ak).attr('xenx-titulo'):$(ak).text(),
// 			data:'&id='+$(this).find("td[xenx-key=CODIGO_EXP]").text()
// 	});
// });

function loadList_cuestionarios_creacion(){
	$("#id_asignatura_cuestionarios_creacion option").remove();
	$.getJSON('include/jqdata.php','mod=get_asignatura&asig='+$("#id_carrera_cuestionarios_creacion").val(),function(j){
		if(j.response=="OK"){
			for(var jk in j.data){
				$("#id_asignatura_cuestionarios_creacion").append('<option value="'+(j.data[jk].Codigo_Asignaturas)+'" >'+(j.data[jk].Nombre_Asignaturas)+'</option>');
			}			
		}else {
			$("#id_asignatura_cuestionarios_creacion").append('<option>--</option>') ;
		}
	});
}