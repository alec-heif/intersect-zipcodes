

//var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

var handleData = function(start, center, end, shapes) {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(center[0], center[1])
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
    var startMarker = new google.maps.Marker({
        position: new google.maps.LatLng(start[0], start[1]),
        map: map,
        title: 'Start'
    });
    var endMarker = new google.maps.Marker({
        position: new google.maps.LatLng(end[0], end[1]),
        map: map,
        title: 'End'
    });

    var straightPathCoords = [
        new google.maps.LatLng(start[0], start[1]),
        new google.maps.LatLng(end[0], end[1])
    ];
    var line = new google.maps.Polyline({
        path: straightPathCoords,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeWeight: 5,
        geodesic: true
    });
    line.setMap(map);

    shapes.forEach(function(shapePoints) {
        var coordinates = [];
        shapePoints.forEach(function(coord) {
            coordinates.push(new google.maps.LatLng(coord[1], coord[0]));
        });
        var overlay = new google.maps.Polygon({
            path: coordinates,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        overlay.setMap(map);
    });
}