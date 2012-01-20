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
	    text: 'Заказы',
	    iconCls: 'orders-icon',
	    hidden: !acl.isView('archive'),
	    handler: PMS.menuMessage 
        /*function() {
	        PMS.System.Layout.getTabPanel().add({
	            iconCls: 'archive-icon',
	            xtype: 'PMS.Orders.Archive',
	            id: 'PMS.Orders.Archive'
	        });
	    }*/
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
	    text: 'Планы',
	    iconCls: 'prod_schd-icon',
	    hidden: !acl.isView('orders'),
        handler: PMS.menuMessage
        /*
	    menu: [{
	        text: 'План производственных работ',
	        iconCls: 'prod_schd-icon',
            hidden: !acl.isView('orders', 'production'),
            handler: function() {
	            window.open('/orders/report/schedule-production');
	        }
	    }, {
	        text: 'План печатных работ',
	        iconCls: 'prod_schd-icon',
            hidden: !acl.isView('orders', 'print'),
            handler: function() {
	            window.open('/orders/report/schedule-print');
	        }
	    }, {
	        text: 'План монтажных работ',
	        iconCls: 'mount_schd-icon',
            hidden: !acl.isView('orders', 'mount'),
	        handler: function() {
	            window.open('/orders/report/schedule-mount');
	        }
	    }, {
	        text: 'Сводный план работ',
	        iconCls: 'work_schd-icon',
            hidden: !acl.isView('orders'),
	        handler: function() {
	            window.open('/orders/report/planning');
	        }
	    }, {
	        text: 'План отпусков сотрудников',
	        iconCls: 'work_schd-icon',
            hidden: !acl.isView('orders'),
	        handler: function() {
                new PMS.Reports.Vacations();
            }
	    }]
        */
    }, {
	    text: 'Отчёты',
	    iconCls: 'prod_schd-icon',
        handler: PMS.menuMessage
        /*
        menu: [{
            text: 'Менеджеры',
            iconCls: 'work_schd-icon',
            hidden: !acl.isView('reports'),
            handler: function() {
                new PMS.Reports.Managers();
            }
        }, {
            text: 'Клиенты',
            iconCls: 'work_schd-icon',
            hidden: !acl.isView('reports'),
            handler: function() {
                new PMS.Reports.Customers();
            }
        }, {
            text: 'Кадры',
            iconCls: 'work_schd-icon',
            hidden: !acl.isView('staff'),
            handler: function() {
                new PMS.Reports.Staff();
            }
        }, {
            text: 'Склад',
            iconCls: 'work_schd-icon',
            hidden: !acl.isView('storage'),
            handler: function() {
                 window.open(link('storage', 'report', 'index', {}, 'html'));
            }
        }, {
            text: 'Основные средства',
            iconCls: 'work_schd-icon',
            hidden: !acl.isView('admin'),
            handler: function() {
                 window.open(link('fixed-assets', 'report', 'index', {}, 'html'));
            }
        }]
        */
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