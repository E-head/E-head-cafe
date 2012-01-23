Ext.ns('PMS.Orderslog');

PMS.Orderslog.List = Ext.extend(Ext.grid.GridPanel, {
    
    title: 'Выручка',
    
    autoScroll: true,
    
    border: false,
    
    loadMask: {msg: 'Загрузка...'},
    
    stripeRows: true,
    
    layout: 'fit',
    
    viewConfig: {autoFill: true},
	
    loadURL: link('orderslog', 'index', 'get-list'),
    
    deleteURL: link('orderslog', 'index', 'delete'),
    
    permissions: acl.isUpdate('admin'),
    
    viewConfig: {
    
        getRowClass: function(record) {
            
            var date = record.get('date'), created = record.get('created');  
            
            if (Ext.isDate(date) && Ext.isDate(created)
            && (date.format(xlib.date.DATE_FORMAT) != created.format(xlib.date.DATE_FORMAT)) 
            ) {
                return 'x-row-expired';
            }
            
        }
        
    },
    
    initComponent: function() {
        
        this.autoExpandColumn = Ext.id();
        
        this.cm = new Ext.grid.ColumnModel([{
            header: 'Дата',
            width: 70,
            sortable: true,
            renderer: xlib.dateRenderer(xlib.date.DATE_FORMAT),
            dataIndex: 'date'
        }, {
            header: 'Ответственный сотрудник',
            dataIndex: 'staff_name',
            id: this.autoExpandColumn
        }, {
            width: 200,
            header: 'Остаток в кассе на начало дня',
            dataIndex: 'summ_start'
        }, {
            width: 200,
            header: 'Сумма выручки за день',
            dataIndex: 'summ_income'
        }, {
            width: 200,
            header: 'Сумма инкассации',
            dataIndex: 'summ_inkasso'
        }, {
            width: 200,
            header: 'Остаток в кассе на конец дня',
            dataIndex: 'summ_rest'
        }, {
            header: 'Добавлено',
            width: 120,
            renderer: xlib.dateRenderer(xlib.date.DATE_TIME_FORMAT),
            dataIndex: 'created'
        }]);
        
        this.cm.defaultSortable = true; 

        this.sm = new Ext.grid.RowSelectionModel({singleSelect: true});

        this.ds = new Ext.data.JsonStore({
	        url: this.loadURL,
	        totalProperty: 'totalCount',
            autoLoad: true,
	        remoteSort: true,
	        root: 'data',
            sortInfo: {
                field: 'date',
                direction: 'DESC'
            },
	        fields: [
	            {name: 'id'},
	            {name: 'date', type: 'date', dateFormat: xlib.date.DATE_FORMAT_SERVER},
	            {name: 'staff_name'},
	            {name: 'summ_start'},
	            {name: 'summ_income'},
	            {name: 'summ_inkasso'},
	            {name: 'summ_rest'},
                {name: 'created', type: 'date', dateFormat: xlib.date.DATE_TIME_FORMAT_SERVER}
	        ]
	    });
        
        this.bbar = new xlib.PagingToolbar({
            store: this.ds,
            displayInfo: true,
            items: ['-', {
            	text: 'Добавить',
            	iconCls: 'add',
            	handler: this.add.createDelegate(this),
                hidden: !this.permissions
            }]
        });
        
        var actions = [{
            text: 'Удалить',
            iconCls: 'delete',
            handler: this.onDelete,
            hidden: !this.permissions
        }];
        
        var actionsPlugin = new xlib.grid.Actions({
	        autoWidth: true,
	        items: actions
	    });
	    
	    this.plugins = [actionsPlugin];
        
        PMS.Orderslog.List.superclass.initComponent.apply(this, arguments);
		
        if (this.permissions) {
            this.on('rowdblclick', this.onRowdblclick, this);
        }
    },
    
    onRowdblclick: function(g, rowIndex) {
    	this.edit(g, rowIndex);
    },
   
    add: function(g, rowIndex) {
		var form = new PMS.Orderslog.Form({permissions: this.permissions});
		var w = form.showInWindow({title: 'Выручка за день'});
		form.on('saved', function() {this.getStore().reload(); w.close();}, this);
		w.show();
	},
	
	edit: function(g, rowIndex) {
		var form = new PMS.Orderslog.Form({
            permissions: this.permissions,
			sid: this.getStore().getAt(rowIndex).get('id')
		});
        var w = form.showInWindow({title: 'Редактирование'});
		form.on('saved', function() {this.getStore().reload(); w.close();}, this);
		w.show();
	},
    
    onDelete: function(g, rowIndex) {
        Ext.Msg.show({
            title: 'Подтверждение',
            msg: 'Вы уверены?',
            buttons: Ext.Msg.YESNO,
            fn: function(b) {
                if ('yes' == b) {
                    Ext.Ajax.request({
                        url: g.deleteURL,
                        success: function(res) {
                            var errors = Ext.decode(res.responseText).errors;
                            if (errors) {
                                xlib.Msg.error(errors[0].msg);
                                return;
                            }
                            g.getStore().reload();
                        },
                        failure: Ext.emptyFn(),
                        params: {id: g.getStore().getAt(rowIndex).get('id')}
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    } 
});

Ext.reg('PMS.Orderslog.List', PMS.Orderslog.List);