<?php

class PMS_DbfImport
{
    // Number of records in the file
    public $dbf_num_rec;

    // Number of columns in each row
    public $dbf_num_field;

    // Information on each column ['name'],['len'],['type']
    public $dbf_names = array();

    // Store for raw file data
    public $_raw;

    // Length of each row
    public $_rowsize;

    // Length of the header information (offset to 1st record)
    public $_hdrsize;

    /**
     * The main entry point
     *
     * @param $filename
     * @return OSDN_Response
     */
    public function start($filename)
    {
        $response = new OSDN_Response();

        if (!$this->read($filename)) {
            return $response->addStatus(new PMS_Status(PMS_Status::FAILURE));
        }

        $rows = array();
        for ($i = 0; $i < $this->dbf_num_rec; $i++) {
            if ($row = $this->getRowAssoc($i)) {
                array_push($rows, $row);
            }
        }

        $result = $this->calculate($rows);

        $response->setRowset($result);
        return $response->addStatus(new PMS_Status(PMS_Status::OK));
    }

    /**
     * Calculate the number of positions from rows array
     *
     * @param array
     * @return array
     */
    public function calculate($rows) {

        $result = array();

        foreach ($rows as $row) {
            if (empty($result[$row['CODE']])) {
                $result[$row['CODE']] = array(
                    'CODE'  => $row['CODE'],
                    'NAME'  => $row['NAME'],
                    'COUNT' => intval($row['COUNT']),
                    'SUMMA' => floatval($row['SUMMA'])
                );
            } else {
                $result[$row['CODE']]['COUNT'] += intval($row['COUNT']);
                $result[$row['CODE']]['SUMMA'] += floatval($row['SUMMA']);
            }
        }

        $finalResult = array();
        foreach ($result as $row) {
            $finalResult[] = array_values($row);
        }

        return $finalResult;
    }

    /**
     * Read the file and parse the data
     *
     * @param $filename
     * @return bool
     */
    public function read($filename) {

        $handle = fopen($filename, "r");
        if (!$handle) {
            return false;
        }

        $filesize = filesize($filename);
        $this->_raw = fread ($handle, $filesize);
        fclose ($handle);

        // Make sure that we indeed have a dbf file...
        // 3 = file without DBT memo file;
        // 131($83) = file with a DBT.
        if (!(ord($this->_raw[0]) == 3 || ord($this->_raw[0]) == 131)
        && ord($this->_raw[$filesize]) != 26) {
            return false;
        }

        //Initial information

        // Header Size
        $line = 32;

        $arrHeaderHex = array();

        for ($i = 0; $i < 32; $i++) {
            $arrHeaderHex[$i] = str_pad(dechex(ord($this->_raw[$i]) ), 2, "0", STR_PAD_LEFT);
        }

        // Number of records
        $this->dbf_num_rec = hexdec($arrHeaderHex[7].$arrHeaderHex[6].$arrHeaderHex[5].$arrHeaderHex[4]);

        // Header Size+Field Descriptor
        $this->_hdrsize = hexdec($arrHeaderHex[9].$arrHeaderHex[8]);

        // Number of fields
        $this->_rowsize = hexdec($arrHeaderHex[11].$arrHeaderHex[10]);
        $this->dbf_num_field = intval(floor(($this->_hdrsize - $line ) / $line )) ;

        // Field properties retrieval looping
        for ($j = 0; $j < $this->dbf_num_field; $j++) {
            $name = '';
            $beg = $j*$line+$line;
            for ($k = $beg; $k < $beg+11; $k++) {
                if (ord($this->_raw[$k]) != 0) {
                    $name .= $this->_raw[$k];
                }
            }
            // Name of the Field
            $this->dbf_names[$j]['name']    = $name;

            // Length of the field
            $this->dbf_names[$j]['len']     = ord($this->_raw[$beg+16]);

            // Type of the field
            $this->dbf_names[$j]['type']    = $this->_raw[$beg+11];
        }

        return true;
    }

    /**
     * Retrieve a record from raw data
     *
     * @param int
     * @return array|bool
     */
    function getRowAssoc($recnum) {

        $rawrow = substr($this->_raw, $recnum * $this->_rowsize + $this->_hdrsize, $this->_rowsize);
        $rowrecs = array();

        // Record is deleted...
        if (ord($rawrow[0]) == 42) {
            return false;
        }

        $beg = 1;
        for ($i = 0; $i < $this->dbf_num_field; $i++) {
            $col = trim(substr($rawrow, $beg, $this->dbf_names[$i]['len']));
            $rowrecs[$this->dbf_names[$i]['name']] = mb_convert_encoding($col, 'UTF-8', 'CP866');
            $beg += $this->dbf_names[$i]['len'];
        }

        return $rowrecs;
    }
}