<?php
	require("../config/main.php");
	$frmdir=str_replace("_","/",$frm);
	if(file_exists("vent/".$frmdir.".php")){ 
		//if(substr($permisos,0,1)==1){
			include("vent/".$frmdir.".php"); 
		//} else {
		//	//die(dechex(substr($permisos,0,6))."_".dechex(substr($permisos,6)));
		//	mssql_close();
		//	die("peticion_negada");
		//}
	}
	//<div class="ui-modal" xenx-form-info="<?=dechex(substr($permisos,0,6))dechex(substr($permisos,6))</div>
	?><div class="ui-modal" xenx-form-info="<?//=dechex(substr($permisos,0,6))?>_<?//=dechex(substr($permisos,6))?>"></div><?php
	$mysqli->close();
	//end;
?>