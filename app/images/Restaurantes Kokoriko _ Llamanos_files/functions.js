
//Initialize shadowbox
Shadowbox.init({
	enableKeys: false
});

//when document is loaded
window.addEvent('domready', function() {
	//detect if there's a session in course
	//
	//"iniciar sesi—n", becomes "current login user"
	//"registrate aqu’", becomes "log out"
	//"olvide mi contrase–a" dissapear
	var json = new Request.JSON({
    	url: 'controllers/helperController.php', 
    	method:'post',
    	data: "submit&action=getCurrentSessionUser",
    	onComplete: function(obj){
    		//
    		if(obj.user == null){
    			//
    			$('lblLogin').innerHTML = "INICIAR SESI&Oacute;N";
    			$('lblLogin').href = "javascript:showModal('iniciosesion.html')";
    			//
    			$('lblNewRegister').innerHTML = "REG&Iacute;STRATE AQU&Iacute;";
    			$('lblNewRegister').href = "registro.php";
    			//
    			$('lblForgotPwd').innerHTML = "OLVIDE MI CONTRASE&Ntilde;A";
    			$('lblForgotPwd').href = "javascript:showModal('olvidoclave.html')";
    		}else{
    			//
    			$('lblLogin').innerHTML = obj.user;
    			$('lblLogin').href = "#";
    			//
    			$('lblNewRegister').innerHTML = "CERRAR SESI&Oacute;N";
    			$('lblNewRegister').href = "javascript:closeSession()";
    			//
    			$('lblForgotPwd').innerHTML = '';
    			$('lblForgotPwd').href = "#";	
    		}
    		//set search function
    		$('btnSearch').href = "javascript:searchInSite()";  
    	}
    });
    json.send();
}); 

//search in all site through google search
//implementing it in busqueda.php by get parameters
function searchInSite(){	
	window.location.href = "busqueda.php?words="+$('txtSearch').value;
}

//close current session
function closeSession(){
	var json = new Request.JSON({
    	url: 'controllers/helperController.php', 
    	method:'post',
    	data: "submit&action=closeCurrentSession",
    	onComplete: function(obj){
    		if(obj.didAction){
    			$('lblLogin').innerHTML = "INICIAR SESI&Oacute;N";
    			$('lblLogin').href = "javascript:showModal('iniciosesion.html')";
    			//
    			$('lblNewRegister').innerHTML = "REG&Iacute;STRATE AQU&Iacute;";
    			$('lblNewRegister').href = "registro.html";
    			//
    			$('lblForgotPwd').innerHTML = "OLVIDE MI CONTRASE&Ntilde;A";
    			$('lblForgotPwd').href = "javascript:showModal('olvidoclave.html')";
    			//
    			window.location.href = "index.html";
    		}
    	}
    });
    json.send();
}

//begin new session
function beginSession(){
	
	var json = new Request.JSON({
    	url: 'controllers/helperController.php', 
    	method:'post',
    	data: "submit&action=beginSession&loginUsername="+$('loginUsername').value+"&loginPassword="+$('loginPassword').value,
    	onComplete: function(obj){
    		//
    		if(obj.didAction){
    			//
    			window.location.href = 'pedidos1.php';
    			
    		}else{
    			$('lblLoginMsg').innerHTML = "* Usuario y contrase&ntilde;a no existen, intenta de nuevo";
    		}
    	}
    });
    json.send();
}

//show modal popup
function showModal(pageName){
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', pageName);
	httpRequest.send(null);
	httpRequest.onreadystatechange = function(){
		if(httpRequest.readyState==4){
			Shadowbox.open({
				content: httpRequest.responseText,
				player: 'html',
				height: 700,
				width: 500
			});
		}
	}
}


function showBannerHomeModal(pageName){
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', pageName);
	httpRequest.send(null);
	httpRequest.onreadystatechange = function(){
		if(httpRequest.readyState==4){
			Shadowbox.open({
				content: httpRequest.responseText,
				player: 'html',
				height: 600,
				width: 600
			});
		}
	}
}


function centraVentanaTerminos() {
    //Obtenemos ancho y alto del navegador, y alto y ancho de la popUp
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var popupHeight = $("#ventanaPopup2").height();
    var popupWidth = $("#ventanaPopup2").width();
    //centering
    $("#ventanaPopup2").css({
        "position": "absolute",
        
        "left": windowWidth/2-popupWidth/2
    });
 
    //Solo se necesita para IE6
    $("#ventanaPopup2Fondo").css({
        "height": windowHeight
    });
}

function muestraTerminos() {

	centraVentanaTerminos();
    $("#ventanaPopup2Fondo").css({
        "opacity": "0.7"
    });
    $("#ventanaPopup1Fondo").fadeIn("slow");
    $("#ventanaPopup2").fadeIn("slow");
    $("#ventanaPopup2Cerrar").click(function(){
    ocultaVentanaTerminos();
  	});

	//Agregamos el evento "click" del div: ventanaPopup1Fondo
	  $("#ventanaPopup1Fondo").click(function(){
	    ocultaVentanaTerminos();
	  });

}

function ocultaVentana() {
    $("#ventanaPopup1Fondo").fadeOut("slow");
    $("#ventanaPopup1").fadeOut("slow");
}

function ocultaVentanaTerminos() {
    $("#ventanaPopup1Fondo").fadeOut("slow");
    $("#ventanaPopup2").fadeOut("slow");
}






//send mail from contact form 
function sendContactForm(){
	console.log($('#contactName').val);
	if($('#contactName').val() != "" && $('#contactPhone').val() !="" && $('#contactEmail').val() !="" && $('#contactComments').val()!=""){	
	var sndData = "submit&action=sendContact";
	sndData += "&contactName="+$('#contactName').val();
	sndData +="&contactPhone="+$('#contactPhone').val(); 
	sndData +="&contactEmail="+$('#contactEmail').val(); 
	sndData +="&contactCity="+$('#contactCity').val();
	sndData +="&contactComments="+$('#contactComments').val();
	
	var json = new Request.JSON({
    	url: 'controllers/contactController.php', 
    	method:'post',
    	data: sndData,
    	onComplete: function(obj){
    		$('contactName').value = '';
    		$('contactPhone').value = '';
    		$('contactEmail').value = '';
    		$('contactCity').selectedIndex = 0;
    		$('contactComments').value = '';
    		//
			if(obj == null) showModal('alerta_generico_error.html');
			if(obj.didAction) showModal('alerta_generico_ok.html');
			else showModal('alerta_generico_error.html');    		
			//$('lblContactMsg').innerHTML = obj.didAction ? "Enviado" : "Intentar de nuevo";
    	}
    });
    json.send();
	}
}

//send mail forgot password form
function sendForgotPasswordForm(){
	var json = new Request.JSON({
    	url: 'controllers/helperController.php', 
    	method:'post',
    	data: "submit&action=sendForgotPasswordForm&email="+$('txtForgotPwdEmail').value,
    	onComplete: function(obj){
    		if(obj.didAction == 66)
			{
				$('txtForgotPwdMsg').innerHTML = "El correo que ingresaste no se encuentra registrado. Por favor registra tus datos.";
			}
			else
			{
				$('txtForgotPwdMsg').innerHTML = obj.didAction ? "* Tu mensaje fue enviado." : "* Tu mensaje no fue enviado, intenta de nuevo";
			}
    	}
    });
    json.send();
}

//send mail for children form
function sendChildrenForm(){
	
	var sndData = "submit&action=sendChildren";
	//sndData += "&childrenCity="+$('childrenCity').value;
	sndData += "&childrenCity=";
	sndData +="&childrenRestaurants="+$('childrenRestaurants').value; 
	sndData +="&childrenQuantity="+$('childrenQuantity').value; 
	sndData +="&childrenName="+$('childrenName').value;
	sndData +="&childrenPhone="+$('childrenPhone').value;
	sndData +="&childrenEmail="+$('childrenEmail').value;
	sndData +="&childrenDay="+$('childrenDay').value;
	sndData +="&childrenMonth="+$('childrenMonth').value;
	sndData +="&childrenYear="+$('childrenYear').value;
	
	var json = new Request.JSON({
    	url: 'controllers/contactController.php', 
    	method:'post',
    	data: sndData,
    	onComplete: function(obj){
    		
    		//$('childrenCity').selectedIndex = 0;
    		$('childrenRestaurants').selectedIndex = 0;
    		$('childrenQuantity').selectedIndex = 0;
    		//
    		$('childrenName').value = '';
    		$('childrenPhone').value = '';
    		$('childrenEmail').value = '';
    		//
    		$('childrenDay').selectedIndex = 0; 
    		$('childrenMonth').selectedIndex = 0; 
    		$('childrenYear').selectedIndex = 0; 
    		//	
    		//$('lblChildrenMsg').innerHTML = obj.didAction ? "Enviado" : "Intentar de nuevo";
			if(obj == null) showModal('alerta_generico_error.html');
			if(obj.didAction) showModal('alerta_generico_ok.html');
			else showModal('alerta_generico_error.html');
    	}
    });
    json.send();   
}

//set cities from db in contact form dropdown list
function setContactFormCities(){
	var json = new Request.JSON({
    	url: 'controllers/helperController.php', 
    	method:'post',
    	data: "submit&action=getCities",
    	onComplete: function(obj){
    		for(var index=0; index<obj.length; index++){
				
    			$('#contactCity').append("<option value='"+obj[index].ciudad+"'>"+obj[index].ciudad+"</option>"); 
    			
    		}
    	}
    });
    json.send();
}

//set cities from db in prelogin form dropdown list
function setPreloginFormCities(){
	var json = new Request.JSON({
    	url: 'controllers/helperController.php', 
    	method:'post',
    	data: "submit&action=getCities",
    	onComplete: function(obj){
    		for(var index=0; index<obj.length; index++){
    			$('txtLoginCity').options[index] = 
    			new Option(obj[index].ciudad, obj[index].ciudad);
    		}
    	}
    });
    json.send();
}

//set cities from db in children form dropdown list
function setChildrenFormCities(){
	var json = new Request.JSON({
    	url: 'controllers/helperController.php', 
    	method:'post',
    	data: "submit&action=getCities",
    	onComplete: function(obj){
    		for(var index=0; index<obj.length; index++){
    			$('childrenCity').options[$('childrenCity').options.length] = 
    				new Option(obj[index].ciudad, obj[index].ciudad);
    		}
    	}
    });
    json.send();
}

//set date format for db in children form dropdown list
function setChildrenFormDateFormat(){
	//set days
	for(var i=1; i<= 31; i++){
		$('childrenDay').options[$('childrenDay').options.length] = new Option(i, i);
	}
	//set months
	var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	for(var i=0; i< months.length; i++){
		$('childrenMonth').options[$('childrenMonth').options.length] = new Option(months[i], months[i]);
	}
	//set years
	var maxYear = 2020;
	for(var i=new Date().getFullYear(); i<= maxYear; i++){
		$('childrenYear').options[$('childrenYear').options.length] = new Option(i, i);
	}
}

//set date format for db in new form
function setNewDateFormat(){
	//set days
	for(var i=1; i<= 31; i++){
		$('newDay').options[$('newDay').options.length] = new Option(i, i);
	}
	//set months
	var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	for(var i=0; i< months.length; i++){
		$('newMonth').options[$('newMonth').options.length] = new Option(months[i], i+1);
	}
}


//register new user
function registerNewUser(){
	
	var sndData = "submit&action=newUser";
	sndData += "&txtNewID="+$('txtNewID').value;
	sndData +="&txtNewEmail="+$('txtNewEmail').value; 
	sndData +="&txtNewName="+$('txtNewName').value; 
	sndData +="&txtNewLastName="+$('txtNewLastName').value;
	sndData +="&txtNewBirthday=2000-"+ $('newMonth').value + "-"+ $('newDay').value;
	sndData +="&txtNewAddress="+$('txtNewAddress').value;
	sndData +="&txtNewCity="+$('txtLoginCity').value;
	sndData +="&txtNewBlock="+$('txtNewBlock').value;
	sndData +="&txtNewPhone="+$('txtNewPhone').value;
	sndData +="&txtNewPhoneExt="+$('txtNewPhoneExt').value;
	sndData +="&cboNewPayment="+$('cboNewPayment').value;
	sndData +="&txtNewComments="+$('txtNewComments').value;
	
	var json = new Request.JSON({
    	url: 'controllers/userController.php', 
    	method:'post',
    	data: sndData,
    	onComplete: function(obj){
    		
    		if(obj.newID != 0){
    			
				showModal('alerta_registro_ok.html');
				
				var json = new Request.JSON({
			    	url: 'controllers/helperController.php', 
			    	method:'post',
			    	data: "submit&action=beginSession&loginUsername="+$('txtNewEmail').value+"&loginPassword="+$('txtNewID').value,
			    	onComplete: function(objx){
			    		
			    		if(objx.didAction){
			    			window.location.href = "index.html";
			    		}
			    	}
			    });
			    json.send();
				
    		}else{
    			showModal('alerta_registro_error.html');
				//$('lblNewMsg').innerHTML = "* Verifica tus datos, si ya estas registrado, utilizado la funcion de 'Olvide mi Contrase–a'";
    		}
    	}
    });
    json.send();   
}

//**********************************************************************************************
// this function build a common comments array to render instead past textarea into 
// [pedidos1.php], [pedidos2.php] and [pedidos3.php] 
//**********************************************************************************************
function setCommonComments(){
	
	//collection of comments
	var commentsCollection = ["Mi gaseosa debe ser light",
	                          "Mas Aji"];
	
	//store collection of comments in a session variable
	//to maintain it through order process
	var quantity = commentsCollection.length; //quantity of comments
	var sndData = "submit&action=updateCurrentOrderComments&quantity="+quantity;
	
	//loop to insert into [sndData] stream of comments like parameteres
	for(var index=0; index<quantity; index++){
		sndData += "&comment"+index+"="+commentsCollection[index]; //set comment
	}
	
	//send json request with stream of parameters
	var json = new Request.JSON({
    	url: 'controllers/orderController.php', 
    	method:'post',
    	data: sndData,
    });
    json.send();
	
	//render checkboxes for first time,
    //these controls are created when session doesn't exist
    //for common comment.
    //when session has been registered, the controls render is done for 
    //php instead of javascript to keep the states update
    var commentsContainer = $('commentsContainer');
    var htmlRender = "<span id='lblcommentsquantity' style='display:none;'>"+quantity+"</span>";
    for(var index=0; index<quantity; index++){
    	
    	htmlRender+= "<input id='cmt"+index+"' name='cmt"+index+"' type='checkbox' />";
    	htmlRender+= "<span>"+commentsCollection[index]+"</span>";
    	htmlRender+= "<br/>";
	}
    commentsContainer.innerHTML = htmlRender;
}

//**********************************************************************************************
//update states of common comments
//**********************************************************************************************
function updateCommonComments(){
	
	//store collection of comments
	var quantity = parseInt($('lblcommentsquantity').innerHTML); //quantity of comments
	var sndData = "submit&action=updateCurrentOrderComments&quantity="+quantity+"&txtComments="+$('txtcomments').value.trim();
	
	//loop to update into [sndData] stream of comments like parameteres
	for(var index=0; index<quantity; index++){
		sndData += "&state"+index+"="+$('cmt'+index).checked; //set comment
	}

	//send json request with stream of parameters
	var json = new Request.JSON({
	 	url: 'controllers/orderController.php', 
	 	method:'post',
	 	data: sndData,
	});
	json.send();
}

//**********************************************************************************************
//update comments and go back for [pedidos1.html]
//**********************************************************************************************
function goBackMainOrders(){
	
	//updateCommonComments(); //update common comments
	//store collection of comments
	var quantity = parseInt($('lblcommentsquantity').innerHTML); //quantity of comments
	var sndData = "submit&action=updateCurrentOrderComments&quantity="+quantity+"&txtComments="+$('txtcomments').value.trim();
	
	//loop to update into [sndData] stream of comments like parameteres
	for(var index=0; index<quantity; index++){
		sndData += "&state"+index+"="+$('cmt'+index).checked; //set comment
	}

	//send json request with stream of parameters
	var json = new Request.JSON({
	 	url: 'controllers/orderController.php', 
	 	method:'post',
	 	data: sndData,
	 	onComplete: function(obj){
	    	//
	 		window.location.href = "pedidos1.php"; //redirect to [pedidos1.html]
    	}
	});
	json.send();
}

