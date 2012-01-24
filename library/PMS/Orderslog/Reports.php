<?php

class PMS_Orderslog_Report
{
	protected $_tableOrderslog, $_tableStaff;

    public function __construct()
    {
        $this->_tableOrderslog = new PMS_Orderslog_Table();
        $this->_tableStaff = new PMS_Staff_Table();
    }

    // TODO: write method
    public function generate(array $params)
    {
        $response = new OSDN_Response();

        /*
        $f = new OSDN_Filter_Input(array(
            '*' => 'StringTrim'
        ), array(
            'start'  => array(array('StringLength', 0, 10), 'allowEmpty' => true),
            'end'    => array(array('StringLength', 0, 10), 'allowEmpty' => true)
        ), $params);

        $response->addInputStatus($f);
        if ($response->hasNotSuccess()) {
            return $response;
        }

        $tableOrders    = $this->_tableOrders->getTableName();
        $tableAccounts  = $this->_tableAccounts->getTableName();
        $rowsMerged     = array();
        $rowStructure   = array(
            'summ_success'  => 0,
            'summ_added'    => 0,
            'failed_count'  => 0,
            'name'          => ''
        );
        $select = $this->_tableOrders->getAdapter()->select();

        // Get total summ of success orders by account for given period
        $select->reset()->from(array('o' => $tableOrders),
            array('value' => new Zend_Db_Expr('SUM(cost)'), 'creator_id')
        )
        ->joinLeft(array('a' => $tableAccounts), 'o.creator_id=a.id', 'name')
        ->where('success_date_fact IS NOT NULL')
        ->group('creator_id');

        if (!empty($f->start)) {
            $select->where('success_date_fact >= ?', $f->start);
        }
        if (!empty($f->end)) {
            $select->where('success_date_fact <= ?', $f->end);
        }

        try {
            $rows = $select->query()->fetchAll();
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        // Parse result rows into one merged array
        foreach ($rows as $row) {
            $rowsMerged[$row['creator_id']] = $rowStructure;
            $rowsMerged[$row['creator_id']]['name'] = $row['name'];
            $rowsMerged[$row['creator_id']]['summ_success'] = $row['value'];
        }

        // Get total summ of added orders by account for given period
        $select->reset()->from(array('o' => $tableOrders),
            array('value' => new Zend_Db_Expr('SUM(cost)'), 'creator_id')
        )
        ->joinLeft(array('a' => $tableAccounts), 'o.creator_id=a.id', 'name')
        ->group('creator_id');

        if (!empty($f->start)) {
            $select->where('created >= ?', $f->start);
        }
        if (!empty($f->end)) {
            $select->where('created <= ?', $f->end);
        }

        try {
            $rows = $select->query()->fetchAll();
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        // Parse result rows into one merged array
        foreach ($rows as $row) {
            if (isset($rowsMerged[$row['creator_id']])) {
                $rowsMerged[$row['creator_id']]['summ_added'] = $row['value'];
            } else {
                $rowsMerged[$row['creator_id']] = $rowStructure;
                $rowsMerged[$row['creator_id']]['name'] = $row['name'];
                $rowsMerged[$row['creator_id']]['summ_added'] = $row['value'];
            }
        }

        // Get total count of failed orders by account for given period
        $select->reset()->from(array('o' => $tableOrders),
            array('value'  => new Zend_Db_Expr('COUNT(*)'), 'creator_id')
        )
        ->joinLeft(array('a' => $tableAccounts), 'o.creator_id=a.id', 'name')
        ->where('success_date_fact IS NULL')
        ->orWhere('success_date_fact IS NOT NULL
            AND success_date_planned < success_date_fact')
        ->group('creator_id');

        if (!empty($f->start)) {
            $select->where('success_date_planned >= ?', $f->start);
        }
        if (!empty($f->end)) {
            $select->where('success_date_planned <= ?', $f->end);
        }

        try {
            $rows = $select->query()->fetchAll();
        } catch (Exception $e) {
            if (OSDN_DEBUG) {
                throw $e;
            }
            return $response->addStatus(new PMS_Status(PMS_Status::DATABASE_ERROR));
        }

        // Parse result rows into one merged array
        foreach ($rows as $row) {
            if (isset($rowsMerged[$row['creator_id']])) {
                $rowsMerged[$row['creator_id']]['failed_count'] = $row['value'];
            } else {
                $rowsMerged[$row['creator_id']] = $rowStructure;
                $rowsMerged[$row['creator_id']]['name'] = $row['name'];
                $rowsMerged[$row['creator_id']]['failed_count'] = $row['value'];
            }
        }

        $response->data = array(
            'rows'  => array_values($rowsMerged),
            'start' => $f->start,
            'end'   => $f->end
        );
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
        */
    }
}