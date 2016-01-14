<?php
	session_start();
		
	//header("Access-Control-Allow-Origin: *");
	$ahora = gmdate("D, d M Y H:i:s")." GMT";
	header("Expires: $ahora");
	header("Last-Modified: $ahora");
	header("Pragma: no-cache");
	header("Cache-Control: no-cache, must-revalidate");
	extract($_GET);
	extract($_POST);
	$isBegin="none";
	
	
	if(file_exists("exists.php")){
		$path="";
		$path2="";
		$path3="../../main/";
	} else {
		if(file_exists("config/exists.php")){
			$path="config/";
			$path2="include/";
			$path3="../main/";
		} else {
			if(file_exists("../server/config/exists.php")){
				$path="../server/config/";
				$path2="../server/include/";
				$path3="../main/";
			} else {
				$path="../config/";
				$path2="../include/";
				$path3="../../main/";
			}
		}
	}
	
	$SemActual = "20161";

	//$mysqli = new mysqli("localhost", "root", "12345", "encuesta");
	$mysqli = new mysqli("localhost", "wordpress", "77693286", "encuesta");	

	/* verificar conexión */
	if ($mysqli->connect_errno) {
	    echo "Fallo al conectar a MySQL: " . $mysqli->connect_error;
	}


	///
	require_once($path."functions.php");
?>