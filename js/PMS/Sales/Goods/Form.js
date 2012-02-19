Ext.ns('PMS.Sales.Goods');

PMS.Sales.Goods.Form = Ext.extend(xlib.form.FormPanel, {
    
    autoHeight: true,

    permissions: true,
    
    defaults: {
        xtype: 'textfield',
        allowBlank: false,
        anchor: '100%'
    },
    
    initComponent: function() {
        
        this.costField = new Ext.form.DisplayField({
            fieldLabel: 'Себестоимость',
            name: 'cost',
            style: 'line-height: 20px;'
        })
        
        this.items = [{
            name: 'id',
            xtype: 'hidden'
        }, {
            fieldLabel: 'Код',
            name: 'code'
        }, {
            fieldLabel: 'Наименование',
            name: 'name'
        }, {
            fieldLabel: 'Цена',
            name: 'price',
            xtype: 'numberfield'
        }, {
            xtype: 'PMS.Storage.Measures.ComboBox',
            fieldLabel: 'Ед. измерения',
            name: 'measure',
            hiddenName: 'measure'
        }, this.costField];
        
        PMS.Sales.Goods.Form.superclass.initComponent.apply(this, arguments);
    },
    
    setCost: function(summ) {
        this.costField.setValue(summ);
    }
});

Ext.reg('PMS.Sales.Goods.Form', PMS.Sales.Goods.Form);