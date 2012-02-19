Ext.ns('PMS.Sales.Goods');

PMS.Sales.Goods.Edit = Ext.extend(Ext.Window, {
    
	sid: null,
    
    layout: 'border',

    width: 600,
    
    height: 500,
    
    border: false,
    
    resizable: false,
    
    modal: true,
    
    loadURL: link('sales', 'goods', 'get'),
    
    addURL: link('sales', 'goods', 'add'),
    
    updateURL: link('sales', 'goods', 'update'),
    
    initComponent: function() {
        
        this.title = (this.sid ? 'Редактирование' : 'Добавление') + ' продукции';
        
        this.formPanel = new PMS.Sales.Goods.Form({
            region: 'center'
        });
        
        this.gridPanel = new PMS.Sales.Goods.Ingredients({
            region: 'south',
            height: 300
        }); 
        
        this.items = [this.formPanel, this.gridPanel];
        
        this.buttons = [{
            text: 'Сохранить', 
            handler: this.saveData,
            scope: this
        }, {
            text: 'Отменить', 
            handler: function() {
                this.close();
            },
            scope: this
        }];
                
        PMS.Sales.Goods.Edit.superclass.initComponent.apply(this, arguments);
        
        this.show();
        
        var calcCost = function(store) {
            this.formPanel.setCost(Ext.util.Format.number(store.sum('cost'), '0.00'));
        }
        
        this.gridPanel.getStore().on({
            add: calcCost,
            remove: calcCost,
            update: calcCost,
            load: calcCost,
            scope: this
        });
        
        if (this.sid) {
            this.loadData(this.sid);
        }
    },
    
    saveData: function() {
        
        if (this.formPanel.getForm().isValid()) {
            
            var params = this.formPanel.getForm().getFieldValues();
            var ingredients = [];
           
            this.gridPanel.getStore().each(function(record) {
                ingredients.push([record.get('id'), record.get('qty')]); 
            });
            
            params.id = this.sid;
            params.ingredients = Ext.encode(ingredients); 
            
            Ext.Ajax.request({
                url: this.sid ? this.updateURL : this.addURL,
                params: params,
                success: this.onSaveSuccess,
                failure: this.onFailure,
                scope: this
            });
        }
    },
    
    onSaveSuccess: function(response, options) {
        
        var res = xlib.decode(response.responseText);
        
        if (res.success) {
            this.fireEvent('saved');
        } else {
            this.onFailure();
        }
    },
    
    loadData: function(id) {
        
        Ext.Ajax.request({
            url: this.loadURL,
            params: {id: this.sid},
            success: this.onLoadSuccess,
            failure: this.onFailure,
            scope: this
        });
        
    },
    
    onLoadSuccess: function(response, options) {
        
        var res = xlib.decode(response.responseText);
        
        if (res.success) {
            this.formPanel.getForm().setValues(res.data);
            this.gridPanel.getStore().loadData(res.data.ingredients);
        } else {
            this.onFailure();
        }
    },
    
    onFailure: function() {
        xlib.Msg.error('Ошибка сервера');
    }
});

Ext.reg('PMS.Sales.Goods.Edit', PMS.Sales.Goods.Edit);