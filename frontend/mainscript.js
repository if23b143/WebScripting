/////////////////////////////////////////////////////////////////////////
//////////////////////////// DOCUMENT-START /////////////////////////////
/////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
    // Delegierung des Klick-Events für den Abbruch-Button
    // FUNKTIONIERT NUR SO
    $(document).on("click", "#cancel_button", function() {
        $('#overlay_content').empty();
        $("#overlay").hide();
        console.log("Cancel Button gedrückt");
    });

    //Toggled das "New-Appointment-Form"
    $(".new_appointment").click(function() {
        new_appointment();
    });

    //Standardmäßig das "New-Appointment" hidden
    $("#appointment_create").hide();
    
    //Hier wird der Content im Appointment versteckt
    $(".list-group .list-group-item .content_from_list").hide();

    //Damit man Voten kann
    $(".voting_button").click(function() {
        show_form();
    });

    //Zeigt die Statistike(Votes, Kommentare) an UND ist standardmäßig versteckt
    $(".statistic_button").hide();
    $(".statistic_button").click(function() {
        show_statistic();
    });
    
    // Event-Delegation für das Klicken auf Elemente mit der Klasse "list-group-item"
    $(".list-group").on("click", ".list-group-item", function(event) {

        
        //Content vom Appointment wird ins Overlay gecloned
        $("#overlay_content").html($(this).find(".content_from_list").clone().show());

        //Versteckt dann das Form
        $("#overlay_content .form_from_list").hide();
        
        //Hol dir den Titel des Appointments und gib es als Overlay-Titel aus
        $('.white-box h4').text($(this).find('h5:first').text());

        //Zeig das Overlay her
        $("#overlay").show();

        // Damit schließt sich das Overlay nicht sofort
        event.stopPropagation();
    });

    // Wenn man außerhalb von dem Overlay clickt:
    $(document).on("click", function(e) {
        if (!$(e.target).closest('.white-box').length) {
            $('#overlay_content').empty();
            $("#overlay").hide();

            show_statistic();
        }
    });

    //Event wenn man den "Submit-Button" im New-Appointment click
    $('.form_from_appointment_create').on('submit', function(event) {
        event.preventDefault();
        var formData = {
            name: $('input[aria-describedby="new_appointment_name"]').val(),
            ort: $('input[aria-describedby="new_appointment_ort"]').val(),
            ablaufdatum: $('input[aria-describedby="new_appointment_date"]').val(),
            auswahl1: $('input[aria-describedby="new_appointment_select_1"]').val(),
            auswahl2: $('input[aria-describedby="new_appointment_select_2"]').val(),
            auswahl3: $('input[aria-describedby="new_appointment_select_3"]').val()
        };
        console.log(formData);
        // Führe die Funktion create_new_appointment() aus, wenn das Formular abgeschickt wird
        create_new_appointment(formData);
    });

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
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        //METHODE ÄNDERN -->JSON.stringify(formData)
        data: {method: "vote_in_appointment", param: JSON.stringify(formData)},
        dataType: "json",
        success: function (response) {
            location.reload();

        } , error: function(xhr){
            console.log("HIER IST EIN FEHLER IM VOTE APPOINTMENT");
            var errorMessage = xhr.status + ': ' + xhr.statusText;
            console.log('AJAX Error: ' + errorMessage);
        }
    });
});
    //HOLT SICH DIE DATEN AUS DER DATENBANK
    loaddata();
    
});
/////////////////////////////////////////////////////////////////////////
//////////////////////////// FUNKTIONEN /////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function cancel_Button(){
    // Event-Handler für den Abbruch-Button zuweisen
    $("#cancel_button").click(function() {
        // Overlay-Inhalt leeren und Overlay ausblenden
        $('#overlay_content').empty();
        $("#overlay").hide();
        show_statistic();
    });
}

//Wenn man das Form im Overlay sehen möchte
function show_form(){
        $(".statistic_button").show(200);
        $(".voting_button").hide(200);

        $("#overlay_content .form_from_list").show(200);
        $("#overlay_content .statistic_from_list").hide(200);
}

//Wenn man die Statistik im Overlay sehen möchte
function show_statistic(){
        $(".statistic_button").hide(200);
        $(".voting_button").show(200);
        
        $("#overlay_content .form_from_list").hide(200);
        $("#overlay_content .statistic_from_list").show(200);
}

//der toggle damit man "New-Appointment" sehen/verstecken kann
function new_appointment() {
    $("#appointment_create").toggle(300);
}

/////////////////////////////////////////////////////////////////////////
//////////////////////////// AJAX-CALLS /////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function loaddata() {
    //ajax-Call für die Daten aus Datenbank
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        //METHODE ÄNDERN
        data: {method: "queryAppointments", param: 0},
        dataType: "json",
        success: function (response) {
            response[0].appointment.forEach(element => {
            
            const ablaufdatum = new Date(element.ablaufdatum);
            const currentDate = new Date();
                    
            // Check ob das Datum nach unserem Datum ist
            if (ablaufdatum < currentDate) {
            // Wenn das AblaufDatum "kleiner" ist, dann erstelle KEIN Form
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
            //Wenn das Ablaufdatum nicht erreicht ist, erstelle ein Form
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
            
            
            //Die Kommentare und Voting-Ergebnisse
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

function create_new_appointment(Data){
    $.ajax({
        type: "GET",
        url: "../backend/serviceHandler.php",
        cache: false,
        async: true, // Setze async auf true
        //METHODE ÄNDERN
        data: {method: "create_new_appointment", param: JSON.stringify(Data)},
        dataType: "json",
        success: function (response) {
           location.reload();



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
            location.reload();


        } , error: function(){
            console.log("HIER IST EIN FEHLER IM VOTE APPOINTMENT");
            var errorMessage = xhr.status + ': ' + xhr.statusText;
            console.log('AJAX Error: ' + errorMessage);
        }
    });
}
