$(document).keydown(function(e){
	///evento sup
	if(e.which==46){
		$("div[xenx-frm].main_widget_hover").each(function(index, element) {
			$(this).remove();
			$.ajax({url:localStorage["xenx-erp-web-server"]+'include/widgets.php',data:'del='+$(this).text()+'&frm='+$(this).attr('xenx-frm')});
			return false;
		});
		$(".ui-dialog-active .gridform:visible tr.tractive:not(.not)").each(function(index, element) {
            delToGrid($(".ui-dialog-active .gridform:visible").attr('id'));
			return false;
        });
	}
	//evento barra espaciadora
	if(e.which==32){
		$(".ui-dialog-active .gridform:visible tr.tractive:not(.not)").each(function(index, element) {
            selToGrid($(".ui-dialog-active .gridform:visible").attr('id'));
			return false;
        });	
	}
	//evento esc
	if(e.which==27){
		closePops();
		return false;
	}
	//evento up
	if(e.which==38||e.which==33){
		if($(".ui-dialog-active .grid").is(":visible")){
			var index=$(".ui-dialog-active .grid:visible table tbody").find('.tractive').index();
			if(index>0){
				$(".ui-dialog-active .grid:visible tr.data.tractive").removeClass('tractive');
				$(".ui-dialog-active .grid:visible tr.data:eq("+(index-1)+")").addClass('tractive');
				$(".ui-dialog-active .grid:visible").children(".contentHeadFix").scrollTop((($(".tractive:visible").height()*(index+1))-($(".ui-dialog-active .grid:visible").height()/2))-($(".tractive:visible").height()*2));
				if($(".ui-dialog-active .grid:visible").children(".contentHeadFix").scrollTop()<=0){
					$(".ui-dialog-active .grid:visible").children(".contentHeadFix").scrollTop($(".tractive:visible").height());
				}
			}
			if($(".ui-dialog-active .grid:visible").hasClass('gridFormSearchForm')){
				selectGridFormSearchForm();	
			}
			return false;
		}
		if($(".ui-dialog-active .gridform").is(":visible")){
			$(".ui-dialog-active .grid:visible table tbody tr.atractive:first").addClass('tractive');
			$(".ui-dialog-active .grid:visible table tbody tr.data").removeClass('atractive');
			var index=$(".ui-dialog-active .gridform:visible table tbody").find('.tractive').index();
			if(index>0){
				$(".ui-dialog-active .gridform:visible tr.data.tractive").removeClass('tractive').removeClass('atractive');
				$(".ui-dialog-active .gridform:visible tr.data:eq("+(index-1)+")").addClass('tractive');
				$(".ui-dialog-active .gridform:visible").children(".contentHeadFix").scrollTop((($(".tractive:visible").height()*(index+1))-($(".ui-dialog-active .grid:visible").height()/2))-($(".tractive:visible").height()*2));
				/*if($(".ui-dialog-active .gridform:visible").children(".contentHeadFix").scrollTop()<=$(".tractive:visible").height()){
					$(".ui-dialog-active .gridform:visible").children(".contentHeadFix").scrollTop($(".tractive:visible").height());
				}*/
			}
			return false;
		}
	}
	//evento down
	if(e.which==40||e.which==34){
		if($(".ui-dialog-active .grid").is(":visible")){
			var index=$(".ui-dialog-active .grid:visible table tbody").find('.tractive').index();
			var cant=$(".ui-dialog-active .grid:visible tr.data").length;
			if((index+1)<cant){
				$(".ui-dialog-active .grid:visible tr.data.tractive").removeClass('tractive');
				$(".ui-dialog-active .grid:visible tr.data:eq("+(index+1)+")").addClass('tractive');
				$(".ui-dialog-active .grid:visible").children(".contentHeadFix").scrollTop((($(".tractive:visible").height()*(index+1))-($(".ui-dialog-active .grid:visible").height()/2))+($(".tractive:visible").height()));
				if($(".ui-dialog-active .grid:visible").children(".contentHeadFix").scrollTop()<=0){
					$(".ui-dialog-active .grid:visible").children(".contentHeadFix").scrollTop($(".tractive:visible").height());
				}
			}
			if($(".ui-dialog-active .grid:visible").hasClass('gridFormSearchForm')){
				selectGridFormSearchForm();	
			}
			return false;
		}
		if($(".ui-dialog-active .gridform").is(":visible")){
			$(".ui-dialog-active .grid:visible table tbody tr.atractive:first").addClass('tractive');
			$(".ui-dialog-active .grid:visible table tbody tr.data").removeClass('atractive');
			var index=$(".ui-dialog-active .gridform:visible table tbody").find('.tractive').index();
			var cant=$(".ui-dialog-active .gridform:visible tr.data").length;
			if((index+1)<cant){
				$(".ui-dialog-active .gridform:visible tr.data.tractive").removeClass('tractive').removeClass('atractive');
				$(".ui-dialog-active .gridform:visible tr.data:eq("+(index+1)+")").addClass('tractive');
				$(".ui-dialog-active .gridform:visible").children(".contentHeadFix").scrollTop((($(".tractive:visible").height()*(index+1))-($(".ui-dialog-active .gridform:visible").height()/2))+($(".tractive:visible").height()));
				if($(".ui-dialog-active .gridform:visible").children(".contentHeadFix").scrollTop()<=0){
					$(".ui-dialog-active .gridform:visible").children(".contentHeadFix").scrollTop($(".tractive:visible").height());
				}
			}
			return false;
		}
	}
	///eventos generales para los formuarios
	if($(".ui-dialog-active").children('.ui-dialog-content').attr('id')){
		var funct='boton_'+$(".ui-dialog-active").children('.ui-dialog-content').attr('id');
		if(eval("window."+funct+"?true:false")){ eval(funct+"("+e.which+",'"+$(".ui-dialog-active").children('.ui-dialog-content').attr('id')+"');"); }
	}
	if($("textarea:not([readonly]):focus").length>0){ 
		if(e.which==8&&$("textarea:not([readonly]):focus").val().length==0){ return false; }
	}
	return e.which>=111&&e.which<=123?false:true;
});
function checkForEnter(event) {
    if($(".ui-dialog-active .ui-modal").is(":not(:visible)")){
		if (event.keyCode == 13) {
			currentBoxNumber = textboxes.index(this);
			if (textboxes[currentBoxNumber + 1] != null) {
				nextBox = textboxes[currentBoxNumber + 1];
			} else {
				nextBox = textboxes[0];
			}
			nextBox.focus();
			nextBox.select();
			event.preventDefault();
			return false;
		}
	}
}
function document_ready(){
}
function farmMarshal(a,d){ 
var e=parseInt(String($((d?("#"+d):spn[0])).find(spn[1]).attr(spn[2]).split("_")[0],16))+String(parseInt($((d?("#"+d):spn[0])).find(spn[1]).attr(spn[2]).split("_")[1],16)); 
	return e[0]=="0"?false:(e.substr(mrshl.indexOf(a),1)==1?true:false);
}
function formMarshal(a,d){
	if($("a[xenx-frm="+(d?d:$(spn[0]+" "+spn[3]).attr("id"))+"]").attr("xenx-inmate")){
		var e=String(parseInt($("a[xenx-frm="+(d?d:$(spn[0]+" "+spn[3]).attr("id"))+"]").attr("xenx-inmate").split("_")[0],16))+String(parseInt($("a[xenx-frm="+(d?d:$(spn[0]+" "+spn[3]).attr("id"))+"]").attr("xenx-inmate").split("_")[1],16));
		//alert(e.substr(mrshl.indexOf(a),1));
		return e[0]=="0"?false:(e.substr(mrshl.indexOf(a),1)==1?true:false);
	} else {
		return true;	
	}
}