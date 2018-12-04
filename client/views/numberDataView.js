var $ = require('jquery');
var _ = require('underscore');

class NumberDataView {
    constructor(data) {
        this.el = document.createElement('div');
        this.el.classList.add('data-view-number');
        this.data = data;
    }
    render() {
        var numString = this.data.toLocaleString();

        $(this.el).text(numString);

        if(numString.length > 25) {
            this.el.classList.add('data-view-number-large');
        } else {
            this.el.classList.remove('data-view-number-large');
        }
    }
    update(data) {
        this.data = data;
        this.render();
    }
    static isValid(data) {
        return _.isNumber(data);
    }
}

module.exports = NumberDataView;
