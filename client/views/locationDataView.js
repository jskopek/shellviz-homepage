var osm = require('osm');
var $ = require('jquery');
var _ = require('underscore');

class LocationDataView {
    constructor(data) {
        this.el = document.createElement('div');
        this.data = data;
    }
    render() {
        if (this.data.latitude && this.data.longitude) {
            var data = [this.data.latitude, this.data.longitude];
        } else if (this.data.lat && this.data.lon) {
            var data = [this.data.lat, this.data.lon];
        } else {
            var data = this.data;
        }

        var osmInstance = osm();
        var map = osmInstance.position.apply(osmInstance, data).radius(1.5);
        $(this.el).append(map.show());
    }
    update(data) {
        this.data = data;
        this.render();
    }
    static isValid(data) {
        // can take {latitude:x, longitude:y}, {lat:x, lon:y}, or [lat, lon] values
        // we run two separate checks becuase one signature is overwhelmingly a lat/lon position,
        // and the other (array of two numbers) could also be something else
        // this way we can prioritize the default view better
        return this.isValidStrong(data) || this.isValidWeak(data)
    }
    static isValidStrong(data) {
        // checks if data is a dictionary of {latitude:x, longitude:y} or {lat:x, lon:y} values
        if(_.isObject(data) && (data.latitude && data.longitude)) {
            return true
        } else if(_.isObject(data) && (data.lat && data.lon)) {
            return true;
        } else {
            return false;
        }
    }
    static isValidWeak(data) {
        // checks if data is a two-value array of possible [lat, lon] values
        if(_.isArray(data) && (data.length == 2) && (data[0] >= -90) && (data[0] <= 90) && (data[1] >= -180) && (data[1] <= 180)) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = LocationDataView;
