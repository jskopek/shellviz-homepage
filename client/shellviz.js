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


//testing
var sv = new window.Shellviz(document.querySelector('.shellviz-window'));
setTimeout(() => { sv.data('hello', "## Hello!"); }, 0);
setTimeout(() => { sv.data('hello', "## Hello! I'm Shellviz!"); }, 1000);
setTimeout(() => { sv.data('logo', 'http://localhost:5000/static/shellviz-hello.png'); }, 1500);
setTimeout(() => { sv.data('instructions', "I'm a fully interactive, web-based version of the Shellviz client. Feed me data by clicking on any of the **Send to Shellviz** buttons."); }, 4000);
//#setTimeout(() => { sv.visualize([1,2,3]); }, 1000);
//#setTimeout(() => { sv.visualize([3,2,1]); }, 1500);
//#setTimeout(() => { sv.visualize([1,2,3]); }, 2000);
//#setTimeout(() => { sv.visualize({'json': 'dict'}); }, 2500);


document.querySelectorAll('.example').forEach((el) => {
    el.addEventListener('click', (e) => {
        document.querySelectorAll('.example').forEach((el) => { el.classList.remove('active'); });
        el.classList.add('active');
        var data = el.dataset['visualize'];
        try {
            data = JSON.parse(data);
        } catch(e) {}
        sv.data(Math.random(), data);
    });
})

//endtesting


module.exports = Shellviz;
