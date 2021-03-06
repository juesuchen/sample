/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.role.Main', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.role.Configs'
    ],
    
    initComponent : function(){
        var me = this;
        this.border = false;
        this.frame = false;
        this.layout = 'border';
        me.callParent();
        
        this.addPanel();
    },
    addPanel : function(){
    	//定义查询表单
    	this.queryForm = EasyUtil.getEasyQueryForm(Ext.bind(this.doQuery,this),roleConfigs.getQueryFormItems(), 3);
		//定义展示列表
		var viewGridConfig = {
		            xtype : 'easygrid',
		            noAutoLoad : true,
		            region : 'center',
		            showTbar : true,
		            showBbar : true,
		            parentPanel :this,
		            noNeddForceFit : false,
		            subWindowTitle : '角色信息详情',
		            baseParams : {queryId : roleConfigs.getModel()},
		            fields : roleConfigs.getQueryFields()
		        };
		this.easyGrid = new Ext.ux.EasyGrid(viewGridConfig);
		//定义权限树
		
		var funtionNodes = roleConfigs.getFuntionNodes();
		var toggle = false;
		var tree = Ext.create('Ext.tree.Panel', {
					region : 'east',
					width : 200,
					store : Ext.create('Ext.data.TreeStore', {
							root : {
								expanded : true,
								children : funtionNodes
							}
						}),
					rootVisible : false,
					listeners: {
			            'checkchange': function(node, checked){//debugger;
			                //如果不是叶结点，则把子结点也相应去掉或加上
			                if(node.isLeaf()){
			                	if(checked){
				                	this.parentcheckchange = false;
				                	node.parentNode.set('checked',true);
			                	}else{
			                		var isAllUncheck = true;
			                		node.parentNode.eachChild(function(subNode){
					                	if(subNode.get('checked')){
					                		isAllUncheck = false;
					                		return;
					                	}
					                });
					                if(isAllUncheck){
					                	this.parentcheckchange = false;
			                			node.parentNode.set('checked',false);
					                }
			                	}
			                }else if(this.parentcheckchange){
			                	node.eachChild(function(subNode){
				                	subNode.set('checked',checked);;
				                });
			                }
			                this.parentcheckchange = true;
			                tree.getStore().sort('checked','DESC');
			            }
			        },
					dockedItems: [{
						xtype: 'toolbar',
			            dock: 'bottom',
			            ui: 'footer',
			            items : [{
								text: '收起/展开全部',
					            iconCls : 'accept',
					            handler: function(){
					            	if(toggle)
					            		tree.expandAll();
					            	else
					            		tree.collapseAll();
					            	toggle = !toggle;
					            }
							}, {
								text : '保存更改',
								iconCls : 'save',
								handler : Ext.bind(this.save,this)
							}]
					}]
				});
		this.tree = tree;
		this.add([this.queryForm,this.easyGrid,this.tree]);
    },
    doQuery : function(){
    	this.tree.expandAll();
    	EasyUtil.doEasyQuery(this.easyGrid,this.queryForm);
    	this.uncheck();
    },
    save : function(){
    	var rs = this.easyGrid.getSelectionModel().getSelection();
		if(rs.length == 0){
			Ext.Msg.alert('操作提示', '请先选择角色。');
			return;
		}
		var roleIds = '';
		Ext.each(rs,function(r){
			if(roleIds.length > 0){
                roleIds += ',';
            }
			roleIds += r.get('id');
		});
		//获取所选权限
		var privilege = '', selNodes = this.tree.getChecked();
        Ext.each(selNodes, function(node){
            if(privilege.length > 0){
                privilege += ',';
            }
            privilege += node.raw.id;
        });
        var url = 'role/savePrivilege';
    	EasyUtil.easyAjax(url,{roleIds:roleIds,privileges:privilege},function(response, opts) {
            var obj = Ext.decode(response.responseText);
            this.doQuery();
            EasyUtil.alertMsg(obj.success);
        },this);
    },
    uncheck : function() {
    	var records = this.tree.getView().getRecords(this.tree.getView().getNodes());
        Ext.each(records,function(node){
        	node.set('checked',false);
        },this);
    },
    dbClickFun : function(r){
    	var url = 'role/getPrivilege/'+r.get('id');
    	EasyUtil.easyAjax(url,{},function(response, opts) {
            var privilege = Ext.decode(response.responseText);
            var records = this.tree.getView().getRecords(this.tree.getView().getNodes());
            Ext.each(records,function(node){
            	node.set('checked',privilege[node.raw.funCode]);
            },this);
        },this);
    },
    addRecord : function(store, form){
    	EasyUtil.submitForm(form,'role/add',this,{isDoQuery:true});
    },
    updateRecord : function(store, r, values,form){
    	EasyUtil.submitForm(form,'role/update',this,{isDoQuery:true});
    },
    removeRecord : function(store, r,gridName,grid){
    	var isSuc = false;
    	EasyUtil.easyAjax('role/delete/' + r.get('id'),{isDoQuery:true},
                function(response, opts) {
    				 var resObj = Ext.decode(response.responseText);
    				 isSuc = resObj.success;
    				 if (isSuc) {
    					 this.doQuery();
    				 }
   		 		},this,true
    	);
    	return isSuc;
    }
});