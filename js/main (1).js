
var spn=new Array(".ui-dialog-active",".ui-modal","server-form-info",".ventana");
var mrshl=new Array("entrar","insertar","modificar","eliminar","actualizar","reversar","tabla");
var logged=false;

	$(document).ready(function(e){
		// Confirmar Cierre de Pagina
		/*window.onbeforeunload = function() { 
		 	if(logged){
				return "Seguro desea abandonar el sistema?";
			}
		}*/
		resizeMain()
		refreshContent();
		if(localStorage["web-server"]){
			//var idd=new Date().getTime();
			// $.ajax({url:'config/exists.php?response=user_logged',success:function(data){
			$.getJSON('config/exists.php?response=user_logged',function(json){
				console.log()
				if(json.response=="true"){
					logged=true;
					if(json.tipo==1){
						initUser();
					}else if(json.tipo==2){
						initUserEstudiante();
					}
				} else {
					Login();
				}
			});
		} else {
			Login();
		}
		$(document).on( "keyup", "#login-user", function(j) {
			//console.log($("#login-user").val());
			if(j.keyCode==13){
				fLogin();	
			}	
		});

	})

	function resizeMain(){
		MainW=$(window).width();
		MainH=$(window).height();
		//$("#main").height(MainH-80).width(MainW).css('background-position','0px '+((MainH/2)-146)+'px');
		$("#sub_main").height(MainH-50).width(MainW).css('background-position','500px '+((MainH/2)-55)+'px');
		$("#sub_sub_main").height(MainH-50).width(MainW).css('background-position','500px '+((MainH/2)-60)+'px');;
	}
function loadFLGrids(){
	$(".ui-dialog-active .FLGrid:not(.FLGrid-active)").each(function(i,e) {
        resizeFLGrids(e);
		$(e).find(".FLGrid-body").scroll(function(){
			$(this).parent().find(".FLGrid-head").scrollLeft($(this).scrollLeft());
		});
		$(e).addClass("FLGrid-active");
    });
}
	function loadWin(vent,opciones){
		$("#"+vent).remove();	//cierra la Ventana para volverla a cargar carga de nuevo
			var ventana=$('<div style="display:none" id="'+vent+'"></div>').addClass('ventana').appendTo('body');
			if(opciones.local){
				var url='include/'+vent+'.html';	// carga ventana locales
			} else {
				var url='include/data.php?frm='+vent+(opciones.data?'&'+opciones.data:''); // carga ventanas cont
			}
			ventana.load(url,function(response,status,xhr){
				if(status!="success"){
					mainMsj({txt:'<span style="color:red"><b>Existen problemas.</b></span>',show:true,life:3000}); // muestra error si no carga la ventanaa
				} else {
						if(localStorage["web-server"]){
							//$.ajax({type:"GET",url:'include/datajs.php',data:'frm='+vent+(opciones.data?'&'+opciones.data:''),dataType:"script"});
							$.ajax({type:"GET",url:'include/datajs.php',data:'frm='+vent+(opciones.data?'&'+opciones.data:''),dataType:"script",success: function(){
								refreshPostContent(vent);
							}});
						}
						refreshContent(vent);
						ventana.dialog({
							width:(opciones.ancho=="full"?($(window).width()-120):opciones.ancho),
							height:(opciones.alto=="full"?($(window).height()-65):opciones.alto),
							modal:opciones.modal,
							position:(opciones.position!=""?(opciones.position):{ my: "center", at: "center", of: window }),

							title:opciones.titulo+($("#"+vent+" div.titulo").html()!=null?$("#"+vent+" div.titulo").html():""),
							closeOnEscape:false,
						close:function(){
							ventana.remove();
							$('.ui-dialog:visible:last').addClass('ui-dialog-active');
							$('.ui-dialog-active input:visible:first').focus();
							
						},open:function(){
							loadForm(vent);
						},focus:function(){
							$(".ui-dialog-active").removeClass("ui-dialog-active");
							$(this).parent().addClass("ui-dialog-active");
						}
					}).parent().draggable({
						containment:"#main",
						disabled: opciones.draggable
					});
					if(opciones.boton){
						ventana.dialog("option","buttons",[opciones.boton,{text:'Cerrar',click:function(){ $(this).dialog('close');}}]);
					}
				}
			});
		
		return false;
	}


	function Login(){
		loadWin('login',{
			modal:true,
			titulo:'Acceso al sistema',
			ancho:400,
			alto:240,
			local:true,
			boton:{
				text:'Entrar',
				click:fLogin
			}
		});
	}
	function fLogin(){
		if($("#login-user").val()!=''){
		//	if($("#login-pass").val()!=''){
				$.ajax({
					url:"include/login.php",
					type:"POST",
					data:$("#form-login").serialize(),
					success:function(data){
						if(data=="logged"){
							localStorage.setItem('web-server',"Valido");
							window.location='./';
						} else {
							console.log (data,' - red');	
						}
					}
				});				
		//	}
		}
	}


	function initUser(){

		$(window).resize(resizeMain);

		$("#main_menu").load('include/menu_principal.php?tipomenu=admin','',function(){
			var list = $("a[server-frm].prewidget:not([server-inmate=0_0])");
			if(list.length<=1){
				
				var salto=120;
				var saltol=100;
				var gleft=20;
				var gtop=20;
				
				list.each(function(i,e) {
					
					var opciones=$(e).attr('server-data')?'" server-data="'+$(e).attr('server-data')+'"':'';
					opciones+=$(e).attr('server-titulo')?'" server-titulo="'+$(e).attr('server-titulo')+'"':'';
					opciones+=$(e).attr('server-ancho')?'" server-ancho="'+$(e).attr('server-ancho')+'"':'';
					opciones+=$(e).attr('server-alto')?'" server-alto="'+$(e).attr('server-alto')+'"':'';
					$('<div align="center" server-frm="'+$(e).attr('server-frm')+'"'+opciones+' style="display:none"><img align="center" src="img/icon/48/'+
					$(e).attr('server-icon')+'.png" style="width:48px;height:48px;padding:5px;"><br></div>')
					.appendTo("#main").addClass('main_widget')
					.css('top',gtop+'px')
					.css('left',gleft+'px')
					.append($(e).text())
					.fadeIn('slow').hover(function(){ 
						$(this).addClass('main_widget_hover'); 
					},function(){ 
						$(this).removeClass('main_widget_hover'); 
					});
	            	
					gleft+=saltol;
					if(i==5){
						gleft=20;	
						gtop+=salto;
					}
				
				});	
				gleft=20;
				gtop+=salto;
				$('<div align="center" onclick="logOut();" style="display:none"><img align="center" src="img/icon/48/exit.png" style="width:48px;height:48px;padding:5px;"><br>Salir</div>')
				.appendTo("#main").addClass('main_widget')
				.css('top',gtop+'px')
				.css('left',gleft+'px')
				.fadeIn('slow').hover(function(){ 
					$(this).addClass('main_widget_hover'); 
				},function(){ 
					$(this).removeClass('main_widget_hover'); 
				});
				
				$("#main_menu li.topitem").css('display','none');
				
			} else {
				$("a[server-frm]").draggable({appendTo:'#main',helper:'clone'});/*
				$.getJSON(localStorage["server-erp-web-server"]+'include/widgets.php',{lJSON:'request'},function(json){
					for(var x in json){
							var opciones=json[x].frm_data?'" server-data="'+json[x].frm_data+'"':'';
							opciones+=json[x].frm_titulo?'" server-titulo="'+json[x].frm_titulo+'"':'';
							opciones+=json[x].frm_ancho?'" server-ancho="'+json[x].frm_ancho+'"':'';
							opciones+=json[x].frm_alto?'" server-alto="'+json[x].frm_alto+'"':'';
							$('<div align="center" server-frm="'+json[x].frm+'"'+opciones+' style="display:none"><img align="center" src="icon/48/'+json[x].icono+'.png" style="width:48px;height:48px;padding:5px;"><br></div>').appendTo("#main").addClass('main_widget').css('top',json[x].top+'px').css('left',json[x].left+'px').append(json[x].nombre).draggable({appendTo:'#main'}).fadeIn('slow').hover(function(){ $(this).addClass('main_widget_hover'); },function(){ $(this).removeClass('main_widget_hover'); });
					}
				});*/
			}
		}).error(function(e) {
	       console.log(e); 
	    });
	   	
		$(document).on( "click", "a[server-frm]", function() {
			loadWin($(this).attr('server-frm'),{
					local:false,
					data:$(this).attr('server-data'),
					ancho:$(this).attr('server-ancho')?$(this).attr('server-ancho'):770,
					alto:$(this).attr('server-alto')?$(this).attr('server-alto'):480,
					titulo:$(this).attr('server-titulo')?$(this).attr('server-titulo'):$(this).text()
			});
			return false;
		});

		$(document).on( "dblclick", "div[server-frm]", function() {
			loadWin($(this).attr('server-frm'),{
					local:false,
					data:$(this).attr('server-data'),
					ancho:$(this).attr('server-ancho')?$(this).attr('server-ancho'):770,
					alto:$(this).attr('server-alto')?$(this).attr('server-alto'):480,
					titulo:$(this).attr('server-titulo')?$(this).attr('server-titulo'):$(this).text()
			});
			return false;
		});

	}


	function initUserEstudiante(){
		$(window).resize(resizeMain);
		$("#main_menu").load('include/menu_principal.php?tipomenu=estudiante','',function(){
			var list = $("a[server-frm].prewidget:not([server-inmate=0_0])");
			if(list.length<=20){
				
				var salto=120;
				var saltol=100;
				var gleft=20;
				var gtop=20;
				
				list.each(function(i,e) {
					
					var opciones=$(e).attr('server-data')?'" server-data="'+$(e).attr('server-data')+'"':'';
					opciones+=$(e).attr('server-titulo')?'" server-titulo="'+$(e).attr('server-titulo')+'"':'';
					opciones+=$(e).attr('server-ancho')?'" server-ancho="'+$(e).attr('server-ancho')+'"':'';
					opciones+=$(e).attr('server-alto')?'" server-alto="'+$(e).attr('server-alto')+'"':'';

					$('<div align="center" server-frm="'+$(e).attr('server-frm')+'"'+opciones+' style="display:none"><img align="center" src="img/icon/48/'+
					$(e).attr('server-icon')+'.png" style="width:48px;height:48px;padding:5px;"><br></div>')
					.appendTo("#main").addClass('main_widget')
					.css('top',gtop+'px')
					.css('left',gleft+'px')
					.append($(e).text())
					.fadeIn('slow').hover(function(){ 
						$(this).addClass('main_widget_hover'); 
					},function(){ 
						$(this).removeClass('main_widget_hover'); 
					});
	            	
					// gleft+=saltol;
					gtop+=salto;
					// if(i==){
					// 	gleft=20;	
					// 	gtop+=salto;
					// }
				
				});	
				gleft=20;
				//gtop+=salto;
				$('<div align="center" onclick="logOut();" style="display:none"><img align="center" src="img/icon/48/exit.png" style="width:48px;height:48px;padding:5px;"><br>Salir</div>')
				.appendTo("#main").addClass('main_widget')
				.css('top',gtop+'px')
				.css('left',gleft+'px')
				.fadeIn('slow').hover(function(){ 
					$(this).addClass('main_widget_hover'); 
				},function(){ 
					$(this).removeClass('main_widget_hover'); 
				});
				
				$("#main_menu li.topitem").css('display','none');
				
			}

		}).error(function(e) {
	       console.log(e); 
	    });
/*
		loadWin('estudiantes_bienvenida',{
			modal:false,
			titulo:'Bienvenida sistema',
			ancho:"full",
			//ancho:600,
			//alto:420,			
			alto:"full",
			local:false,
			draggable: true,
			position:{ my: "left center", at: "center", of:  window },
			// boton:{
			// 	text:'Entrar',
			// 	click:fLogin
			// }
		});*/


		$(document).on( "click", "a[server-frm]", function() {
			loadWin($(this).attr('server-frm'),{
					local:false,
					data:$(this).attr('server-data'),
					ancho:$(this).attr('server-ancho')?$(this).attr('server-ancho'):770,
					alto:$(this).attr('server-alto')?$(this).attr('server-alto'):480,
					titulo:$(this).attr('server-titulo')?$(this).attr('server-titulo'):$(this).text()
			});
			return false;
		});

		$(document).on( "dblclick", "div[server-frm]", function() {
		loadWin($(this).attr('server-frm'),{
				local:false,
				data:$(this).attr('server-data'),
				ancho:$(this).attr('server-ancho')?$(this).attr('server-ancho'):770,
				alto:$(this).attr('server-alto')?$(this).attr('server-alto'):480,
				titulo:$(this).attr('server-titulo')?$(this).attr('server-titulo'):$(this).text()
		});
		return false;
	});

	}

function refreshContent(vent){
	$('.boton').button();
	$('#tabs').tabs({show:refreshTab});
	$('.tabs.vertical').each(function(x, el) {
        $(el).addClass("ui-tabs-vertical ui-helper-clearfix");
    	$(el).find('li').removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
    });

    /*
	$('input[server-check-search]').each(function(i, e) {
		if($(this).attr('server-check-search')!='checked'){
			$(e).before('<input type="checkbox" title="Utlizar para busqueda" value="0" />');
			$(e).attr("server-not-search","true");
		} else {
			$(e).before('<input type="checkbox" checked="true" title="Utlizar para busqueda" value="0" />');
		}
		$(e).prev().click(function(){
			if($(this).next().is("[server-not-search]")){
				$(this).next().removeAttr("server-not-search");
			} else {
				$(this).next().attr("server-not-search","true");
			}	
		});
		$(e).removeAttr('server-check-search');
    });
	$(".treeview:not(.treeview-start)").simpletreeview({
		open:  "&#9660;",   // HTML string to display for the opened handle
		close: "&#9658;",   // HTML string to display for the closed handle
		slide: true,       // Boolean flag to indicate if node should slide open/close
		speed: 'fast',    // Speed of the slide. Can be a string: 'slow', 'fast', or a number of milliseconds: 1000
		collapsed: false,   // Boolean to indicate if the tree should be collapsed on build
		collapse: null,     // A node to collapse on build. Can be a string with indexes: '0.1.2' or a jQuery ul: $("#tree ul:eq(1)")
		expand:'1.1'        // A node to expand on build. Can be a string with indexes: '0.1.2' or a jQuery ul: $("#tree ul:eq(1)")
	});
	$(".treeview").addClass("treeview-start");
	$('input[server-mask]').each(function(i, e) {
		$(e).mask($(e).attr("server-mask"));
	});
	

	if(vent=='login'){
		if(localStorage["server-erp-web-servers"]){
			$('#login-servidor option').remove();
			conLocalServ();
			for(var x in servidores){
				if(servidores[x]!=''){
					$('#login-servidor').append('<option value="'+x+'">'+servidores_nombre[x]+'</option>');
				}
			}
		}
		$("#tool-servers").button({text:false,icons:{primary:'ui-icon-plusthick'}}).click(function(){
			loadWin('conexiones',{local:true,modal:true,titulo:'Nueva conexi&oacute;n',ancho:400,boton:{text:'Agregar',click:addServer}});	
		}).next().button({text:false,icons:{primary:'ui-icon-trash'}}).click(function(){
			if(confirm("Seguro desea eliminar esta conexion?")){
				servidores_nombre[$("#login-servidor").val()]="";
				servidores[$("#login-servidor").val()]="";
				conLocalServ(true);
				window.location=window.location;
			}	
		}).parent().buttonset();
	}*/
}

//	Formularios

function refreshTab(){
	$(".ui-dialog-active form:visible input:first").focus();
	//refreshGridForm();
}

function saveForm(){
	if((formMarshal("insertar")&&$(".ui-dialog-active form:visible[server-form-data]").attr("server-form-data-id")=="")||(formMarshal("modificar")&&$(".ui-dialog-active form:visible[server-form-data]").attr("server-form-data-id")!="")){
		$(".ui-dialog-active form:visible[server-form-data]").each(function(index,form) {
			var dataget='datato='+$(form).attr("server-form-data");
			for(var i=0;i<=2;i++){
				dataget+=$(form).attr("server-form-data-id"+(i>0?i:""))?('&saveid'+(i>0?i:"")+'='+$(form).attr("server-form-data-id"+(i>0?i:""))):'';
				dataget+=$(form).attr("server-form-data-campo"+(i>0?i:""))?('&saveidcampo'+(i>0?i:"")+'='+$(form).attr("server-form-data-campo"+(i>0?i:""))):'';
			}
			var datapost="";
			//if($(form).attr("server-auxiliar")){ dataget+='&xenxauxiliar='+$(form).attr("server-auxiliar"); }	
			$(".ui-dialog-active form:visible[server-form-data] *:input:visible").each(function(index, element) {
				
				if($(this).attr("server-not-save")!="true"&&$(this).parents('.FLGrid').length==0){
					//alert($(this).attr('name')+' '+$(this).parents('.FLGrid').length);
					if($(this).attr("type")=="checkbox"){
						if($(this).is(":not(:checked)")&&($(this).attr('unvalue')!="")){ 
							datapost+=(datapost!=""?"&":"")+$(this).attr('name')+"="+$(this).attr('unvalue');
						} else {
							datapost+=(datapost!=""?"&":"")+$(this).attr('name')+"="+$(this).val();
						}
					} else if($(this).is("textarea")){
						datapost+=(datapost!=""?"&":"")+$(this).attr('name')+"="+$(this).val();
					} else {
						datapost+=(datapost!=""?"&":"")+$(this).attr('name')+"="+$(this).val();
					}
				}
			});
			console.log(dataget)
			//console.log($.ajax({url:'include/sdata.php?'+dataget,data:datapost,type:'POST'}))
			$.ajax({url:'include/sdata.php?'+dataget,data:datapost,type:'POST',timeout:20000,success:function(data){
				var datax=data.split('|||');
				for(var i=0;i<=2;i++){
					if(datax[i+1]){
						$(".ui-dialog-active form[server-form-data='"+$(form).attr("server-form-data")+"']").attr("server-form-data-id",datax[i+1]);
						$(".ui-dialog-active form[server-form-data='"+$(form).attr("server-form-data")+"'] input[name="+
						$(".ui-dialog-active form[server-form-data='"+$(form).attr("server-form-data")+"']").attr('server-form-data-campo')
							+"]").val(datax[i+1]);
					}
				}
				if($(".ui-dialog-active .FLGrid").length==0){
					if(datax.length>1){
						loadForm();
					}
				} else {
					saveFormGrids();
				}
				//gridFormSearchForm();
				
				console.log(datax[0]);
			},error:function(e){
				console.log(e); 
				//mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 
				console.log("<span style='color:red'><b>Existen problemas con la conexi&oacute;n.</b></span>"); 
			},statusCode:{ 404: function() { 
				mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 			}
			}});
		});/*
		if($(".ui-dialog-active .FLGrid").length==0){
			saveFormGrids();
		}*/
	} else {
		alert('No tiene permisos para realizar esta operaci&oacute;n.');
	}
}

function searchForm(){
	if($(".ui-dialog-active .ui-modal").is(":visible")){ return false; }
	$(".ui-dialog-active form[server-form-search]:visible").each(function(index, form) {
		var div=$(form).attr('server-form-search');
		var dataget='searchto='+$(form).attr("server-form-data");
		var i=0;
		lastFocus=$(":focus");
		$("#"+div+".grid").removeClass('grid').addClass('kgrid');
		$(".ui-dialog-active").find("#"+div+" [server-search-campo]").each(function(ix,ex) {
        	$(ex).attr("data-field",$(ex).attr("server-search-campo")).removeAttr("server-search-campo");
		});
		
		var ogrid = $("#"+div);
		dataget+="&serverorderby="+(ogrid.attr("server-orderby")?ogrid.attr("server-orderby"):"");
		dataget+="&serverorder="+(ogrid.attr("server-order")?ogrid.attr("server-order"):"");
		dataget+="&serverwhere="+(ogrid.attr("server-where")?ogrid.attr("server-where"):"");
		/*
		$(".ui-dialog-active").find("#"+div+" [data-field]").each(function(ix,ex) {
        	if(!$(ex).attr("width")){
				if((/Nombre/).test($(ex).text())){
					$(ex).attr("width",((/Nombre/).test($(ex).text())?300:80))
				}	
			}
		});*/
		
		$(($(".ui-dialog-active #original_data_"+div).length>0?(".ui-dialog-active #original_data_"+div):(".ui-dialog-active #"+div))+" *[data-field]").each(function(it, element) {
			var ind=it+1;
			dataget+="&rfield"+ind+"="+$(element).attr("data-field");
			if($(element).attr("server-search-subdata")){
				dataget+="&rsubfield"+ind+"="+$(element).attr("server-search-subdata");
			}
			if($(element).attr("server-search-subcampo")){
				dataget+="&rsubcampofield"+ind+"="+$(element).attr("server-search-subcampo");
			}
			if($(element).attr("server-search-subid")){
				dataget+="&rsubidfield"+ind+"="+$(element).attr("server-search-subid");
			}
		});
		//console.log(dataget);

		if($(form).attr('server-form-data-id')!=""){
				datapost=$(form).attr('server-form-data-campo')+"="+$(form).attr('server-form-data-id')+"&uniquecodexenx=true";
		} else {
			var datapost=$(form).serialize();
			$(".ui-dialog-active *[server-not-search]:visible").each(function(index, element) {
				datapost+="&"+$(element).attr("name")+"=";
			});/*
			$(".ui-dialog-active *[server-search-unique]:visible").each(function(index, element) {
				datapost+="&unique_"+$(element).attr("name")+"=true";
			});*/
		}
		
		//$.ajax({url:'include/fdata.php?'+dataget,data:datapost,type:'POST',cache:false})
		

		$.ajax({url:'include/fdata.php?'+dataget,data:datapost,type:'POST',cache:false,success:function(data){
				var ids=$(".ui-dialog-active:visible #"+div);
				var k=loadKGrid(ids,data);
				
				if(k==1){
					selectSearchForm();
				} else if(!k) {
					if(lastFocus){
						lastFocus.focus();
					}
					//console.log(data);
					mainMsj({txt:'<span style="color:red"><b>No se encontró ningun resultado</b></span>',show:true,life:3000}); 
				}		
			}/*,error:function(e){ 
				mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 
			},statusCode:{ 404: function() { 
				mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 			
			}*/
		});
    });
}

function loadKGrid(ids,data){
	var vent=$(".ui-dialog-active .ventana");
	if(vent.find("#original_data_"+ids.attr('id')).length==0){
		vent.append('<div style="display:none;" id="original_data_'+ids.attr('id')+'"></div>');
		vent.find("#original_data_"+ids.attr('id')).html(ids.html());
	} else {
		ids.html($(".ui-dialog-active #original_data_"+ids.attr('id')).html());	
	}
	ids.find("tbody").html(data);
	var foot=ids.find(".trfooter").html();
	ids.find(".trfooter").remove();
	if(ids.find("tbody").find("tr").length==0){
		return 0;
	}else if(ids.find("tbody").find("tr").length==1){	
		ids.find("tbody").find("tr").addClass('k-state-focused');
		return 1;
	} else {
		lastFocus=$(":focus");
		//closePops();	
		var an=vent.width()-(vent.width()*0.2);
		var al=vent.height()-(vent.height()*0.3);
		ids.width(an).height(al);
		var cols=[];
		ids.find("thead tr th").each(function(i,e) {
			cols.push({field:$(e).attr('data-field'),width:$(e).attr('width')?$(e).attr('width')+'px':'80px',title:$(e).text()});
		});
		//ids.find("table").kendoGrid({groupable:(al>400?true:false),width:an,height:al-50,pageable:false,sortable:true,columns:cols,navigatable:true,toolbar:$(foot).html()});
		vent.find(".k-widget").css('height',al);
		$(".ui-dialog-active .ui-modal").css('z-index',101).css('display','block');
		ids.css('display','block').css('z-index',102).position({of:vent});
		lastFocus=$(":focus");
		ids.find(".k-grid").focus();
		return 2;
	}
}
function selectSearchForm(idx){
	var div=!idx?$(".ui-dialog-active .gridbuscar"):$("#"+idx);
	var dataget="frm="+$(".ui-dialog-active .ventana").attr("id");
	for(var i=0; i<=3; i++){
		if($(".ui-dialog-active *[server-form-search]").attr("server-form-data-campo"+(i>0?i:""))){
			dataget+="&id"+(i>0?i:"")+"="+div.find("tbody tr.k-state-focused td:eq("+(div.find("thead").find("th[data-field="+$(".ui-dialog-active form[server-form-search]").attr("server-form-data-campo"+(i>0?i:''))+"]").index())+")").html();
		}	
	}
	//console.log(dataget)
	$(".ui-dialog-active .ventana").html('').load('include/data.php?'+dataget,'',function(){
		refreshContent();
		loadForm();
	});
}
function clearForm(){
	var dataget="frm="+$(".ui-dialog-active .ventana").attr("id");
	$(".ui-dialog-active .ventana").html('').load('include/data.php?'+dataget,'',function(response,status,xhr){
		if(response=="peticion_negada"){
			mainMsj({txt:'<span style="color:red"><b>Usted no puede acceder a este modulo.</b></span>',show:true,life:3000});
			$(".ui-dialog-active").dialog('close');
			return false;
		} else {
			$(".ui-dialog-active span.ui-title-sub span").text("");
			refreshContent();
			refreshPostContent();
			loadForm();
		}
	});	
}

function loadForm(div){
	$(".ui-dialog-active form[server-form-data]:visible").each(function(index,form) {
		var dataget='datato='+$(form).attr("server-form-data");
		for(var i=0;i<=2;i++){
			dataget+=$(form).attr("server-form-data-id"+(i>0?i:""))?('&loadid'+(i>0?i:"")+'='+$(form).attr("server-form-data-id"+(i>0?i:""))):'';
			dataget+=$(form).attr("server-form-data-campo"+(i>0?i:""))?('&loadidcampo'+(i>0?i:"")+'='+$(form).attr("server-form-data-campo"+(i>0?i:""))):'';
		}
		$(".ui-dialog-active form[server-form-data] input[server-load-function]").each(function(index,elem) {
			dataget+='&loadfunction'+(index>0?index:'')+'='+$(elem).attr('server-load-function');
			dataget+='&loadfunctioncampo'+(index>0?index:'')+'='+$(elem).attr('name');
		});	
		$(".ui-dialog-active form[server-form-data] [server-form-subdata]").each(function(index,elem) {
			dataget+='&subdata'+(index>0?index:'')+'='+$(elem).attr('server-form-subdata');
			dataget+='&subid'+(index>0?index:'')+'='+$(elem).attr('server-form-subid');
			dataget+='&subcampo'+(index>0?index:'')+'='+$(elem).attr('server-form-subcampo');
			
			//dataget+='&subidadd'+(index>0?index:'')+'='+($(elem).attr('server-form-subdata-addcol')?$(elem).attr('server-form-subdata-addcol'):'');
			
			if($(elem).attr('name')){
				dataget+='&sub'+(index>0?index:'')+'='+$(elem).attr('name');
			} else {
				dataget+='&sub'+(index>0?index:'')+'='+$(elem).attr('server-data-campo');
			}
			if($(elem).attr('server-alt')){
				dataget+='&subalt'+(index>0?index:'')+'='+$(elem).attr('server-alt');
			}
		});

		//$.ajax({url:'include/sdata.php?'+dataget,success:function(json){ console.log(json); }});
		//loadingForm(true);
		$.getJSON('include/sdata.php?'+dataget,'',function(json){
			//loadingForm(false);
			//console.log(json)
			if(json){
				for(var x in json){			
						if($(".ui-dialog-active *[name='"+x+"']").attr('type')){
							switch($(".ui-dialog-active *[name='"+x+"']").attr('type')){
								case 'checkbox':
									if(json[x]=="1"){ $(".ui-dialog-active *[name='"+x+"']").attr('checked','true').trigger('change'); }
								break;
								default:
									$(".ui-dialog-active *[name='"+x+"']").val(json[x].toString().trim());
							}	
						} else {
							if($(".ui-dialog-active *[name='"+x+"']").is("textarea")){
								$(".ui-dialog-active *[name='"+x+"']").html(json[x]);
							} else if($(".ui-dialog-active *[name='"+x+"']").is("select")){
								$(".ui-dialog-active select[name='"+x+"'] option").removeAttr('selected');
								$(".ui-dialog-active select[name='"+x+"'] option[value='"+json[x]+"']").attr('selected','selected');
								$(".ui-dialog-active select[name='"+x+"']").val(json[x].toString().trim());
							}
							 else {
								$(".ui-dialog-active *[name='"+x+"']").val(json[x].toString());
							}
						}
				}
				$('.ui-dialog-active input[name='+$(form).attr('server-form-data-campo')+']').attr('readonly','readonly');
				$(".ui-dialog-active input").trigger('change');
				//loadFLGrids();
				//loadFormGrids();
			} else {
				if(index==0){
					console.log("No se encontr&oacute; ning&uacute;n registro.");
					$(".ui-dialog-active form[server-form-data='"+$(form).attr("server-form-data")+"']").attr("server-form-data-id","");
				}
			}
			if(eval("typeof onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id'))=='function'){
				eval("onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id')+"();");
			}
		}).fail(function(err){
			console.log(err);
			//loadingForm(false);
		});
/*
		loadFLGrids();
		if($(".ui-dialog-active .FLGrid").length==0){
			loadFormGrids();
		}*/
		$(".ui-dialog-active input[name='"+$(form).attr("server-form-data-campo")+"']").unbind('keydown').keydown(function(event){
			if(event.keyCode==13||event.keyCode==9) {
				if($(this).val()!=""){
					var xcampo="";
					//loadingForm(true);
					$(".ui-dialog-active .ventana").html('').load('include/data.php?frm='+$(".ui-dialog-active .ventana").attr("id")+'&id='+$(this).val(),'',function(){
						//loadingForm(false);
						refreshContent();
						loadForm();
					});
					//////////////$(".ui-dialog-active form[server-form-data='"+$(form).attr("server-form-data")+"']").attr("server-form-data-id",$(this).val());
					//////////////loadForm();
				}
			}
		});
		if($(".ui-dialog-active input[name='"+$(form).attr("server-form-data-campo")+"']:visible").is(":not([server-not-focus])")){
			$(".ui-dialog-active input[name='"+$(form).attr("server-form-data-campo")+"']:visible").focus();
		} else {
			$(form).find("input:not([server-not-focus]):visible:first").focus();
		}
	});
}
function refreshPostContent(vent){
	if(eval("typeof onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id'))=='function'){
		eval("onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id')+"();");
	}
}
function closePops(isNext){
	$(".ui-dialog-active .ui-modal, .ui-dialog-active .gridbuscar:visible, .ui-dialog-active .searchtooltip, .ui-dialog-active .flgrig-search-tooltip, .ui-dialog-active .pop, .kgrid").css('display','none');
	if(lastFocus){
		lastFocus.focus();	
	}
	if(isNext){
		$('*[server-flgrid-input-active]').removeAttr('server-flgrid-input-active');
		nextInputFocus();	
	}
	
}
function logOut(){	
	$.ajax({url:'include/logout.php',cache:false,
			success:function(data){window.location='./';},
			error:function(e,f,g){console.log("Error");}
		});	
}