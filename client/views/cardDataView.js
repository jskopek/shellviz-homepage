var _ = require('underscore');
var $ = require('jquery');
var utils = require('../app/clientUtils.js');


// - Web vs. Desktop
// -- Web:
var cardDataViewTemplate = require('pug-loader!../templates/cardDataView.pug');
// -- Desktop: 
//var pug = require('pug');
//var path = require('path');
//var cardDataViewTemplate = pug.compileFile(path.join(__dirname, '..', 'templates', 'cardDataView.pug'));


class CardDataView {
    constructor(data) {
        this.el = document.createElement('div');
        this.data = data;
        this.current = 0;
        this.searchQuery = undefined;
    }
    render() {
        var filteredData = this.filteredData();
        var dictVal = _.isArray(filteredData) ? filteredData[this.current] : filteredData;

        $(this.el).html(cardDataViewTemplate({
            values: _.pairs(dictVal),
            searchQuery: this.searchQuery,
            currentCard: this.current + 1,
            numCards: filteredData.length
        }));

        $(this.el).find('input.search').on('change', function(e) {
            this.searchQuery = $(e.currentTarget).val();
            this.current = 0;
            this.render();
        }.bind(this));

        $(this.el).find('button[data-step]').on('click', function(e) {
            this.current += parseInt($(e.currentTarget).data('step'));
            if(this.current < 0) { this.current = 0; }
            else if(this.current >= (filteredData.length - 1)) { this.current = filteredData.length - 1; }
            this.render();
        }.bind(this));

        $(this.el).find('.card-value-title').on('click', function(e) {
            $(this).trigger('requestModeChange', {mode: 'grouped-bar', dataViewOptions: $(e.currentTarget).text()});
        }.bind(this));
    }
    update(data) {
        this.data = data;
        this.render();
    }
    filteredData() {
        if(_.isArray(this.data) && this.searchQuery) {
            var filteredRegExp = new RegExp(this.searchQuery, 'i');
            var filteredData = _.filter(this.data, function(dict) { return _.values(dict).join(' ').match(filteredRegExp); });
            return filteredData;
        } else {
            return this.data;
        }

    }
    static isValid(data) {
        // if the data is an array of JSON objects, it's a strong match for a card view
        // if data is a json object, it can still be visualized as a card, but it loses a lot of the benefit
        // compared to a JSON object enable it, but don't make it the default choice
        return this.isValidStrong(data) || this.isValidWeak(data);
    }
    static isValidStrong(data) {
        return utils.isArrayOfJSONObjects(data);
    }
    static isValidWeak(data) {
        return utils.isJSONObject(data);
    }
}

module.exports = CardDataView;
