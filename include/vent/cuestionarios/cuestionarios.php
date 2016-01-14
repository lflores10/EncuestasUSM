
<div class="titulo"><?=$id?></span></div>
<div id="tabs">
	<ul>
    	<li><a href="#principal_<?=$frm?>">Principal</a></li>
        <li><a href="#preguntas_<?=$frm?>">Preguntas</a></li>
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
                    </tr>
                </table>
            </form>
        </p>
    </div>

    <div id="preguntas_<?=$frm?>">
        <tr>
            <td align="right">Carrera:</td> 
            <td valign="top" width="200">
                <select sstyle="width:50%" name="Carrera" id="id_servicios_prv_<?=$frm?>">
                    <option value=""></option>
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
    </div>

    <div id="distribucion_<?=$frm?>">

    </div>
    
</div>