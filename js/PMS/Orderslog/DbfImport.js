Ext.ns('PMS.Orderslog');

PMS.Orderslog.DbfImport = Ext.extend(Ext.Window, {
    
    title: 'Импорт данных',
    
    submitURL: link('orderslog', 'index', 'import'),
    
    resizable: false,
    
    width: 600,
    
    modal: true,
    
    initComponent: function() {
        
        this.uploadForm = new xlib.form.FormPanel({
            permissions: true,
            fileUpload: true,
            labelWidth: 60,
            defaults: {
                anchor: 0
            },
            items: [{
                xtype: 'fileuploadfield',
                fieldLabel: 'Dbf File',
                name: 'f',
                buttonText: '',
                anchor: '100%',
                allowBlank: false,
                buttonCfg: {
                    iconCls: 'x-form-file-btn-icon'
                }
            }]
        });
        
        this.resultGrid = new Ext.grid.GridPanel({
            border: false,
            cls: 'x-border-bottom',
            height: 400,
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
                format: '0.00',
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
        
        this.items = [this.resultGrid, this.uploadForm];
        
        this.buttons = [{
            text: 'Загрузить',
            handler: this.onProcess,
            scope: this
        }, {
            text: 'Отмена',
            handler: function() {
                this.close();
            },
            scope: this
        }]
        
        PMS.Orderslog.DbfImport.superclass.initComponent.apply(this, arguments);
        
        this.show();
    },
    
    onProcess: function() {

        if (!this.uploadForm.getForm().isValid()) {
            return;
        }
        
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
        return;
    }
});