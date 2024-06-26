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
                error_log("Im new_Appointment");
                $res = $this->dh->create_new_appointment($param);
                break;
            case "vote_in_appointment":
                $res = $this->dh->vote_in_appointment($param);
                break;
            default:
                $res = null;
                error_log("im default");
                break;
        }
        return $res;
    }
}
