//const request = require('request');
//const querystring = require('querystring');

// if we are running on node and XMLHttpRequest is not defined, import the shim
if(typeof XMLHttpRequest == 'undefined') {
    try {
        var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    } catch(e) {
        console.error('XMLHttpRequest could not be initialized');
    }
}

class Shellviz {
    constructor() {
        this.api_key = '';
        this.mac_address = '';
        this.VERSION = '0.1.7';
        this.base_request_params = {
            'apiKey': this.api_key,
            'macAddress': this.mac_address,
            'libraryLanguage': 'javascript',
            'libraryVersion': this.VERSION
        }
    }
//    visualizeOld(data, id) {
//        var request_dict = Object.assign({}, this.base_request_params, {'data': JSON.stringify(data)});
//        if(id) { Object.assign(request_dict, {'id': id}); }
//
//        request({
//            url: 'http://localhost:3384/visualize', 
//            method: 'POST',
//            json: request_dict
//        }, (err, httpResponse, body) => {
//            //console.log(httpResponse.body); 
//        });
//    }
    visualize(data, id) {
        var request_dict = Object.assign({}, this.base_request_params, {'data': JSON.stringify(data)});
        if(id) { Object.assign(request_dict, {'id': id}); }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3384/visualize', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        //xhr.onload = () => { console.log('done'); }
        xhr.send(JSON.stringify(request_dict));
        //xhr.send(querystring.stringify(request_dict));
    }
}
if(typeof module != 'undefined') {
    module.exports = Shellviz;
}
