$(function(){

	var url = "https://pizza.mybluemix.net/chat/web";
	var conversation_id;

	send("inicio_conversa");

	function send(msg){
		
		var data ={
			"msg" : msg,
			"conversation_id" : conversation_id
		}
		
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			dataType: 'json'
		}).done(function(data) {
			//TODO vai retornar varias msgs, em um loop coloca
			//TODO se possivel... colcoar um delay pra cada msg... pra nao ficar tao robotica...
			var fraseInicial = data.output.text[0];

			console.log("fraseInicial: "+fraseInicial);

			if(fraseInicial == 'post_back'){

				appendButtonMsg(data);
			} else {

				if(conversation_id != null) setTimeout(function() { appendMsg("bot", data.output.text); }, 1000);
				else appendMsg("bot", data.output.text);
			}

			conversation_id = data.context.conversation_id;			
			//TODO salvar conversation_id
			
		})
		.fail(function(data) {
			//append uma nova msg mas avisando que falha (tipo facebook)
			appendMsg("fail", "Problema ao enviar mensagem");
			alert( "error" );
		});
 
	}

	/**
	adiciona uma msg 
	**/
	function appendMsg(user, msg){
		//TODO colocar em um html a msg, saber se é do bot, ou do user (que ta vindo no parametro user)
		//@TODO ao adicionar msg rolar o scroll pra baixo
		if(user == 'bot'){

			$("#divMensagens").append("<div class=\"direct-chat-msg\"><div class=\"direct-chat-info clearfix\"><span class=\"direct-chat-name pull-left\">GOPrefs</span></div><img class=\"direct-chat-img\" src=\"dist/img/logo_prefeitura.png\" alt=\"GOPrefs\"><div class=\"direct-chat-text\">"+msg+"</div></div>");
		} else if(user == 'user'){

			$("#divMensagens").append("<div class=\"direct-chat-msg right\"><div class=\"direct-chat-info clearfix\"><span class=\"direct-chat-name pull-right\">Usu&aacute;rio</span></div><img class=\"direct-chat-img\" src=\"dist/img/logo_usuario.png\" alt=\"Usuário\"><div class=\"direct-chat-text\">"+msg+"</div></div>");
		} else if(user == 'localizacao'){

			$("#divMensagens").append("<div class=\"direct-chat-msg right\"><div class=\"direct-chat-info clearfix\"><span class=\"direct-chat-name pull-right\">Usu&aacute;rio</span></div><img class=\"direct-chat-img\" src=\"dist/img/logo_usuario.png\" alt=\"Usuário\"><div class=\"direct-chat-text\">Localiza&ccedil;&atilde;o enviada</div></div>");
		}

		var divMsg = $("#divMensagens");
		var height = divMsg[0].scrollHeight;
		divMsg.scrollTop(height);

	}

	/**
	adiciona uma msg com botão de sim ou não
	**/
	function appendButtonMsg(data){

    	$("#divMensagens").append("<div class=\"direct-chat-msg\"><div class=\"direct-chat-info clearfix\"><span class=\"direct-chat-name pull-left\">Prefeitura de Curitiba</span></div><img class=\"direct-chat-img\" src=\"dist/img/logo_prefeitura.png\" alt=\"Prefeitura de Curitiba\"><div class=\"direct-chat-text\">"+data.output.text[1]+"<br/><div class=\"padding: 5px;\"><button type=\"button\" class=\"btn btn-success\" id=\"botaoSim\">Sim</button><button type=\"button\" class=\"btn btn-danger\" id=\"botaoNao\" style=\"margin-left: 5px;\">N&atilde;o</button></div></div></div>");
		$("#divMensagens").append("<script>$(\"#botaoSim\").on(\"click\", function(){var msg = 'postback_sim';send(msg);});</script>");
		$("#divMensagens").append("<script>$(\"#botaoNao\").on(\"click\", function(){var msg = 'postback_nao';send(msg);});</script>");
		var divMsg = $("#divMensagens");
		var height = divMsg[0].scrollHeight;
		divMsg.scrollTop(height);

	}
	
	//@TODO Ao pressionar enter ou clicar no botão
	$("#enviar").on("click", function(){
		//@TODO pegar msg do $("input[type='text']") e limpar 
		var msg = $("input[type='text']").val();
		$("input[type='text']").val("");
		appendMsg("user", msg);
		send(msg);
		
		//@TODO dar append e enviar
		//@TODO caso ok, append as msgs da goPrefs
		//@TODO ao erro alertar erro de envio
	});


	//@TODO Ao pressionar no botão de enviar localização
	$("#localizacao").on("click", function(){
		//@TODO pegar msg do $("input[type='text']") e limpar 

		var data;
		navigator.geolocation.getCurrentPosition(function(data){

			data ={
				"msg" : "localizacao",
				"lat" : data.coords.latitude,
				"long" : data.coords.longitude,
				"conversation_id" : conversation_id
			}
	    });

		appendMsg("localizacao", data);
		send('localizacao');
		
		//@TODO dar append e enviar
		//@TODO caso ok, append as msgs da goPrefs
		//@TODO ao erro alertar erro de envio
	});

	$("input").keypress(function(e){
	    if(e.keyCode==13){
       		$("#enviar").click(); 	
	    }
    });

})


