var d3 = require('d3');
var c3 = require('c3');
var $ = require('jquery');
var utils = require('../app/clientUtils.js');
var _ = require('underscore');

class C3DataView {
    constructor(data, mode) {
        this.el = document.createElement('div');
        this.data = data;
        this.mode = mode;
        this.c3 = undefined;
    }
    render(mode) {
        this.c3 = c3.generate($.extend(
            {},
            {bindto: this.el},
            this.generateParams()
        ));
    }
    update(data) {
        this.data = data;
        this.render();
    }
    generateParams() {
        throw Error('generateParams() method must be initated in subclass');
    }
    isValid() {
        throw Error('isValid() method must be initated in subclass');
    }
}

class PieDataView extends C3DataView {
    generateParams() {
        // takes valid pie data and massages it in a pie-compatible format
        // pie data must be an array of [label, value] arrays
        return {
            data: {
                columns: utils.isJSONObject(this.data) ? _.pairs(this.data) : this.data,
                type: 'pie'
            },
            transition: { duration: 0 }
        }

    }
    static isValid(data) {
        // if the data is an object, attempt to convert it into an array before passing it to the validity function
        if(utils.isJSONObject(data)) { data = _.pairs(data); }
        return utils.isArrayOfLabelValuePairs(data);
    }
}

class GaugeDataView extends C3DataView {
    generateParams() {
        // generate the required arguments for c3's `data` property in order to generate an area chart
        return {
            data: {
                columns: [['data', this.data * 100]],
                type: 'gauge'
            },
            transition: { duration: 0 }
        }
    }
    update(data) {
        this.data = data;
        this.c3.load({
            columns: [['data', data * 100]],
        });
    }
    static isValid(data) {
        return _.isNumber(data) && (data <= 1);
    }
}

class BarDataView extends C3DataView {
    generateParams() {
        // generate the required arguments for c3's `data` property in order to generate a bar chart
        if(utils.isArrayOfLabelValuePairs(this.data)) {
            return {
                data: {
                    columns: [['Value'].concat(_.pluck(this.data, 1))],
                    type: 'bar'
                },
                size: {
                    // if there are more than 10 columns, manually set the height based on num columns
                    height: this.data.length > 10 ? this.data.length * 10 : undefined
                },
                axis: {
                    // shows labels on left when there are more than 10 columns
                    rotated: this.data.length > 10,
                    x: {
                        type: 'category',
                        categories: _.pluck(this.data, 0)
                    }
                },
                legend: { show: false },
                transition: { duration: 0 }
            };
        } else if(_.isObject(this.data)) {
            return {
                data: {
                    columns: [['Value'].concat(_.values(this.data))],
                    type: 'bar'
                },
                size: {
                    // if there are more than 10 columns, manually set the height based on num columns
                    height: this.data.length > 10 ? this.data.length * 10 : undefined
                },
                axis: {
                    // shows labels on left when there are more than 10 columns
                    rotated: this.data.length > 10,
                    x: {
                        type: 'category',
                        categories: _.keys(this.data)
                    }
                },
                legend: { show: false },
                transition: { duration: 0 }
            }
        }

    }
    static isValid(data) {
        if(utils.isArrayOfLabelValuePairs(data)) {
            return true;
        } else if(utils.isJSONObject(data)) {
            return utils.isValid(_.values(data), _.isNumber);
        }

    }
}

class AreaDataView extends C3DataView {
    generateParams() {
        // generate the required arguments for c3's `data` property in order to generate an area chart
        return {
            data: {
                columns: [
                    ['Value'].concat(this.data)
                ],
                types: { 'Value': 'area-spline' }
            },
            legend: {
                show: false
            },
            transition: { duration: 0 },
            axis: {
                y: {show:false},
                x: {
                    tick: {
                        format: function(x) { return this.data[x]; }.bind(this)
                    }
                }

            },
        };
    }
    static isValid(data) {
        if(!_.isArray(data)) {
            return false;
        } else {
            return utils.isValid(data, _.isNumber);
        }

    }
}

module.exports = {
    'PieDataView': PieDataView,
    'GaugeDataView': GaugeDataView,
    'BarDataView': BarDataView,
    'AreaDataView': AreaDataView
}
