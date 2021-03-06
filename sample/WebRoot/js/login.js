Ext.onReady(function() {
	var loginFun = function() {
		
		var userName = Ext.getDom('txtUserName').value;
		if (Ext.isEmpty(userName)) {
			Ext.get('rfvUserName').setVisible(true);
			return;
		}
		var passWord = Ext.getDom('txtPassWord').value;
		if (Ext.isEmpty(passWord)) {
			Ext.get('rfvPassWord').setVisible(true);
			return;
		}
		var isAutoLoginNext = Ext.fly('logincookie').dom.checked;
		
		Ext.Ajax.request({
					url : 'sysinfo/login.do',
					success : function(response, opts) {
						var obj = Ext.decode(response.responseText);
						if (obj.success) {
							var path = window.location.pathname;
							path = path.substring(0, path.lastIndexOf('/') + 1);
							// set the cookie
	                        if(isAutoLoginNext){
	                        	var now = new Date();
	                        	var expireDate = new Date(now.getFullYear(),now.getMonth(),now.getDate()+14);
		                        Ext.util.Cookies.set('user', userName,expireDate,path);
		                        Ext.util.Cookies.set('pass', passWord,expireDate,path);
	                        }
							window.location = path;
						} else {
							alert('用户名或密码错误!');
						}
					},
					failure : function() {
						alert('服务不可用，请稍后重试!');
					},
					params : {
						loginName : userName,
						password : passWord
					}
				});
		return false;
	};
	function isAutoLogin(){
	   	  var user = Ext.util.Cookies.get('user');
	   	  var pass = Ext.util.Cookies.get('pass');
	   	  if(!Ext.isEmpty(user) && !Ext.isEmpty(pass)){
	   	  	 Ext.get("txtUserName").dom.value = user;
	   	  	 Ext.get("txtPassWord").dom.value = pass;
	   	  	 Ext.fly('logincookie').dom.checked = true;
	   	  }
	}
	isAutoLogin();
	Ext.getDom('btnLogin').onclick = loginFun;
	Ext.getDom('txtPassWord').onkeypress = function(e){
		if(e.keyCode == 13)
			loginFun();
	};
});
