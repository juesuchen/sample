Ext.define("Ext.ux.EasyCombo", {
			extend : 'Ext.form.field.ComboBox',
            alias: ['widget.easycombo'],
			constructor : function(config) {
				config = config || {};
				Ext.applyIf(config, {
							displayField : 'text',
							editable : false,
							valueField : 'value',
							hiddenName : config.hiddenName || config.name,
							triggerAction : 'all',
                            autoScroll : true,
                            listConfig : {minWidth:50},
							queryMode  : 'local',
							emptyText : '请选择',
							store : new Ext.data.ArrayStore({
										fields : ['value', 'text'],
										data : config.data
									})
						});
				Ext.apply(this, config);
				this.callParent();
			},
		  getStore : function(){
		  	return this.store;
		  }
		});