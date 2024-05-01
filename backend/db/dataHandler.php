<?php
include("./models/appointment.php");
include("./dbConfig.php");
class DataHandler
{
    public function queryAppointments()
    {
        $appointment =  $this->getDemoData2();
        $voting =  $this->putintodatabase2();

        $combinedData[] = [
            'appointment' => $appointment,
            'voting' => $voting
        ];
        return $combinedData;
    }

    public function create_new_appointment()
    {
        $res =  $this->putintodatabase();
        return $res;
    }

    public function vote_in_appointment()
    {
        $res =  $this->putintodatabase2();
        return $res;
    }

    /*
    public function queryPersonById($id)
    {
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
  '/
    }
    /* BRAUCHEN WIR NICHT MEHR ABER SICHERHEITSHALBER
    public function queryPersonByName($name)
    {+
        $result = array();
        foreach ($this->queryPersons() as $val) {
            if ($val[0]->lastname == $name) {
                array_push($result, $val);
            }
        }
        return $result;
    }
    */
/*
    private static function getDemoData()
    {
        $demodata = [
            [new appointment(1, "tilel1", "Wien", "12.04.2024", "11.04.2024",)],
            [new appointment(2, "title2", "Salzburg", "25.06.2024", "20.05.2024",)],
        ];
        return $demodata;
    }
*/
    //Holt die Informationen aus der appointment Datenbank

    private static function getDemoData2()
    {

        $connect = connecttodb();

        
        if($connect)
        {
            try
            {
                $query = "SELECT * FROM appointments";
                //$query = "SELECT * FROM appointments ";
                $result = $connect->query($query);

                $demodata2 = [];
                while($row = $result->fetch_assoc())
                {

                    $appointment = new appointment($row['ID'], $row['Titel'], $row['Ort'], $row['Datum'], $row['Ablaufdatum'], $row['Auswahl1'], $row['Auswahl2'], $row['Auswahl3']);
                    //$voting = new appointment($row['Appointment_ID_FK'], $row['Titel'], $row['Ort'], $row['Datum'], $row['Ablaufdatum'], $row['Auswahl1'], $row['Auswahl2'], $row['Auswahl3']);

                    /*
                    $appointment->setVotingID($row['voting_ID']);
                    $appointment->setUsername($row['Username']);
                    $appointment->setAppointmentIDFK($row['Appointment_ID_FK']);
                    $appointment->setTermin1($row['Termin1']);
                    $appointment->setTermin2($row['Termin2']);
                    $appointment->setTermin3($row['Termin3']);
                    $appointment->setKommentar($row['Kommentar']); 

                    $voting_query = "SELECT * FROM voting WHERE Appointment_ID_FK = 1";
                    $voting_result = $connect->query($voting_query);

                    while($voting_row = $voting_result->fetch_assoc())
                    {
                        $voting = new voting($voting_row['voting_ID'], $voting_row['Username'], $voting_row['Termin1'], $voting_row['Termin2'], $voting_row['Termin3'], $voting_row['Kommentar'], $voting_row['Appointment_ID_FK']);
                    }
                    
                    $combinedData[] = [
                        'appointment' => $appointment,
                        'voting' => $voting
                    ]; */
                    
                    $demodata2[] = $appointment;

                }
                return $demodata2;
            } catch(Exception $e)
            {
                echo "Error" . $e->getMessage();
                return null;
            }

        } else 
        {
            return null;
        }

        $connect->close();
    }

        //Die Eingegebenen Informationen werden in die Datenbank eingetragen
    private static function putintodatabase()
    {

        $apName;
        $apOrt;
        $apabdate;
        $apSelect1;
        $apSelect2;
        $apSelect3;

        $connect = connecttodb();

        if($_SERVER["REQUEST_METHOD"] == "POST")
        {
            //Hier wird geprüft ob die einzelnen Felder leer sind oder nicht
            if(!empty($_POST['new_appointment_name']) && !empty($_POST['new_appointment_ort']) && !empty($_POST['new_appointment_date']) && !empty($_POST['new_appointment_select_1']) && !empty($_POST['new_appointment_select_2']) && !empty($_POST['new_appointment_select_3']))
            {

                $apName = $_POST['new_appointment_name'];
                $apOrt = $_POST['new_appointment_ort'];
                $apabdate = $_POST['new_appointment_date'];
                $apSelect1 = $_POST['new_appointment_select_1'];
                $apSelect2 = $_POST['new_appointment_select_2'];
                $apSelect3 = $_POST['new_appointment_select_3'];


                $query = "INSERT INTO appointments (Titel, Ort, Ablaufdatum, Auswahl1, Auswahl2, Auswahl3) VALUES ('$apName', '$apOrt', '$apabdate', '$apSelect1', '$apSelect2', '$apSelect3')";
                
                //Hier wird geprüft ob die Eintragung erfolgreich war

                if($connect->query($query) === TRUE && $connect->query($query2) === TRUE) 
                {
                    echo("Appointment erfolgreich angelegt!");
                }
                else
                {
                    echo("Ein Unbekannter Fehler ist aufgetreten!");
                }

            }

        }

        $connect->close();

    }


    private static function putintodatabase2()
    {

        $connect = connecttodb();

        $Name;
        $apTermin1;
        $apTermin2;
        $apTermin3;
        $Comment;

        if($connect)
        {
            try
            {

                $query = "SELECT * FROM voting";
                $result = $connect->query($query);

                $demodata3 = [];
                while($row = $result->fetch_assoc())
                {

                    $voting = new voting($row['voting_ID'], $row['Username'], $row['Termin1'], $row['Termin2'], $row['Termin3'], $row['Kommentar'], $row['Appointment_ID_FK']);
                    $demodata3[] = $voting; 

                }
                return $demodata3;
            } catch(Exception $e)
            {
                echo "Error" . $e->getMessage();
                return null;
            }

        } else 
        {
            return null;
        }

        $connect->close();

     /*
        if($_SERVER["REQUEST_METHOD"] == "POST")
        {
            if(!empty($_POST['Username']))
            {

        //nicht fertig
                $apTermin1 = $_POST['new_appointment_select_1'];
                $apTermin2 = $_POST['new_appointment_select_2'];
                $apTermin3 = $_POST['new_appointment_select_3'];
                $Name = $_POST['Username'];

                $query2 = "INSERT INTO voting (Username, Termin1, Termin2, Termin3, Kommentar) VALUES ('$Name', '$apTermin1', '$apTermin2', '$apTermin3', '$Comment')";

                $connect->close();
            //..............................


                

            }
        }
        */
    }

}
