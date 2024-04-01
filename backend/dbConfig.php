<?php
    //MUSS GEÄNDERT
    $host = "localhost";
    $user = "hotel_user";
    $password = "passwort";
    $database = "hotel";


    $db_obj = new mysqli($host, $user, $password, $database);
    if ($db_obj->connect_error) {
      echo "Connection Error: " . $db_obj->connect_error;
     exit();
    }
?>