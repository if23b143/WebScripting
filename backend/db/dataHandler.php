<?php
include("./models/appointment.php");
include("./dbConfig.php");
class DataHandler
{
    public function queryPersons()
    {
        $res =  $this->getDemoData();
        return $res;
    }

    public function queryPersonById($id)
    {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
    }
    /* BRAUCHEN WIR NICHT MEHR ABER SICHERHEITSHALBER
    public function queryPersonByName($name)
    {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->lastname == $name) {
                array_push($result, $val);
            }
        }
        return $result;
    }
    */

    private static function getDemoData()
    {
        $demodata = [
            [new appointment(1, "tilel1", "Wien", "12.04.2024", "11.04.2024",)],
            [new appointment(2, "title2", "Salzburg", "25.06.2024", "20.05.2024",)],
        ];
        return $demodata;
    }

    private static function getDemoData2()
    {

        $connect = 




    }
}
