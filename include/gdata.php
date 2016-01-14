<?php
	//SUB FORM GUARDADO CARGA Y EDICION
	require("../config/main.php");
	if($load){
		$con="";
		$cols="";
		$i=1;
		while(isset($_GET["rfield".$i])){
			if($_GET["rsubfield".$i]){
				if(!strstr($_GET["rfield".$i],$cols)){
					$cols.=($cols?",":"")."(select ".$_GET["rfield".$i]." from tb".$_GET["rsubfield".$i]." where tb".$_GET["rsubfield".$i].".".$_GET["rsubcampofield".$i]."=tb".$sttdatato.".".$_GET["rsubidfield".$i].") as ".$_GET["rfield".$i];
				}
			} else {
				$result = $mysqli->query("SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='tb".$sttdatato."'");
				while($row=$result->fetch_array(MYSQLI_ASSOC)){
					if($row[0]==$_GET["rfield".$i]){
						if(!strstr($_GET["rfield".$i],$cols)){
							if($sttdatato=='expedientes5'&&$_GET["rfield".$i]=='TODAY'){
								$cols.=($cols?",":"")."convert(nvarchar,".$_GET["rfield".$i].",100)";
							}elseif($row[1]=="smalldatetime"){
								$cols.=($cols?",":"")."convert(nvarchar,".$_GET["rfield".$i].",103)";
							} else {
								$cols.=($cols?",":"").$_GET["rfield".$i];
							}
						}
					}
				}	
			}
			$i++;
		}
		$i=0;
		$we="";
		$ix="";
		while(isset($_GET["sttcampo".$ix])){
			$we.=($we?" and ":"").$_GET["sttcampo".$ix]." like '".$_GET["sttid".$ix]."'";
			$i++;
			$ix=$i==0?"":$i;
		}
		
		$i=0;
		
		
		$msql="select ".$cols." from tb".$sttdatato.($we?(" where ".$we):'');
		
		//putxt($msql);	

		if($result = $mysqli->query("$msql where ".stripslashes($equery))){
			$msql.=" where ".stripslashes($equery);
		} 
		
		$msql.=($xordeby?(' order by '.$xordeby):'');
		

		$sql=$mysqli->query("$msql where ".stripslashes($equery));
		
		//putxt("$msql where ".stripslashes($equery));
		/*
		while($row=mssql_fetch_array($sql,MSSQL_ASSOC)){
			$aclass="";
			switch($sttdatato){
				case "expedientes2":
					/*if(mssql_result(mssql_query("select count(*) from tbexpedientes2 where anulado_exp=1 and codigo_exp=".$row["CODIGO_EXP"]),0,0)>0){
						$aclass=" trannulled not";
					}*//*
				break;
			}
			?><tr class="data<?=$i==0?" atractive":""?><?=$aclass?>" bgcolor="#<?=$i++%2==0?"efefff":"eec"?>"><?
			foreach($row as $key=>$val){
				//$sqlx=mssql_query("SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME like 'tb".$sttdatato."' and COLUMN_NAME like '".$key."'");
				//$type=mssql_result($sqlx,0,0);
				?><td xenx-key="<?=$key?>"><?					
					echo getOutput($val,$type);
				?></td><?php
			}
			?></tr><?php
		}*/
		//$sub=mssql_num_rows($sql);
		?><tr class="trfooter"><td><?=$sub?> registros encontrados<td></span><?php
	}
	if($save){
		
		$akeys="";
		$akeyscol="";
		
		$campos="";
		$i=0;
		$we="";
		$ix="";
		while(isset($_GET["sttcampo".$ix])){
			$we.=($we?" and ":"").$_GET["sttcampo".$ix]."='".$sttid."'";
			$campos[strtoupper($_GET["sttcampo".$ix])]=$sttid;
			$i++;
			$ix=$i==0?"":$i;
		}
		//$sql=mssql_query("delete from tb".$sttdatato." where ".$we);
		///
		$con="";
		$datad="";
		$cols="";
		$acols=array();
		$sql=mssql_query("SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='tb".$sttdatato."'");
		while($row=mssql_fetch_array($sql)){
			if(isset($campos[strtoupper($row[0])])){
				$cols.=($cols?",":"").$row[0];
				$con.=($con?",":"")."'".$campos[strtoupper($row[0])]."'";
				$datad=($datad?" and ":"").$row[0]." like "."'".$campos[strtoupper($row[0])]."'"; // para eliminar
			}
			$i=1;
			while(isset($_GET["rfield".$i])){
				if(!stristr($cols,$row[0])){
					if(!stristr($row[0],$_GET["rfield".$i])){
						if(stristr($row[0],$_GET["rsubidfield".$i])){
							$cols.=($cols?",":"").$row[0];
							$acols[]=$_GET["rfield".$i];
							$j=1;
							while(isset($_GET["kfield".$j])){
								if($_GET["rfield".$i]==$_GET["kfield".$j]){
									$akeys[]=$_GET["kfield".$j];
									$akeyscols[$_GET["kfield".$j]]=$_GET["rsubidfield".$i];
								}
								$j++;
							}
							
						}
					} else {
						$cols.=($cols?",":"").$row[0];
						$acols[]=$_GET["rfield".$i];
						$j=1;
						while(isset($_GET["kfield".$j])){
							if($_GET["rfield".$i]==$_GET["kfield".$j]){
								$akeys[]=$_GET["kfield".$j];
								$akeyscols[$_GET["kfield".$j]]=$_GET["kfield".$j];
							}
							$j++;
						}
					}
				}
				$i++;
			}
		}
		$i=0;
		$ix="";
		while($_POST["field".$ix."_"]){
			$columnas=$cols;
			$datos=$con;
			$datakey=$datad;	
			$i2=0;
			$ix2="";
			while($_POST["field".$ix."_".$ix2]){
				foreach($acols as $val){
					if($val==$_POST["field".$ix."_".$ix2]){ // columna que coincida ingreso el valor
						if($sttdatato=="expedientes2"&&$val=="STATUS_EXP"){ //Instamedic
							$serialData[$val]="'0'";
							$datos.=($datos?",":"")."'0'";
						} elseif($sttdatato=="expedientes3"&&$val=="FECHA_EXP") {
							$serialData[$val]="GETDATE()";
							$datos.=($datos?",":"")."NULL";
						} elseif($sttdatato=="expedientes5"&&$val=="TODAY") {
							$serialData[$val]="GETDATE()";
							$datos.=($datos?",":"")."NULL";
						} elseif($sttdatato=="expedientes3"&&$val=="USUARIO_EXP") {
							$serialData[$val]="'".$_SESSION["xenx-lite-user"]["LOGIN"]."'";
							$datos.=($datos?",":"")."'".$_SESSION["xenx-lite-user"]["LOGIN"]."'";
						} elseif(($sttdatato=="clientes2"&&($val=="PRECIO_CLI"||$val=="COSTO_CLI"))||($sttdatato=="proveedores3"&&$val=="COSTO_PRV")){
							$serialData[$val]="'".(str_replace(",",".",$_POST["val".$ix."_".$ix2])*1)."'";
							$datos.=($datos?",":"")."'".(str_replace(",",".",$_POST["val".$ix."_".$ix2])*1)."'";
						} else {
							$dataT=colTable($val,$sttdatato);
							switch(trim($dataT['type'])){
								case "numeric":
									$serialData[$val]=(str_replace(",",".",$_POST["val".$ix."_".$ix2])*1);
									$datos.=($datos?",":"").(str_replace(",",".",$_POST["val".$ix."_".$ix2])*1);
								break;
								case "decimal":
									$serialData[$val]=(str_replace(",",".",$_POST["val".$ix."_".$ix2])*1);
									$datos.=($datos?",":"").(str_replace(",",".",$_POST["val".$ix."_".$ix2])*1);
								break;
								default:
									$serialData[$val]="'".$_POST["val".$ix."_".$ix2]."'";
									$datos.=($datos?",":"")."'".$_POST["val".$ix."_".$ix2]."'";
							}
							
						}
					}
				}
				$i2++;
				$ix2=$i2==0?"":$i2;
			}
			foreach($akeys as $val){
				$i2=0;
				$ix2="";
				while($_POST["field".$ix."_".$ix2]){
					if($val==$_POST["field".$ix."_".$ix2]){ //columna que coinida infreso el valor
						$datakey.=($datakey?" and ":"").$akeyscols[$val]." like '".$_POST["val".$ix."_".$ix2]."'";
					}
					$i2++;
					$ix2=$i2==0?"":$i2;
				}
			}
			
			$j=1;
			while(isset($_GET["autofield".$j])){
				$datakey.=($datakey?' and ':'')." len(".$_GET["autofield".$j].")=0";
				$j++;
			}
			
			//echo $datakey;
			$datos=$con;
			foreach($acols as $val){
				$datos.=($datos?",":"").$serialData[$val];
			}
			/*
			if($sttdatato=='expedientes2'){
				$prec=@mssql_result(mssql_query("select costo_pro from tbproductos where codigo_pro = ".$serialData["BAREMO_EXP"]),0,0);
				$precv=@mssql_result(mssql_query("SELECT COSTO_PRV FROM TBPROVEEDORES3 WHERE PRODUCTO_PRV=".$serialData["BAREMO_EXP"]." AND CODIGO_PRV = ".$serialData["PROVEEDOR_EXP"]),0,0);
				$columnas.=',COSTO_EXP';
				$datos.=",".($precv>0?$precv:($prec>0?$prec:0));
			}
			*/
			if($datakey!=""){
				
				if(mssql_result(mssql_query("select count(*) from tb".$sttdatato." where ".$datakey),0,0)==0){
					
					//putxt("insert into tb".$sttdatato." (".$columnas.") values (".$datos.")");
					
					$sql=mssql_query("insert into tb".$sttdatato." (".$columnas.") values (".$datos.")");
					
					if($sttdatato=="expedientes4"){
						$ausq=mssql_query("UPDATE ex set 
							ANTEFE_EXP=f1,
							ANTPNTO_EXP=f2, 
							ANTTRA_EXP=f3,
							ANTCHQ_EXP=f4,
							ANTICIPO_EXP=f5
							from TbExpedientes as ex left join 
							(select 
								EXPEDIENTE_ANT,
								'' as CODIGO_ANT,
								sum(ANTEFE_ANT) as f1, 
								sum(ANTPNTO_ANT) as f2, 
								sum(ANTTRA_ANT) as f3,
								sum(ANTCHQ_ANT) as f4, 
								sum(TOTAL_ANT) as f5 
								from tbexpedientes4
								group by EXPEDIENTE_ANT
							) as t on CODIGO_EXP=t.EXPEDIENTE_ANT
							where $datakey");
							
						$icount = mssql_result(mssql_query("select count(*)
							from tbanticipos where usuario_ant='".$_SESSION['xenx-lite-user']['LOGIN']."'
							and fecha_ant = convert(date,getdate())
							"),0,0);
						if($icount==0){
							mssql_query("insert into tbanticipos (fecha_ant, usuario_ant) values (convert(date,getdate()),'".$_SESSION['xenx-lite-user']['LOGIN']."') ");	
						}
						
						mssql_query("update tbanticipos set total_ant=(select sum(t.total_ant) from tbexpedientes4 as t where convert(date,t.today)=convert(date,fecha_ant)) where usuario_ant='".$_SESSION['xenx-lite-user']['LOGIN']."'
								and fecha_ant = convert(date,getdate())");
						
					}
					
					if($sttdatato=="expedientes2"){
						
						$ausqlll=@mssql_result(mssql_query("select @@IDENTITY"),0,0);
						
						audit($sttdatato,'I',$ausqlll);
						
						$ssqlll=mssql_query("update tbexpedientes2 set USUARIO='".$_SESSION["xenx-lite-user"]["LOGIN"]."' where codigo_exp=".$ausqlll);
					
					
						$ssq=mssql_query("update te set COSTO_EXP = 
						ISNULL(case when isnull(tpr.COSTO_PRV,0)>0 then
							tpr.COSTO_PRV
						else
							tp.costo_pro
						end,0)
						from tbexpedientes2 as te
						left join TbProductos as tp on
						te.BAREMO_EXP = tp.codigo_pro
						left outer join tbproveedores3 as tpr on
						tpr.PRODUCTO_PRV = te.BAREMO_EXP and tpr.CODIGO_PRV = PROVEEDOR_EXP
						where te.codigo_exp=$ausqlll");
						
						mssql_query("update tbexpedientes2 set total_exp=(CANTIDAD_EXP*precio_exp) where TOTAL_EXP is null");
						
						mssql_query("INSERT INTO [dbo].[TbExpedientes2]
								   ([EXPEDIENTE_EXP]
								   ,[BAREMO_EXP]
								   ,[PROVEEDOR_EXP]
								   ,[CLAVE_EXP]
								   ,[COSTO_EXP]
								   ,[PRECIO_EXP]
								   ,[STATUS_EXP]
								   ,[CANTIDAD_EXP]
								   ,[TODAY]
								   ,[USUARIO]
								   ,[TOTAL_EXP]
								   ,[ANULADO_EXP]
								   ,[ESPECIALIDAD_EXP]
								   ,[FACTURADO_EXP]
								   ,[ATENDIDOPOR_EXP]
								   ,[ATENDIDOFECHA_EXP]
								   ,[SERVCOMP_EXP]
								   ,[PORCSERVCOMP_EXP]
								   ,[ODSSERVCOMP_EXP])
							SELECT
								EXPEDIENTE_EXP,
								PRODUCTO_PRO AS BAREMO_EXP,
								PROVEEDOR_EXP,
								CLAVE_EXP,
								0 AS COSTO_EXP,
								CASE WHEN (SELECT SERVCOMP_CLI FROM TBCLIENTES2 WHERE PRODUCTO_CLI = BAREMO_EXP AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TBEXPEDIENTES WHERE TBEXPEDIENTES.CODIGO_EXP=EXPEDIENTE_EXP)) IS NOT NULL THEN
									((CONVERT(NUMERIC(8,2),
										(SELECT SERVCOMP_CLI FROM TBCLIENTES2 WHERE PRODUCTO_CLI = BAREMO_EXP AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TBEXPEDIENTES WHERE TBEXPEDIENTES.CODIGO_EXP=EXPEDIENTE_EXP))
									)/100)*PRECIO_EXP) 
								ELSE
									((CONVERT(NUMERIC(8,2),PORC_PRO)/100)*PRECIO_EXP) 
								END
								AS PRECIO_EXP,
								STATUS_EXP,
								CANTIDAD_EXP,
								TODAY,
								USUARIO,
								((CASE WHEN (SELECT SERVCOMP_CLI FROM TBCLIENTES2 WHERE PRODUCTO_CLI = PRODUCTO_PRO AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TBEXPEDIENTES WHERE TBEXPEDIENTES.CODIGO_EXP=EXPEDIENTE_EXP)) IS NOT NULL THEN
									((CONVERT(NUMERIC(8,2),
										(SELECT SERVCOMP_CLI FROM TBCLIENTES2 WHERE PRODUCTO_CLI = PRODUCTO_PRO AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TBEXPEDIENTES WHERE TBEXPEDIENTES.CODIGO_EXP=EXPEDIENTE_EXP))
									)/100)*PRECIO_EXP) 
								ELSE
									((CONVERT(NUMERIC(8,2),PORC_PRO)/100)*PRECIO_EXP) 
								END) * CANTIDAD_EXP),
								ANULADO_EXP,
								ESPECIALIDAD_EXP,
								FACTURADO_EXP,
								ATENDIDOPOR_EXP,
								ATENDIDOFECHA_EXP,
								1,
								PORC_PRO,
								CODIGO_EXP 
						from 
						tbexpedientes2
						inner join TbProductos2 on
						baremo_exp = codigo_pro
						WHERE
							(SELECT COUNT(*) FROM TBCLIENTES2 WHERE 
								PRODUCTO_CLI = BAREMO_EXP
								AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TBEXPEDIENTES WHERE TBEXPEDIENTES.CODIGO_EXP=EXPEDIENTE_EXP)
								AND ISNULL(SERVCOMP_CLI,0)=0
							) = 0
						AND codigo_exp=$ausqlll");
						
					}
					
					if($sttdatato=="presupuestos2"){
						
						$ausqlll=@mssql_result(mssql_query("select @@IDENTITY"),0,0);
						
						audit($sttdatato,'I',$ausqlll);
						
						$ssqlll=@mssql_query("update TbPresupuestos2 set USUARIO='".$_SESSION["xenx-lite-user"]["LOGIN"]."' where codigo_exp=".$ausqlll);
					
						$ssq=mssql_query("INSERT INTO [dbo].[TbPresupuestos2]
								([EXPEDIENTE_EXP]
								,[BAREMO_EXP]
								,[PROVEEDOR_EXP]
								,[CLAVE_EXP]
								,[COSTO_EXP]
								,[PRECIO_EXP]
								,[STATUS_EXP]
								,[CANTIDAD_EXP]
								,[TODAY]
								,[USUARIO]
								,[TOTAL_EXP]
								,[ANULADO_EXP]
								,[SERVCOMP_EXP]
								,[PORCSERVCOMP_EXP]
								,[ODSSERVCOMP_EXP])
					SELECT
							EXPEDIENTE_EXP,
							PRODUCTO_PRO AS BAREMO_EXP,
							PROVEEDOR_EXP,
							CLAVE_EXP,
							0 AS COSTO_EXP,
							CASE WHEN (SELECT SERVCOMP_CLI FROM TBCLIENTES2 WHERE PRODUCTO_CLI = PRODUCTO_PRO AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TBEXPEDIENTES WHERE TBEXPEDIENTES.CODIGO_EXP=EXPEDIENTE_EXP)) IS NOT NULL THEN
								((CONVERT(NUMERIC(8,2),
									(SELECT SERVCOMP_CLI FROM TBCLIENTES2 WHERE PRODUCTO_CLI = PRODUCTO_PRO AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TBEXPEDIENTES WHERE TBEXPEDIENTES.CODIGO_EXP=EXPEDIENTE_EXP))
								)/100)*PRECIO_EXP) 
							ELSE
								((CONVERT(NUMERIC(8,2),PORC_PRO)/100)*PRECIO_EXP) 
							END
							AS PRECIO_EXP,
							STATUS_EXP,
							CANTIDAD_EXP,
							TODAY,
							USUARIO,
							(CASE WHEN (SELECT SERVCOMP_CLI FROM TBCLIENTES2 WHERE PRODUCTO_CLI = PRODUCTO_PRO AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TBEXPEDIENTES WHERE TBEXPEDIENTES.CODIGO_EXP=EXPEDIENTE_EXP)) IS NOT NULL THEN
								((CONVERT(NUMERIC(8,2),
									(SELECT SERVCOMP_CLI FROM TBCLIENTES2 WHERE PRODUCTO_CLI = PRODUCTO_PRO AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TBEXPEDIENTES WHERE TBEXPEDIENTES.CODIGO_EXP=EXPEDIENTE_EXP))
								)/100)*PRECIO_EXP) 
							ELSE
								((CONVERT(NUMERIC(8,2),PORC_PRO)/100)*PRECIO_EXP) 
							END * CANTIDAD_EXP),
							ANULADO_EXP,
							1,
							PORC_PRO,
							CODIGO_EXP 
					from 
					tbpresupuestos2
					inner join TbProductos2 on
					baremo_exp = codigo_pro
					WHERE
						(SELECT COUNT(*) FROM TBCLIENTES2 WHERE 
							PRODUCTO_CLI = BAREMO_EXP
							AND CODIGO_CLI IN (SELECT CLIENTE_EXP FROM TbPresupuestos WHERE TbPresupuestos.CODIGO_EXP=EXPEDIENTE_EXP)
							AND ISNULL(SERVCOMP_CLI,0)=0
						) = 0
						AND codigo_exp=$ausqlll");
						
					}
					
				} else {
					$sql=false;	
					
				}
			} else {
				$sql=mssql_query("insert into tb".$sttdatato." (".$columnas.") values (".$datos.")");
				
			}
			if($sql){
				$idc++;
			}
			$i++;
			$ix=$i==0?"":$i;
		}
		$i=0;
		$ix="";
		while($_POST["dfield".$ix."_"]){
			$columnas=$cols;
			$datos=$datad;
			$datakey=$datad;
			$i2=0;
			$ix2="";
			while($_POST["dfield".$ix."_".$ix2]){
				foreach($acols as $val){
					if($val==$_POST["dfield".$ix."_".$ix2]){ // columna que coinida infreso el valor
						if($sttdatato=="expedientes2"&&($val=="CLAVE_EXP"||$val=="STATUS_EXP")){ //Instamedic
							//$datos.=($datos?" and ":"").$val." like '".$_POST["val".$ix."_".$ix2]."'";
						} else {
							$datos.=($datos?" and ":"").$val." like '".$_POST["dval".$ix."_".$ix2]."'";
							$auk.=($auk?"-":"").$_POST["dval".$ix."_".$ix2];
						}
						
					}
				}
				
				$i2++;
				$ix2=$i2==0?"":$i2;
			}
			
			foreach($akeys as $val){
				$i2=0;
				$ix2="";
				while($_POST["dfield".$ix."_".$ix2]){
					if($val==$_POST["dfield".$ix."_".$ix2]&&trim($_POST["dval".$ix."_".$ix2])!=""){ //columna que coinida infreso el valor
						$datakey.=(trim($datakey)!=""?" and ":"").$akeyscols[$val]." like '".$_POST["dval".$ix."_".$ix2]."'";
					}
					$i2++;
					$ix2=$i2==0?"":$i2;
					
				}
			}
			
			$j=1;
			if(isset($_GET["autofield".$j])){ $auk=''; $datakey=""; }
			while(isset($_GET["autofield".$j])){
				
				$i2=0;
				$ix2="";
				while($_POST["dfield".$ix."_".$ix2]){
					
					if($_GET["autofield".$j]==$_POST["dfield".$ix."_".$ix2]){ // columna que coinida infreso el valor
						$datakey.=($datakey?" and ":"").$_GET["autofield".$j]." like '".trim($_POST["dval".$ix."_".$ix2])."'";
						$auk.=($auk?"-":"").$_POST["dval".$ix."_".$ix2];
					}
					
					$i2++;
					$ix2=$i2==0?"":$i2;
					
				}
				
				$j++;
				
			}
			
			if($datakey!=""){
				if($sttdatato=="expedientes2"){
					
					$sql=mssql_query("update tb".$sttdatato." set anulado_exp=1 where ".$datakey);
					$sql=mssql_query("update tb".$sttdatato." set anulado_exp=1 where ODSSERVCOMP_EXP=".$auk);
					
					foreach($_GET as $k=>$v){
						putxt($k.":".$v);
					}
										
					audit($sttdatato,'A',$auk,$dsanul);
					//putxt($auk);
				} else {
					if($sttdatato=="expedientes4"||$sttdatato=="expedientes5"){
					
					} else {
						$sql=mssql_query("delete from tb".$sttdatato." where ".$datakey);
						//putxt("delete from tb".$sttdatato." where ".$datakey);
						audit($sttdatato,'E',$auk);
					}
				}
				//echo "delete from tb".$sttdatato." where ".$datakey;
			} else {
				$sql=mssql_query("delete from tb".$sttdatato." where ".$datos);
				audit($sttdatato,'E',$auk);
				//echo "delete from tb".$sttdatato." where ".$datos;
			}
			if($sql){
				//echo "delete from tb".$sttdatato." where ".$datos;
				$idc++;
			}
			$i++;
			$ix=$i==0?"":$i;
		}
		if($idc){
			echo($idc." subregistros guardados");	
		} else {
			
			echo("<span style='color:red'>No se guardaron subregistros</span>");
		}
	}
?>