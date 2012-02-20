Ext.ns('PMS.Orderslog');

PMS.Orderslog.DbfImport = Ext.extend(Ext.Window, {
    
    title: 'Импорт данных',
    
    submitURL: link('orderslog', 'index', 'import'),
    
    resizable: false,
    
    width: 600,
    
    modal: true,
    
    border: false,
    
    initComponent: function() {
        
        var self = this;
        
        this.uploadForm = new xlib.form.FormPanel({
            permissions: true,
            fileUpload: true,
            bodyStyle: {'background-color': '#CCD8E7'},
            padding: '5px 0 0 0',
            border: false,
            items: [{
                xtype: 'fileuploadfield',
                name: 'f',
                hideLabel: true,
                buttonOnly: true,
                buttonText: 'Загрузить файл',
                allowBlank: false,
                listeners: {
                    fileselected: self.onProcess,
                    scope: self
                }
            }]
        });
        
        this.resultGrid = new Ext.grid.GridPanel({
            title: 'Продукция',
            height: 150,
            viewConfig: {
                autoFill: true
            },
            cm: new Ext.grid.ColumnModel([{
                header: 'Код',
                dataIndex: 'CODE',
                width: 40
            }, {
                header: 'Наименование',
                dataIndex: 'NAME'
            }, {
                header: 'Количество',
                dataIndex: 'COUNT',
                align: 'right',
                width: 40
            }, {
                header: 'Сумма',
                dataIndex: 'SUMMA',
                align: 'right',
                xtype: 'numbercolumn',
                width: 40
            }]),
            ds: new Ext.data.ArrayStore({
                idProperty: 'CODE',
                fields: [
                    {name: 'CODE'},
                    {name: 'NAME'},
                    {name: 'COUNT', type: 'int'},
                    {name: 'SUMMA', type: 'float'}
                ]
            })
        });
        
        this.calcGrid = new Ext.grid.GridPanel({
            title: 'Расходные материалы',
            height: 250,
            viewConfig: {
                autoFill: true
            },
            cm: new Ext.grid.ColumnModel([{
                header: '№',
                hidden: true,
                dataIndex: 'id',
                width: 40
            }, {
                header: 'Наименование',
                dataIndex: 'name',
                id: this.autoExpandColumn
            }, {
                header: 'Ед. измерения',
                dataIndex: 'measure',
                width: 100
            }, {
                header: 'Кол-во',
                dataIndex: 'qty',
                width: 60,
                align: 'right'
            }, {
                header: 'Цена',
                dataIndex: 'price',
                xtype: 'numbercolumn',
                format: '0.000,00/i',
                width: 40,
                align: 'right'
            }, {
                header: 'Сумма',
                dataIndex: 'cost',
                align: 'right',
                xtype: 'numbercolumn',
                format: '0.000,00/i',
                width: 40
            }]),
            ds: new Ext.data.ArrayStore({
                idProperty: 'CODE',
                fields: [
                    {name: 'id'},
                    {name: 'name'},
                    {name: 'measure'},
                    {name: 'qty'},
                    {name: 'price', type: 'float'},
                    {name: 'cost', type: 'float'}
                ]
            })
        });
        
        this.items = [this.resultGrid, this.calcGrid, this.uploadForm];
        
        PMS.Orderslog.DbfImport.superclass.initComponent.apply(this, arguments);
        
        this.show();
    },
    
    onProcess: function() {

        if (!this.uploadForm.getForm().isValid()) {
            return;
        }
        
        this.resultGrid.getStore().removeAll(false);
        
        this.uploadForm.getForm().submit({
            url: this.submitURL,
            waitMsg: 'Загрузка...',
            success: this.onSuccess,
            failure: this.onFailure,
            scope: this
        });
        
    },
    
    onFailure: function(form, options) {
        xlib.Msg.error('Ошибка сервера');
    },
    
    onSuccess: function(form, options) {
        var o = options.result;
        if (!o.success) {
            this.onFailure();
        }
        this.resultGrid.getStore().loadData(o.data);
        
        // Calculate and add the summary row
        this.resultGrid.getStore().add(new (this.resultGrid.getStore()).recordType({
            CODE: '<b>Итого</b>',
            NAME: '',
            COUNT: '',
            SUMMA: this.resultGrid.getStore().sum('SUMMA')
        }, ' '));
    }
});