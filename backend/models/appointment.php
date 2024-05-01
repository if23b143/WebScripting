<?php
class appointment {
    public $id;
    public $titel;
    public $ort;
    public $datum;
    public $ablaufdatum;
    public $Auswahl1;
    public $Auswahl2;
    public $Auswahl3;
    

    function __construct($id, $titel, $ort, $datum, $ablaufdatum, $Auswahl1, $Auswahl2, $Auswahl3) {
        $this->id = $id;
        $this->titel = $titel;
        $this->ort = $ort;
        $this->datum = $datum;
        $this->ablaufdatum = $ablaufdatum;
        $this->Auswahl1 = $Auswahl1;
        $this->Auswahl2 = $Auswahl2;
        $this->Auswahl3 = $Auswahl3;

      }
}

class voting {
  public $voting_id;
  public $Username;
  public $Termin1;
  public $Termin2;
  public $Termin3;
  public $Kommentar;
  public $Appointment_ID_FK;

  function __construct($voting_id, $Username, $Termin1, $Termin2, $Termin3, $Kommentar, $Appointment_ID_FK) {
      $this->voting_id = $voting_id;
      $this->Username = $Username;
      $this->Termin1 = $Termin1;
      $this->Termin2 = $Termin2;
      $this->Termin3 = $Termin3;
      $this->Kommentar = $Kommentar;
      $this->Appointment_ID_FK = $Appointment_ID_FK;
      
    }
}
