/**
 * Created by Quanta on 2016/7/14 0014.
 */
function CustomMarker(latlng, map, args) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function() {
    var self = this;
    var div = this.div;
    if (!div) {
        div = this.div = document.createElement('div');
        var img = document.createElement('img');
        img.src = 'images/airplanenor.png';
        img.style.width = '36px';
        img.style.height = '36px';
        div.className = 'marker';
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';
        div.style.width = '36px';
        div.style.height = '36px';
        div.appendChild(img);
        if (typeof(self.args.id) !== 'undefined') {
            div.id = self.args.id;
        }
        google.maps.event.addDomListener(img, "click", function(event) {
            var object = flights[$(this).parent().attr('id')];
            var marker = object.marker;
            var info = object.info;
            if(marker.clicked){
                info.close();
                this.src = 'images/airplanenor.png';
            }else{
                this.src = 'images/airplanesel.png';
                info.refeash();
                info.open(map, marker);
            }
            marker.clicked = !marker.clicked;
        });
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
    }
    if(flights[self.args.id]['points'].length > 1){
        var e = flights[self.args.id]['points'][1].lng - flights[self.args.id]['points'][0].lng;
        var n = flights[self.args.id]['points'][1].lat - flights[self.args.id]['points'][0].lat;
        var deg = Math.atan2(e, n) * (180 / Math.PI);
        $(div).css('transform','rotate('+deg+'deg)');
    }
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    if (point) {
        div.style.left = point.x-18 + 'px';
        div.style.top = point.y-18 + 'px';
    }
};

CustomMarker.prototype.remove = function() {
    if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
    }
};

CustomMarker.prototype.getPosition = function() {
    return this.latlng;
};
CustomMarker.prototype.setPosition = function(latLng) {
    if(this.div){
        this.latlng = new google.maps.LatLng(latLng);
        this.draw();
    }
};
