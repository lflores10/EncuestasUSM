<?php

	error_reporting(E_ALL);
    ini_set('display_errors', 'On');
	require("../config/main.php");
	//$sql="SELECT * FROM tbusuarios WHERE Codigo_Usuarios='' and Codigo_Status=1";		
	$sql="SELECT * FROM tbusuarios WHERE Codigo_Usuarios='".$_POST["login-user"]."' and Codigo_Status=1";
//	$sql="SELECT * FROM tbusuarios WHERE Codigo_Usuarios='".$_POST["login-user"]."' and Codigo_Pass='".$_POST["login-pass"]."' and Codigo_Status=1";	
	$result = $mysqli->query($sql);
	$row_cnt = $result->num_rows;
	if($row_cnt!=0){
		$_SESSION["server-lite-user"]=$result->fetch_array(MYSQLI_ASSOC);
		echo "logged";
		$result->free();
	}else{

		$sql1="SELECT * FROM tbalumnos WHERE Codigo_Alumnos=".$_POST["login-user"];	
		//$sql1="SELECT * FROM tbalumnos WHERE Codigo_Alumnos='16511975'";
		$result1 = $mysqli->query($sql1);
		$row_cnt = $result1->num_rows;
		if($row_cnt!=0){
			$_SESSION["server-lite-user"]=$result1->fetch_array(MYSQLI_ASSOC);
			echo "logged";
		}else{
			echo "no esta Registrado";
		}
	}
	$mysqli->close();
?>