var server="";
var MainW=0;
var MainH=0;
var servidores=new Array();
var servidores_nombre=new Array();
var spn=new Array(".ui-dialog-active",".ui-modal","xenx-form-info",".ventana");
var mrshl=new Array("entrar","insertar","modificar","eliminar","actualizar","reversar","costos","porcentaje","tabla","imagen");
var chatEnabled=false;
var isQuering=false;
//variables del chat
var windowFocus = true;
var username;
var chatHeartbeatCount = 0;
var minChatHeartbeat = 2000;
var maxChatHeartbeat = 9000;
var chatHeartbeatTime = minChatHeartbeat;
var originalTitle;
var blinkOrder = 0;
var chatboxFocus = new Array();
var newMessages = new Array();
var newMessagesWin = new Array();
var chatBoxes = new Array();
var lastFocus;
var mainHost=window.location.hostname+(window.location.port?(":"+window.location.port):"");
var mainFolder=String(window.location).replace("/app","").replace("/index.html","").replace("#","").replace("http://","");
var user;
var datepickerfilter={};
var logged=false;
var google;
var dataPrintThermal="";
///
$(window).on('error',function(){
	if(confirm('Ha ocurrido un error.\r\nContacte a administrador.\r\n ¿Desea recargar el sistema?')){
		window.location='./';
		return false;
	}
});
$(document).ready(function(e){
	//document_ready();
	resizeMain();
	refreshContent();
	originalTitle = document.title;
	$([window, document]).blur(function(){
		windowFocus = false;
	}).focus(function(){
		windowFocus = true;
		document.title = originalTitle;
	});
	window.onbeforeunload = function() { 
	 	if(logged){
			return "Seguro desea abandonar el sistema?";
		}
	}
	$(window).unload(function(){
		//logOut();
	}); 
		if(localStorage["xenx-erp-web-server"]){
			var idd=new Date().getTime();
			$.ajax({url:localStorage["xenx-erp-web-server"]+'config/exists.php?response=user_logged',success:function(data){ 
				//console.log("user: "+data);
				if(data=="true"){
					logged=true; 
					initUser();
				} else {
					$("head").append('<link rel="stylesheet" type="text/css" href="css/black-tie/jquery-ui-1.8.16.custom.css">');
					console.log("login web servers");
					Login();
				}
			}});
		} else {
			$("head").append('<link rel="stylesheet" type="text/css" href="css/black-tie/jquery-ui-1.8.16.custom.css">');
			console.log("login web servers");
			Login();
		}

	$("#login-pass").live('keypress',function(e){
		if(e.keyCode==13){
			fLogin();	
		}	
	});
	$("#login-user").live('blur',function(){
		if($("#login-user").val()!=''){
			$("#login-loading-icon").html("<img src='img/loading.gif' width=12 height=12 align='left'> ");
			$.ajax({url:servidores[$("#login-servidor").val()]+'config/exists.php',cache:false,success:function(d){
				$.getJSON(servidores[$("#login-servidor").val()]+'include/searchbase.php',{usuario:$("#login-user").val()},function(json){
					$("#login-loading-icon").html("");
					$("#login-empresa option").val('');
					$("#login-empresa option").remove();
					for(var row in json){
						$("#login-empresa").append('<option value="'+json[row].id+'">'+row+'-'+json[row].nombre+'</option>');
					}
					if(!row){
						$("#login-text-empresa").html('Ninguna asociada a '+$("#login-user").val()).show('fast');
						$("#login-empresa").hide();
					} else {
						$("#login-empresa").show('fast');
						$("#login-text-empresa").hide();
					}
				}).fail(function(e){ console.log(e); });
			},error:function(){
				$("#login-loading-icon").html("");
				$("#login-empresa option").val('');
				$("#login-empresa option").remove();
				$("#login-text-empresa").html('No se pudo establecer conexion al servidor').show('fast');
				$("#login-empresa").hide();
			}});
		} else {
			$("#login-text-empresa").html('Debe indicar un nombre').show('fast');
			$("#login-empresa").hide();	
		}
	});
	$.ajaxSetup({timeout:8000});
	$(document).ajaxStart(function(){ isQuering=true; });
	$(document).ajaxStop(function(){ isQuering=false; });
	/*
	$(document).delegate("#data-print",'load',function(){
		loadingForm(false);
		if($(this).attr('data-print')=='true'){
			isQuering=false;
		}
		printFrame();
	});
	*/
});

function resizeMain(){
	MainW=$(window).width();
	MainH=$(window).height();
	//$("#main").height(MainH-80).width(MainW).css('background-position','0px '+((MainH/2)-146)+'px');
	$("#sub_main").height(MainH-50).width(MainW).css('background-position','500px '+((MainH/2)-55)+'px');
	$("#sub_sub_main").height(MainH-50).width(MainW).css('background-position','500px '+((MainH/2)-60)+'px');;
}

function fullScreen(){
	if(!document.webkitIsFullScreen){
		document.body.webkitRequestFullScreen();
	} else {
		document.webkitCancelFullScreen();
	}
}

function cacheTheme(theme){
	$.getJSON(localStorage["xenx-erp-web-server"]+'include/jqdata.php','mod=change_theme&t='+theme,function(j){
		var idd=new Date().getTime();
		window.location='./?'+idd;
	});
}

function loadWin(vent,opciones){
	mainMsj({txt:'Cargando '+(opciones.titulo?opciones.titulo:'ventana...'),show:true,life:1300,icon:'loading.gif'});
	$("#"+vent).remove();
	if(!opciones){
		opciones={
			local:false
		};
	}
	if(formMarshal("entrar",vent)){
		var ventana=$('<div style="display:none" id="'+vent+'"></div>').addClass('ventana').appendTo('body');
		if(opciones.local){
			var url='include/'+vent+'.html';
		} else {
			var url=localStorage["xenx-erp-web-server"]+'data.php?frm='+vent+(opciones.data?'&'+opciones.data:'');
		}
		ventana.load(url,function(response,status,xhr){
			if(status!="success"){
				mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000});
			} else {				
				if(ventana.find("#nueva_con").length>0){
					if((/http/).test(String(window.location))){
						ventana.find("#nueva_con").html(mainFolder);
					}
				}
				if(localStorage["xenx-erp-web-server"]){
					$.ajax({type:"GET",url:localStorage["xenx-erp-web-server"]+'datajs.php',data:'frm='+vent+(opciones.data?'&'+opciones.data:''),dataType:"script",success: function(){
						refreshPostContent(vent);
					}});
				}
				refreshContent(vent);
					ventana.dialog({
					width:(opciones.ancho=="full"?($(window).width()-7):opciones.ancho),
					height:(opciones.alto=="full"?($(window).height()-65):opciones.alto),
					modal:opciones.modal,
					title:opciones.titulo+" <span style='color:#fc9005' class='ui-title-sub'>"+($("#"+vent+" div.titulo").html()!=null?$("#"+vent+" div.titulo").html():"")+"</span>",
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
				},resize:resizeForm
				}).parent().draggable({
					containment:"#main"
				});
				if(opciones.boton){
					ventana.dialog("option","buttons",[opciones.boton,{text:'Cerrar',click:function(){ $(this).dialog('close');}}]);
				}
			}
		});
	} else {
		mainMsj({txt:'<span style="color:red"><b>Usted no puede acceder a este modulo.</b></span>',show:true,life:3000});	
	}
	return false;
}



function initUser(){
	$.getJSON(localStorage["xenx-erp-web-server"]+'include/theme.php','',function(j){
		$("head link:last").before('<link rel="stylesheet" type="text/css" href="css/'+j.theme+'/jquery.ui.all.css">');
	});
	$(window).resize(resizeMain);
	$("#main_menu").load(localStorage["xenx-erp-web-server"]+'include/menu_principal.php','',function(){
		var list = $("a[xenx-frm].prewidget:not([xenx-inmate=0_0])");
		if(list.length<=12){
			
			var salto=120;
			var saltol=100;
			var gleft=20;
			var gtop=20;
			
			list.each(function(i,e) {
				
				var opciones=$(e).attr('xenx-data')?'" xenx-data="'+$(e).attr('xenx-data')+'"':'';
				opciones+=$(e).attr('xenx-titulo')?'" xenx-titulo="'+$(e).attr('xenx-titulo')+'"':'';
				opciones+=$(e).attr('xenx-ancho')?'" xenx-ancho="'+$(e).attr('xenx-ancho')+'"':'';
				opciones+=$(e).attr('xenx-alto')?'" xenx-alto="'+$(e).attr('xenx-alto')+'"':'';
				$('<div align="center" xenx-frm="'+$(e).attr('xenx-frm')+'"'+opciones+' style="display:none"><img align="center" src="icon/48/'+
				$(e).attr('xenx-icon')+'.png" style="width:48px;height:48px;padding:5px;"><br></div>')
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
			$('<div align="center" onclick="logOut();" style="display:none"><img align="center" src="icon/48/exit.png" style="width:48px;height:48px;padding:5px;"><br>Salir</div>')
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
			$("a[xenx-frm]").draggable({appendTo:'#main',helper:'clone'});
			$.getJSON(localStorage["xenx-erp-web-server"]+'include/widgets.php',{lJSON:'request'},function(json){
				for(var x in json){
						var opciones=json[x].frm_data?'" xenx-data="'+json[x].frm_data+'"':'';
						opciones+=json[x].frm_titulo?'" xenx-titulo="'+json[x].frm_titulo+'"':'';
						opciones+=json[x].frm_ancho?'" xenx-ancho="'+json[x].frm_ancho+'"':'';
						opciones+=json[x].frm_alto?'" xenx-alto="'+json[x].frm_alto+'"':'';
						$('<div align="center" xenx-frm="'+json[x].frm+'"'+opciones+' style="display:none"><img align="center" src="icon/48/'+json[x].icono+'.png" style="width:48px;height:48px;padding:5px;"><br></div>').appendTo("#main").addClass('main_widget').css('top',json[x].top+'px').css('left',json[x].left+'px').append(json[x].nombre).draggable({appendTo:'#main'}).fadeIn('slow').hover(function(){ $(this).addClass('main_widget_hover'); },function(){ $(this).removeClass('main_widget_hover'); });
				}
			});
		}
		
	}).error(function(e) {
       console.log(e); 
    });
	$.getJSON(localStorage["xenx-erp-web-server"]+'include/user.php','',function(j){
		user=j;
	});
	$("#main_tooltip").load(localStorage["xenx-erp-web-server"]+'include/tooltip.php','',function(){
		if($("#chat_tooltip").length>0){
			if($("#chat_tooltip").hasClass("chat_autoini")){
				startChatSession();
			} else {
				$("#chat_list_session_content").html(txtInitSessionChat());	
			}
			$("#chat_tooltip").click(function(){
				if($("#chat_list_session").is(":visible")){
					$("#chat_list_session").hide('slow');
				} else {
					$("#chat_list_session").show('fast');	
				}
			});
		}
	});
	$("#main").mousemove(function(e){
		var ejeY=(e.pageY-($(window).height()/2))/100;
		$("#sub_sub_main").css('background-position',(500-((e.pageX-(MainW/2))/100))+'px '+(((MainH/2)-50)-((e.pageY-(MainH/2))/100))+'px');
	});
	$("#sub_main").droppable({
		hoverClass: "ui-state-medium",
		accept:'a[xenx-frm], div[xenx-frm]',
		drop:function(event,ui){
			if(ui.draggable.attr('xenx-icon')){
				if($("div[xenx-frm='"+ui.draggable.attr('xenx-frm')+"']").text()!=ui.draggable.text()){
					var opciones=ui.draggable.attr('xenx-data')?'" xenx-data="'+ui.draggable.attr('xenx-data')+'"':'';
					opciones+=ui.draggable.attr('xenx-titulo')?'" xenx-titulo="'+ui.draggable.attr('xenx-titulo')+'"':'';
					opciones+=ui.draggable.attr('xenx-ancho')?'" xenx-ancho="'+ui.draggable.attr('xenx-ancho')+'"':'';
					opciones+=ui.draggable.attr('xenx-alto')?'" xenx-alto="'+ui.draggable.attr('xenx-alto')+'"':'';
					
					$('<div align="center" xenx-frm="'+ui.draggable.attr('xenx-frm')+'"'+opciones+' style="display:none"><img align="center" src="icon/48/'+ui.draggable.attr('xenx-icon')+'.png" style="width:48px;height:48px;padding:5px;"><br></div>').appendTo("#main").addClass('main_widget').css('top',ui.position.top+'px').css('left',ui.position.left+'px').append(ui.draggable.text()).draggable({appendTo:'#main'}).fadeIn('slow').hover(function(){ $(this).addClass('main_widget_hover'); },function(){ $(this).removeClass('main_widget_hover'); });
					
					var sopciones=opciones.replace(/"/g,'');
					sopciones=sopciones.replace(/&/g,'___');
					sopciones=sopciones.replace(/ xenx-/g,'&');
					$.ajax({url:localStorage["xenx-erp-web-server"]+'include/widgets.php',data:'add='+ui.draggable.text()+'&top='+ui.position.top+'&left='+ui.position.left+'&frm='+ui.draggable.attr('xenx-frm')+'&icono='+ui.draggable.attr('xenx-icon')+sopciones});
				}
			} else {
				$.ajax({url:localStorage["xenx-erp-web-server"]+'include/widgets.php',data:'editpos='+ui.draggable.text()+'&top='+ui.position.top+'&left='+ui.position.left+'&frm='+ui.draggable.attr('xenx-frm')});
			}
		}
	});
	$("a[xenx-frm]").live('click',function(){
		loadWin($(this).attr('xenx-frm'),{
				local:false,
				data:$(this).attr('xenx-data'),
				ancho:$(this).attr('xenx-ancho')?$(this).attr('xenx-ancho'):770,
				alto:$(this).attr('xenx-alto')?$(this).attr('xenx-alto'):480,
				titulo:$(this).attr('xenx-titulo')?$(this).attr('xenx-titulo'):$(this).text()
		});
		return false;
	});
	$("div[xenx-frm]").live('dblclick',function(){
		loadWin($(this).attr('xenx-frm'),{
				local:false,
				data:$(this).attr('xenx-data'),
				ancho:$(this).attr('xenx-ancho')?$(this).attr('xenx-ancho'):770,
				alto:$(this).attr('xenx-alto')?$(this).attr('xenx-alto'):480,
				titulo:$(this).attr('xenx-titulo')?$(this).attr('xenx-titulo'):$(this).text()
		});
		return false;
	});
	
	///atributos principales de los elementos
	$("input:not([xenx-tooltip])").live('keydown',function(event){
		if($(".ui-dialog-active .ui-modal").is(":not(:visible)")){
			var lfound = false ;
			if (event.keyCode == 13) {
				nextInputFocus(this);
			}
		}
	});
	$("input[xenx-onkeyenter]").live('keydown',function(event){
		if($(".ui-dialog-active .ui-modal").is(":not(:visible)")){
			if (event.keyCode == 13) {
				eval($(this).attr('xenx-onkeyenter')+"();");
			}
		}
	});
	//kgrid
	$(".k-grid:focus").live('keydown',function(event){
		if($(this).find(".k-state-focused").length>0){
			if($(this).parent().hasClass('flgrig-search-tooltip')){
				if(event.keyCode==13||event.keyCode==32) {
					selectFLGrid($(this).find(".k-state-focused"));
					event.preventDefault();
					return false;
				}
			}
			if($(this).parent().hasClass('gridbuscar')){
				if(event.keyCode==13||event.keyCode==32) {
					selectSearchForm();
					event.preventDefault();
					return false;
				}
			}
			if($(this).parent().hasClass('searchtooltip')){
				if(event.keyCode==13||event.keyCode==32) {
					selectSearchTooltip();
					event.preventDefault();
					return false;
				}
			}
		}
	}).live('dblclick',function(){
		if($(this).find(".k-state-focused").length>0){
			if($(this).parent().hasClass('flgrig-search-tooltip')){
				selectFLGrid($(this).find(".k-state-focused"));
				event.preventDefault();
				return false;
			}
			if($(this).parent().hasClass('gridbuscar')){
				selectSearchForm();
				event.preventDefault();
				return false;
			}
			if($(this).parent().hasClass('searchtooltip')){
				selectSearchTooltip();
				event.preventDefault();
				return false;
			}
		}
	});
	$(document).delegate('.k-grid tbody tr','dblclick click',function(){
		if($(this).parent().find("tr").index($(this))==0){
			$(this).parent().find().removeClass('k-state-focused');
			$(this).addClass('k-state-focused');
		}
	});
	//
	$("input[xenx-tooltip]").live('keydown',function(event){
		if($(".ui-dialog-active .ui-modal").is(":not(:visible)")){
			if(event.keyCode==119) {
				eval("searchTooltip('"+$(this).attr("xenx-tooltip")+"',30);");
				return false;
			} else if(event.keyCode==13) {
				if($(this).val()!=""){
					eval("searchTooltip('"+$(this).attr("xenx-tooltip")+"',30);");
					return false;
				} else {
					nextInputFocus(this);
				}
			}
		}
	});
	$('input[xenx-number]').live('keypress',function(b){
		if((b.charCode > 45 && b.charCode < 58) || (b.charCode == 0) || (b.charCode==44)){
			if($(this).attr("xenx-number")=="doble"){
				return true;
			} else {
				if(b.charCode==44||b.charCode==46){
					return false;	
				} else {
					return true;	
				}
			}
		}else{
			return false;
		}
	});
	$(".ui-dialog-active .FLGrid tbody input").live('focusin',function(){
		$(this).parent('td').addClass('FLGrid-td-focus');
	}).live('focusout',function(){
		$(this).attr('readonly','readonly');
		$(this).parent('td').removeClass('FLGrid-td-focus').removeClass('FLGrid-td-focus-editable');
	}).live('keydown',function(){
		if($(".ui-dialog-active .ui-modal").is(":not(:visible)")){
			if($(this).is("[readonly]")){
				if(event.which==39){ //boton derecha
					var tr=$(this).parent('td').parent('tr');
					var i=tr.find("input").index($(this));
					if(i<tr.find("input").length){
						tr.find("input:eq("+(i+1)+")").focus();
					}
					return false;
				}
				if(event.which==37){ //boton izquierda
					var tr=$(this).parent('td').parent('tr');
					var i=tr.find("input").index($(this));
					if(i>0){
						tr.find("input:eq("+(i-1)+")").focus();	
					}
					return false;
				}
				if(event.which==38||event.which==33){ // boton arriba
					var tbody=$(this).parent('td').parent('tr').parent('tbody');
					var tr=$(this).parent('td').parent('tr');
					var itr=tbody.find("tr").index(tr);
					var i=tr.find("input").index($(this));
					if(itr>0){
						tbody.find("tr:eq("+(itr-1)+")").find("input:eq("+i+")").focus();	
					}
					return false;
				}
				if(event.which==40||event.which==34){ // boton abajo
					var tbody=$(this).parent('td').parent('tr').parent('tbody');
					var tr=$(this).parent('td').parent('tr');
					var itr=tbody.find("tr").index(tr);
					var i=tr.find("input").index($(this));
					if(tbody.find("tr").length>itr){
						tbody.find("tr:eq("+(itr+1)+")").find("input:eq("+i+")").focus();	
					}
					return false;
				}
				if(event.which==36||event.which==35){
					if(event.ctrlKey){
						$(this).parent('td').parent('tr').parent("tbody").find("tr:"+(event.which==36?"first":"last")).find("input:"+(event.which==36?"first":"last")).focus();	
					} else {
						$(this).parent('td').parent('tr').find("input:"+(event.which==36?"first":"last")+"").focus();
					}
					return false;
				}
			}
			if(event.which==45){
				insertFLGrid();
				return false;
			}
			if(event.which==46){
				removeFLGrid();
				return false;
			}
			if($(this).is("[xenx-flgrid-input-search]")&&(event.which==119||event.which==13)){
				searchFLGrid(this);
				return false;
			}
			if(event.which!=13&&!(event.which>111&&event.which<123)){
				if($(this).is("[xenx-flgrid-input-editable=true]")&&!$(this).parent('td').hasClass('FLGrid-td-focus-editable')){
					if($(this).parents('.FLGrid[xenx-flgrid-action-edit]').length>0){
						if(event.which!=32){ ///barra espaciadora
							$(this).val(String.fromCharCode((96<=event.which&&event.which<=105)?event.which-48:event.which));
						}
						$(this).removeAttr('readonly');
						$(this).parent('td').addClass('FLGrid-td-focus-editable');
						if(!($(this).parent().parent()).is('.tr-add')){
							($(this).parent().parent()).addClass('tr-edt');
						}
						return !($(this).val()==''&&event.which==8);
					} else {
						mainMsj({txt:'<span style="color:red"><b>No esta permitido editar el registro.</b></span>',show:true,life:5000});
						return false;	
					}
				}
			}
			return true;
		}
	});
	$(".ui-dialog-active .FLGrid tbody td").live('click',function(){
		if($(this).is("[xenx-flgrid-input-editable=true]")){
			$(this).removeAttr('readonly');
		}
		$(this).find("input").focus();
	});
	/// fin de los atributos principale s de los elementos
	ping();
}
function refreshPostContent(vent){
	$("div[xenx-map]").each(function(i, e) {
       eval($(e).attr('xenx-map')+"();"); 
    });
	if(eval("typeof onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id'))=='function'){
		eval("onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id')+"();");
	}
}
function refreshContent(vent){
	$('.boton').button();
	$('.tabs').tabs({show:refreshTab});
	$('.tabs.vertical').each(function(x, el) {
        $(el).addClass("ui-tabs-vertical ui-helper-clearfix");
    	$(el).find('li').removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
    });
	$('input[xenx-check-search]').each(function(i, e) {
		if($(this).attr('xenx-check-search')!='checked'){
			$(e).before('<input type="checkbox" title="Utlizar para busqueda" value="0" />');
			$(e).attr("xenx-not-search","true");
		} else {
			$(e).before('<input type="checkbox" checked="true" title="Utlizar para busqueda" value="0" />');
		}
		$(e).prev().click(function(){
			if($(this).next().is("[xenx-not-search]")){
				$(this).next().removeAttr("xenx-not-search");
			} else {
				$(this).next().attr("xenx-not-search","true");
			}	
		});
		$(e).removeAttr('xenx-check-search');
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
	$('input[xenx-mask]').each(function(i, e) {
		$(e).mask($(e).attr("xenx-mask"));
	});
	if(vent=='login'){
		if(localStorage["xenx-erp-web-servers"]){
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
	}
}

function msjWin(txt,color){
	$("#msjWin").remove();
	var panel=$(".ui-dialog-buttonpane");
	$(".ui-dialog-buttonpane").each(function(index, element) { panel=$(element); });
	panel.prepend('<span id="msjWin" style="font-size:10px;float:left;font-weight:bold;width:50%;'+(color?'color:'+color:'')+'"></span>');
	panel.children("#msjWin").html(txt);
}

function conLocalServ(localToVar){
	if(localToVar){
		localStorage["xenx-erp-web-servers"]="";
		localStorage["xenx-erp-web-servers-name"]="";
		for(var x in servidores){
			if(servidores[x]!=''){
				localStorage["xenx-erp-web-servers"]+=servidores[x]+'|||';
				localStorage["xenx-erp-web-servers-name"]+=servidores_nombre[x]+'|||';
			}
		}
	} else {
		servidores=localStorage.getItem("xenx-erp-web-servers").split('|||');
		servidores_nombre=localStorage.getItem("xenx-erp-web-servers-name").split('|||');
	}
}

function Login(){
	loadWin('login',{
		modal:true,
		titulo:'Acceso al sistema',
		ancho:400,
		alto:420,
		local:true,
		boton:{
			text:'Entrar',
			click:fLogin
		}
	});
}
function fLogin(){
	if($("#login-user").val()!=''){
		if($("#login-empresa").css('display')!='none'){
			if($("#login-pass").val()!=''){
				msjWin("<img src='img/loading.gif' width=12 height=12 align='left'>&nbsp;&nbsp;Estableciendo conexion con el servidor.",'green');
				$.ajax({url:servidores[$("#login-servidor").val()]+"include/login.php",type:"POST",data:$("#form-login").serialize(),success:function(data){
					if(data=="logged"){
						localStorage.setItem('xenx-erp-web-server',servidores[$("#login-servidor").val()]);
						//localStorage["xenx-erp-web-server"]=servidores[$("#login-servidor").val()];
						window.location='./';
					} else {
						msjWin(data,'red');	
					}
				}});
				
			} else {
				msjWin('Debe indicar una contrase&ntilde;a.','red');	
			}
		} else {
			msjWin('No existe este usuario en ninguna empresa.','red');
		}
	}
}
function logOut(){
	if(chatEnabled){closeChatSession();}
	$.ajax({url:localStorage["xenx-erp-web-server"]+'include/logout.php',cache:false,success:function(data){ window.location='./'; },error:function(e,f,g){ console.log("Error"); }});	
}
function mainMsj(option){
	if(option.close){
		$("#msj"+option.id).hide('slide',{direction:"right"},function(){ $(this).remove(); });	
	} else {
		var idd=new Date().getTime();
		var count=$(".main_msj").length;
		$('<div id="msj'+(option.id?option.id:idd)+'"><img src="img/'+(option.icon?option.icon:'info.png')+'" width=16 align="left">&nbsp;&nbsp;</div>').append(option.txt).addClass('main_msj').css('top',30+(28*count)).appendTo('#main_mesages').show('slide',{direction:"right"});
		setTimeout("mainMsj({close:true,id:"+(option.id?option.id:idd)+"})",(option.life?option.life:4000));	
	}
}
function ping(){
	if(!chatEnabled&&!isQuering){
		if(localStorage["xenx-erp-web-server"]){
			$.ajax({url:localStorage["xenx-erp-web-server"]+'include/ping.php',cache:false,success:function(data){
				if(data=="ok"){
					var existsPing=false;
					$(".ui-dialog, .ui-dialog-active").each(function(i,e) {
						if(eval("typeof ping_"+$(e).find(".ui-dialog-content").attr('id'))=='function'){
							existsPing=true;
							eval("ping_"+$(e).find(".ui-dialog-content").attr('id')+"();");
						}
                    });
					setTimeout("ping();",existsPing?5000:7000);					
				} else {
					//logOut();	
				}
			},error:function(){
				setTimeout("ping();",7000);
				mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:5000});
			}});
		}
	} else {
		setTimeout("ping();",5000);
	}
}
function addServer(){
	if($("#server_nombre").val()!=''&&$("#server_url").val()!=''){
		msjWin("<img src='img/loading.gif' width=12 height=12 align='left'>&nbsp;&nbsp;Verificando conexi&oacute;n",'green');
		$.ajax({url:'http://'+$("#server_url").val()+'/server/config/exists.php',
			timeout:5000,success:function(data){
				if(data=="exists"){
					servidores=servidores.concat(['http://'+$("#server_url").val()+'/server/']);
					servidores_nombre=servidores_nombre.concat([$("#server_nombre").val()]);
					conLocalServ(true);
					window.location=window.location;
				} else {
					msjWin('No se ha podido establecer conexion con el servidor.','red');
				}
			},
			error:function(jqXHR, textStatus, errorThrown){ msjWin('No se ha podido establecer conexion con el servidor.','red');},statusCode:{ 404: function() { msjWin('No se ha podido establecer conexion con el servidor.','red'); }
		}});
	} else {
		msjWin('Debe llenar ambos campos.','red');	
	}	
}
function saveForm(){
	if((formMarshal("insertar")&&$(".ui-dialog-active form:visible[xenx-form-data]").attr("xenx-form-data-id")=="")||(formMarshal("modificar")&&$(".ui-dialog-active form:visible[xenx-form-data]").attr("xenx-form-data-id")!="")){
		$(".ui-dialog-active form:visible[xenx-form-data]").each(function(index,form) {
			var dataget='datato='+$(form).attr("xenx-form-data");
			for(var i=0;i<=2;i++){
				dataget+=$(form).attr("xenx-form-data-id"+(i>0?i:""))?('&saveid'+(i>0?i:"")+'='+$(form).attr("xenx-form-data-id"+(i>0?i:""))):'';
				dataget+=$(form).attr("xenx-form-data-campo"+(i>0?i:""))?('&saveidcampo'+(i>0?i:"")+'='+$(form).attr("xenx-form-data-campo"+(i>0?i:""))):'';
			}
			var datapost="";
			if($(form).attr("xenx-auxiliar")){ dataget+='&xenxauxiliar='+$(form).attr("xenx-auxiliar"); }		
			$(".ui-dialog-active form:visible[xenx-form-data] *:input:visible").each(function(index, element) {
				if($(this).attr("xenx-not-save")!="true"&&$(this).parents('.FLGrid').length==0){
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
			$(".ui-dialog-active form:visible[xenx-form-data] img[xenx-data-imagen]:visible").each(function(ind, ele) {
				if($(ele).attr('xenx-data-imagen-new')=="true"){
					datapost+=(datapost!=""?"&":"")+$(ele).attr('xenx-data-imagen')+"="+escape($(ele).get(0).src.replace('data:image/png;base64,',''));
				} else {
					console.log('La imagen no es nueva');	
				}
			});
			$.ajax({url:localStorage["xenx-erp-web-server"]+'include/sdata.php?'+dataget,data:datapost,type:'POST',timeout:20000,success:function(data){
				var datax=data.split('|||');
				for(var i=0;i<=2;i++){
					if(datax[i+1]){
						$(".ui-dialog-active form[xenx-form-data='"+$(form).attr("xenx-form-data")+"']").attr("xenx-form-data-id",datax[i+1]);
						$(".ui-dialog-active form[xenx-form-data='"+$(form).attr("xenx-form-data")+"'] input[name="+
						$(".ui-dialog-active form[xenx-form-data='"+$(form).attr("xenx-form-data")+"']").attr('xenx-form-data-campo')
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
				gridFormSearchForm();
				
				mainMsj({txt:'<span style="color:green">'+datax[0]+'</span>',show:true,life:3000});
			},error:function(e){
				console.log(e); 
				mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 
			},statusCode:{ 404: function() { 
				mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 			}
			}});
		});
		if($(".ui-dialog-active .FLGrid").length==0){
			saveFormGrids();
		}
	} else {
		mainMsj({txt:'<span style="color:red"><b>No tiene permisos para realizar esta operaci&oacute;n.</b></span>',show:true,life:3000});
	}
}
function delsaveForm(){
	if(formMarshal("eliminar")){
		$(".ui-dialog-active form:visible[xenx-form-data]").each(function(index,form) {
			if($(this).attr('xenx-form-data-id')!==''){
				var dataget='datato='+$(form).attr("xenx-form-data");
				for(var i=0;i<=2;i++){
					dataget+=$(form).attr("xenx-form-data-id"+(i>0?i:""))?('&delid'+(i>0?i:"")+'='+$(form).attr("xenx-form-data-id"+(i>0?i:""))):'';
					dataget+=$(form).attr("xenx-form-data-campo"+(i>0?i:""))?('&delidcampo'+(i>0?i:"")+'='+$(form).attr("xenx-form-data-campo"+(i>0?i:""))):'';
				}
				if(confirm("¿Seguro desea eliminar este registro: "+$(".ui-dialog-active .ui-dialog-title").text()+"?")){
					$.ajax({url:localStorage["xenx-erp-web-server"]+'include/sdata.php?'+dataget,success:function(data){
						mainMsj({txt:'<span style="color:green">'+data+'</span>',show:true,life:3000});
						clearForm();
					},error:function(){ 
						mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 
					},statusCode:{ 404: function() { 
						mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 			}
					}});
				}
			}
		});
	} else {
		mainMsj({txt:'<span style="color:red"><b>No tiene permisos para realizar esta operaci&oacute;n.</b></span>',show:true,life:3000});
	}
}
function anulForm(field){
	if(formMarshal("anular")){
		$(".ui-dialog-active form:visible[xenx-form-data]").each(function(index,form) {
			if($(this).attr('xenx-form-data-id')!==''){
				var dataget='datato='+$(form).attr("xenx-form-data")+'&fieldset='+field;
				for(var i=0;i<=2;i++){
					dataget+=$(form).attr("xenx-form-data-id"+(i>0?i:""))?('&anulid'+(i>0?i:"")+'='+$(form).attr("xenx-form-data-id"+(i>0?i:""))):'';
					dataget+=$(form).attr("xenx-form-data-campo"+(i>0?i:""))?('&anulidcampo'+(i>0?i:"")+'='+$(form).attr("xenx-form-data-campo"+(i>0?i:""))):'';
				}
				var resp = prompt("Indique el motivo de la anulacion","");
				if(resp!=''){
					$.ajax({url:localStorage["xenx-erp-web-server"]+'include/sdata.php?'+dataget+"&amot="+resp,success:function(data){
						mainMsj({txt:'<span style="color:green">'+data+'</span>',show:true,life:3000});
						clearForm();
					},error:function(){ 
						mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 
					},statusCode:{ 404: function() { 
						mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 			}
					}});
				}
			}
		});
	} else {
		mainMsj({txt:'<span style="color:red"><b>No tiene permisos para realizar esta operaci&oacute;n.</b></span>',show:true,life:3000});
	}
}
function loadForm(div){
	$(".ui-dialog-active form[xenx-form-data]:visible").each(function(index,form) {
		var dataget='datato='+$(form).attr("xenx-form-data");
		for(var i=0;i<=2;i++){
			dataget+=$(form).attr("xenx-form-data-id"+(i>0?i:""))?('&loadid'+(i>0?i:"")+'='+$(form).attr("xenx-form-data-id"+(i>0?i:""))):'';
			dataget+=$(form).attr("xenx-form-data-campo"+(i>0?i:""))?('&loadidcampo'+(i>0?i:"")+'='+$(form).attr("xenx-form-data-campo"+(i>0?i:""))):'';
		}
		$(".ui-dialog-active form[xenx-form-data] input[xenx-load-function]").each(function(index,elem) {
			dataget+='&loadfunction'+(index>0?index:'')+'='+$(elem).attr('xenx-load-function');
			dataget+='&loadfunctioncampo'+(index>0?index:'')+'='+$(elem).attr('name');
		});	
		$(".ui-dialog-active form[xenx-form-data] [xenx-form-subdata]").each(function(index,elem) {
			dataget+='&subdata'+(index>0?index:'')+'='+$(elem).attr('xenx-form-subdata');
			dataget+='&subid'+(index>0?index:'')+'='+$(elem).attr('xenx-form-subid');
			dataget+='&subcampo'+(index>0?index:'')+'='+$(elem).attr('xenx-form-subcampo');
			
			//dataget+='&subidadd'+(index>0?index:'')+'='+($(elem).attr('xenx-form-subdata-addcol')?$(elem).attr('xenx-form-subdata-addcol'):'');
			
			if($(elem).attr('name')){
				dataget+='&sub'+(index>0?index:'')+'='+$(elem).attr('name');
			} else {
				dataget+='&sub'+(index>0?index:'')+'='+$(elem).attr('xenx-data-campo');
			}
			if($(elem).attr('xenx-alt')){
				dataget+='&subalt'+(index>0?index:'')+'='+$(elem).attr('xenx-alt');
			}
		});
		//$.ajax({url:localStorage["xenx-erp-web-server"]+'include/sdata.php?'+dataget,success:function(json){ alert(json); console.log(json); }});
		loadingForm(true);
		$.getJSON(localStorage["xenx-erp-web-server"]+'include/sdata.php?'+dataget,'',function(json){
			loadingForm(false);
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
						$('.ui-dialog-active *[xenx-data-campo="'+x+'"]').text(json[x].toString());
						///para las imagenes
							$('.ui-dialog-active *[xenx-data-imagen="'+x+'"]').each(function(iimg, eimg) {
								if(json[x]!=""){
									$(eimg).get(0).src="data:image/png;base64,"+unescape(json[x]);
								}
							});
						//
				}
				$('.ui-dialog-active input[name='+$(form).attr('xenx-form-data-campo')+']').attr('readonly','readonly');
				$(".ui-dialog-active input").trigger('change');
				loadFLGrids();
				loadFormGrids();
			} else {
				if(index==0){
					mainMsj({txt:'<span style="color:red"><b>No se encontr&oacute; ning&uacute;n registro.</b></span>',show:true,life:3000});
					$(".ui-dialog-active form[xenx-form-data='"+$(form).attr("xenx-form-data")+"']").attr("xenx-form-data-id","");
				}
			}
			if(eval("typeof onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id'))=='function'){
				eval("onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id')+"();");
			}
		}).fail(function(err){
			//console.log(err);
			loadingForm(false);
		});
		loadFLGrids();
		if($(".ui-dialog-active .FLGrid").length==0){
			loadFormGrids();
		}
		$(".ui-dialog-active input[name='"+$(form).attr("xenx-form-data-campo")+"']").unbind('keydown').keydown(function(event){
			if(event.keyCode==13||event.keyCode==9) {
				if($(this).val()!=""){
					var xcampo="";
					loadingForm(true);
					$(".ui-dialog-active .ventana").html('').load(localStorage["xenx-erp-web-server"]+'data.php?frm='+$(".ui-dialog-active .ventana").attr("id")+'&id='+$(this).val(),'',function(){
						loadingForm(false);
						refreshContent();
						loadForm();
					});
					//////////////$(".ui-dialog-active form[xenx-form-data='"+$(form).attr("xenx-form-data")+"']").attr("xenx-form-data-id",$(this).val());
					//////////////loadForm();
				}
			}
		});
		if($(".ui-dialog-active input[name='"+$(form).attr("xenx-form-data-campo")+"']:visible").is(":not([xenx-not-focus])")){
			$(".ui-dialog-active input[name='"+$(form).attr("xenx-form-data-campo")+"']:visible").focus();
		} else {
			$(form).find("input:not([xenx-not-focus]):visible:first").focus();
		}
	});
	/*if($(".ui-dialog-active form[xenx-form-data]:visible").length==0){
		if(eval("typeof onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id'))=='function'){
			eval("onload_"+$(".ui-dialog-active .ui-dialog-content").attr('id')+"();");
		}
	}*/
}
function gridFormSearchForm(){
	$(".ui-dialog-active .gridFormSearchForm:visible").each(function(idgrid, grid) {
		$(".ui-dialog-active form[xenx-form-data]:eq("+$(grid).attr('xenx-grid-findex')+")").each(function(index,form) {
			var div=$(form).attr('xenx-form-search');
			var divg=$(grid).attr('id');
			var dataget='searchto='+$(form).attr("xenx-form-data");
			
			var i=0;
			$(".ui-dialog-active #"+divg+" *[xenx-search-campo]").each(function(index, element) {
				i++;
				dataget+="&rfield"+i+"="+$(element).attr("xenx-search-campo");
				if($(element).attr("xenx-search-subdata")){
					dataget+="&rsubfield"+i+"="+$(element).attr("xenx-search-subdata");
				}
				if($(element).attr("xenx-search-subcampo")){
					dataget+="&rsubcampofield"+i+"="+$(element).attr("xenx-search-subcampo");
				}
				if($(element).attr("xenx-search-subid")){
					dataget+="&rsubidfield"+i+"="+$(element).attr("xenx-search-subid");
				}
			});
			if($(form).attr('xenx-form-data-id')!=""){
					datapost=$(form).attr('xenx-form-data-campo')+"="+$(form).attr('xenx-form-data-id')+"&uniquecodexenx=true";
			} else {
				var datapost=$(form).serialize();
				$(".ui-dialog-active form[xenx-form-data]:eq("+$(grid).attr('xenx-grid-findex')+") *[xenx-not-search]").each(function(indexc, element) {
					datapost+="&"+$(element).attr("name")+"=";
				});
			}
			$.ajax({url:localStorage["xenx-erp-web-server"]+'include/fdata.php?'+dataget,data:datapost,type:'POST',success:function(data){
				$(".ui-dialog-active #"+divg+" tbody").html('');
				$(".ui-dialog-active #"+divg+" table tbody").append(data);
				gridFixedHeader();
				selectGridFormSearchForm();
				$(".ui-dialog-active #"+divg+" table tbody tr").click(function(){ 
					$("tr.data").removeClass('tractive'); $(this).addClass('tractive'); 
					selectGridFormSearchForm();
				});	
			}});
		});
	});
}

function selectGridFormSearchForm(){
	$(".ui-dialog-active .gridFormSearchForm:visible tbody tr.tractive td").each(function(index,element) {
		$(".ui-dialog-active *[name='"+$(element).attr("xenx-key")+"']:not(:checkbox):visible, .ui-dialog-active *[xenx-alt='"+$(element).attr("xenx-key")+"']:not(:checkbox):visible").val($(element).text());
		if($(".ui-dialog-active *[name='"+$(element).attr("xenx-key")+"']:visible").is(':checkbox')){
			if($(element).text()==$(".ui-dialog-active *[name='"+$(element).attr("xenx-key")+"']:visible").val()){
				$(".ui-dialog-active *[name='"+$(element).attr("xenx-key")+"']:visible").attr("checked","false");
			} else {
				$(".ui-dialog-active *[name='"+$(element).attr("xenx-key")+"']:visible").removeAttr("checked");
			}
		}
		$(".ui-dialog-active form[xenx-form-data-campo='"+$(element).attr("xenx-key")+"']:visible").attr("xenx-form-data-id",$(element).text());
		$(".ui-dialog-active form[xenx-form-data-campo-alt='"+$(element).attr("xenx-key")+"']:visible").attr("xenx-form-data-id",$(element).text());
    });
}
function selectSearchForm(idx){
	var div=!idx?$(".ui-dialog-active .gridbuscar"):$("#"+idx);
	var dataget="frm="+$(".ui-dialog-active .ventana").attr("id");
	for(var i=0; i<=3; i++){
		if($(".ui-dialog-active *[xenx-form-search]").attr("xenx-form-data-campo"+(i>0?i:""))){
			dataget+="&id"+(i>0?i:"")+"="+div.find("tbody tr.k-state-focused td:eq("+(div.find("thead").find("th[data-field="+$(".ui-dialog-active form[xenx-form-search]").attr("xenx-form-data-campo"+(i>0?i:''))+"]").index())+")").html();
		}	
	}
	$(".ui-dialog-active .ventana").html('').load(localStorage["xenx-erp-web-server"]+'data.php?'+dataget,'',function(){
		refreshContent();
		loadForm();
	});
}
function clearForm(){
	var dataget="frm="+$(".ui-dialog-active .ventana").attr("id");
	$(".ui-dialog-active .ventana").html('').load(localStorage["xenx-erp-web-server"]+'data.php?'+dataget,'',function(response,status,xhr){
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
function searchTooltip(div,ltop){
	if(!ltop){ var ltop=30; }
	var ids=$("#"+div);
	var dataget="sttdatato="+ids.attr("xenx-search-tooltip-data")+"&datatop="+ltop;
	var i=0;
	while(ids.attr("xenx-search-tooltip-campo"+(i>0?i:""))){
		dataget+="&sttcampo"+(i>0?i:"")+"="+ids.attr("xenx-search-tooltip-campo"+(i>0?i:""));
		i++;
	}
	dataget+="&sttid="+$(".ui-dialog-active input[name='"+ids.attr("xenx-search-tooltip-id")+"']").val();
	
	dataget+="&xenxorderby="+(ids.attr("xenx-orderby")?ids.attr("xenx-orderby"):"");
	dataget+="&xenxorder="+(ids.attr("xenx-order")?ids.attr("xenx-order"):"");
	
	dataget+="&xenxwhere="+(ids.attr("xenx-search-tooltip-where")?ids.attr("xenx-search-tooltip-where"):"");
	
	lastFocus=$(":focus");
	
	$("#"+div+".grid").removeClass('grid').addClass('kgrid');
	$(".ui-dialog-active").find("#"+div+" [xenx-search-campo]").each(function(ix,ex) {
		$(ex).attr("data-field",$(ex).attr("xenx-search-campo")).removeAttr("xenx-search-campo");
	});
	
	$(".ui-dialog-active").find("#"+div+" [data-field]").each(function(ix,ex) {
		if(!$(ex).attr("width")){
			if((/Nombre/).test($(ex).text())){
				$(ex).attr("width",((/Nombre/).test($(ex).text())?300:80))
			}	
		}
	});
	$("#"+div+" th[data-field]").each(function(index, element) {
		i=index+1;
		dataget+="&rfield"+i+"="+$(element).attr("data-field");
		if($(element).attr("xenx-search-subdata")){
			dataget+="&rsubfield"+i+"="+$(element).attr("xenx-search-subdata");
		}
		if($(element).attr("xenx-search-subcampo")){
			dataget+="&rsubcampofield"+i+"="+$(element).attr("xenx-search-subcampo");
		}
		if($(element).attr("xenx-search-subid")){
			dataget+="&rsubidfield"+i+"="+$(element).attr("xenx-search-subid");
		}
	});
	$.ajax({url:localStorage["xenx-erp-web-server"]+'include/ftdata.php?'+dataget,cache:false,success:function(data){
		if(data){
			//console.log(data);
			var ids=$("#"+div+"");
			var k=loadKGrid(ids,data);
			if(k==1){
				selectSearchTooltip(div);
			} else if(!k) {
				if(lastFocus){
					lastFocus.focus();
				}
				mainMsj({txt:'<span style="color:red"><b>No se encontró ningun resultado</b></span>',show:true,life:3000}); 
			}
		}
	}});
}
function selectSearchTooltip(idx){
	var div=!idx?$(".ui-dialog-active .searchtooltip:visible"):$("#"+idx);
	//alert(div.attr('id'));
	if(div.attr('xenx-onselect')){
		var tr=div.find("tbody tr.k-state-focused");
		eval(div.attr('xenx-onselect')+"(tr);");
	} else {
		div.find("tbody tr.k-state-focused td").each(function(i,e) {
			//alert($(e).attr('xenx-search-campo-goto'));
			var datafield=(div.find("thead tr th:eq("+i+")").attr('xenx-search-campo-goto')?'xenx-search-campo-goto':'data-field');
			var namefield=(div.find("thead tr th:eq("+i+")").attr(datafield));
			
			if($('.ui-dialog-active *[xenx-flgrid-input-active]').length>0){
				$('.ui-dialog-active *[xenx-flgrid-input-active]').parent().parent().find("input[xenx-alt='"+namefield+"'], input[name='"+namefield+"'], *[xenx-data-campo='"+namefield+"']").val($(e).html()).trigger('change');
			} else {
				$(".ui-dialog-active form:visible input[xenx-alt='"+namefield+"'], .ui-dialog-active form:visible input[name='"+namefield+"'], .ui-dialog-active form:visible [xenx-data-campo='"+namefield+"']").val($(e).html()).trigger('change');	
			}
			///$(".ui-dialog-active form:visible input[name='"+namefield+"']").val($(e).html());
			//$(".ui-dialog-active form:visible [xenx-data-campo='"+namefield+"']").html($(e).html());
			
		});
	}
	closePops(true);
}
function gridFixedHeader(ex){
	if(!ex){ ex=":visible"; }
	$(".ui-dialog-active .grid"+ex).each(function(index,element){
		if(!$(element).children(".contentHeadFix").html()){
			if(!$(element).children("table").attr('width')){
				$(element).children("table").attr('width','100%');
			}
			$(element).addClass('gridFixedHeader');
			$(element).append('<div class="headHeadFix">'+$(element).html()+'</div>');
			$(element).append('<div class="contentHeadFix">'+$(element).children(".headHeadFix").html()+'</div>');
			$(element).children(".contentHeadFix").scroll(function(){
				$(element).children(".headHeadFix").scrollLeft($(this).scrollLeft());
			});
			$(element).children(".headHeadFix").children("table").children("tbody").remove();
			$(element).children("table").remove();
			$(element).children(".contentHeadFix").css('position','relative').css('top','0px');
		}
		if($(".ui-dialog-active .grid"+ex+" .trfooter").html()){
			$(element).append('<div class="footerHeadFix"><span style="padding-top:5px; padding-right:10px;">'+$(".ui-dialog-active .grid"+ex+" .trfooter").html()+'</span></div>');
			$(".ui-dialog-active .grid"+ex+" .trfooter").remove();
		}
		$(".ui-dialog-active .grid"+ex).each(function(index,element){
			$(element).children(".contentHeadFix").height($(element).height());
			$(element).children(".contentHeadFix").scrollTop(0);
			
			////mejorado ///
			$(element).find(".contentHeadFix thead th").each(function(indexm, elementm) {
				//console.log(elementm)
				$(element).find(".headHeadFix th:eq("+indexm+")").width($(elementm).width());
            });
			$(element).find(".headHeadFix table").width($(element).find(".contentHeadFix table").width()+10);
		});
	});
}
function showPop(div){
	closePops();
	$(".ui-dialog-active form[xenx-form-data]:visible .pop#"+div).each(function(index, element) {
		if($(".ui-dialog-active #"+div).is(":not(:visible)")){
			var left=(($('.ui-dialog-active').width()/2)-325);
			$(".ui-dialog-active #"+div).css('top',top).css('left',left).css('z-index',($(".ui-dialog-active .ui-modal").css('z-index')+1)).show();
			$(".ui-dialog-active #"+div).css('z-index',($(".ui-dialog-active .ui-modal").css('z-index')+1)).focus();
			$(".ui-dialog-active .ui-modal").show('fade');
		}
    });
}
function closePops(isNext){
	$(".ui-dialog-active .ui-modal, .ui-dialog-active .gridbuscar:visible, .ui-dialog-active .searchtooltip, .ui-dialog-active .flgrig-search-tooltip, .ui-dialog-active .pop, .kgrid").css('display','none');
	if(lastFocus){
		lastFocus.focus();	
	}
	if(isNext){
		$('*[xenx-flgrid-input-active]').removeAttr('xenx-flgrid-input-active');
		nextInputFocus();	
	}
	
}
function loadFormGrids(){
	$(".ui-dialog-active form[xenx-form-data] .gridform").each(function(index, element) {
		var div=$(element).attr("id");
		var dataget="sttdatato="+$(element).attr("xenx-grid-data");
		
		if($(element).attr("xenx-grid-query")){
			dataget+="&equery="+$(element).attr("xenx-grid-query");	
		}
		
		if($(element).attr("xenx-grid-orderby")){
			dataget+="&xordeby="+$(element).attr("xenx-grid-orderby");	
		}
		
		var i=0;
		while($(element).attr("xenx-grid-campo"+(i>0?i:""))){
			dataget+="&sttcampo"+(i>0?i:"")+"="+$(element).attr("xenx-grid-campo"+(i>0?i:""));
			i++;
		}
		
		i=0;
		while($(element).attr("xenx-grid-id"+(i>0?i:""))){
			dataget+="&sttid"+(i>0?i:"")+"="+$(".ui-dialog-active input[name='"+$(element).attr("xenx-grid-id"+(i>0?i:""))+"']").val();
			i++;
		}
		
		var i=0;
		$("#"+div+" table:first *[xenx-grid-campo]").each(function(indexv, elementv) {
			i++;
			dataget+="&rfield"+i+"="+$(elementv).attr("xenx-grid-campo");
			if($(elementv).attr("xenx-grid-subdata")){
				dataget+="&rsubfield"+i+"="+$(elementv).attr("xenx-grid-subdata");
			}
			if($(elementv).attr("xenx-grid-subcampo")){
				dataget+="&rsubcampofield"+i+"="+$(elementv).attr("xenx-grid-subcampo");
			}
			if($(elementv).attr("xenx-grid-subid")){
				dataget+="&rsubidfield"+i+"="+$(elementv).attr("xenx-grid-subid");
			}
		});
		
		$.ajax({url:localStorage["xenx-erp-web-server"]+'include/gdata.php?load=true&'+dataget,success:function(data){
			$("#"+div+" table tbody").html('');
			$("#"+div+" table tbody").append(data);
			gridFixedHeader('form');
			$(".ui-dialog-active #"+div+" table tbody tr").click(function(){ $("tr.data").removeClass('tractive'); $(this).addClass('tractive'); });
		}});
		
		$(element).unbind('mouseleave').live('mouseleave',function(){
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.tractive").addClass('atractive');
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.data").removeClass('tractive');
		}).unbind('mouseenter').live('mouseenter',function(){
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.tractive:first").addClass('atractive');
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.data").removeClass('tractive');
			
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.atractive:first").addClass('tractive');
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.data").removeClass('atractive');
			
			/*
			$(this).children(".contentHeadFix").scrollTop((($(".tractive:visible").height()*(($("#"+$(this).attr('id')+" .contentHeadFix tbody tr.data").length)+1))-($("#"+$(this).attr('id')).height()/2))+($(".tractive:visible").height()));
			if($("#"+$(this).attr('id')).children(".contentHeadFix").scrollTop()<=0){
				$("#"+$(this).attr('id')).children(".contentHeadFix").scrollTop($(".tractive:visible").height());
			}
			*/
			
		});
		
	});
	
	$(".ui-dialog-active form[xenx-form-data] .FLGrid").each(function(ig, grid) {
		
		$(grid).find('tbody').html('');
		
		var dataget="sttdatato="+$(grid).attr("xenx-flgrid-data");
		var i=0;
		
		while($(grid).is('[xenx-flgrid-data-campo'+(i>0?i:"")+']')){
			dataget+="&sttcampo"+(i>0?i:"")+"="+$(grid).attr("xenx-flgrid-data-campo"+(i>0?i:""));
			dataget+="&sttid"+(i>0?i:"")+"="+$(".ui-dialog-active input[name='"+$(grid).attr("xenx-flgrid-data-id"+(i>0?i:""))+"']").val();
			i++;
		}
		
		i=0;
		var j=0;
		var k=0;
		$(grid).find("thead th").each(function(ih, gh) {
            i++;
			dataget+="&rfield"+i+"="+$(gh).attr("xenx-flgrid-campo");
			if($(gh).attr("xenx-flgrid-subdata")){
				dataget+="&rsubfield"+i+"="+$(gh).attr("xenx-flgrid-subdata");
			}
			if($(gh).attr("xenx-flgrid-subcampo")){
				dataget+="&rsubcampofield"+i+"="+$(gh).attr("xenx-flgrid-subcampo");
			}
			if($(gh).attr("xenx-flgrid-subid")){
				dataget+="&rsubidfield"+i+"="+$(gh).attr("xenx-flgrid-subid");
			}
        });
		
		if($(grid).attr("xenx-flgrid-query")){
			dataget+="&equery="+$(element).attr("xenx-flgrid-query");	
		}
		
		if($(grid).attr("xenx-flgrid-orderby")){
			dataget+="&xordeby="+$(element).attr("xenx-flgrid-orderby");	
		}
		
		$.getJSON(localStorage["xenx-erp-web-server"]+'include/flgrid.php?load=true&'+dataget,'',function(data){
			if(data){
				for(var a in data){
					insertFLGrid(data[a]);
				}	
			}
		});
		
	});
		
}
function saveFormGrids(){
	$(".ui-dialog-active form[xenx-form-data] .gridform:visible").each(function(index, element) {
		var div=$(element).attr("id");
		var dataget="sttdatato="+$(element).attr("xenx-grid-data");
		var i=0;
		while($(element).attr("xenx-grid-campo"+(i>0?i:""))){
			dataget+="&sttcampo"+(i>0?i:"")+"="+$(element).attr("xenx-grid-campo"+(i>0?i:""));
			i++;
		}
		dataget+="&sttid="+$(".ui-dialog-active input[name='"+$(element).attr("xenx-grid-id")+"']").val();
		var i=0;
		var j=0;
		var k=0;
		$("#"+div+" .headHeadFix *[xenx-grid-campo]:not([xenx-not-save=true]):not([xenx-grid-key-auto=true])").each(function(indexv, elementv) {
			i++;
			dataget+="&rfield"+i+"="+$(elementv).attr("xenx-grid-campo");
			if($(elementv).attr("xenx-grid-subdata")){
				dataget+="&rsubfield"+i+"="+$(elementv).attr("xenx-grid-subdata");
			}
			if($(elementv).attr("xenx-grid-subcampo")){
				dataget+="&rsubcampofield"+i+"="+$(elementv).attr("xenx-grid-subcampo");
			}
			if($(elementv).attr("xenx-grid-subid")){
				dataget+="&rsubidfield"+i+"="+$(elementv).attr("xenx-grid-subid");
			}
			if($(elementv).attr("xenx-grid-key")){
				j++;
				dataget+="&kfield"+j+"="+$(elementv).attr("xenx-grid-campo"); //llave
			}
		});
		$("#"+div+" .headHeadFix *[xenx-grid-key-auto]").each(function(indexv, elementv) {
			k++;
			dataget+="&autofield"+k+"="+$(elementv).attr("xenx-grid-campo"); //llave
		});
		
		var datapost="";
		$(".ui-dialog-active #"+div+" .contentHeadFix table tbody tr.data.tradded").each(function(index, element) {
            var ij=0;
			$(element).children('td').each(function(indexe, elemente) {
				if(!$("#"+div+" .headHeadFix *[xenx-grid-campo]:eq("+indexe+")").attr("xenx-not-save")){
                	datapost+=(datapost!=""?"&":"")+"field"+(index>0?index:"")+"_"+(ij>0?ij:"")+"="+$(elemente).attr("xenx-key");
					datapost+="&val"+(index>0?index:"")+"_"+(ij>0?ij:"")+"="+$(elemente).text();
					ij++;
				}
            });
        });
		
		if($(".ui-dialog-active #"+div+"[xenx-is-anul]").length>0){
			if($(".ui-dialog-active #"+div+" .contentHeadFix table tbody tr.data.trdeleted").length>0){
				var descanul=prompt("Indique el motivo de la anulación");
				dataget+="&dsanul="+descanul;
			}
		}
		
		$(".ui-dialog-active #"+div+" .contentHeadFix table tbody tr.data.trdeleted").each(function(index, element) {
            var ij=0;
			$(element).children('td').each(function(indexe, elemente) {
                if(!$("#"+div+" .headHeadFix *[xenx-grid-campo]:eq("+indexe+")").attr("xenx-not-save")){
					datapost+=(datapost!=""?"&":"")+"dfield"+(index>0?index:"")+"_"+(ij>0?ij:"")+"="+$(elemente).attr("xenx-key");
					datapost+="&dval"+(index>0?index:"")+"_"+(ij>0?ij:"")+"="+$(elemente).text();
					ij++;
				}
            });
        });
		
		$.ajax({url:localStorage["xenx-erp-web-server"]+'include/gdata.php?save=true&'+dataget,type:'POST',data:datapost,success:function(data){
			mainMsj({txt:'<span style="color:green">'+data+'</span>',show:true,life:3000});	
			setTimeout(refreshTab,300);
		}});
	});
	
	$(".ui-dialog-active form[xenx-form-data] .FLGrid:visible").each(function(ig, grid) {
		var datapost="";
		var dataget="sttdatato="+$(grid).attr("xenx-flgrid-data");
		var i=0;
		while($(grid).is('[xenx-flgrid-data-campo'+(i>0?i:"")+']')){
			dataget+="&sttcampo"+(i>0?i:"")+"="+$(grid).attr("xenx-flgrid-data-campo"+(i>0?i:""));
			dataget+="&sttid"+(i>0?i:"")+"="+$(".ui-dialog-active input[name='"+$(grid).attr("xenx-flgrid-data-id"+(i>0?i:""))+"']").val();
			i++;
		}
		i=0;
		var j=0;
		var k=0;
		$(grid).find("thead th:not([xenx-flgrid-not-save])").each(function(ih, gh) {
            i++;
			dataget+="&rfield"+i+"="+$(gh).attr("xenx-flgrid-campo");
        });
		
		$(grid).find("tbody tr.tr-add").each(function(ib, gb) {
            var ij=0;
			$(gb).find('td input').each(function(ii, gi) {
				var td = $(gi).parent();
				if($(grid).find("thead tr th:eq("+$(gb).find('td').index(td)+"):not([xenx-flgrid-not-save]):not([xenx-flgrid-primarykey])").length>0){
					datapost+=(datapost!=""?"&":"")+"field"+(ib>0?ib:"")+"_"+(ij>0?ij:"")+"="+$(gi).attr('name');
					datapost+="&val"+(ib>0?ib:"")+"_"+(ij>0?ij:"")+"="+$(gi).val();
					ij++;
				}
            });
        });
		
		$(grid).find("tbody tr.tr-del").each(function(ib, gb) {
            var ij=0;
			$(gb).find('td input').each(function(ii, gi) {
				var td = $(gi).parent();
				if($(grid).find("thead tr th:eq("+$(gb).find('td').index(td)+")").is('[xenx-flgrid-primarykey]')||$(grid).find("thead tr th:eq("+$(gb).find('td').index(td)+")").is('[xenx-flgrid-key]')){
					datapost+=(datapost!=""?"&":"")+"dfield"+(ib>0?ib:"")+"_"+(ij>0?ij:"")+"="+$(gi).attr('name');
					datapost+="&dval"+(ib>0?ib:"")+"_"+(ij>0?ij:"")+"="+$(gi).val();
					ij++;
				}
            });
        });
		
		$(grid).find("tbody tr.tr-edt:not(.tr-add)").each(function(ib, gb) {
            var ij=0;
			$(gb).find('td input').each(function(ii, gi) {
				var td = $(gi).parent();
				if($(grid).find("thead tr th:eq("+$(gb).find('td').index(td)+"):not([xenx-flgrid-not-save])").length>0){
					datapost+=(datapost!=""?"&":"")+"efield"+(ib>0?ib:"")+"_"+(ij>0?ij:"")+"="+$(gi).attr('name');
					datapost+="&eval"+(ib>0?ib:"")+"_"+(ij>0?ij:"")+"="+$(gi).val();
					if($(grid).find("thead tr th:eq("+$(gb).find('td').index(td)+")").is('[xenx-flgrid-primarykey]')||$(grid).find("thead tr th:eq("+$(gb).find('td').index(td)+")").is('[xenx-flgrid-key]')){
						datapost+="&eiskey"+(ib>0?ib:"")+"_"+(ij>0?ij:"")+"=true";
					}
					ij++;
				}
            });
        });
		
		//alert(datapost);
		
		$.ajax({url:localStorage["xenx-erp-web-server"]+'include/flgrid.php?save=true&'+dataget,type:'POST',data:datapost,success:function(data){
			mainMsj({txt:'<span style="color:green">'+data+'</span>',show:true,life:3000});	
			setTimeout(loadForm,300);
		}});
		
	});
	
}
function refreshTab(){
	$('.ui-dialog-active .gmap:visible:not(.mapLoaded)').each(function(index, element) {
       	$(element).addClass('mapLoaded').gmap3({action: 'init',
			options:{
				center:[10.033767,-67.840576],
				zoom:6,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: true,
				navigationControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
				},
				scrollwheel: true,
				streetViewControl: true
			},
			events:{
				click: function(map,event){
					var lang=(Math.round(event.latLng.lat()*1000000)/1000000)+","+(Math.round(event.latLng.lng()*1000000)/1000000);
					var valest="";
					$(".ui-dialog-active input[name='"+$(element).attr("xenx-coord")+"']:visible").each(function(indexa, elementa) {
						if($(elementa).val()==""){
							$(elementa).val(lang);
							valest="ok";	
						}
					});
					if(valest==""){
						$(".ui-dialog-active input[name='"+$(element).attr("xenx-coord")+"']:visible:first").val(lang);
					}
					loadMarkers();
				}
			}
		});
    });
	loadMarkers();
	$(".ui-dialog-active form:visible input:first").focus();
	refreshGridForm();
}
function refreshGridForm(){
	gridFormSearchForm();
	gridFixedHeader('form');
	$(".ui-dialog-active .gridform:visible").each(function(index,element){
		var cant=0;
		var antW=$(element).children(".headHeadFix").children("table").attr('width');
		$(element).children(".headHeadFix").children("table").attr('width','');
		$(element).children(".contentHeadFix").css('height',($(element).height()-20)+'px');
		//$(element).children(".contentHeadFix").animate({scrollTop:0});
		$(element).children(".contentHeadFix").children("table").children("tbody").children("tr.tractive").children("td").each(function(indexm, elementm) {
				cant=indexm;
			   $(element).children(".headHeadFix").children("table").children("thead").children("tr").children("th").each(function(indexs, elements) {
					if(indexm==indexs){
						$(elements).css('width',$(elementm).width()+'px');
					}
			   });
		});
		if(cant==0){
			$(element).children(".headHeadFix").children("table").attr('width',antW);
		}
	});
	totalizeFormGrid();
}
function totalizeFormGrid(){
	$("*[xenx-total-from]:visible").each(function(ind, e) {
        var grid=$("#"+$(e).attr("xenx-total-from"));
		var et=0;
		grid.find(".contentHeadFix tbody tr:not(.not) td[xenx-key='"+$(e).attr("xenx-total")+"']").each(function(it, etr) {
           // console.log($(etr).find("td:eq("+eq+")").text());
			et=et+Number($(etr).text());
			$(e).text(format(et,'monto'));
        });
    });
}
function addToGrid(div,jdata){
	var data="";
	if(jdata){
		$("#"+div+" .headHeadFix th[xenx-grid-campo]").each(function(index, element) {
				var mval = jdata[$(element).attr('xenx-grid-campo')];
				data+='<td xenx-key="'+$(element).attr('xenx-grid-campo')+'">'+(mval?mval:'')+'</td>';
		});
		if(data!=""){
			$("#"+div+" .contentHeadFix tbody tr.data.tractive").removeClass('tractive');
			$('<tr class="data tractive"></tr>').addClass("tradded").html(data).click(function(){ $("tr.data").removeClass('tractive'); $(this).addClass('tractive'); }).appendTo("#"+div+" .contentHeadFix tbody");
			$("#"+div).children(".contentHeadFix").scrollTop((($(".tractive:visible").height()*(($("#"+div+" .contentHeadFix tbody tr.data").length)+1))-($("#"+div).height()/2))+($(".tractive:visible").height()));
			if($("#"+div).children(".contentHeadFix").scrollTop()<=0){
				$("#"+div).children(".contentHeadFix").scrollTop($(".tractive:visible").height());
			}
		}
	} else {
		if($(".ui-dialog-active form:visible[xenx-form-data] input[name='"+$("#"+div+" .headHeadFix th[xenx-grid-campo]:first").attr('xenx-grid-campo')+"']").val()!=""){
			$("#"+div+" .headHeadFix th[xenx-grid-campo]").each(function(index, element) {
	
					var mval = ($(".ui-dialog-active form:visible[xenx-form-data] *[xenx-alt='"+$(element).attr('xenx-grid-campo')+"']").length>0?$(".ui-dialog-active form:visible[xenx-form-data] *[xenx-alt='"+$(element).attr('xenx-grid-campo')+"']").val():$(".ui-dialog-active form:visible[xenx-form-data] *[name='"+$(element).attr('xenx-grid-campo')+"']").val());
					
					data+='<td xenx-key="'+$(element).attr('xenx-grid-campo')+'">'+(mval?mval:'')+'</td>';
					//$(".ui-dialog-active form:visible[xenx-form-data] input[name='"+$(element).attr('xenx-grid-campo')+"']").val('');
					//$(".ui-dialog-active form:visible[xenx-form-data] input[xenx-alt='"+$(element).attr('xenx-grid-campo')+"']").val('');
					if(index==0){
						$(".ui-dialog-active form:visible[xenx-form-data] input[name='"+$(element).attr('xenx-grid-campo')+"']").focus();
					}
			});
			if(data!=""){
				$("#"+div+" .contentHeadFix tbody tr.data.tractive").removeClass('tractive');
				$('<tr class="data tractive"></tr>').addClass("tradded").html(data).click(function(){ $("tr.data").removeClass('tractive'); $(this).addClass('tractive'); }).appendTo("#"+div+" .contentHeadFix tbody");
				$("#"+div).children(".contentHeadFix").scrollTop((($(".tractive:visible").height()*(($("#"+div+" .contentHeadFix tbody tr.data").length)+1))-($("#"+div).height()/2))+($(".tractive:visible").height()));
				if($("#"+div).children(".contentHeadFix").scrollTop()<=0){
					$("#"+div).children(".contentHeadFix").scrollTop($(".tractive:visible").height());
				}
			}
		}
	}
}
function delToGrid(div){
	if($(".ui-dialog-active #"+div+":not([xenx-grid-readonly])").length>0){
		if($(".ui-dialog-active #"+div+" tr.tractive").hasClass('tradded')) {
			$(".ui-dialog-active #"+div+" tr.tractive").remove();
			$(".ui-dialog-active #"+div+" tr.data:eq(0)").addClass('tractive');
			$(".ui-dialog-active #"+div).children(".contentHeadFix").scrollTop($(".tractive:visible").height());
		}else{
			if($(".ui-dialog-active #"+div+" tr.tractive").hasClass('trdeleted')){
				$(".ui-dialog-active #"+div+" tr.tractive").removeClass('trdeleted');
			} else {
				$(".ui-dialog-active #"+div+" tr.tractive").addClass('trdeleted');
			}
		}
	}
	totalizeFormGrid();
}
function selToGrid(div){
	if($(".ui-dialog-active #"+div+":not([xenx-grid-readonly])").length>0){
		if(!$(".ui-dialog-active #"+div+" tr.tractive").hasClass('tradded')) {
			if($(".ui-dialog-active #"+div+" tr.tractive").hasClass('trselected')){
				$(".ui-dialog-active #"+div+" tr.tractive").removeClass('trselected');
			} else {
				$(".ui-dialog-active #"+div+" tr.tractive").addClass('trselected');
			}
		}
	}
}
///markers
function loadMarkers(){
	$('.ui-dialog-active .gmap:visible').each(function(index, element) {
		$(element).gmap3({action:'clear'});
		$(".ui-dialog-active input[name='"+$(element).attr("xenx-coord")+"']:visible").each(function(indexa, elementa) {
            if($(elementa).val()!=""){
				$(element).gmap3({
					action: 'addMarker',
					marker:{
						options:{
							draggable:false,
							animation: google.maps.Animation.DROP,
							title:$(elementa).attr("title")?$(elementa).attr("title"):"A"
						},
					},
					latLng:$(elementa).val().split(","),
					map:{
						center: true,
						zoom:13
					}
				});
			}
        });
	});
}
function centerMarkers(div){
	var marker=div.gmap3({action:'get',name:'marker',first:true});
	if(marker){
		div.gmap3({
			action:'setCenter',
			args:[marker.getPosition()]
		}).gmap3({
			action:'setZoom',
			args:[16]
		}).gmap3({
			action:'getBounds',
			callback: function (bounds){
				if (!bounds) return;
				var markers=div.gmap3({action:'get',name:'marker',all:true});
				for(var i in markers){
					bounds.extend(markers[i].getPosition());
				}
				$(this).gmap3('get').fitBounds(bounds);
			}
		});
	} else {
		div.gmap3({
			action:'setZoom',
			args:[8]
		});
	}
}
////
function searchGrid(id){
	$(".ui-dialog-active form[xenx-grid-search='"+id+"']:visible").each(function(index,form) {
		var dataget="datato"+"="+$("#"+id).attr("xenx-grid-data");
		var i=0;
		while($("#"+id).attr("xenx-grid-campo"+(i>0?i:""))){
			dataget+="&sgcampo"+(i>0?i:"")+"="+$("#"+id).attr("xenx-grid-campo"+(i>0?i:""));
			dataget+="&sgid"+(i>0?i:"")+"="+$(".ui-dialog-active input[name='"+$("#"+id).attr("xenx-grid-id"+(i>0?i:""))+"']").val();
			i++;
		}
		$(".ui-dialog-active form[xenx-grid-search='"+id+"']:visible *:input").each(function(indexe, element) {
			dataget+="&sgcampo"+(i>0?i:"")+"="+$(element).attr('name');
			if($(this).attr("type")=="checkbox"){
				if($(this).is(":not(:checked)")){
					if($(this).attr('unvalue')){ 
						dataget+="&sgid"+(i>0?i:"")+"="+$(element).attr('unvalue');
					}
				} else {
					dataget+="&sgid"+(i>0?i:"")+"="+$(element).val();
				}
			} else {
				dataget+="&sgid"+(i>0?i:"")+"="+$(element).val();
			}
			if($(element).attr("xenx-grid-search-cond")){
				dataget+="&sgcond"+(i>0?i:"")+"="+$(element).attr("xenx-grid-search-cond");
			}
			if($(element).attr("xenx-grid-search-function")){
				dataget+="&sgfunction"+(i>0?i:"")+"="+$(element).attr("xenx-grid-search-function");
			}
			i++;
        });
		i=0;
		$("#"+id+" .headHeadFix thead *[xenx-grid-campo]").each(function(indexv, elementv) {
			i++;
			dataget+="&rfield"+i+"="+$(elementv).attr("xenx-grid-campo");
			if($(elementv).attr("xenx-grid-subdata")){
				dataget+="&rsubfield"+i+"="+$(elementv).attr("xenx-grid-subdata");
			}
			for(var x=0;x<=3;x++){
				if($(elementv).attr("xenx-grid-subcampo"+(x>0?x:''))){
					dataget+="&rsubcampo"+(x>0?x:'')+"field"+i+"="+$(elementv).attr("xenx-grid-subcampo"+(x>0?x:''));
				}
				if($(elementv).attr("xenx-grid-subid"+(x>0?x:''))){
					dataget+="&rsubid"+(x>0?x:'')+"field"+i+"="+$(elementv).attr("xenx-grid-subid"+(x>0?x:''));
				}
			}
			if($(elementv).attr("xenx-function")){
				dataget+="&rfunction"+i+"="+$(elementv).attr("xenx-function");
			}
			if($(elementv).attr("xenx-function-vars")){
				dataget+="&rfunctionvars"+i+"="+$(elementv).attr("xenx-function-vars");
			}
		});
		$.ajax({url:localStorage["xenx-erp-web-server"]+'include/gsdata.php?load=true&'+dataget,success:function(data){
			$("#"+id+" table tbody").html('');
			$("#"+id+" table tbody").append(data);
			gridFixedHeader('form');
			$(".ui-dialog-active .gridform:visible").each(function(index,element){
				var cant=0;
				var antW=$(element).children(".headHeadFix").children("table").attr('width');
				//$(element).children(".headHeadFix").children("table").attr('width','');
				$(element).children(".contentHeadFix").css('height',($(element).height()-40)+'px');
				$(element).children(".contentHeadFix").animate({scrollTop:20});
				$(element).children(".contentHeadFix").children("table").children("tbody").children("tr.tractive").children("td").each(function(indexm, elementm) {
						cant++;
					   $(element).children(".headHeadFix").children("table").children("thead").children("tr").children("th").each(function(indexs, elements) {
							if(indexm==indexs){
								$(elements).css('width',$(elementm).width()+'px');
							}
					   });
				});
			});
		}});
		$(form).unbind('mouseleave').live('mouseleave',function(){
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.tractive").addClass('atractive');
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.data").removeClass('tractive');
		}).unbind('mouseenter').live('mouseenter',function(){
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.tractive:first").addClass('atractive');
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.data").removeClass('tractive');
			
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.atractive:first").addClass('tractive');
			$(this).children(".contentHeadFix").children("table").children("tbody").children("tr.data").removeClass('atractive');

			$(this).children(".contentHeadFix").scrollTop((($(".tractive:visible").height()*(($("#"+$(this).attr('id')+" .contentHeadFix tbody tr.data").length)+1))-($("#"+$(this).attr('id')).height()/2))+($(".tractive:visible").height()));
			if($("#"+$(this).attr('id')).children(".contentHeadFix").scrollTop()<=0){
				$("#"+$(this).attr('id')).children(".contentHeadFix").scrollTop($(".tractive:visible").height());
			}
		});
    });
}
function htmlEncode(s){
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  delete el;
  return s;
}
function resizeForm(ev,ui){
	$(this).find(".FLGrid-active").each(function(i,e) {
		resizeFLGrids(e);
	});
}
///FLGrid
function loadFLGrids(){
	$(".ui-dialog-active .FLGrid:not(.FLGrid-active)").each(function(i,e) {
        resizeFLGrids(e);
		$(e).find(".FLGrid-body").scroll(function(){
			$(this).parent().find(".FLGrid-head").scrollLeft($(this).scrollLeft());
		});
		$(e).addClass("FLGrid-active");
    });
}
function resizeFLGrids(e){
	$(e).width($(".ui-dialog-active .ventana").width()-10);
	var uh=0;
	$(e).find("th").each(function(i2, e2) {
		uh+=parseInt($(e2).attr("width"));
	});
	$(e).find("table").attr("width",uh);
	uh=0;
	$(".ui-dialog-active .ventana").children(":not(.ui-modal, .kgrid):visible").each(function(i2, e2) {
		uh+=$(e2).height();
	});
	uh=$(".ui-dialog-active .ventana").height()-uh+$(e).find(".FLGrid-body").height();
	$(e).find(".FLGrid-body").height(uh).width($(e).width());
	$(e).find(".FLGrid-head").width($(e).width());	
}
function insertFLGrid(xdata){
	if(!$(".ui-dialog-active div.ui-modal").is(":visible")){
		if(xdata||$(".ui-dialog-active .FLGrid[xenx-flgrid-action-insert]:visible").length>0){
			var grid=$(".ui-dialog-active .FLGrid:visible");
			var data='<tr'+(!xdata?' class="tr-add"':' class="tr-def2"')+'>';
			var cont="";
			var opt="";
			grid.find("thead tr th").each(function(i,e) {
				opt="";
				var dat="";
				if(xdata){
					if(xdata[$(e).attr('xenx-flgrid-campo')]){
						dat=xdata[$(e).attr('xenx-flgrid-campo')];
					}
				}
				if($(e).attr("xenx-flgrid-autoincrement")=="true"){
					cont=dat;
					opt+=' xenx-flgrid-auto="true"';
				}else{
					cont='<input style="width:'+(Number($(e).width())-Number($(e).parent().parent().parent().attr("cellpadding"))*2)+'px;" '+
					(
						($(e).attr("xenx-flgrid-editable")=="true")&&(!
							($(e).is("[xenx-flgrid-primarykey]")||($(e).is("[xenx-flgrid-key]")&&(xdata)))
						)?
							'xenx-flgrid-input-editable="true"':
							''
					)+' '
					+(
						$(e).is("[xenx-flgrid-search]")?
							'xenx-flgrid-input-search="'+$(e).attr("xenx-flgrid-search")+'"':
							''
					)+(
						$(e).is("[xenx-flgrid-campo-alt]")?
							'xenx-alt="'+$(e).attr("xenx-flgrid-campo-alt")+'"':
							''
					)+' placeholder="'+($(e).is("[xenx-flgrid-search]")?"F8 buscar":"")+'" name="'+$(e).attr('xenx-flgrid-campo')+'" readonly="readonly" '+
					' value="'+dat+'"'+
					'>';
				}
				data+='<td width="'+$(e).width()+'"'+opt+'>'+cont+'</td>';
			});
			data+="</tr>";
			grid.find("tbody").append(data);
			refreshFLGrid();
			grid.find("tbody tr:last input[xenx-flgrid-input-editable]:first").focus();
		} else {
			mainMsj({txt:'<span style="color:red"><b>No puede insertar nuevos registros</b></span>',show:true,life:3000}); 
		}
	}
}
function refreshFLGrid(){
	var grid=$(".ui-dialog-active .FLGrid-active:visible");
	grid.find("tbody tr").each(function(i,e) {
		$(e).find("td[xenx-flgrid-auto=true]").text(i+1);
	});
	grid.find("thead tr th").each(function(i,e) {
		if($(e).attr('xenx-onchange')){
            grid.find("tbody tr").find("td:eq("+i+") input:not([onfocusout])").attr("onfocusout",$(e).attr('xenx-onchange')+"(this);");
			eval($(e).attr('xenx-onchange')+"();");
		}
		//este evento del input esta vinculado con la funcion InitUser
		if($(e).attr('xenx-onkeyenter')){
			grid.find("tbody tr").find("td:eq("+i+") input:not([xenx-onkeyenter])").attr('xenx-onkeyenter',$(e).attr('xenx-onkeyenter'));
		}
	});
}
function removeFLGrid(){
	var grid=$(".ui-dialog-active .FLGrid:visible");
	if(grid.find("tr.tr-add input:focus").length>0){
		var tr=grid.find("input:focus").parent('td').parent('tr');
		var i=grid.find("tbody tr").index(tr);
		tr.remove();
		if(grid.find("tbody tr:eq("+i+")").length>0){
			grid.find("tbody tr:eq("+i+") input:first").focus();
		} else {
			grid.find("tbody tr:last input:first").focus();
		}
	}
	if(grid.find("tr:not(.tr-add) input:focus").length>0){
		if(grid.attr('xenx-flgrid-action-delete')=='true'){
			var tr=grid.find("input:focus").parent('td').parent('tr');
			var i=grid.find("tbody tr").index(tr);
			tr.addClass('tr-del');
		} else {
			mainMsj({txt:'<span style="color:red"><b>No tiene permisos para eliminar este registro</b></span>',show:true,life:3000}); 
		}
	}
	refreshFLGrid();
}
function searchFLGrid(e){
	var ids=$("#"+$(e).attr('xenx-flgrid-input-search'));
	//var dataget="?search="+ids.attr('xenx-flgrid-search-query')+"&searchvalue="+encodeURIComponent($(e).val());
	if(!ltop){ var ltop=30; }
	var cols="";
	var dataget="sttdatato="+ids.attr("xenx-search-tooltip-data")+"&datatop="+ltop;
	
	ids.removeClass('grid').addClass('kgrid');
	ids.find("[xenx-search-campo]").each(function(ix,ex) {
		$(ex).attr("data-field",$(ex).attr("xenx-search-campo")).removeAttr("xenx-search-campo");
	});
	
	ids.find("[data-field]").each(function(ix,ex) {
		if(!$(ex).attr("width")){
			if((/Nombre/).test($(ex).text())){
				$(ex).attr("width",((/Nombre/).test($(ex).text())?300:80))
			}	
		}
	});
	
	ids.find("th[data-field]").each(function(index, element) {
		i=index+1;
		dataget+="&rfield"+i+"="+$(element).attr("data-field");
		if($(element).attr("xenx-search-subdata")){
			dataget+="&rsubfield"+i+"="+$(element).attr("xenx-search-subdata");
		}
		if($(element).attr("xenx-search-subcampo")){
			dataget+="&rsubcampofield"+i+"="+$(element).attr("xenx-search-subcampo");
		}
		if($(element).attr("xenx-search-subid")){
			dataget+="&rsubidfield"+i+"="+$(element).attr("xenx-search-subid");
		}
	});
	
	dataget+="&sttid="+$(e).val();
	
	$('*[xenx-flgrid-input-active]').removeAttr('xenx-flgrid-input-active');
	$(e).attr('xenx-flgrid-input-active','true');
	console.log(e);
	var i=0;
	while(ids.attr("xenx-search-tooltip-campo"+(i>0?i:""))){
		dataget+="&sttcampo"+(i>0?i:"")+"="+ids.attr("xenx-search-tooltip-campo"+(i>0?i:""));
		i++;
	}
	$.ajax({url:localStorage["xenx-erp-web-server"]+'include/ftdata.php?'+dataget,cache:false,success:function(data){
		if(data){
			var ids=$("#"+$(e).attr('xenx-flgrid-input-search'));
			console.log(ids);
			var k=loadKGrid(ids,data);
			if(k==1){
				lastFocus=$(":focus");
				selectFLGrid(ids.find("tbody").find("tr"));
			} else if(!k) {
				if(lastFocus){
					lastFocus.focus();
				}
				mainMsj({txt:'<span style="color:red"><b>No se encontró ningun resultado</b></span>',show:true,life:3000}); 
			}
		}
	}});
	
	//alert(dataget);
	/*
	$.ajax({url:localStorage["xenx-erp-web-server"]+'include/flgrid.php'+dataget,cache:false,success:function(data){
		var ids=$("#"+$(e).parents().eq(5).attr('xenx-flgrid-search'));
		var k=loadKGrid(ids,data);
		if(!k){
			$("input:focus").parent().prev().children().focus();
			mainMsj({txt:'<span style="color:red"><b>No se encontró ningun resultado</b></span>',show:true,life:3000}); 
		} else if(k==1) {
			lastFocus=$(":focus");
			selectFLGrid(ids.find("tbody").find("tr"));
		}
	}});
	*/
}
function selectFLGrid(ef){
	var parent=$(ef).parents().eq($(".ui-dialog-active .k-grid:visible").length>0?4:2);
	ef.find("td").each(function(it,et) {
		var ex=parent.find("thead tr th:eq("+it+")");
		if($(ex).attr("data-field")){
			lastFocus.parents().eq(1).find("input[name="+$(ex).attr("data-field")+"], input[xenx-alt="+$(ex).attr("data-field")+"]").val($(et).text());
		}
	});
	closePops();
	var mp=$(":focus").parents().eq(5);
	if(mp.find("thead tr th[xenx-flgrid-fas]").length>0){
		var ic=mp.find("thead tr th").index(mp.find("thead tr th[xenx-flgrid-fas]"));
		$(":focus").parents().eq(1).find("td:eq("+ic+") input").focus();
	}
}
////kgrid
function searchForm(){
	if($(".ui-dialog-active .ui-modal").is(":visible")){ return false; }
	$(".ui-dialog-active form[xenx-form-search]:visible").each(function(index, form) {
		var div=$(form).attr('xenx-form-search');
		var dataget='searchto='+$(form).attr("xenx-form-data");
		var i=0;
		lastFocus=$(":focus");
		$("#"+div+".grid").removeClass('grid').addClass('kgrid');
		$(".ui-dialog-active").find("#"+div+" [xenx-search-campo]").each(function(ix,ex) {
        	$(ex).attr("data-field",$(ex).attr("xenx-search-campo")).removeAttr("xenx-search-campo");
		});
		
		var ogrid = $("#"+div);
		dataget+="&xenxorderby="+(ogrid.attr("xenx-orderby")?ogrid.attr("xenx-orderby"):"");
		dataget+="&xenxorder="+(ogrid.attr("xenx-order")?ogrid.attr("xenx-order"):"");
		dataget+="&xenxwhere="+(ogrid.attr("xenx-where")?ogrid.attr("xenx-where"):"");
		
		$(".ui-dialog-active").find("#"+div+" [data-field]").each(function(ix,ex) {
        	if(!$(ex).attr("width")){
				if((/Nombre/).test($(ex).text())){
					$(ex).attr("width",((/Nombre/).test($(ex).text())?300:80))
				}	
			}
		});
		
		$(($(".ui-dialog-active #original_data_"+div).length>0?(".ui-dialog-active #original_data_"+div):(".ui-dialog-active #"+div))+" *[data-field]").each(function(it, element) {
			var ind=it+1;
			dataget+="&rfield"+ind+"="+$(element).attr("data-field");
			if($(element).attr("xenx-search-subdata")){
				dataget+="&rsubfield"+ind+"="+$(element).attr("xenx-search-subdata");
			}
			if($(element).attr("xenx-search-subcampo")){
				dataget+="&rsubcampofield"+ind+"="+$(element).attr("xenx-search-subcampo");
			}
			if($(element).attr("xenx-search-subid")){
				dataget+="&rsubidfield"+ind+"="+$(element).attr("xenx-search-subid");
			}
		});
		if($(form).attr('xenx-form-data-id')!=""){
				datapost=$(form).attr('xenx-form-data-campo')+"="+$(form).attr('xenx-form-data-id')+"&uniquecodexenx=true";
		} else {
			var datapost=$(form).serialize();
			$(".ui-dialog-active *[xenx-not-search]:visible").each(function(index, element) {
				datapost+="&"+$(element).attr("name")+"=";
			});
			$(".ui-dialog-active *[xenx-search-unique]:visible").each(function(index, element) {
				datapost+="&unique_"+$(element).attr("name")+"=true";
			});
		}
		$.ajax({url:localStorage["xenx-erp-web-server"]+'include/fdata.php?'+dataget,data:datapost,type:'POST',cache:false,success:function(data){
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
		},error:function(e){ 
			mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 
		},statusCode:{ 404: function() { 
			mainMsj({txt:'<span style="color:red"><b>Existen problemas con la conexi&oacute;n.</b></span>',show:true,life:3000}); 			}
		}});
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
		closePops();	
		var an=vent.width()-(vent.width()*0.2);
		var al=vent.height()-(vent.height()*0.3);
		ids.width(an).height(al);
		var cols=[];
		ids.find("thead tr th").each(function(i,e) {
			cols.push({field:$(e).attr('data-field'),width:$(e).attr('width')?$(e).attr('width')+'px':'80px',title:$(e).text()});
		});
		ids.find("table").kendoGrid({groupable:(al>400?true:false),width:an,height:al-50,pageable:false,sortable:true,columns:cols,navigatable:true,toolbar:$(foot).html()});
		vent.find(".k-widget").css('height',al);
		$(".ui-dialog-active .ui-modal").css('z-index',101).css('display','block');
		ids.css('display','block').css('z-index',102).position({of:vent});
		lastFocus=$(":focus");
		ids.find(".k-grid").focus();
		return 2;
	}
}
/// ->
function format(val,type){
	switch(type){
		case "monto":
			return strToNumber(val);
		break;
		default:
			return val;
	}
}
function AddPuntos(nStr){
	//primero elimino los puntos si existen
	nStr=DelPuntos(nStr);
	//ahora si agrego los puntos
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? ',' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + '.' + '$2');
	}
	return x1 + x2;
}

function DelPuntos(nStr){
	var x = nStr.split('.');
	if(x.length>1){
		nStr=x[0];
		for(i=1;i<=x.length-1;i++){
			if(x[i].length>2){
				nStr+=String(x[i]);
			} else {
				nStr+="."+x[i];
			}
		}
	}
	//nStr.replace(',','.');
	return nStr;
}

function strToNumber(numero){
	if(numero){
		if(Number(numero)){
			numero=Number(numero).toFixed(2);	
		}
		return AddPuntos(numero);
	} else {
		return 0;
	}
}
function nextInputFocus(thisx){
	var currentBoxNumber=$(".ui-dialog-active input:visible:not([xenx-not-focus])").index($(":focus"));
	if($(".ui-dialog-active input:visible:not([xenx-not-focus])")[currentBoxNumber + 1] != null) {
		nextBox = $(".ui-dialog-active input:visible:not([xenx-not-focus])")[currentBoxNumber + 1];
	} else {
		nextBox = $(".ui-dialog-active input:visible:not([xenx-not-focus])")[0];
	}
	nextBox.focus();
	nextBox.select();
	if($(nextBox).attr("type")!="button"){
		event.preventDefault();
		return false;
	}
}
function printFrame(){ 
	if($("#data-print").attr('data-print')=="true"){
		$("#data-print")[0].contentWindow.print();
		$("#data-print").attr('data-print','false');
	}
}
function promptPwd(okf,txt){
		
		$(".promptPwd").remove();
	
		$(".ui-dialog-active .ui-modal").css('display','block');
		$(".ui-dialog-active .ui-modal").css('z-index','100');
		$(".ui-dialog-active").append('<div id="promptPwdResponse" align="center" class="promptPwd">'+(txt?'<div class="textcont-pwd">'+txt+'</div>':'')+'<b>Ingrese la clave del Aprobador:</b> <input type="password"> <button type="button" class="boton" onclick="'+okf+'($(this).prev().val()); promptPwdClose();">Aceptar</button> <button type="button" class="boton" onclick="promptPwdClose();">Cancelar</button></div>');
		
		$('#promptPwdResponse').css('top',(($(".ui-dialog-active").height()-$('#promptPwdResponse').height())/2)+'px');
		$('#promptPwdResponse').css('left',(((($(".ui-dialog-active").width()-$('#promptPwdResponse').width())/2))-10)+'px');
		
		$('#promptPwdResponse input').focus();
		
		$('#promptPwdResponse input').keypress(function(e) {
            if(e.keyCode==13){
				eval(okf+'(\''+$(this).val()+'\');');
				promptPwdClose();
			}
        });
}
function promptPwdClose(){
	$(".ui-dialog-active .ui-modal").css('display','none');
	$(".ui-dialog-active .ui-modal").css('z-index','1');
	$(".promptPwd").remove();
}
function gen_xls(){
	var mform = $(".ui-dialog-active form[xenx-form-type=report]");
	if(mform.length>0){
		//loadingForm(true);
		//isQuering=true;
		var sq = 'd='+mform.attr('xenx-form-name')+'&'+mform.serialize();
		$("#data-print")[0].src=localStorage["xenx-erp-web-server"]+'xls/rp.php?'+sq;
		$("#data-print").attr("data-print","true");
	}
}
function gen_doc(){
	var mform = $(".ui-dialog-active form[xenx-form-type=res]:visible");
	if(mform.length>0){
		loadingForm(true);
		isQuering=true;
		var sq = mform.serialize();
		$("#data-print")[0].src=localStorage["xenx-erp-web-server"]+'doc/res.php?'+sq;
		$("#data-print").attr("data-print","true");
	}
}
function gen_tdoc(){
	var mform = $(".ui-dialog-active form[xenx-form-type=res]:visible");
	var currentdate = new Date();
	if(mform.length>0){
		var sq = mform.serialize();	
		console.log(localStorage["xenx-erp-web-server"]+'png/res.php?'+sq+'&time='+currentdate.getTime());
		$.getJSON(localStorage["xenx-erp-web-server"]+'png/res.php?'+sq+'&time='+currentdate.getTime(),null,function(json){
			if(json['count']>0){
				dataPrintThermal=json['data'];
				if(json['count']>0){
					printTTget(0);
					for(var i=1;i<json['count'];i++){
						setTimeout('printTTget('+i+');',(i*3000));
					}
				}
			}
			mainMsj({txt:'<span style="color:green"><b>Datos enviados a la impresora.</b></span>',show:true,life:3000,id:777});
		});
	}
}
function gen_pdf(){
	var mform = $(".ui-dialog-active form[xenx-form-type=report]");
	if(mform.length>0){
		loadingForm(true);
		isQuering=true;
		var sq = 'd='+mform.attr('xenx-form-name')+'&'+mform.serialize();
		//alert(sq);
		$("#data-print")[0].src=localStorage["xenx-erp-web-server"]+'pdf/rp.php?'+sq;
		$("#data-print").attr("data-print","true");
	}
}
function loadingForm(isOpen){
	var d = $(".ui-dialog-active");
	if(isOpen){
		d.find('.ui-modal').css('display','block').css('z-index','100');
		if(d.find('.ui-modal-loading').length==0){
			d.find('.ui-modal').after('<div class="ui-modal-loading" align="center"><img src="img/loading.gif"><br>Cargando...</div>');
		}
		d.find('.ui-modal-loading').css('top',((d.find('.ventana').height()/2)-40)+'px');
		d.find('.ui-modal-loading').css('left',((d.find('.ventana').width()/2)-40)+'px');
	} else {
		$('.ui-modal').css('display','none');
		$('.ui-modal-loading').css('display','none');
	}
}
function printTTget(i){
	$.ajax({url:'http://'+user['IP_POSTERMINAL']+':8778/xenx=printthermalimage&l1='+escape(user['IMPRESORA_POSTERMINAL'])+'&l2='+dataPrintThermal[i]+'[XENXEND]',timeout:30000});
}
function updateDatabase(){
	$.ajax({url:localStorage["xenx-erp-web-server"]+'sql/updatesql.php',cache:false,success:function(data){
		mainMsj({txt:'<span style="color:green"><b>'+data+'</b></span>',show:true,life:3000}); 
	}});
}