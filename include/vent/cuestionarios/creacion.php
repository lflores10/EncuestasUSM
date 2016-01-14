<div class="divdatatoolbar"><ul class="datatoolbar">
	<li class="topfirst">
    	<a href="#" onclick="clearForm();">
    		<div align="center"><img src="img/icon/32/nuevo.png" width="18" height="18"></div>
        	Nuevo F2
       	</a>
    </li>
	<li>
    	<a onclick="preSaveUSR('<?=$frm?>');">
    		<div align="center"><img src="img/icon/32/guardar.png" width="18" height="18"></div>
        	Guardar F4
       	</a>
    </li>
    <li>
    	<a onclick="delsaveForm();">
    		<div align="center"><img src="img/icon/32/eliminar.png" width="18" height="18"></div>
        	Eliminar F6
       	</a>
    </li>
    <li>
    	<a onclick="searchForm();">
    		<div align="center"><img src="img/icon/32/buscar.png" width="18" height="18"></div>
        	Buscar F8
       	</a>
    </li>
    <li class="topfirst">
    	<a onClick="$('#<?=$frm?>').dialog('close')">
    		<div align="center"><img src="img/icon/32/salir.png" width="18" height="18"></div>
        	Salir F12
       	</a>
    </li>
</ul></div>
<div class="titulo"></span></div>
<div id="tabs">
	<ul>
    	<li><a href="#principal_<?=$frm?>">Principal</a></li>
        <li><a href="#preguntas_<?=$frm?>" onclick="LoadFormCuestionario2(<?=$id?>);">Preguntas</a></li>
        <li><a href="#distribucion_<?=$frm?>">Distribucion</a></li>
    </ul>
    <div id="principal_<?=$frm?>">
    	<p>
        	<form server-form-data="cuestionario" server-form-data-id="<?=$id?>" server-form-data-campo="Codigo_Cuestionario" server-form-search="buscar_<?=$frm?>">
            	<table width="100%" border="0" cellspacing="0" cellpadding="4">
                  
                    <tr>
                        <td align="right" style="width: 150px;">Codigo:</td>
                        <td><input type="text" name="Codigo_Cuestionario" value="" size="18"  /></td>
                        <td align="right">Cuestionario Inactivo: </td>
                        <td><input name="Status_cuestionario" type="checkbox" value="1" unvalue="0"/></td>
                    </tr>
                    <tr>
                        <td align="right">Nombre Cuestionario:</td>
                        <td colspan="4"><input type="text" style="width:50%" name="Nombre_Cuestionario" value="" /></td>
                    </tr>
                    <tr>
                        <td align="right">Descripcion:</td>
                        <td colspan="4">
                        <textarea cols="47" rows="2" name="Comentarios_cuestionario"></textarea>

                        <!--<input type="text" style="width:50%" name="Comentarios_cuestionario" value="" />--></td>
                    </tr>
                </table>
            </form>
        </p>
    </div>

    <div id="preguntas_<?=$frm?>">
        <p><form server-form-data="cuestionario2" server-form-data-id="<?=$id?>" server-form-data-campo="Codigo_Cuestionario">
            <fieldset> <legend>Crear campo</legend>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td>
                        <input type="text" name="CAMPO_FOR" size="40" placeholder="Pregunta a crear" />Tipo  
                        <select name="TIPO_FOR">
                            <option value="1">Texto</option>
                            <option value="2">Seleccion Multiple</option>
                        </select>
                    </td>
                    <td  rowspan="2"><input type="button" class="boton" onclick="addlISTfORMAR();" name="agg" value="Agregar"></td>
                    
                </tr>
            </table>
            </fieldset>
            <br />
            <div class="gridform" server-grid-data="cuestionario2" server-grid-campo="Codigo_Cuestionario" server-grid-id="Codigo_Cuestionario" style="width:844px; height:150px;" id="grid_<?=$frm?>">
                <table border="0" cellspacing="0" cellpadding="3">
                  <thead>
                    <tr>
                        <th style="width: 30px; text-align: left;" >#</th>
                        <th style="width: 90px; text-align: left;" >Codigo</th>
                        <th style="width: 300px; text-align: left;">Nombre</th>
                        <th style="width: 135px; text-align: left;">Tipo</th>
                        <th >Orden</th>
                    </tr>
                  </thead>
                  <tbody>
                    <table border="0" cellspacing="0" cellpadding="3"></table>
                  </tbody>
                </table>
            </div>
        </form></p>
    </div>

    <div id="distribucion_<?=$frm?>">
    <p>
        <tr>
            <td align="right">Carrera:</td> 
            <td valign="top" width="200">
                <select style="width:30%" name="Carrera" id="id_carrera_<?=$frm?>" onchange="loadList_<?=$frm?>();">
                    <option value="" ></option>
                    <?php
                        if ($result = $mysqli->query("SELECT * FROM tbcarrera where Status_Carrera =1")) {
                            while ($row = $result->fetch_assoc()) {
                                ?><option value="<?=$row["Codigo_Carrera"]?>"><?=$row["Nombre_Carrera"]?></option><?php 
                            }
                            $result->free();
                        }
                    ?>
                </select>
            </td>
        </tr>  
        <tr>
            <td>
               <select style="width:30%" name="Carrera" id="id_asignatura_<?=$frm?>" >
               </select>
            </td>
          </tr>                    
    </div>
    
</div>
<div class="grid gridbuscar" id="buscar_<?=$frm?>">
    <table width="900" border="0" cellspacing="0" cellpadding="3">
      <thead>
          <tr>
            <th server-search-campo="Codigo_Cuestionario">Codigo</th>
            <th server-search-campo="Nombre_Cuestionario">Nombre</th>
            <th server-search-campo="Status_cuestionario">Inactivo</th>
          </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
</div>
<div class="grid searchtooltip" id="sttdepartamentos_<?=$frm?>" server-search-tooltip-data="departamentos" server-search-tooltip-campo="CODIGO_DEP" server-search-tooltip-campo1="NOMBRE_DEP" server-search-tooltip-id="DEPARTAMENTO">
    <table border="0" cellspacing="0" cellpadding="3">
      <thead>
          <tr>
            <th server-search-campo="CODIGO_DEP">Codigo</th>
            <th server-search-campo="NOMBRE_DEP">Nombre del departamento</th>
          </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
</div>
<div class="grid searchtooltip" id="sttproveedores_<?=$frm?>" server-search-tooltip-data="proveedores" server-search-tooltip-campo="codigo_prv" server-search-tooltip-campo1="nombre_prv" server-search-tooltip-id="PROVEEDOR_UPR">
    <table border="0" cellspacing="0" cellpadding="3">
      <thead>
          <tr>
            <th server-search-campo="codigo_prv">Codigo</th>
            <th server-search-campo="nombre_prv">Nombre del proveedor</th>
          </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
</div>
<div class="grid searchtooltip" id="sttgrupos_<?=$frm?>"
	 server-search-tooltip-data="usuarios" 
     server-search-tooltip-campo="LOGIN" 
     server-search-tooltip-campo1="NOMBRE" 
     server-search-tooltip-id="GRUPO_UGR"
     server-search-tooltip-where="GRUPO=1"
     >
    <table border="0" cellspacing="0" cellpadding="3">
      <thead>
          <tr>
            <th server-search-campo="login">Codigo</th>
            <th server-search-campo="nombre">Nombre del grupo</th>
          </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
</div>	