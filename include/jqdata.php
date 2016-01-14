<?php
require("../config/main.php");

switch($mod){
	case "savecuestionario":
	 	$CountQuery=(count($_GET)-4)/4; 
		for($i = 1 ; $i <= $CountQuery; $i++){
			$sql="";
			if(empty($_GET['Codigo_Preguntas_'.$i.''])){
				$sql = "INSERT INTO tbcuestionario2( Codigo_cuestionario, pregunta_cuestionario2, tipo_cuestionario2, orden_cuestionario2) VALUES (".$id.",'".$_GET['pregunta_cuestionario2_'.$i.'']."',".$_GET['tipo_cuestionario2_'.$i.''].",".$_GET['orden_cuestionario2_'.$i.''].");";
					$result = $mysqli->query($sql);

			}else {
				$sql = "UPDATE tbcuestionario2 SET pregunta_cuestionario2 = '".$_GET['pregunta_cuestionario2_'.$i.'']."', tipo_cuestionario2 = ".$_GET['tipo_cuestionario2_'.$i.''].", orden_cuestionario2 = ".$_GET['orden_cuestionario2_'.$i.'']." WHERE Codigo_Preguntas = ".$_GET['Codigo_Preguntas_'.$i.'']." AND Codigo_cuestionario = ".$id.";";
					$result = $mysqli->query($sql);
			}
		}		
	break;
	case "loadcuestionario":
		$data[response]="OK";
		$sql="SELECT * FROM encuesta.tbcuestionario2 where Codigo_Cuestionario = $id";

		$result = $mysqli->query($sql);
		$data["count"]=$result->num_rows;
		while($row=$result->fetch_array(MYSQLI_ASSOC)){
			$data["data"][]=array_map("utf8_encode",$row);			
		}
	echo json_encode($data);
	break;
	case "deletecuestionario":
		$data[response]="OK";
		$sql="SELECT * FROM encuesta.tbcuestionario2 where Codigo_Cuestionario = $id";

		$result = $mysqli->query($sql);
		$data["count"]=$result->num_rows;
		while($row=$result->fetch_array(MYSQLI_ASSOC)){
			$data["data"][]=array_map("utf8_encode",$row);			
		}
	echo json_encode($data);
	break;
	case "get_asignatura":
		$data[response]="OK";
		$sql="SELECT * FROM tbasignaturas where Carrera_Asignatura = $asig order by Semestre_Asignatura";

		$result = $mysqli->query($sql);
		$data["count"]=$result->num_rows;
		while($row=$result->fetch_array(MYSQLI_ASSOC)){
			$data["data"][]=array_map("utf8_encode",$row);			
		}
	echo json_encode($data);
	break;_encode($data);
	break;
	case "get_cuestionarios_alumnos":
		$data[response]="OK";
		$sql="SELECT Codigo_Cuestionario,Codigo_Asignatura FROM encuesta.tbcuestionario3 where Codigo_Asignatura in (SELECT Codigo_Asignaturas FROM encuesta.tbalumasig where Codigo_Alumnos = ".$alumnos." and Periodo_Alumno = ".$periodo.")";

		$result = $mysqli->query($sql);
		$data["count"]=$result->num_rows;
		while($row=$result->fetch_array(MYSQLI_ASSOC)){
			$data["data"][]=array_map("utf8_encode",$row);			
		}
	echo json_encode($data);
	break;


}
?>
