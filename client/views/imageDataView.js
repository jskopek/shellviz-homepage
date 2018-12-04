var $ = require('jquery');
var _ = require('underscore');

class ImageDataView {
    constructor(data) {
        this.el = document.createElement('div');
        this.data = data;
    }
    render() {
        var img = new Image();
        img.src = this.data;
        img.style.width = '100%';
        $(this.el).append(img);
    }
    update(data) {
        this.data = data;
        this.render();
    }
    static isValid(data) {
        var imageRegex = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/;
        return _.isString(data) && imageRegex.test(data.trim().toLowerCase());
    }
}

module.exports = ImageDataView;
