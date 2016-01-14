<?php
	//GARGA, EDICION Y GUARDADO DE LOS FORMULARIOS
	require("../config/main.php");
	begin();
	if($saveid){
		///actualizar
		$conw="";
		for($i=0;$i<=2;$i++){
			$ix=$i>0?$i:'';
			if($_GET["saveid".$ix]){
				$conw.=($conw?" and ":"").$_GET["saveidcampo".$ix]."='".$_GET["saveid".$ix]."'";
			}	
		}
		$result = $mysqli->query("select count(*) from tb".$datato." where ".$conw);	
		if(mysqli_result($result,0,0)==0){
			$saveid="";	
		}
	}
	if($saveid){		
		///actualizar
		$adds="";
		$conw="";
		for($i=0;$i<=2;$i++){
			$ix=$i>0?$i:'';
			if($_GET["saveid".$ix]){
				$conw.=($conw?" and ":"").$_GET["saveidcampo".$ix]."='".$_GET["saveid".$ix]."'";
				$auc=$_GET["saveid".$ix];
			}	
		}
		if($xenxauxiliar){
			/*if($xenxauxiliar=="usuarios"){
				if($_POST["CLAVE"]){
					$adds["CLAVE"]=$_POST["CLAVE"];
					unset($_POST["CLAVE"]);
				}
			}*/
		}
		//$_POST["USUARIO"]=$_SESSION['server-lite-user']['LOGIN'];
		$con="";
		$result = $mysqli->query("SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='tb".$datato."'");
		while($row = $result->fetch_array(MYSQLI_NUM)){
			if(isset($adds[$row[0]])){
				if($row[1]=="smalldatetime"||$row[1]=="datetime"||$row[1]=="date"){
					$con.=($con?",":"").$row[0]."='".toDate($adds[$row[0]])."'";
				}elseif($row[1]=="float"||$row[1]=="numeric") {
					$con.=($con?",":"").$row[0]."=cast('".str_replace(",",".",$adds[$row[0]])."' to float)";
				}else{
					
					$con.=($con?",":"").$row[0]."='".stripslashes(utf8_decode($adds[$row[0]]))."'";
				}
			}elseif(isset($_POST[$row[0]])){
				if($row[1]=="smalldatetime"||$row[1]=="datetime"){
					$con.=($con?",":"").$row[0]."='".toDate($_POST[$row[0]])."'";
				} elseif($row[1]=="date"){
					//putxt($_POST[$row[0]]);
					$con.=($con?",":"").$row[0]."=CONVERT(DATE,'".toDate($_POST[$row[0]])."')";
				}elseif($row[1]=="float"||$row[1]=="numeric"||$row[1]=="decimal"){
					$con.=($con?",":"").$row[0]."=cast('".str_replace(",",".",$_POST[$row[0]])."' as float)";
				}elseif($row[1]=="ntext"){
					if(strstr("FOTO",$row[0])){
						$con.=($con?",":"").$row[0]."='".urlencode($_POST[$row[0]])."'";
					} else {
						$con.=($con?",":"").$row[0]."='".stripslashes(utf8_decode($_POST[$row[0]]))."'";
					}
				}else{
					$con.=($con?",":"").$row[0]."='".stripslashes(utf8_decode($_POST[$row[0]]))."'";
				}
			}
		}
		
		//putxt("update tb$datato set $con where $conw");
		if(strlen(trim($con))>0){
			$result = $mysqli->query("update tb$datato set $con where $conw");		
		} else {
			$result===true;
		}
		$txt="actualizados";
		
	} elseif($loadid){
		//cargar
		$conw="";
		for($i=0;$i<=2;$i++){
			$ix=$i>0?$i:'';
			if($_GET["loadid".$ix]){
				$conw.=($conw?" and ":"")."t0.".$_GET["loadidcampo".$ix]."='".$_GET["loadid".$ix]."'";
			}	
		}
		$i=0;
		$ix="";
		$cols="";
		$tables="tb".$datato;
		$tables_join="";/*
		while(isset($_GET["sub".$ix])){
			if($_GET["sub".$ix]){
				if($datato=="expedientes2"&&$_GET["subcampo".$ix]=="CODIGO_PAC"){
					$cols.=($cols?",":"").'t'.$ix.'.PACIENTE_EXP AS CODIGO_PAC, NOMBRE_PAC';
					$tables.="tb".$_GET["subdata".$ix];
					$tables_join.=" left outer join tbexpedientes as t".$ix." on t".$ix.".CODIGO_EXP=t0.EXPEDIENTE_EXP";
					$tables_join.=" left outer join tbpacientes as tpac on tpac.CODIGO_PAC=PACIENTE_EXP";
				}elseif($datato=="presupuestos2"&&$_GET["subcampo".$ix]=="CODIGO_PAC"){
					$cols.=($cols?",":"").'t'.$ix.'.PACIENTE_EXP AS CODIGO_PAC, NOMBRE_PAC';
					$tables.="tb".$_GET["subdata".$ix];
					$tables_join.=" left outer join tbpresupuestos as t".$ix." on t".$ix.".CODIGO_EXP=t0.EXPEDIENTE_EXP";
					$tables_join.=" left outer join tbpacientes as tpac on tpac.CODIGO_PAC=PACIENTE_EXP";
				} else {
					$cols.=($cols?",":"").'t'.$ix.'.'.($_GET["subalt".$ix]?$_GET["subalt".$ix]:$_GET["sub".$ix])." as ".$_GET["sub".$ix];
					$tables.="tb".$_GET["subdata".$ix];
					$tables_join.=" left outer join tb".$_GET["subdata".$ix]." as t".$ix." on t".$ix.".".$_GET["subcampo".$ix]."=t0.".$_GET["subid".$ix];
				}
			}
			$i++;
			$ix=$i;
		}*/

		$result = $mysqli->query("SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='tb".$datato."'");
		//$sql=mssql_query("SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='tb".$datato."'");
		//while($row=mssql_fetch_array($sql)){  
		while($row = $result->fetch_array(MYSQLI_NUM)){
			
			switch($row[1]){
				case "ntext":
					$cols.=($cols?",":"")." CAST(t0.".$row[0]." as TEXT) as ".$row[0];
				break;
				case "smalldatetime":
					$cols.=($cols?",":"")." CONVERT(varchar, t0.".$row[0].", 103) as ".$row[0];
				break;
				default;
					$cols.=($cols?",":"")."t0.".$row[0];
			}
		}
		$query="select ".$cols." from tb".$datato." as t0 ".$tables_join." where ".$conw." LIMIT 0, 1" ;
		//putxt($query);/*
	  	//die("select top(1) ".$cols." from ".$tables." where ".$conw);
		$result = $mysqli->query($query);
		//$sql=mssql_query($query);
		$xarr=$result->fetch_array(MYSQLI_ASSOC);
		//$xarr=mssql_fetch_array($sql,MSSQL_ASSOC);
		$ix="";
		$i=0;
		while(isset($_GET["loadfunction".$ix])){
			eval('$xarr["'.$_GET["loadfunctioncampo".$ix].'"]='.$_GET["loadfunction".$ix].'($xarr["'.$_GET["loadfunctioncampo".$ix].'"]);');
			$ix=++$i;
		}
		if($result){
			$data=json_encode(array_map("utf8_encode",$xarr));	
		}
	}elseif(($datato)&&(!$saveid)) {
		////agregar
		//verifico si guarda a traves de su campo unico saveidcampo
		/*if($datato=="expedientes"||$datato=="presupuestos"){
			if(strlen($_POST["PACIENTE_EXP"])<4){
				rollback();
				echo "";
				die();	
			}
		}*/
		
		$result = $mysqli->query("select * from tb$datato where upper($saveidcampo)=upper('".$_POST[$saveidcampo]."')");
		$row_cnt = $result->num_rows;
		if($row_cnt == 0){
			$adds="";

			/*  es un Guardado de cosas Auxiliares..!! no me interesa en estos momentos
			if($xenxauxiliar){
				if($xenxauxiliar=="clientes"){
					$sql=mssql_query("select * from tbauxiliares where RIF_AUX like '".$_POST["rif_cli"]."'");
					if(mssql_num_rows($sql)>0){
						$row=mssql_fetch_array($sql);
						$adds["codigo_cli"]=$row["CODIGO_AUX"];
						$adds["AUXILIAR_CLI"]=$row["CODIGO_AUX"];	
					} else {
						if($sql=mssql_query("insert into tbauxiliares (NOMBRE_AUX,RIF_AUX) values ('".$_POST["nombre_cli"]."','".$_POST["rif_cli"]."')")){
							$sql=mssql_query("select * from tbauxiliares where RIF_AUX like '".$_POST["rif_cli"]."'");
							$row=mssql_fetch_array($sql);
							$adds["codigo_cli"]=$row["CODIGO_AUX"];
							$adds["AUXILIAR_CLI"]=$row["CODIGO_AUX"];	
						} else {
							rollback();
							die("<b><span style='color:red'>Debe indicar nombre y rif.</span></b>");	
						}
					}	
					
				}
				if($xenxauxiliar=="proveedores"){
					$sql=mssql_query("select * from tbauxiliares where RIF_AUX like '".$_POST["rif_prv"]."'");
					if(mssql_num_rows($sql)>0){
						$row=mssql_fetch_array($sql);
						$adds["codigo_prv"]=$row["CODIGO_AUX"];
						$adds["AUXILIAR_PRV"]=$row["CODIGO_AUX"];	
					} else {
						if($sql=mssql_query("insert into tbauxiliares (NOMBRE_AUX,RIF_AUX) values ('".$_POST["nombre_prv"]."','".$_POST["rif_prv"]."')")){
							$sql=mssql_query("select * from tbauxiliares where RIF_AUX like '".$_POST["rif_prv"]."'");
							$row=mssql_fetch_array($sql);
							$adds["codigo_prv"]=$row["CODIGO_AUX"];
							$adds["AUXILIAR_PRV"]=$row["CODIGO_AUX"];	
						} else {
							roolback();
							die("<b><span style='color:red'>Debe indicar nombre y rif.</span></b>");	
						}
					}
				}
			}*/
			
			
			// Guardado Principal
			
			$con="";
			$conc="";
			//$sql=mssql_query("SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='tb".$datato."'");
			$result = $mysqli->query("SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='tb".$datato."'");
			while($row = $result->fetch_array(MYSQLI_NUM)){
				putxt($_POST[$row[0]]);
				if(isset($adds[$row[0]])){ ///si existe en algun auxiliar

					$conc.=($conc?",":"").$row[0];
					if($row[1]=="smalldatetime"||$row[1]=="datetime"){
						$con.=($con?",":"")."'".toDate($adds[$row[0]])."'";
					}elseif($row[1]=="float"||$row[1]=="numeric") {
						$con.=($con?",":"")."cast('".str_replace(",",".",$adds[$row[0]])."' as float)";
					}else{
						$con.=($con?",":"")."'".stripslashes(utf8_decode($adds[$row[0]]))."'";
					}
				} elseif(isset($_POST[$row[0]])){
					$conc.=($conc?",":"").$row[0];
					if($row[1]=="smalldatetime"||$row[1]=="datetime"){
						if(trim($_POST[$row[0]])==""){
							$con.=($con?",":"")."NULL";
						} else {
							$con.=($con?",":"")."'".toDate($_POST[$row[0]])."'";
						}
					}elseif($row[1]=="datetime"){
						$con.=($con?",":"")."'".toDate($_POST[$row[0]])."'";
					}elseif($row[1]=="float"||$row[1]=="numeric") {
						$con.=($con?",":"")."cast('".str_replace(",",".",$_POST[$row[0]])."' as float)";
					}elseif($row[1]=="varchar"){
						$con.=($con?",":"")."'".$_POST[$row[0]]."'";
					}else{
						$con.=($con?",":"")."'".stripslashes(utf8_decode($_POST[$row[0]]))."'";
					}
				}
			}

			//putxt("insert into tb".$datato." (".$conc.") values (".$con.")");


			//if((trim($conc)!=""&&trim($conc)!="USUARIO")){
			if(trim($conc)!=""){

				$result = $mysqli->query("insert into tb".$datato." (".$conc.") values (".$con.")");
			
				//$sql=mssql_query("insert into tb".$datato." (".$conc.") values (".$con.")");
				for($i=0;$i<=2;$i++){
					$ix=$i>0?$i:'';
					if($_GET["saveidcampo".$ix]){
						if(isAutoIncrement($datato,$_GET["saveidcampo".$ix])){
							//$res=mssql_result(mssql_query("select @@IDENTITY"),0,0);
							if($res){
								$response.=$res."|||";
										if($datato=='citas'){
											$amot='Pac: '.$_POST["PACIENTE_CIT"].' - Esp: '.$_POST["BAREMO_CIT"].' - Med: '.$_POST["PROVEEDOR_CIT"];
										}								
								audit($datato,'I',$res,$amot);
							}
						}elseif(isset($_POST[$_GET["saveidcampo".$ix]])){
							$response.=$_POST[$_GET["saveidcampo".$ix]]."|||";
						}elseif(isset($adds[$_GET["saveidcampo".$ix]])){
							$response.=$adds[$_GET["saveidcampo".$ix]]."|||";
						}
					}
				}
			}
		} else {
			$data="<span style='color:green'><br>Ya existe este codigo<b/><br/>Ya sido cargado en el formulario</span>|||".$_POST[$saveidcampo];
			rollback();	
		}
		$txt="agregados";
	}
	if($data){
		echo $data;
	} else {
		if($result){
			echo "<b>Datos $txt con exito...</b>|||".$response;
		} else {
			
			//putxt(mssql_get_last_message());
			echo "<span style='color:#999'>No se completo la operaci&oacute;n...</span>|||".$response;
		}
	}
	commit();
?>