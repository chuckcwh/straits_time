$(document).ready(function(){

    var csvUrl = "battle_data/content.csv";
    var imageUrl = "images/battle-image/";


//    retrieve data from csv using jquery-csv plugin
    $.ajax({
        url: csvUrl,
        async: false,
        dataType: "text",
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
            createDataSets(data);
            console.log(data);
        },
    })

//    create data sets
    function createDataSets(data) {
        for (i=1; i<data.length; i++) {
            var checkImg = data[i][0].indexOf("img");
            if (checkImg > 0) {
                $(".csv-" + data[i][0]).attr("src", imageUrl + data[i][1]);
            } else {
                $(".csv-" + data[i][0]).html(data[i][1]);
            }
        }
        removeCardIfEmpty();
    };

//    remove the card if no data
    function removeCardIfEmpty() {
        $(".csv-lookup").each(function() {
            var ifEmpty = $.trim($(this).find(".csv-checkIfEmpty").html());
            if (ifEmpty == "") {
                $(this).hide();
            }
        });

//        $(".csv-lookup2").each(function() {
//            var ifEmpty = $(this).find(".csv-checkIfEmpty2").html().trim();
//            if (ifEmpty == "") {
//                $(this).hide();
//            }
//        });
    }
});