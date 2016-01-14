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