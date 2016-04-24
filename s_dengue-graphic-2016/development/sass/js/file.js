var map_leaflet;
var distance_perimeter = 1000;
var st_circle_perimeter;
var url_marker_svg_red = "images/icon-marker-red.svg";
var url_marker_svg_yellow = "images/icon-marker-yellow.svg";
var url_marker_svg_selected = "images/icon-marker-selected.svg";
var marker_flag_selected;
var marker_selected;

var a_markers = [];
var t_card = "<div class='st-card' id='pos_[ST-POSITION-ID]'><div class='row_card'>";
// t_card += "<div class='label_card'>CHILDCARE</div>";
t_card += "<div class='label_card'> Location</div>";
t_card += "<div class='description_card'>[ST-LOCATION]</div>"
t_card += "</div>";
t_card += "<div class='row_card'>";
t_card += "<div class='label_card'> No. of cases</div>";
t_card += "<div class='description_card'>[ST-NO-CASES]</div>";
t_card += "</div>";
t_card += "<div class='row_card'>";
t_card += "<div class='label_card'> Cases since start of cluster </div>";
t_card += "<div class='description_card'>[ST-CLUSTER-START]</div>";
t_card += "</div>";
t_card += "<div class='row_card'>";
t_card += "<div class='label_card'> Cases with onset in last 2 weeks </div>";
t_card += "<div class='description_card'> [ST-CLUSTER-LAST-TWOWEEKS] </div>";
t_card += "</div></div>";

var LeafIcon = L.Icon.extend({
    options: {
        //shadowUrl: 'js/images/marker-shadow.png',
        iconSize: [25, 31],
        shadowSize: [50, 64],
        iconAnchor: [12, 27],
        shadowAnchor: [4, 62],
        popupAnchor: [0, 0]
    }
});

var o_colors_bullet = {
    2016: "rgb(31, 95, 112)",
    2015: "rgb(0, 129, 198)",
    2014: "rgb(204, 0, 51)"
};

$(function() {
    var a_data_csv = [];

    var url_csv_data_dengue = "csv/file_data_dengue.csv";
    // var url_csv_data_dengue = "http://localhost/graphics/csv/get-data-dengue-csv";
    // var url_csv_data_dengue = "http://52.74.240.184/graphics/csv/get-data-dengue-csv";
    // var url_csv_data_dengue="http://graphics.straitstimes.com/csv/get-data-dengue-csv";

    var url_csv_data_historical_week_dengue = "csv/file_historical_week_dengue.csv";
    // var url_csv_data_historical_week_dengue = "http://localhost/graphics/csv/get-data-historical-week-dengue-csv";
    // var url_csv_data_historical_week_dengue = "http://52.74.240.184/graphics/csv/get-data-historical-week-dengue-csv";
    // var url_csv_data_historical_week_dengue="http://graphics.straitstimes.com/csv/get-data-historical-week-dengue-csv";

    var url_csv_data_historical_accumulative_dengue = "csv/file_historical_accumulative_dengue.csv";
    // var url_csv_data_historical_accumulative_dengue = "http://localhost/graphics/csv/get-data-historical-accumulative-dengue-csv";
    // var url_csv_data_historical_accumulative_dengue = "http://52.74.240.184/graphics/csv/get-data-historical-accumulative-dengue-csv";
    // var url_csv_data_historical_accumulative_dengue="http://graphics.straitstimes.com/csv/get-data-historical-accumulative-dengue-csv";




    var url_tiles = "https://{s}.tiles.mapbox.com/v4/{user_id}/{z}/{x}/{y}.png?access_token={token}"

    var definition_layer1 = new L.TileLayer(url_tiles, {
        // continuousWorld: true,
        attribution: "CartoDB",
        // subdomains: "1234",
        token: "pk.eyJ1IjoiY2hhY2hvcGF6b3MiLCJhIjoib2w2VmRlOCJ9.0oe-BndrfdhOBtI-4mzMeQ",
        user_id: "chachopazos.2ffaa71c"
    });

    map_leaflet = new L.Map("map-dengue", {
        center: [1.360270, 103.831959],
        zoom: 12,
        // maxZoom: 16,
    });
    map_leaflet.scrollWheelZoom.disable();
    map_leaflet.addLayer(definition_layer1);
    L.Icon.Default.imagePath = "images";


    var controlSearch = new L.Control.Search({
        container: 'control-search-out',
        sourceData: googleGeocoding,
        formatData: formatJSON,

        markerLocation: false,
        circleLocation: true,
        autoType: false,
        // autoCollapse: true,
        zoom: 15,
        textPlaceholder: "eg. 1000 Toa Payoh or 318994",
        collapsed: false,

        // layer: electoral_division,
        initial: false,
        minLength: 2,
        // position: 'topright'
    });

    controlSearch.on("search_locationfound", function(e) {
        if (st_circle_perimeter !== undefined) map_leaflet.removeLayer(st_circle_perimeter);
        if (marker_selected !== undefined) map_leaflet.removeLayer(marker_selected);

        st_circle_perimeter = L.circle(e.latlng, distance_perimeter, {
            stroke: false,
            fillColor: '#5A9DDC'
        }).addTo(map_leaflet);

        var number_markers_filters = 0;
        a_markers.forEach(function(d) {
            var distance_meters = e.latlng.distanceTo(d.marker._latlng);
            if (d.is_visible === 0) {
                map_leaflet.addLayer(d.marker);
                d.is_visible = 1;
                $("#pos_" + d.pos).show();
            }
            if (distance_meters > distance_perimeter) {
                $("#pos_" + d.pos).hide();
                map_leaflet.removeLayer(d.marker);
                d.is_visible = 0;
            } else {
                number_markers_filters++;
            }
        });
        $(".numer-search-out").html(number_markers_filters);
        if (controlSearch._markerLoc._circleLoc._map === null) {
            console.log("null");
            map_leaflet.addLayer(controlSearch._markerLoc._circleLoc);
        }
    });
    map_leaflet.addControl(controlSearch);



    d3.csv(url_csv_data_dengue, function(error, data) {
        if (!error) {
            a_data_csv = data;
            window.onload = main(a_data_csv);
        }
    });

    d3.csv(url_csv_data_historical_accumulative_dengue, function(error, data) {
        if (!error) {
            a_data_accumulative_csv = data;
            window.onload = process_accumulative(a_data_accumulative_csv);
        }
    });
    d3.csv(url_csv_data_historical_week_dengue, function(error, data) {
        if (!error) {
            a_data_week_csv = data;
            window.onload = process_week(a_data_week_csv);
        }
    });

    $(".content-cards").on('mouseover', '.st-card', function() {
        var pos = parseInt($(this).attr('id').split('pos_')[1]);
        if (marker_flag_selected !== pos) {
            a_markers.forEach(function(d) {
                if (pos === d.pos) {
                    marker_flag_selected = pos;
                    $('.content-cards').stop(true, false);
                    $(".st-card").removeClass('st-highlighter');
                    if (marker_selected !== undefined) map_leaflet.removeLayer(marker_selected);
                    map_leaflet.setView(d.marker._latlng, 13);
                    // map_leaflet.setView(d.marker._latlng);
                    action_mouseover(d, 0);
                }
            });
        }
    });

    $(".search-cancel").on("click", function() {
        $('.content-cards').stop(true, false);
        $(".st-card").show();
        $(".st-card").removeClass('st-highlighter');
        $(".numer-search-out").html(a_markers.length);
        if (marker_selected !== undefined) map_leaflet.removeLayer(marker_selected);
        if (st_circle_perimeter !== undefined) map_leaflet.removeLayer(st_circle_perimeter);

        map_leaflet.removeLayer(controlSearch._markerLoc._circleLoc);
        a_markers.forEach(function(d) {
            if (d.is_visible === 0) {
                map_leaflet.addLayer(d.marker);
            }
        });
    });
});

$(window).on("resize", function() {
    map_leaflet.invalidateSize();
});

function process_accumulative(a_data) {
    var a_keys = getkeys(a_data[0]);
    var a_work = order_by_week(a_data);
    var a_data_g = get_array_order_highcharts(a_work, a_keys);

    chart = new Highcharts.Chart({
        credits: false,
        chart: {
            renderTo: 'graphic-historical-accumulative-dengue',
            type: 'line',
            zoomType: 'x',
        },
        title: {
            text: 'Cumulative Growth',
            align: 'left',
            x: 70,
        },
        plotOptions: {
            series: {
                shadow: false,
                marker: {
                    states: {
                        hover: {
                            radiusPlus: 2,
                            lineColor: '#fff',
                            lineWidth: 0
                        }
                    }
                }
            },
            line:{
                states:{
                    hover:{
                        lineWidth:2,
                    }
                }
            }
        },
        subtitle: {
            text: ''
        },
        legend: {
            layout: 'horizontal',
            verticalAlign: 'top',
            y: 25
        },

        yAxis: {
            min: 0,
            title: {
                text: 'Number of Cases'
            },
            labels: {
                formatter: function() {
                    return this.value
                },
            }
        },
        xAxis: {
            categories: a_data_g.weeks
        },
        xAxis: {
            title: {
                text: 'Week'
            },
            labels: {
                type: 'category',

            },
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            shadow: false,
            borderRadius: 0,
            borderColor: '#666'
        },
        series: a_data_g.a_series
    });
}

function get_array_order_highcharts(a_data_order, a_keys) {
    var a_all_data = {};
    a_all_data.weeks = [];
    a_all_data.a_series = [];

    var o_series = {};
    a_data_order.forEach(function(d) {
        a_all_data.weeks.push(d.week);
        a_keys.forEach(function(k) {
            if (o_series[k] === undefined) {
                o_series[k] = {}
                o_series[k].name = k;
                o_series[k].shadow=false;
                o_series[k].marker = {
                    symbol: 'circle'
                };
                if (get_color(k) !== undefined) {
                    o_series[k].color = get_color(k);
                }
                o_series[k].data = [];
            };
            if (d[k] !== undefined && d[k]) o_series[k].data.push(parseInt(d[k]));
        });
    });
    a_keys.forEach(function(k) {
        a_all_data.a_series.push(o_series[k]);
    });
    return a_all_data;
}

function process_week(a_data) {
    var a_keys = getkeys(a_data[0]);
    var a_work = order_by_week(a_data);

    var a_data_g = get_array_order_highcharts(a_work, a_keys);

    chart2 = new Highcharts.Chart({
        credits: false,
        chart: {
            renderTo: 'graphic-historical-week-dengue',
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text: 'New cases',
            align: 'left',
            x: 70,
        },
        legend: {
            layout: 'horizontal',
            verticalAlign: 'top',
            y: 25
        },
        subtitle: {
            text: ''
        },

        xAxis: {
            categories: a_data_g.weeks
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of new Cases'
            },
            labels: {
                formatter: function() {
                    return this.value
                },
            }
        },
        xAxis: {
            title: {
                text: 'Week'
            },
            labels: {
                formatter: function() {
                    return this.value
                }
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
            shadow: false,
            borderRadius: 0,
            borderColor: '#666'
        },
        plotOptions: {
            series: {
                shadow: false,
                marker: {
                    states: {
                        hover: {
                            radiusPlus: 2,
                            lineColor: '#fff',
                            lineWidth: 0
                        }
                    }
                }
            },
            line:{
                states:{
                    hover:{
                        lineWidth:2,
                    }
                }
            }
        },
        series: a_data_g.a_series
    });
}

function get_color(year) {
    var color = o_colors_bullet[year];
    return color;
}

function order_by_week(array) {
    return array.sort(function(a, b) {
        return d3.ascending(parseInt(a.week), parseInt(b.week));
    });
}

function getkeys(object) {
    return d3.keys(object).filter(function(d) {
        return d !== 'week' && d !== "2012" && d !== "2013";
    }).sort(function(a, b) {
        return d3.ascending(parseInt(a), parseInt(b));
    });
}

var geocoder = new google.maps.Geocoder();

function googleGeocoding(text, callResponse) {
    geocoder.geocode({
        address: text,
        componentRestrictions: {
            country: "SG"
        }
    }, callResponse);
}

function formatJSON(rawjson) {
    var json = {},
        key, loc, disp = [];

    for (var i in rawjson) {
        key = rawjson[i].formatted_address;

        loc = L.latLng(rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng());

        json[key] = loc; //key,value format
    }

    return json;
}

function action_mouseover(obj_marker, scroll) {
    var element_top = $("#pos_" + obj_marker.pos)[0].offsetTop - ($(".content-cards").height() / 2) + ($("#pos_" + obj_marker.pos).height() / 2);
    $("#pos_" + obj_marker.pos).addClass('st-highlighter');

    var el = $('.content-cards');
    if (scroll === 1) {
        el.animate({
            'scrollTop': element_top
        }, 'slow');
    }

    marker_selected = L.marker(obj_marker.marker._latlng, {
        icon: new LeafIcon({
            iconUrl: url_marker_svg_selected
        })
    }).addTo(map_leaflet);
}



function main(a_data) {
    a_data.forEach(function(d, i) {
        $(".total-per-day").html(format_number(d.number_today_cases));
        $(".day-time-update").html("updated on " + d.date_today_cases);
        $(".total-per-year").html(format_number(d.total_number_accumulative));
        d.st_position = i;
        var url_marker_svg;
        if (parseInt(d.st_nc) >= 10) {
            url_marker_svg = url_marker_svg_red;
        } else {
            url_marker_svg = url_marker_svg_yellow;
        }

        var marker = new L.marker([d.st_lat, d.st_lng], {
                icon: new LeafIcon({
                    iconUrl: url_marker_svg
                })
            })
            // .bindPopup()
            .addTo(map_leaflet)
            .on("click", function(e) {
                $('.content-cards').stop(true, false);
                $(".st-card").removeClass('st-highlighter');
                if (marker_selected !== undefined) map_leaflet.removeLayer(marker_selected);
                a_markers.forEach(function(nd) {
                    if (nd.marker === e.target) {;
                        action_mouseover(nd, 1);
                    }
                });
            });

        a_markers.push({
            marker: marker,
            pos: d.st_position,
            is_visible: 1
        });

        var t_card_f = t_card.replace('[ST-LOCATION]', d.st_address.trim(), 'g')
            .replace('[ST-NO-CASES]', d.st_nc, 'g')
            .replace('[ST-CLUSTER-START]', d.cases_cluster, 'g')
            .replace('[ST-CLUSTER-LAST-TWOWEEKS]', d.new_cases_cluster, 'g')
            .replace('[ST-POSITION-ID]', d.st_position, 'g');

        $(".content-cards").append(t_card_f);
    });
    $(".numer-search-out").html(a_markers.length);
    $(".nano").nanoScroller({
        scroll: 'top',
        alwaysVisible: true,
        // iOSNativeScrolling: true,
        preventPageScrolling: true
    });
}