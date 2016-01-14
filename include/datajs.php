<?php
	require("../config/main.php");
	header("Content-type: text/javascript");
	$frmdir=str_replace("_","/",$frm);
	//if(file_exists("vent/".$frmdir.".php")){ 
	//	include("vent/".$frmdir.".php"); 
	//} else {
		if(file_exists("vent/".$frmdir.".js")){ 
			include("vent/".$frmdir.".js"); 
		}
	//}
	//mssql_close();
	end
?>