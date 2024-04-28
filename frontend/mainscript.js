//Starting point for JQuery init
$(document).ready(function () {
    $("#searchResult").hide();
    $("#btn_Search").click(function (e) {
       loaddata($("#seachfield").val());
    });
    $("#new_appointment").click(function() {
        new_appointment();
    });

    $(".list-group .list-group-item form").hide();

    
    
    // Event-Delegation für das Klicken auf Elemente mit der Klasse "list-group-item"
    $(".list-group").on("click", ".list-group-item", function(e) {
        console.log("hallo");

        // Zeige das <small>-Element innerhalb des angeklickten list-group-items an
        //VIELLEICHT COOL DAS ANGEZEIGT WIRD--WENN ER ABGESTIMMT HAT
        $(this).find("small").show();

        //$(".list-group .list-group-item small").show();

        // Formular in das overlay einfügen und anzeigen
        //$(".white-box").append($(this).find("form").show());
        $(".white-box").html($(this).find("form").clone().show());


        //$(this).find("form").show();

        $("#overlay").show();


        // Prevent event propagation to avoid immediate closing of the overlay
        e.stopPropagation();
    });

    // Close the overlay when clicking outside the white box
    $(document).on("click", function(e) {
        console.log("hallo");
        if (!$(e.target).closest('.white-box').length) {
            $('#overlay_content').empty();
            $("#overlay").hide();
        }
    });
});

function new_appointment() {
    //alert("Hallo");
    
}


function loaddata(searchterm) {

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
