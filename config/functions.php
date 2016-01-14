<?php

/*
function toDate($date,$xformat='DD/MM/YYYY'){
	if(!$_SESSION["dateformat"]){
		session_register("dateformat");
		$df=str_replace('y','Y',mssql_result(mssql_query("select dateformat from sys.syslanguages s where s.name = @@language"),0,0));	
		$_SESSION["dateformat"]=$df[0].'-'.$df[1].'-'.$df[2];
	}
	if(ereg("([0-9]{1,2})/([0-9]{1,2})/([0-9]{4})",$date)){
		return date($_SESSION["dateformat"]." h:i:s",($date?datetotime($date,$xformat):time()));
	} elseif(ereg("([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})",$date)){
		return date($_SESSION["dateformat"]." h:i:s",($date?datetotime($date):time()));
	} {
		return date($_SESSION["dateformat"]." h:i:s");
	}
}
function toDate2($date){
	if(ereg("([0-9]{1,2})/([0-9]{1,2})/([0-9]{4})",$date)){
		return date("Y-d-m",($date?datetotime($date,'DD/MM/YYYY'):time()));
	} else {
		return date("Y-d-m");
	}
}
function dateDiff($d1,$d2){
	$diff= abs($d2-$d1);
	$d['y'] = floor($diff / (365*60*60*24));
	$d['m'] = floor(($diff - $d['m'] * 365*60*60*24) / (30*60*60*24));
	$d['d'] = floor(($diff - $d['y'] * 365*60*60*24 - $d['m']*30*60*60*24)/ (60*60*24));
	return $d;		
}
function datetotime ($date, $format = 'YYYY-MM-DD') {
	if ($format == 'YYYY-MM-DD') list($year, $month, $day) = explode('-', $date);
	if ($format == 'YYYY/MM/DD') list($year, $month, $day) = explode('/', $date);
	if ($format == 'YYYY.MM.DD') list($year, $month, $day) = explode('.', $date);
	if ($format == 'DD-MM-YYYY') list($day, $month, $year) = explode('-', $date);
	if ($format == 'DD/MM/YYYY') list($day, $month, $year) = explode('/', $date);
	if ($format == 'DD.MM.YYYY') list($day, $month, $year) = explode('.', $date);
	if ($format == 'MM-DD-YYYY') list($month, $day, $year) = explode('-', $date);
	if ($format == 'MM/DD/YYYY') list($month, $day, $year) = explode('/', $date);
	if ($format == 'MM.DD.YYYY') list($month, $day, $year) = explode('.', $date);
	return mktime(0, 0, 0, $month, $day, $year);
}*/
function putxt($txt){
	$f = fopen("console.txt","a");
	fwrite($f,date("d/m/Y H:i:s a: ")."\t".$txt.PHP_EOL);
	fclose($f);	
}
function getUser(){
	return json_encode($_SESSION["server-lite-user"]);
}
function begin(){
	global $isBegin;
	if($isBegin!="none"){
		$isBegin="true";
		mysql_query("START TRANSACTION");
	}
}
function commit(){
	global $isBegin;
	if($isBegin=="true"){
		$isBegin="false";
		mysql_query("COMMIT");
	}
}
function rollback(){
	global $isBegin;
	if($isBegin=="true"){
		$isBegin="false";
		mysql_query("ROLLBACK");
	}
}

function mysqli_result($res, $row, $field=0) { 
     $res->data_seek($row); 
     $datarow = $res->fetch_array(); 
     return $datarow[$field]; 
 } 

function colTable($col,$table){

	$link = mysqli_connect("localhost", "wordpress", "77693286", "encuesta");
	$result = mysqli_query($link, "SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME like 'tb".$table."' and COLUMN_NAME like '".$col."'");

	//$result = $mysqli->query("SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME like 'tb".$table."' and COLUMN_NAME like '".$col."'");
	//$sql=mssql_query();
	if(mysqli_num_rows($result)>0){
		$resultados['type']=mysqli_result($result,0,0);
		switch($resultados['type']){
			case "ntext":
				$resultados['query']="CAST(tb".$table.".".$col." as TEXT) as ".$col;
			break;
			case "smalldatetime":
				$resultados['query']="CONVERT(varchar, tb".$table.".".$col.", 103) as ".$col;
			break;
			case "date":
				$resultados['query']="CONVERT(varchar, tb".$table.".".$col.", 103) as ".$col;
			break;
			default;
				//$resultados['query']="tb".$table.".".$col." as ".$col;
				$resultados['query']=$col." as ".$col;
		}
		return $resultados;
	} else {
		return false;	
	}
}
function getOutput($val,$type){
	if($type=="smalldatetime"||$type=="date"){
		return date("d/m/Y",strtotime($val));	
	}
	if($type=="float"||$type=="real"){
		return number_format($val,2,",","");	
	}
	if($type=="time"){
		return substr($val,0,5);
	}
	return utf8_encode($val);
	//return $val;
}/*
function exception_error_handler($errno, $errstr, $errfile, $errline ){
    rollback();
}

function stripAccents($cadena){
    $originales = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ
ßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿRr';
    $modificadas = 'aaaaaaaceeeeiiiidnoooooouuuuy
bsaaaaaaaceeeeiiiidnoooooouuuyybyRr';
    $cadena = utf8_decode($cadena);
    $cadena = strtr($cadena, utf8_decode($originales), $modificadas);
    $cadena = strtolower($cadena);
    return strtoupper(utf8_encode($cadena));
}

function toStr($t){
	return 	utf8_encode($t);
} 

function clearStr($string){
    $string = trim($string);
    $string = str_replace(
        array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'),
        array('a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A'),
        $string
    );
    $string = str_replace(
        array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'),
        array('e', 'e', 'e', 'e', 'E', 'E', 'E', 'E'),
        $string
    );
    $string = str_replace(
        array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'),
        array('i', 'i', 'i', 'i', 'I', 'I', 'I', 'I'),
        $string
    );
    $string = str_replace(
        array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'),
        array('o', 'o', 'o', 'o', 'O', 'O', 'O', 'O'),
        $string
    );
    $string = str_replace(
        array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'),
        array('u', 'u', 'u', 'u', 'U', 'U', 'U', 'U'),
        $string
    );
    $string = str_replace(
        array('ñ', 'Ñ', 'ç', 'Ç'),
        array('n', 'N', 'c', 'C',),
        $string
    );
    $string = str_replace(
        array("\\", "¨", "º", "-", "~",
             "#", "@", "|", "!", "\"",
             "·", "$", "%", "&", "/",
              "?", "'", "¡",
             "¿", "[", "^", "`", "]",
             "+", "}", "{", "¨", "´"),
        '',
        $string
    );
	return $string;
}
*/
function isAutoIncrement($tbl,$col){
	//$s=mssql_result(mssql_query("select columnproperty(object_id('tb$tbl'),'$col','IsIdentity')"),0,0);
	return $s==1;	
}
//set_error_handler("exception_error_handler");
?>