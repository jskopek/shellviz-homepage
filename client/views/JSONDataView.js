var $ = require('jquery');
window.jQuery = $;
var jsonView = require('jsonview');
var _ = require('underscore');

class JSONDataView {
    constructor(data) {
        this.el = document.createElement('div');
        this.el.classList.add('data-view-raw');
        this.data = data;
    }
    render() {
        $(this.el).JSONView(this.data); 
    }
    update(data) {
        this.data = data;
        this.render();
    }
    static isValid(data) {
        return _.isObject(data);
    }
}

module.exports = JSONDataView;
