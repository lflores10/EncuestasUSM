<?php
	//error_reporting(E_ALL);
	require("../config/main.php");
	//ini_set('display_errors', 'On');
	$data="";
	function loadMenu($xmen,$issub=""){
		global $data;
		$data.='<ul '.(!$issub?'id="menu_principal"':'').'>';
		$dt=0;
		foreach($xmen as $key=>$val){
			$opt=$val->ventana?' server-frm="'.$val->ventana.'"':'';
			$opt.=$val->icono?' server-icon="'.$val->icono.'"':'';
			$opt.=$val->ventana_datos?' server-data="'.$val->ventana_datos.'"':'';
			$opt.=$val->ventana_titulo?' server-titulo="'.$val->ventana_titulo.'"':'';
			$opt.=$val->ventana_alto?' server-alto="'.$val->ventana_alto.'"':'';
			$opt.=$val->ventana_ancho?' server-ancho="'.$val->ventana_ancho.'"':'';

			/*
			if($val->server_modulo){
				$opt.=' server-modulo="'.$val->server_modulo.'"';	
				if($_SESSION['server-lite-user']['SUPERVISOR']!="1"){
					$sqlgru=mssql_query("SELECT GRUPO_UGR FROM TBUSUARIOSGRU WHERE USUARIO_UGR='".$_SESSION['server-lite-user']['Codigo_Usuarios']."'");
					if(mssql_num_rows($sqlgru)>0){
						$sqlp=mssql_query("select top(1) CHK1,CHK2,CHK3,CHK4,CHK5,CHK6,CHK7,CHK8,CHK9,CHK10,CHK11,CHK12,CHK13 from tbusuarios1 WHERE LOGIN IN (SELECT GRUPO_UGR FROM TBUSUARIOSGRU WHERE USUARIO_UGR='".$_SESSION['server-lite-user']['LOGIN']."') and modulo='".$val->server_modulo."'");
					} else {
						$sqlp=mssql_query("select top(1) CHK1,CHK2,CHK3,CHK4,CHK5,CHK6,CHK7,CHK8,CHK9,CHK10,CHK11,CHK12,CHK13 from tbusuarios1 WHERE LOGIN='".$_SESSION['server-lite-user']['Codigo_Usuarios']."' and modulo='".$val->server_modulo."'");
					}
					if(mssql_num_rows($sqlp)>0){
						$permiso=implode(mssql_fetch_array($sqlp,MSSQL_ASSOC));
						$opt.=' server-inmate="'.dechex(substr($permiso,0,6))."_".dechex(substr($permiso,6)).'"';
						if(substr($permiso,0,1)=="0"){ $opt.=' style="color:#999"'; }
					} else {
						$opt.=' server-inmate="0_0" style="color:#999"';	
					}
				} else {*/
					$permiso="1111111111111";
					$opt.=' server-inmate="'.dechex(substr($permiso,0,6))."_".dechex(substr($permiso,6)).'"';/*
				}
			}*/
			//aqui se establecen los permisos con la tabla tbusuarios2
			$data.='<li class="'.($issub?'sub':'top').(!$dt?'first':($dt==count($xmen)?'last':'item')).'">'.($val->icono?'<img src="../img/icon/16/'.$val->icono.'.png" class="ui-icon-menu">':'').'<a class="prewidget" href="'.($val->link?$val->link:'#').'" '.$opt.'>'.($val->submenu?'<span>':'').$val->nombre.($val->submenu?'</span>':'').'</a>';
			if($val->submenu){
				loadMenu($val->submenu,"true");	
			}
			$data.='</li>';
			$dt++;
		}
		$data.='</ul>';
	}

	switch ($tipomenu) {
		case 'admin':
			include("mp.php");
			break;
		case 'estudiante':
			include("mp_estudiante.php");
			break;
	}


	$menu=json_decode($mjson);
	loadMenu($menu);
	echo $data;
	//mssql_close();
	//end
 ?>