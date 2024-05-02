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

    public function create_new_appointment($param)
    {
        $res =  $this->putintoAppointmentDataBase($param);
        return $res;
    }

    public function vote_in_appointment($param)
    {
        error_log("Im VotE-appointment");
        $res =  $this->putintoVotingDataBase($param);
        return $res;
    }

    private static function getAppointmentData()
    {

        $connect = connecttodb();

        
        if($connect)
        {
            try
            {
                $query = "SELECT * FROM appointments";
                $result = $connect->query($query);

                $demodata2 = [];
                while($row = $result->fetch_assoc())
                {

                    $appointment = new appointment($row['ID'], $row['Titel'], $row['Ort'], $row['Datum'], $row['Ablaufdatum'], $row['Auswahl1'], $row['Auswahl2'], $row['Auswahl3']);
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
    private static function putintoAppointmentDataBase($appointment)
    {

        $connect = connecttodb();
        if (!$connect) {
            error_log("Hallo im Datenbank fellgeschlagen");
            echo "Verbindung zur Datenbank fehlt.";
            return;
        }
    
        $json_data = json_decode($appointment, true);

            //Hier wird geprüft ob die einzelnen Felder leer sind oder nicht
            if ($json_data !== null) {
                $stmt = $connect->prepare("INSERT INTO appointments (Titel, Ort, Ablaufdatum, Auswahl1, Auswahl2, Auswahl3) VALUES (?, ?, ?, ?, ?, ?)");
                
                if (TRUE) {

                // Variablen für die Abfrage binden
                $stmt->bind_param("ssssss", $json_data['name'], $json_data['ort'], $json_data['ablaufdatum'], $json_data['auswahl1'], $json_data['auswahl2'], $json_data['auswahl3']);
                
                // Abfrage ausführen
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    //echo "Daten erfolgreich in die Datenbank eingefügt.";
                    return 1;
                } else {
                    echo "Fehler beim Einfügen der Daten in die Datenbank.";
                }
    
                // Abfrage schließen
                $stmt->close();

            } else {
                echo "Fehler beim Vorbereiten der Datenbankabfrage.";
            }
        } else {
            echo "Fehler beim Verarbeiten der JSON-Daten.";
        }

        $connect->close();

    }

    private static function putintoVotingDataBase($vote_in_appointment) {
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
        
        // Überprüfen, ob die JSON-Daten erfolgreich decodiert wurden
        if ($json_data !== null) {
            // Datenbankabfrage vorbereiten
            $stmt = $connect->prepare("INSERT INTO voting (Username, Termin1, Termin2, Termin3, Kommentar, Appointment_ID_FK) VALUES (?, ?, ?, ?, ?, ?)");
            
            // Überprüfen, ob die Abfrage erfolgreich vorbereitet wurde
            if (TRUE) {
    
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
        
    }

}
