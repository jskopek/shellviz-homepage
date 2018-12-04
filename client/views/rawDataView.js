var $ = require('jquery');
var _ = require('underscore');

class RawDataView {
    constructor(data) {
        this.el = document.createElement('div');
        this.el.classList.add('data-view-raw');
        this.data = data;
    }
    render() {
        var text = _.isObject(this.data) ? JSON.stringify(this.data) : this.data;
        $(this.el).text(text);
    }
    update(data) {
        this.data = data;
        this.render();
    }
    static isValid(data) {
        // the only time RawDataView isn't valid is when the data is a number, because we will use the more appropriate NumberDataView instead
        return !_.isNumber(data);
    }
}

module.exports = RawDataView;
