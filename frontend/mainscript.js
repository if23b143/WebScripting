/////////////////////////////////////////////////////////////////////////
//////////////////////////// DOCUMENT-START /////////////////////////////
/////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
    $("#searchResult").hide();
    $("#btn_Search").click(function (e) {
       loaddata();
    });
   
    
    // Delegierung des Klick-Events für den Abbruch-Button
    // FUNKTIONIERT NUR SO
    $(document).on("click", "#cancel_button", function() {
        $('#overlay_content').empty();
        $("#overlay").hide();
        console.log("Cancel Button gedrückt");
    });

    $(".new_appointment").click(function() {
        new_appointment();
    });
    $("#appointment_create").hide();
    
    $(".list-group .list-group-item .content_from_list").hide();

    $(".voting_button").click(function() {
        show_form();
    });

    $(".statistic_button").hide();
    $(".statistic_button").click(function() {
        show_statistic();
    });
    
    // Event-Delegation für das Klicken auf Elemente mit der Klasse "list-group-item"
    $(".list-group").on("click", ".list-group-item", function(e) {
        //console.log("hallo");

        // Zeige das <small>-Element innerhalb des angeklickten list-group-items an
        //VIELLEICHT COOL DAS ANGEZEIGT WIRD--WENN ER ABGESTIMMT HAT
        //$(this).find("small").show();

        //$(".list-group .list-group-item small").show();

        // Formular in das overlay einfügen und anzeigen
        //$(".white-box").append($(this).find("form").show());
        $("#overlay_content").html($(this).find(".content_from_list").clone().show());

        $("#overlay_content .form_from_list").hide();
        //$(this).find("form").show();
        
        $('.white-box h4').text($(this).find('h5:first').text());

        $("#overlay").show();


        

        //HIER KOMMT EINE ABFRAGE --> IF --> WENN DAS ABLAUFDATUM ERREICHT IST
        //DIE ABFRAGE KANN ERST GEMACHT WERDEN, WENN BACKEND FERTIG
        //LÄSST ENTWEDER DEN BUTTON VERSCHWINDEN
        //ODER MACHT DAS FORM WEG --> BUTTON FÜHRT ZU EINEM "Sorry kein Voting möglich"


        // Prevent event propagation to avoid immediate closing of the overlay
        e.stopPropagation();
    });

    // Close the overlay when clicking outside the white box
    $(document).on("click", function(e) {
        //console.log("hallo");
        if (!$(e.target).closest('.white-box').length) {
            $('#overlay_content').empty();
            $("#overlay").hide();

            show_statistic();
        }
    });
});
/////////////////////////////////////////////////////////////////////////
//////////////////////////// FUNKTIONEN /////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function cancel_Button(){
    // Event-Handler für den Abbruch-Button zuweisen
    $("#cancel_button").click(function() {
        // Overlay-Inhalt leeren und Overlay ausblenden
        console.log("DIES IST EIN TEST 2")
        $('#overlay_content').empty();
        $("#overlay").hide();
        //FIX DAS NOCH --> GIB ES IN EINE EIGENE FUNKTION
        show_statistic();
    });
}

function show_form(){
        $(".statistic_button").show(200);
        $(".voting_button").hide(200);

        $("#overlay_content .form_from_list").show(200);
        $("#overlay_content .statistic_from_list").hide(200);
}

function show_statistic(){
        $(".statistic_button").hide(200);
        $(".voting_button").show(200);
        
        $("#overlay_content .form_from_list").hide(200);
        $("#overlay_content .statistic_from_list").show(200);
}

function new_appointment() {
    //alert("Hallo");
    $("#appointment_create").toggle(300);
}

/////////////////////////////////////////////////////////////////////////
//////////////////////////// AJAX-CALLS /////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function loaddata() {

    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        //METHODE ÄNDERN
        data: {method: "queryPersons", param: searchterm},
        dataType: "json",
        success: function (response) {
            //RESPONSE AUF UNSER PROJEKT ÄNDERN
            $("#noOfentries").val(response.length);
            $("#searchResult").show(1000).delay(1000).hide(1000);
        }
    });
}
