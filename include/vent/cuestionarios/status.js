function boton_operativo_medicolist(boton,vent){

}
function onload_cuestionarios_status(){
	change_operativo_medicolist();
	//$('#med_operativo_medicolist option[value="'+$('#med_operativo_medicolist').attr("xenx-codigo")+'"]').attr('selected', 'selected');
	return false;
}
function imprimeListaCistasMed(){
	if($("#servicios_operativo_medicolist").val()!=""){
		var desde = $("#fecha_operativo_medicolist").val();
		$("#data-print")[0].src=localStorage["xenx-erp-web-server"]+'pdf/rp.php?d=listapacmed&dd='+desde+'&esp='+$("#servicios_operativo_medicolist").val()+'&med='+$("#medicos_operativo_medicolist tbody tr.tractive").attr("xenx-codigo");
		$("#data-print").attr("data-print","true");
	}
}

function codmed_operativo_medicolist(){
	var v = $("#operativo_medicolist");
	if(v.find("#servicios_operativo_medicolist option:selected").val()!=""){
		$.getJSON('include/jqdata.php','mod=get_cod_byprv&esp='+v.find("#servicios_operativo_medicolist option:selected").val(),function(j){
		
			if(j.response=="OK"){
				$("#med_operativo_medicolist").find('option').remove().end()
				$("#med_operativo_medicolist").append('<option value=""></option>');				
				for(var jk in j.data){
					if($('#med_operativo_medicolist').attr("codigo") == j.data[jk].CODIGO_PRV){							
						$("#med_operativo_medicolist").append('<option value="'+(j.data[jk].CODIGO_PRV)+'" selected="selected">'+(j.data[jk].NOMBRE_PRV)+'</option>');
					}else {
						$("#med_operativo_medicolist").append('<option value="'+(j.data[jk].CODIGO_PRV)+'">'+(j.data[jk].NOMBRE_PRV)+'</option>');
					}
				}
			} else {
				mainMsj({txt:'<span style="color:red"><b>Error al cargar lo seleccionado</b></span>',show:true,life:5000,id:777});
			}
		});
	} else {
		mainMsj({txt:'<span style="color:red"><b>Debe cargar un registro.</b></span>',show:true,life:3000,id:777});	
	}	
}

function change_operativo_medicolist(){

	$("#med_operativo_medicolist").attr('codigo', $("#med_operativo_medicolist").val());
	if($("#servicios_operativo_medicolist").val()!=""){	
		var temSelect = $(this);
		$.getJSON('include/jqdata.php','mod=buscar_citas_medicolist&esp='+$("#servicios_operativo_medicolist").val()+"&fecha="+$("#fecha_operativo_medicolist").val()+"&codmed="+$("#med_operativo_medicolist").val()+'&med='+$(this).attr("codigo"),function(j){
			$("#listac_operativo_medicolist tbody").html('');
			if(j.count>0){
				for(var jk in j.data){
					$("#listac_operativo_medicolist tbody").append('<tr class="hover"><td width="10" style="font-size:10px;'+
					(j.data[jk].EXPEDIENTE!=''?'':'background-color:#991A00;')
					+'">'
					+j.data[jk].EXPEDIENTE+
					'</td><td width="50">'+
					j.data[jk].PACIENTE_CIT+
					'</td><td width="255">'+
					j.data[jk].paciente+
					'</td><td align="center" width="30">'+
					j.data[jk].TURNO_CIT+
					'</td><td width="140">'+
					j.data[jk].MOTIVO+
					'</td><td width="45">'+
					(j.data[jk].ATENDIDO_CIT!=0?('<img src="icon/16/agt_action_success.png" title="Chequeado por '+j.data[jk].USUARIOATE+'">'):('<img src="icon/16/aim_away.png" title="Paciente no atendido">'))+
					'</td><td width="45">'+
					(j.aten[jk].ATENDIDO_ENF!=0&&j.data[jk].EXPEDIENTE!=''?('<img src="icon/16/agt_action_success_blue.png" title="Chequeado por '+j.aten[jk].ATENDIDO_ENF+'">'):('<img src="icon/16/bloqueado.png" title="Paciente no atendido">'))+
					'</td><td width="32">'+
					(j.aten[jk].ATENDIDO_POR!=0&&j.data[jk].EXPEDIENTE!=''?('<img src="icon/16/agt_action_success_blue.png" title="Chequeado por '+j.aten[jk].PROVEEDOR_EXP+'">'):('<img src="icon/16/bloqueado.png" title="Paciente no atendido">'))+
					'</td><td width="89">'+
					j.data[jk].NOTA_CIT+
					'</td></tr>');
				}
			} else {
				if(j.err){
					$("#listac_operativo_medicolist tbody").append('<tr><td colspan="3">'+j.err+'<td><tr>');
				} else {
					$("#listac_operativo_medicolist tbody").append('<tr><td colspan="3">No posee citas reservadas para este d&iacute;a.<td><tr>');
				}
			}
		});			
		codmed_operativo_medicolist();
	}
};

$(".ui-dialog-active").delegate('#listac_operativo_medicolist tbody tr:not(.not)','dblclick',function(e){
	var med = $("#med_operativo_medicolist").val();
	if(typeof(med)==='undefined'){
		med = '';
	}else {
		med = $("#med_operativo_medicolist").val()
	}

	loadWin('operativo_pacientesm',{
			local:false,
			ancho:800,
			alto:520,
			titulo:'Informaci&oacute;n del Paciente',
			data:'&id='+$(this).find("td:eq(1)").text()+'&e='+$(this).find("td:eq(0)").text()+'&codmed='+med+$("#operativo_medicolist input[id='codmed']").val()
	});
});