<?php
//$_SESSION["server-lite-user"]["Codigo_Alumnos"];
//    print_r($SemActual);
//SELECT * FROM encuesta.tbalumasig where Codigo_Alumnos = "16511975" and Periodo_Alumno = "$SemActual";


?>
<table cellpadding="0" cellspacing="0" border="1" id="l_oerativo_citas" style="border:1px solid #eee;">
    <tr>
        <td></td>
        <td>Listado de Encuestas Disponibles </td>
    </tr>
    <tr>
        <td valign="top">
            <table id="listac_<?=$frm?>" width="100%" class="table" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th width="50" colspan="2"># Codigo</th>
                        <th width="255">Nombre</th>
                        <th width="20">Status</th>
                        <th width="130">Descripcion</th>
                    </tr>
                </thead>
                <tbody style="position:absolute; width:790px; overflow:scroll; overflow-x:hidden; height:360px;">
                </tbody>
            </table>
        </td>
    </tr>
</table>