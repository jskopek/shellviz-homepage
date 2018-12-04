var $ = require('jquery');
var marked = require('marked');

class MarkdownDataView {
    constructor(data) {
        this.el = document.createElement('div');
        this.data = data;
    }
    render() {
        $(this.el).html(marked(this.data));
    }
    update(data) {
        this.data = data;
        this.render();
    }
    static isValid(data) {
        return typeof data == 'string';
    }
}

module.exports = MarkdownDataView;
