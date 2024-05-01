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
