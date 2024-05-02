<?php
include("./models/appointment.php");
include("./dbConfig.php");
class DataHandler
{
    public function queryAppointments()
    {
        $appointment =  $this->getAppointmentData();
        $voting =  $this->getVotingData();

        $combinedData[] = [
            'appointment' => $appointment,
            'voting' => $voting
        ];
        return $combinedData;
    }

    public function create_new_appointment()
    {
        $res =  $this->putintoAppointmentDataBase();
        return $res;
    }

    public function vote_in_appointment($param)
    {
        error_log("Im VotE-appointment");
        $res =  $this->putintoVotingDataBase($param);
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

    private static function getAppointmentData()
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
    private static function putintoAppointmentDataBase()
    {

        $voteUserName;
        $voteTermin1;
        $voteTermin2;
        $voteTermin3;
        $voteKommentar;
        $voteAppointment_ID_FK;

        $connect = connecttodb();

        if($_SERVER["REQUEST_METHOD"] == "GET")
        {
            //Hier wird geprüft ob die einzelnen Felder leer sind oder nicht
           

                $voteUserName = $_GET['form_voting_name'];
                $voteTermin1 = $_GET['from_voting_Check1'];
                $voteTermin2 = $_GET['form_voting_Check2'];
                $voteTermin3 = $_GET['form_voting_Check3'];
                $voteKommentar = $_GET['exampleFormControlTextarea1'];
                $voteAppointment_ID_FK = 1;


                $query = "INSERT INTO voting (Titel, Ort, Ablaufdatum, Auswahl1, Auswahl2, Auswahl3) VALUES ('$apName', '$apOrt', '$apabdate', '$apSelect1', '$apSelect2', '$apSelect3')";
                
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

        $connect->close();

    }

    private static function putintoVotingDataBase($vote_in_appointment) {
        // Globale Verbindung verwenden, falls erforderlich
        $connect = connecttodb();
        error_log("Hallo vorm connect");
        // Überprüfen, ob die Verbindung vorhanden ist
        if (!$connect) {
            error_log("Hallo im Datenbank fellgeschlagen");
            echo "Verbindung zur Datenbank fehlt.";
            return;
        }
    
        // JSON-Daten aus dem String extrahieren
        $json_data = json_decode($vote_in_appointment, true);
        //return $json_data;
        
        // Überprüfen, ob die JSON-Daten erfolgreich decodiert wurden
        if ($json_data !== null) {
            // Datenbankabfrage vorbereiten
            $stmt = $connect->prepare("INSERT INTO voting (Username, Termin1, Termin2, Termin3, Kommentar, Appointment_ID_FK) VALUES (?, ?, ?, ?, ?, ?)");
            
            // Überprüfen, ob die Abfrage erfolgreich vorbereitet wurde
            if (TRUE) {
                /*
                $Test_variable1 = "Hallo";
                $Test_variable2 = 1;
                $Test_variable3 = 0;
                $Test_variable4 = 1;
                $Test_variable5 = ; 
                $Test = 1; */
                //return $json_data["name"];
                // Variablen für die Abfrage binden
                $stmt->bind_param("sssssi", $json_data['name'], $json_data['auswahl1'], $json_data['auswahl2'], $json_data['auswahl3'], $json_data['kommentare'], $json_data['Appointment_FK']);
                
                // Abfrage ausführen
                $stmt->execute();
                //return print_r($stmt);

                // Überprüfen, ob die Abfrage erfolgreich war
                if ($stmt->affected_rows > 0) {
                    //echo "Daten erfolgreich in die Datenbank eingefügt.";
                    return 1;
                } else {
                    echo "Fehler beim Einfügen der Daten in die Datenbank.";
                }
    
                // Abfrage schließen
                $stmt->close();
                //error_log("Print" . $stmt);
            } else {
                echo "Fehler beim Vorbereiten der Datenbankabfrage.";
            }
        } else {
            echo "Fehler beim Verarbeiten der JSON-Daten.";
        }
    }
    

    
    private static function getVotingData() 
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
