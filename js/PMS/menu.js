Ext.ns('PMS');

PMS.menuMessage = function() {
    xlib.Msg.info('Модуль на стадии разработки'); 
}

PMS.Menu = function(params) {
    
    params = params || {};
    
	var username  = params.username || '';
	var rolename  = params.rolename || '';
	var roleId    = parseInt(params.roleId);
    var enableMap = params.enableMap || false; 
    
	return [{
	    xtype: 'box',
	    autoEl: {
	        tag: 'div',
	        style: 'cursor: pointer;',
	        qtip: 'e-head.ru',
	        cls: 'e-head-logo'
	    },
	    listeners: {
	        render: function(box) {
	            box.el.on('click', function() {
	                window.open('http://e-head.ru/');
	            })
	        }
	    }
	}, ' ', ' ', ' ', ' ', ' ', {
	    xtype: 'box',
	    autoEl: {
	        tag: 'div',
	        style: 'cursor: pointer;',
	        qtip: 'арабика.com',
	        cls: 'arabika-logo'
	    },
	    listeners: {
	        render: function(box) {
	            box.el.on('click', function() {
	                window.open('http://арабика.com/');
	            })
	        }
	    }
	}, ' ', ' ', '-', ' ', ' ', {
	    text: 'Выручка',
	    iconCls: 'orders-icon',
	    hidden: !acl.isView('orders'),
	    handler: function() {
	        PMS.System.Layout.getTabPanel().add({
	            iconCls: 'archive-icon',
	            xtype: 'PMS.Orderslog.List',
	            id: 'PMS.Orderslog.List'
	        });
	    }
	}, {
	    text: 'Склад',
	    iconCls: 'suppliers-icon',
        hidden: !acl.isView('storage'),
        handler: function() {
            PMS.System.Layout.getTabPanel().add({
                iconCls: 'suppliers-icon',
                xtype: 'PMS.Storage.Assets.Layout',
                id: 'PMS.Storage.Assets.Layout'
            });
        }
    }, {
        /*
        text: 'Заявки на снабжение',
        iconCls: 'suppliers-icon',
        handler: PMS.menuMessage
        handler: function() {
            PMS.System.Layout.getTabPanel().add({
                iconCls: 'suppliers-icon',
                xtype: 'PMS.Storage.Requests.List',
                id: 'PMS.Storage.Requests.List'
            });
        }
	}, {
        */
	    text: 'Кадры',
	    iconCls: 'customers-icon',
        hidden: !acl.isView('staff'),
        handler: function() {
            PMS.System.Layout.getTabPanel().add({
                iconCls: 'customers-icon',
                xtype: 'PMS.Staff.Layout',
                id: 'PMS.Staff.Layout'
            });
        } 
	}, {
        text: 'Основные средства',
        iconCls: 'archive-icon',
        hidden: !acl.isView('admin'),
        handler: function() {
            PMS.System.Layout.getTabPanel().add({
                iconCls: 'archive-icon',
                xtype: 'PMS.FixedAssets.List',
                id: 'PMS.FixedAssets.List'
            });
        }
	}, {
	    text: 'Отчёты',
	    iconCls: 'prod_schd-icon',
        menu: [{
            text: 'Выручка',
            iconCls: 'work_schd-icon',
            hidden: !acl.isView('reports'),
            handler: function() {
                new PMS.Reports.Orderslog();
            }
        }, {
            text: 'Склад',
            iconCls: 'work_schd-icon',
            hidden: !acl.isView('storage'),
            handler: function() {
                 window.open(link('storage', 'report', 'index', {}, 'html'));
            }
        }, {
            text: 'Кадры',
            iconCls: 'work_schd-icon',
            hidden: !acl.isView('staff'),
            handler: function() {
                new PMS.Reports.Staff();
            }
        }, {
            text: 'Основные средства',
            iconCls: 'work_schd-icon',
            hidden: !acl.isView('admin'),
            handler: function() {
                 window.open(link('fixed-assets', 'report', 'index', {}, 'html'));
            }
        }]
	}, ' ', ' ', '-', '->', {
		text: 'Менеджер доступа',
		iconCls: 'accounts_manager-icon',
		hidden: !acl.isView('admin'),
		handler: function() {
			PMS.System.Layout.getTabPanel().add({
				iconCls: 'accounts_manager-icon',
				xtype: 'xlib.acl.layout',
				id: 'xlib.acl.layout'
			});
		}
	}, new Ext.Toolbar.Button({
        text: 'Выход',
        tooltip: username + ' (' + rolename + ')',
        iconCls: 'exit-icon',
        handler: function() {
            window.location.href = '/index/logout';
        }
    })];
}