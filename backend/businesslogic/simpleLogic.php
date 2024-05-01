<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param)
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            case "create_new_appointment":
                $res = $this->dh->create_new_appointment();
                break;
            case "vote_in_appointment":
                $res = $this->dh->create_new_appointment();
                break;
            /*
            case "queryPersonByName":
                $res = $this->dh->queryPersonByName($param);
                break;
            */
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
