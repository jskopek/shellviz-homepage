var PanelView = require('./views/panelView.js');
require('./public/main.css');
require('./public/jquery.jsonview.min.css');
require('./public/c3.min.css');
var $ = require('jquery');

class Shellviz {
    constructor(el) {
        this.el = el;
        this.panels = {};
        this.el.innerHTML = '<div id="blank-canvas">Initialized, waiting for data...</div><div id="canvas"></div>';

        // automatically scroll down as values are added, but only if the user is already at the bottom
        this.atBottom = true;
        $(el).scroll(() => {
            this.atBottom = ($(el).scrollTop() + $(el).height() > $(el).find('#canvas').height() - 100) ? true : false;
        });
    }
    visualize(data) {
        this.data(undefined, data);
    }
    data(id, data, mode) {
        if(!id) {
            id = Math.random();
        }
        if(this.panels[id]) {
            this.panels[id].update(data);
        } else {
            var client = undefined; // carryover from web version
            var mode = mode;
            this.panels[id] = new PanelView(id, client, data, undefined, mode);
            var containerEl = this.el.querySelector('#canvas');
            containerEl.appendChild(this.panels[id].el);
            this.panels[id].render();
            this.el.querySelector('#blank-canvas').classList.add('hidden');

            // when a new panel is requested by the data view, create it; this
            // feels like a hack at the moment
            $(this.panels[id]).on('requestNewPanel', function(e, data) {
                console.log('TODO: TEST THIS'); // TODO: test this
                var id = Math.random(); // yup, a hack
                this.data(id, data);
            });
        }

        // handle scrolling to bottom
        if(this.atBottom) {
            this.el.scrollTo(0, this.el.querySelector('#canvas').scrollHeight);
        }
    }
    remove(panel) {
        delete panels[panel.id];

        // show the blank canvas if no panels remain
        if(!Object.keys(panels).length) {
            document.getElementById('blank-canvas').classList.remove('hidden');
        }
    }
}
window.Shellviz = Shellviz;
module.exports = Shellviz;
