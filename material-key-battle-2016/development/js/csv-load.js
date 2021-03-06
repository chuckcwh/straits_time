$(document).ready(function(){

    var csvUrl = "battle_csv/content.csv";
    var imageUrl = "images/battle-image/";


//    retrieve data from csv using jquery-csv plugin
    $.ajax({
        url: csvUrl,
        async: false,
        dataType: "text",
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
            createDataSets(data);
        },
    })

//    create data sets
    function createDataSets(data) {
        for (i=1; i<data.length; i++) {
            var checkImg = data[i][0].indexOf("img");
            var ifEmpty = $.trim(data[i][1]);
            if (checkImg > 0 && ifEmpty != "") {
                $(".csv-" + data[i][0]).attr("data-original", imageUrl + data[i][1]);
            } else {
                $(".csv-" + data[i][0]).html(data[i][1]);
            }
        }
        $('.headline-appear').addClass('appear');

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

        $(".csv-lookup2").each(function() {
            var ifEmpty = $(this).find(".csv-checkIfEmpty2").html().trim();
            if (ifEmpty == "") {
                $(this).hide();
            }
        });
    }

//    toggle key battles slideup/slidedown
    $('.accordion-arrow').on('click', function(e) {
        e.preventDefault();
        var section = $(this).parent();
        if (!section.hasClass('clicked') && ($('.battle-division').hasClass('clicked'))) {
            $('.battle-division').removeClass('clicked');
            section.addClass('clicked');
        } else {
            section.toggleClass('clicked');
        }
    });


//    lazyload image with fadein effect
    $('img.lazy').lazyload({
        effect: "fadeIn"
    })

});