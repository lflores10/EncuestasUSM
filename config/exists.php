<?php
session_start();
extract($_GET);

	switch($response){
		case "user_logged":
			//echo session_id()."<br>";
			//var_dump($_SESSION);			
			$data[tipo]=$_SESSION["server-lite-user"]["perfil_usuario"];
			$data[response]=is_array($_SESSION["server-lite-user"])?"true":"false";
			echo json_encode($data);
		break;
		case "sql_connect":
			$mserver=@sqlite_fetch_array(sqlite_query($dbmain,"SELECT * FROM tbconexion"), SQLITE_ASSOC);
			die((@mssql_connect($mserver[servidor],$mserver[login],$mserver[password]))?"true":"false");
		break;
		case "exists_databases":
			$rows2=@sqlite_fetch_array(sqlite_query($dbmain,"SELECT count(*) as count FROM tbempresas"), SQLITE_ASSOC);
			die(($rows2['count']>0)?"true":"false");
		break;
		default:
			die("exists");
	}
?>