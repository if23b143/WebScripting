<?php
    
function connecttodb(){

  $host = "localhost";
  $user = "bif2webscriptinguser";
  $password = "bif2021";
  $database = "webprojekt";


    $db_obj = new mysqli($host, $user, $password, $database);
    if ($db_obj->connect_error) {
      echo "Connection Error: " . $db_obj->connect_error;
     exit();
    }

}   
?>