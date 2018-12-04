var PanelView = require('./views/panelView.js');
var $ = require('jquery');

class Shellviz {
    constructor(el) {
        this.el = el;
        this.panels = {};
        this.el.innerHTML = '<div id="blank-canvas">Initialized, waiting for data...</div><div id="canvas"></div>';

//        // automatically scroll down as values are added, but only if the user is already at the bottom
//        window.atBottom = true;
//        $(window).scroll(function() {
//            window.atBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100) ? true : false;
//        });
//        messageServer.on('data', function(id, data) {
//            if(window.atBottom) {
//                window.scrollTo(0, document.getElementById('canvas').scrollHeight);
//            }
//        });
    }
    visualize(data) {
        this.data(undefined, data);
    }
    data(id, data) {
        if(this.panels[id]) {
            this.panels[id].update(data);
        } else {
            var client = undefined; // carryover from web version
            this.panels[id] = new PanelView(id, client, data);
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
