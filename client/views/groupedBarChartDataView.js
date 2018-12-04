var _ = require('underscore');
var $ = require('jquery');
var d3 = require('d3');
var c3 = require('c3');
var utils = require('../app/clientUtils.js');

// - Web vs. Desktop
// -- Web:
var groupedBarChartDataViewTemplate = require('pug-loader!../templates/groupedBarChartDataView.pug');
// -- Desktop: 
//var pug = require('pug');
//var path = require('path');
//var groupedBarChartDataView = pug.compileFile(path.join(__dirname, '..', 'templates', 'groupedBarChartDataView.pug'));


class GroupedBarChartDataView {
    constructor(data, currentKey) {
        this.el = document.createElement('div');
        this.data = data;
        this.currentKey = currentKey || this.getDefaultCurrentKey();
    }
    render() {
        var scrollTop = $(document).scrollTop(); // get the window's scroll position before rendering

        $(this.el).html(groupedBarChartDataViewTemplate({
            keys: _.keys(this.data[0]),
            currentKey: this.currentKey
        }));

        $(this.el).find('select').on('change', function(e) {
            this.currentKey = $(e.currentTarget).val();
            this.render();
        }.bind(this));

        if(this.currentKey) {
            var aggregatedData = _.pairs(_.countBy(_.pluck(this.data, this.currentKey)));
            var c3Params = this.generateBarC3Params(aggregatedData);
            c3.generate($.extend({}, {bindto: $(this.el).find('.data-aggregated-component').get(0)}, c3Params));
        }

        $(document).scrollTop(scrollTop); // reset scroll position after rendering
    }
    update(data) {
        this.data = data;
        this.render();
    }
    generateBarC3Params(data) {
        return {
            data: {
                columns: [['Value'].concat(_.pluck(data, 1))],
                type: 'bar',
                // if a bar is clicked, request a new card with only data from that column
                onclick: function(d, element) {
                    var aggregatedData = _.pairs(_.countBy(_.pluck(this.data, this.currentKey)));
                    var selectedValue = aggregatedData[d.index][0];
                    var filteredData = _.filter(this.data, function(row) { return row[this.currentKey] == selectedValue; }.bind(this));
                    $(this).trigger('requestNewPanel', [filteredData]);
                }.bind(this)
            },
            size: {
                // if there are more than 10 columns, manually set the height based on num columns
                height: data.length > 10 ? data.length * 10 : undefined
            },
            axis: {
                // shows labels on left when there are more than 10 columns
                rotated: data.length > 10, 
                x: {
                    type: 'category',
                    categories: _.pluck(data, 0)
                }
            },
            legend: { show: false }
        };
    }
    getDefaultCurrentKey() {
        // gets the default key to group by
        // looks for the first key that corresponds to a boolean value on first entry; if no boolean values exist, returns the first key
        // that corresponds to a numeric value
        var keyValPairs = _.pairs(_.first(this.data));
        return _.first(_.find(keyValPairs, function(keyVal) { return _.isBoolean(keyVal[1]) })) || _.first(_.find(keyValPairs, function(keyVal) { return _.isNumber(keyVal[1]) }));
    }
    static isValid(data) {
        // used to determine if we can render the GroupedBarChartView, which is in dataViews
        return utils.isArrayOfJSONObjects(data) && (_.unique(_.map(data, function(v) { return _.keys(v).join(','); })).length == 1)
    }
}

module.exports = GroupedBarChartDataView;
