var _ = require('underscore');
var $ = require('jquery');
var utils = require('../app/clientUtils.js');

// - Web vs. Desktop
// -- Web:
var tableDataViewTemplate = require('pug-loader!../templates/tableDataView.pug');
// -- Desktop: 
//var pug = require('pug');
//var path = require('path');
//var tableDataViewTemplate = pug.compileFile(path.join(__dirname, '..', 'templates', 'tableDataView.pug'));


class TableDataView {
    constructor(data) {
        this.el = document.createElement('div');
        this.data = data;
        this.searchQuery = undefined;
    }
    render() {
        var filteredData = this.filteredData();

        if(utils.isArrayOfJSONObjects(filteredData)) {
            var header = _.keys(_.first(filteredData));
            var data = _.map(filteredData, function(row) { return _.values(row); });
        } else {
            var header = undefined;
            var data = filteredData
        }

        $(this.el).html(tableDataViewTemplate({
            rows: data,
            header: header,
            searchQuery: this.searchQuery,
        }));

        $(this.el).find('input.search').on('change', function(e) {
            this.searchQuery = $(e.currentTarget).val();
            this.current = 0;
            this.render();
        }.bind(this));

        // trigger an excelDownloadRequested event on download click; this is a tooootal hack
        $(this.el).find('input.download-excel').on('click', function(e) {
            $(this).trigger('excelDownloadRequested');
        }.bind(this));
    }
    update(data) {
        this.data = data;
        this.render();
    }
    filteredData() {
        if(this.searchQuery) {
            var filteredRegExp = new RegExp(this.searchQuery, 'i');

            if(utils.isArrayOfJSONObjects(this.data)) {
                return _.filter(this.data, function(dict) { return _.values(dict).join(' ').match(filteredRegExp); });
            } else if(utils.isArrayOfObjects(this.data)) {
                return _.filter(this.data, function(cols) { return cols.join(' ').match(filteredRegExp); });
            } else {
                return this.data;
            }
        } else {
            return this.data;
        }

    }
    static isValid(data) {
        // if the data is an array of JSON objects, it's a strong match for a card view
        // if data is a json object, it can still be visualized as a card, but it loses a lot of the benefit
        // compared to a JSON object enable it, but don't make it the default choice
        if(utils.isArrayOfObjects(data)) {
            var rowCounts = _.map(data, function(row) { return _.isArray(row) ? row.length : _.keys(row).length; });
            var uniqueRowCounts = _.unique(rowCounts);
            if( (uniqueRowCounts.length == 1) && (uniqueRowCounts[0] > 1) ) {
                return true;
            }
        }
        return false;
    }
}

module.exports = TableDataView;
