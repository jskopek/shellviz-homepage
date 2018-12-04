var messageServer = require('../httpMessageServer.js');
var PanelView = require('../views/panelView.js');
var $ = require('jquery');

var panels = {};

messageServer.on('data', function(id, data) {
    if(panels[id]) {
        panels[id].update(data);
    } else {
        var client = undefined; // carryover from web version
        panels[id] = new PanelView(id, client, data);
        var containerEl = document.getElementById('canvas');
        containerEl.appendChild(panels[id].el);
        panels[id].render();
        document.getElementById('blank-canvas').classList.add('hidden');

        // when a new panel is requested by the data view, create it; this
        // feels like a hack at the moment
        $(panels[id]).on('requestNewPanel', function(e, data) {
            console.log('TODO: TEST THIS'); // TODO: test this
            var id = Math.random(); // yup, a hack
            var client = Math.random(); // yup, a hack
            messageServer.emit('data', id, client, data);
        });
    }
});

// automatically scroll down as values are added, but only if the user is already at the bottom
window.atBottom = true;
$(window).scroll(function() {
    window.atBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100) ? true : false;
});
messageServer.on('data', function(id, data) {
    if(window.atBottom) {
        window.scrollTo(0, document.getElementById('canvas').scrollHeight);
    }
});
messageServer.on('remove', function(panel) {
    delete panels[panel.id];

    // show the blank canvas if no panels remain
    if(!Object.keys(panels).length) {
        document.getElementById('blank-canvas').classList.remove('hidden');
    }
});

// Auto-update UI
const electron = require('electron');
const {ipcRenderer} = electron;
ipcRenderer.on("update-available", function(event) {
    document.getElementById('update-downloading').classList.remove('hidden');
});
ipcRenderer.on("update-downloaded", function(event, releaseNotes, releaseName, releaseDate, updateURL) {
    document.getElementById('update-downloading').classList.add('hidden');
    document.getElementById('update-installed').classList.remove('hidden');
});

// Outdated library warning
messageServer.on('outdatedLibrary', function(libraryLanguage, libraryVersion) {
    document.getElementById('outdated-library').classList.remove('hidden');
});

//require('../loadTestData.js').instant();
//require('../loadTestData.js').updating();
