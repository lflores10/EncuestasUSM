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
<div class="titulo"></div>
<div id="tabs">
	<ul>
    	<li><a href="#principal_<?=$frm?>">Principal</a></li>
        <li><a href="#permisos_<?=$frm?>">Permisos y Aprobadores</a></li>        
    </ul>
    <div id="principal_<?=$frm?>">
    	<p>
        	
        </p>
    </div>
    <div id="permisos_<?=$frm?>">
    	<p>
        	<table width="100%" border="0" cellspacing="0" cellpadding="3">
               	<tr>
                	<td width="50%" valign="top"><strong>Menu del sistema: </strong><span id="usuarios_seccion_menu" style="color:#F00; font-weight:bold"/></span><br /><br />
                    
                    </td>
                   
                </tr>
            </table>
        </p>
    </div>
    