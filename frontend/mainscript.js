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

    $('.form_from_appointment_create').submit(function(event) {
       
    
        // Führe die Funktion create_new_appointment() aus, wenn das Formular abgeschickt wird
        create_new_appointment();
    });
    /*
    $('.form_from_list').submit(function(event) {
        //event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seite neu laden)
    
        // Führe die Funktion create_new_appointment() aus, wenn das Formular abgeschickt wird
        var formData = {
            name: $('#form_voting_name').val(), // Name
            // Beispiel: Hier die Annahme, dass die Termine als Checkboxen mit den IDs "form_voting_Check1", "form_voting_Check2", "form_voting_Check3" existieren
            termin1: $('#form_voting_Check1').prop('checked'), // Termin 1
            termin2: $('#form_voting_Check2').prop('checked'), // Termin 2
            termin3: $('#form_voting_Check3').prop('checked'), // Termin 3
            kommentar: $('#exampleFormControlTextarea1').val() // Kommentar
        };
    
    
        // Führe die Funktion create_new_appointment() aus und übergebe die Formulardaten
        vote_in_appointment(formData);
    }); */

    // Event-Handler für das Absenden des Formulars innerhalb der Liste
    $('#overlay_content').on('submit', '.form_from_list', function(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    // Extrahiere die Daten aus dem Formular
    var formData = {
        name: $(this).find('input[type="text"]').val(),
        auswahl1: $(this).find('#from_voting_Check1').prop('checked'),
        auswahl2: $(this).find('#form_voting_Check2').prop('checked'),
        auswahl3: $(this).find('#form_voting_Check3').prop('checked'),
        kommentare: $(this).find('textarea').val(),
        Appointment_FK: $(this).parent().attr('id')
       
    };
    
    console.log($('.form_from_list').parent().attr('id'));
    //console.log(formData);
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        //METHODE ÄNDERN -->JSON.stringify(formData)
        data: {method: "vote_in_appointment", param: JSON.stringify(formData)},
        dataType: "json",
        success: function (response) {
            //RESPONSE AUF UNSER PROJEKT ÄNDERN
            //alert("VOTE APPOINTMENT FUNKTIONIERT");
            //console.log(response);
            location.reload();



        } , error: function(xhr){
            console.log("HIER IST EIN FEHLER IM VOTE APPOINTMENT");
            var errorMessage = xhr.status + ': ' + xhr.statusText;
            console.log('AJAX Error: ' + errorMessage);
        }
    });
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
        data: {method: "queryAppointments", param: 0},
        dataType: "json",
        success: function (response) {
            //RESPONSE AUF UNSER PROJEKT ÄNDERN
            $("#noOfentries").val(response.length);
            $("#searchResult").show(1000).delay(1000).hide(1000);


            console.log(response);
            //console.log(response[0][0].ort);

            


            // Das kopierte Element am Ende der .list-group anhängen
            //$('.list-group').append($('.list-group').children().first().clone());

            ///////////////CHANGE THIS --> CHATGPT HAT EINE LÖSUNG --> NICHT SO GUT ABER
           response[0].appointment.forEach(element => {
             //for (var i = 0; i < 2; i++) {
                // Parse the ablaufdatum string to a Date object
            const ablaufdatum = new Date(element.ablaufdatum);
            const currentDate = new Date();
                    //console.log('#' + element.id + ' .form_from_list');
            // Check if the ablaufdatum is before the current date
    if (ablaufdatum < currentDate) {
        // If ablaufdatum is in the past, remove the form
        $('.appointment-group').append(
                    
            '<a class="list-group-item list-group-item-action list-group-item-danger" aria-current="true">' +
                '<div class="d-flex w-100 justify-content-between">' +
                    '<h5 class="mb-1">' + element.titel +'</h5>' +
                    '<small>bis <strong>' + element.ablaufdatum +'</strong></small>' +
                '</div>' +
                
                '<div class="content_from_list" id="' + element.id + '">' +

                    '<div class="statistic_from_list">' +
                        '<ul class="list-group list-group-horizontal">' +
                            '<li class="list-group-item list-group-item-dark">Ort</li>' +
                            '<li class="list-group-item flex-grow-1">'+ element.ort +'</li>' +
                        '</ul>' +
                        
                        '<br>' +
                        '<h5>Abstimmung:</h5>' +
                        '<ol class="list-group list-group-numbered">' +
                            '<li class="list-group-item d-flex justify-content-between align-items-start">' +
                                '<div class="fw-bold ms-2 me-auto">' + element.Auswahl1 + '</div>' +
                                '<span class="badge bg-primary rounded-pill voting1">0 Vote</span>' +
                            '</li>' +
                            '<li class="list-group-item d-flex justify-content-between align-items-start">' +
                                '<div class="fw-bold ms-2 me-auto">' + element.Auswahl2 + '</div>' +
                                '<span class="badge bg-primary rounded-pill voting2">0 Vote</span>' +
                            '</li>' +
                            '<li class="list-group-item d-flex justify-content-between align-items-start">' +
                                '<div class="fw-bold ms-2 me-auto">' + element.Auswahl3 + '</div>' +
                                '<span class="badge bg-primary rounded-pill voting3">0 Vote</span>' +
                            '</li>' +
                        '</ol>' +
                        '<br>' +

                        '<h5>Kommentare:</h5>' +
                        '<div class="kommentare">' + 
                        '<ul class="list-group list-group-horizontal">' +
                            
                        '</ul>' +
                        '</div>' +
                        
                    '</div>' +
                    '<form class="form_from_list">' +
                    '<h5> Sorry das Voting ist zu Ende </h5>' +
                    '</form>' +
                    '</div>' +
                '</a>');
    } else {
          
                $('.appointment-group').append(
                    
                '<a class="list-group-item list-group-item-action" aria-current="true">' +
                    '<div class="d-flex w-100 justify-content-between">' +
                        '<h5 class="mb-1">' + element.titel +'</h5>' +
                        '<small>bis <strong>' + element.ablaufdatum +'</strong></small>' +
                    '</div>' +
                    
                    '<div class="content_from_list" id="' + element.id + '">' +

                        '<div class="statistic_from_list">' +
                            '<ul class="list-group list-group-horizontal">' +
                                '<li class="list-group-item list-group-item-dark">Ort</li>' +
                                '<li class="list-group-item flex-grow-1">'+ element.ort +'</li>' +
                            '</ul>' +
                            
                            '<br>' +
                            '<h5>Abstimmung:</h5>' +
                            '<ol class="list-group list-group-numbered">' +
                                '<li class="list-group-item d-flex justify-content-between align-items-start">' +
                                    '<div class="fw-bold ms-2 me-auto">' + element.Auswahl1 + '</div>' +
                                    '<span class="badge bg-primary rounded-pill voting1">0 Vote</span>' +
                                '</li>' +
                                '<li class="list-group-item d-flex justify-content-between align-items-start">' +
                                    '<div class="fw-bold ms-2 me-auto">' + element.Auswahl2 + '</div>' +
                                    '<span class="badge bg-primary rounded-pill voting2">0 Vote</span>' +
                                '</li>' +
                                '<li class="list-group-item d-flex justify-content-between align-items-start">' +
                                    '<div class="fw-bold ms-2 me-auto">' + element.Auswahl3 + '</div>' +
                                    '<span class="badge bg-primary rounded-pill voting3">0 Vote</span>' +
                                '</li>' +
                            '</ol>' +
                            '<br>' +

                            '<h5>Kommentare:</h5>' +
                            '<div class="kommentare">' + 
                            '<ul class="list-group list-group-horizontal">' +
                                
                            '</ul>' +
                            '</div>' +
                            
                        '</div>' +

                        '<form class="form_from_list" method="GET">' +
                                '<div class="input-group mb-3">' +
                                    '<span class="input-group-text" id="form_voting_name">Name</span>' +
                                    '<input type="text" class="form-control" placeholder="zB.: Max Mustermann" aria-label="Username" aria-describedby="basic-addon1">' +
                                '</div>' +
                                '<h5>Termine</h5>' +
                                '<div class="form-check">' +
                                    '<input type="checkbox" class="form-check-input" value="" id="from_voting_Check1">' +
                                    '<label class="form-check-label" for="from_voting_Check1">' + element.Auswahl1 + '</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input type="checkbox" class="form-check-input" value="" id="form_voting_Check2">' +
                                    '<label class="form-check-label" for="from_voting_Check2">' + element.Auswahl2 + '</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input type="checkbox" class="form-check-input" value="" id="form_voting_Check3">' +
                                    '<label class="form-check-label" for="form_voting_Check3">' + element.Auswahl3 + '</label>' +
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
            });
            
            /*
            response[0].voting.forEach(votingElement => {
                // Finde das entsprechende HTML-Element anhand der ID
                let appointmentElement = $('#' + votingElement.Appointment_ID_FK);
            
                // Überprüfe, ob das HTML-Element gefunden wurde
                if (appointmentElement.length > 0) {
                    // Füge die Kommentare und den Benutzernamen hinzu
                    appointmentElement.find('.kommentare').append(
                        '<ul class="list-group list-group-horizontal">' +
                            '<li class="list-group-item list-group-item-dark">' + votingElement.Username + '</li>' +
                            '<li class="list-group-item flex-grow-1">' + votingElement.Kommentar + '</li>' +
                        '</ul>'
                    );
                }
            }); 

            let votingCounts = {
                voting1: 0,
                voting2: 0,
                voting3: 0
            };
            
            // Zähle die Votes für jeden Termin
            response[0].voting.forEach(votingElement => {
                if (votingElement.Termin1 == 1) {
                    votingCounts.voting1++;
                    //console.log("Voting1:"+votingCounts.voting1)
                }
                if (votingElement.Termin2 == 1) {
                    votingCounts.voting2++;
                }
                if (votingElement.Termin3 == 1) {
                    votingCounts.voting3++;
                }
            
                // Finde das entsprechende HTML-Element anhand der ID
                let appointmentElement = $('#' + votingElement.Appointment_ID_FK);
            
                // Überprüfe, ob das HTML-Element gefunden wurde
                if (appointmentElement.length > 0) {
                    // Füge die Kommentare und den Benutzernamen hinzu
                    appointmentElement.find('.kommentare').append(
                        '<ul class="list-group list-group-horizontal">' +
                            '<li class="list-group-item list-group-item-dark">' + votingElement.Username + '</li>' +
                            '<li class="list-group-item flex-grow-1">' + votingElement.Kommentar + '</li>' +
                        '</ul>'
                    );
                }
            });
            //console.log(votingCounts.voting1)
            // Aktualisiere die Anzahl der Votes in der HTML-Ansicht 
            
            $('.voting1').text(votingCounts.voting1 + ' Vote');
            $('.voting2').text(votingCounts.voting2 + ' Vote');
            $('.voting3').text(votingCounts.voting3 + ' Vote'); 

            
            
            response[0].voting.forEach(votingElement => {
                if (votingElement.Termin1 == 1) {
                    
                    let appointmentElement = $('#' + votingElement.Appointment_ID_FK);
                    console.log("appointmentElement:" + votingElement.Appointment_ID_FK);
                    if (appointmentElement.hasClass('content_from_list')) {
                        console.log("BIN HIER");
                        votingCounts.voting1++;
                    }
                }
                if (votingElement.Termin2 == 1) {
                    let appointmentElement = $('#' + votingElement.Appointment_ID_FK);
                    if (appointmentElement.hasClass('content_from_list')) {
                        votingCounts.voting2++;
                    }
                }
                if (votingElement.Termin3 == 1) {
                    let appointmentElement = $('#' + votingElement.Appointment_ID_FK);
                    if (appointmentElement.hasClass('content_from_list')) {
                        votingCounts.voting3++;
                    }
                }
            
                // Finde das entsprechende HTML-Element anhand der ID
                let appointmentElement = $('#' + votingElement.Appointment_ID_FK);
            
                // Überprüfe, ob das HTML-Element gefunden wurde
                if (appointmentElement.length > 0) {
                    // Füge die Kommentare und den Benutzernamen hinzu
                    appointmentElement.find('.kommentare').append(
                        '<ul class="list-group list-group-horizontal">' +
                            '<li class="list-group-item list-group-item-dark">' + votingElement.Username + '</li>' +
                            '<li class="list-group-item flex-grow-1">' + votingElement.Kommentar + '</li>' +
                        '</ul>'
                    );
                }
            });
            
            // Aktualisiere die Anzahl der Votes in der HTML-Ansicht
            $('.voting1').text(votingCounts.voting1 + ' Vote');
            $('.voting2').text(votingCounts.voting2 + ' Vote');
            $('.voting3').text(votingCounts.voting3 + ' Vote'); */

            let votingCounts = {
                voting1: 0,
                voting2: 0,
                voting3: 0
            };
            
            
            response[0].voting.forEach(votingElement => {
                let appointmentElement = $('#' + votingElement.Appointment_ID_FK + '.content_from_list');
            
                if (votingElement.Termin1 == 1 && appointmentElement.length > 0) {
                    let voting2Element = appointmentElement.find('.voting1');
                    let currentVotes = parseInt(voting2Element.text());
                    voting2Element.text((currentVotes + 1) + ' Vote');
                }
                if (votingElement.Termin2 == 1 && appointmentElement.length > 0) {
                    let voting2Element = appointmentElement.find('.voting2');
                    let currentVotes = parseInt(voting2Element.text());
                    voting2Element.text((currentVotes + 1) + ' Vote');
                }
                if (votingElement.Termin3 == 1 && appointmentElement.length > 0) {
                    let voting2Element = appointmentElement.find('.voting3');
                    let currentVotes = parseInt(voting2Element.text());
                    voting2Element.text((currentVotes + 1) + ' Vote');
                }
            
                // Überprüfe, ob das HTML-Element gefunden wurde und ob die Klasse content_from_class vorhanden ist
                if (appointmentElement.length > 0) {
                    // Füge die Kommentare und den Benutzernamen hinzu
                    appointmentElement.find('.kommentare').append(
                        '<ul class="list-group list-group-horizontal">' +
                            '<li class="list-group-item list-group-item-dark">' + votingElement.Username + '</li>' +
                            '<li class="list-group-item flex-grow-1">' + votingElement.Kommentar + '</li>' +
                        '</ul>'
                    );
            
                   
                    
                }


            });
            

            $(".list-group .list-group-item .content_from_list").hide();

        } , error: function(xhr){
            console.log("HIER IST EIN FEHLER");
            var errorMessage = xhr.status + ': ' + xhr.statusText;
            console.log('AJAX Error: ' + errorMessage);
        }
    });
}

function create_new_appointment(){
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        async: true, // Setze async auf true
        //METHODE ÄNDERN
        data: {method: "create_new_appointment", param: 0},
        dataType: "json",
        success: function (response) {
            //RESPONSE AUF UNSER PROJEKT ÄNDERN
           console.log("CREATE APPOINTMENT FUNKTIONIERT");




        } , error: function(){
            console.log("HIER IST EIN FEHLER IM CREATE APPOINTMENT");
        }
    });
}

function vote_in_appointment(formData){
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        //METHODE ÄNDERN -->JSON.stringify(formData)
        data: {method: "vote_in_appointment", param: formData},
        dataType: "json",
        success: function (response) {
            //RESPONSE AUF UNSER PROJEKT ÄNDERN
            //alert("VOTE APPOINTMENT FUNKTIONIERT");
            //console.log(response);
            location.reload();


        } , error: function(){
            console.log("HIER IST EIN FEHLER IM VOTE APPOINTMENT");
            var errorMessage = xhr.status + ': ' + xhr.statusText;
            console.log('AJAX Error: ' + errorMessage);
        }
    });
}
