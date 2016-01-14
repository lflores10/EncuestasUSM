<?php
	//BUSQUEDA F8 DEL FORM
	require("../config/main.php");
	$con="";
	$cols="";
	$type="";

	foreach($_POST as $key=>$val){
		if($val){
			$xt=colTable($key,$searchto);
			if($xt){
				if($_POST['uniquecodexenx']){
					$con.=($con?" and ":" ").$key." like '".$val."'";
				} else {
					if($_POST['unique_'.$key]){
						$con.=($con?" and ":" ").$key." like '".$val."'";
					} else {
						$con.=($con?" and ":" ").$key." like '%".$val."%'";
					}
				}
			}
		}
	}
	$i=1;
	$tables_join="";
	$tables= "tb".$searchto.",";
	while(isset($_GET["rfield".$i])){
		if($_GET["rfield".$i]){
			if(!isset($_GET["rsubfield".$i])){
				$xt=colTable($_GET["rfield".$i],$searchto);
				if($xt){
					$type[$_GET["rfield".$i]]=$xt['type'];
					$cols.=($cols?",":"").$xt['query'];
				}
			} else {
				$xt2=colTable($_GET["rfield".$i],$_GET["rsubfield".$i]);
				if($xt2){
					if(!strstr($tables,"tb".$_GET["rsubfield".$i])){
						$tables.="tb".$_GET["rsubfield".$i].",";
						$cols.=($cols?",":"").$xt2['query'];
						$tables_join.=" left outer join tb".$_GET["rsubfield".$i]." on tb".$_GET["rsubfield".$i].".".$_GET["rsubcampofield".$i]."=tb".$searchto.".".$_GET["rsubidfield".$i];
						//$cols.=($cols?",":"")."(select top(1) ".$xt2['query']." from tb".$_GET["rsubfield".$i]." where tb".$_GET["rsubfield".$i].".".$_GET["rsubcampofield".$i]."=tb".$searchto.".".$_GET["rsubidfield".$i].") as ".$_GET["rfield".$i];
					} else {
						$cols.=($cols?",":"").$xt2['query'];
					}
				}
			}
		}
		$i++;
	}
	//die("select ".$cols." from tb".$searchto.$tables_join.($con?" where ".$con:"")." LIMIT 0, 200");
	$i=0;
	
	if($_GET["serverorderby"]){
		$xorder=$_GET["serverorderby"]?(" order by ".$_GET["serverorderby"]." ".($_GET["serverorder"]?$_GET["serverorder"]:"asc")):"";
	}
	if($_GET["serverwhere"]){
		if(base64_encode(base64_decode($_GET["serverwhere"], true)) === $_GET["serverwhere"]){
			$con.=($con?" AND ":" ")."(".base64_decode($_GET["serverwhere"]).")";
		} else {
			$con.=($con?" AND ":" ")."(".$_GET["serverwhere"].")";
		}
	}
	
	//$sql=mssql_query("select ".$cols." from tb".$searchto.$tables_join.($con?" where ".$con:"").$xorder." LIMIT 0, 200");
	$result = $mysqli->query("select ".$cols." from tb".$searchto.$tables_join.($con?" where ".$con:"").$xorder." LIMIT 0, 200");
	
	//$q="select count(*) from tb".$searchto.$tables_join.($con?" where ".$con:"");
	$result1 = $mysqli->query("select count(*) from tb".$searchto.$tables_join.($con?" where ".$con:""));	
	//$sqlq="select top(200) ".$cols." from tb".$searchto.$tables_join.($con?" where ".$con:"").$xorder;

	//die("select count(*) from tb".$searchto.$tables_join.($con?" where ".$con:""));
	//$sql2=mssql_query($q);


	//while(@$row=mssql_fetch_array($sql,MSSQL_ASSOC)){
	while(@$row = $result->fetch_array(MYSQLI_ASSOC)){
		?><tr><?php
		foreach($row as $key=>$val){
			?><td><?=getOutput($val,$type)?></td><?php
		}
		?></tr><?php
	}	
	//$sub=mssql_num_rows($sql);
	$sub=$result->num_rows;;
	//$row=mssql_fetch_array($sql2);
	$row=$result1->fetch_array(MYSQLI_ASSOC);
	?>
		<tr class="trfooter">
			<td>Se muestran <?=$sub?> de <?=number_format($row[0],0,'',".")?> registros encontrados</td>
	</tr><?php
?>