/////////////////////////////////////////////////////////////////////////
//////////////////////////// DOCUMENT-START /////////////////////////////
/////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
    $("#searchResult").hide();
    
    
   
    
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

    loaddata();
    
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
        data: {method: "queryPersons", param: 0},
        dataType: "json",
        success: function (response) {
            //RESPONSE AUF UNSER PROJEKT ÄNDERN
            $("#noOfentries").val(response.length);
            $("#searchResult").show(1000).delay(1000).hide(1000);


            
            
            


            // Das kopierte Element am Ende der .list-group anhängen
            //$('.list-group').append($('.list-group').children().first().clone());

            ///////////////CHANGE THIS --> CHATGPT HAT EINE LÖSUNG --> NICHT SO GUT ABER
            for (var i = 0; i < 3; i++) {
                $('.appointment-group').append(
                    
                '<a class="list-group-item list-group-item-action" aria-current="true">' +
                    '<div class="d-flex w-100 justify-content-between">' +
                        '<h5 class="mb-1">PROBE-AJAX</h5>' +
                        '<small>bis <strong>22.10.2024</strong></small>' +
                    '</div>' +
                    '<p class="mb-1">von <strong>Alex</strong> </p>' +
                    '<div class="content_from_list">' +

                        '<div class="statistic_from_list">' +
                            '<ul class="list-group list-group-horizontal">' +
                                '<li class="list-group-item list-group-item-dark">Ort</li>' +
                                '<li class="list-group-item flex-grow-1">Wien</li>' +
                            '</ul>' +
                            
                            '<br>' +
                            '<h5>Abstimmung:</h5>' +
                            '<ol class="list-group list-group-numbered">' +
                                '<li class="list-group-item d-flex justify-content-between align-items-start">' +
                                    '<div class="fw-bold ms-2 me-auto">12:00 - 12:30</div>' +
                                    '<span class="badge bg-primary rounded-pill">4 Vote</span>' +
                                '</li>' +
                                '<li class="list-group-item d-flex justify-content-between align-items-start">' +
                                    '<div class="fw-bold ms-2 me-auto">13:00 - 14:00</div>' +
                                    '<span class="badge bg-primary rounded-pill">1 Vote</span>' +
                                '</li>' +
                                '<li class="list-group-item d-flex justify-content-between align-items-start">' +
                                    '<div class="fw-bold ms-2 me-auto">15:00 - 16:00</div>' +
                                    '<span class="badge bg-primary rounded-pill">14 Vote</span>' +
                                '</li>' +
                            '</ol>' +
                            '<br>' +

                            '<h5>Kommentare:</h5>' +
                            '<ul class="list-group list-group-horizontal">' +
                                '<li class="list-group-item list-group-item-dark">Alex</li>' +
                                '<li class="list-group-item flex-grow-1">Ein tolles Meeting!</li>' + 
                            '</ul>' +
                        '</div>' +
                        
                        '<form class="form_from_list">' +
                                '<div class="input-group mb-3">' +
                                    '<span class="input-group-text" id="basic-addon1">Name</span>' +
                                    '<input type="text" class="form-control" placeholder="zB.: Max Mustermann" aria-label="Username" aria-describedby="basic-addon1">' +
                                '</div>' +
                                '<h5>Termine</h5>' +
                                '<div class="form-check">' +
                                    '<input type="checkbox" class="form-check-input" value="" id="exampleCheck1">' +
                                    '<label class="form-check-label" for="exampleCheck1">12:00 - 12:30</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input type="checkbox" class="form-check-input" value="" id="exampleCheck2">' +
                                    '<label class="form-check-label" for="exampleCheck2">13:00 - 14:00</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input type="checkbox" class="form-check-input" value="" id="exampleCheck3">' +
                                    '<label class="form-check-label" for="exampleCheck3">15:00 - 16:00</label>' +
                                '</div>' +
                                '<div class="mb-3">' +
                                    '<label for="exampleFormControlTextarea1" class="form-label"><h5>Kommentare</h5></label>' +
                                    '<textarea class="form-control form-control-sm" id="exampleFormControlTextarea1" rows="3"></textarea>' +
                                '</div>' +
                                '<button type="submit" class="btn btn-primary">Submit</button>' +
                                '<button type="button" class="btn btn-outline-danger" id="cancel_button">Cancel</button>' +
                            '</form>' +
                    '</div>' +
                '</a>');
            }

            $(".list-group .list-group-item .content_from_list").hide();

        } , error: function(){
            console.log("HIER IST EIN FEHLER");
        }
    });
}
