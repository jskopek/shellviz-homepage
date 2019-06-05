var d3 = require('d3');
var c3 = require('c3');
var $ = require('jquery');
var _ = require('underscore');
var timeago = require('time-ago')();

var GroupedBarChartDataView = require('./groupedBarChartDataView.js');
var CardDataView = require('./cardDataView.js');
var PieDataView = require('./C3DataViews.js').PieDataView;
var AreaDataView = require('./C3DataViews.js').AreaDataView;
var BarDataView = require('./C3DataViews.js').BarDataView;
var GaugeDataView = require('./C3DataViews.js').GaugeDataView;
var JSONDataView = require('./JSONDataView.js');
var LocationDataView = require('./locationDataView.js');
var ImageDataView = require('./imageDataView.js');
var MarkdownDataView = require('./markdownDataView.js');
var RawDataView = require('./rawDataView.js');
var NumberDataView = require('./numberDataView.js');
var TableDataView = require('./tableDataView.js');
//var messageServer = require('../httpMessageServer.js');


// - Web vs. Desktop
// -- Web:
var panelViewTemplate = require('pug-loader!../templates/panelView.pug');
// -- Desktop: 
//var pug = require('pug');
//var path = require('path');
//var panelViewTemplate = pug.compileFile(path.join(__dirname, '..', 'templates', 'panelView.pug'));




class PanelView {
    constructor(id, client, data, updated_at, mode) {
        this.id = id;
        this.client = client;
        this.el = document.createElement('div');
        this.el.classList.add('panel-view');
        this.data = data;
        this.mode = mode || this.getDefaultMode();
        this.updatedAt = updated_at ? new Date(updated_at) : new Date();
        this.updatedAtTimer = undefined;
        this.dataView = undefined;
        this.dataViewOptions = undefined;
    }
    renderTime() {
        $(this.el).find('.updated-at').text(((new Date() - this.updatedAt) < 1000) ? 'Now' : timeago.ago(this.updatedAt))
    }
    render() {
        $(this.el).html(panelViewTemplate({
            pieEnabled: PieDataView.isValid(this.data),
            barEnabled: BarDataView.isValid(this.data),
            groupedBarEnabled: GroupedBarChartDataView.isValid(this.data),
            areaEnabled: AreaDataView.isValid(this.data),
            gaugeEnabled: GaugeDataView.isValid(this.data),
            markdownEnabled: MarkdownDataView.isValid(this.data),
            jsonEnabled: JSONDataView.isValid(this.data),
            locationEnabled: LocationDataView.isValid(this.data),
            cardEnabled: CardDataView.isValid(this.data),
            imageEnabled: ImageDataView.isValid(this.data),
            numberEnabled: NumberDataView.isValid(this.data),
            tableEnabled: TableDataView.isValid(this.data),
            rawEnabled: RawDataView.isValid(this.data),
            mode: this.mode,
        }));
        this.renderTime();

        $(this.el).find('.mode-buttons button').on('click', function(e) {
            var scrollTop = $(document).scrollTop(); // get the window's scroll position before rendering
            this.mode = $(e.currentTarget).data('mode');
            this.render();
            $(document).scrollTop(scrollTop); // reset scroll position after rendering
        }.bind(this));

        $(this.el).find('button.clear-button').on('click', function(e) { this.remove(); }.bind(this));


        this.dataView = this.getDataView();
        $(this.el).find('.data-view').append(this.dataView.el);
        this.dataView.render();

        // if the data view has requested a change to another mode, do so now
        // some data views have interactive options that allow the panel to switch to another mode
        $(this.dataView).on('requestModeChange', function(e, modeData) {
            this.mode = modeData.mode;
            this.dataViewOptions = modeData.dataViewOptions
            this.render();
        }.bind(this));

        // if a data view has requested a new panel, bubble it up as an event on this panel
        // this is so the panel creator can do something about it
        // feels like a hack at the moment
        $(this.dataView).on('requestNewPanel', function(e, data) {
            $(this).trigger('requestNewPanel', [data]);
        }.bind(this));

        // - Web vs. Desktop
        // -- Web:
        //// if the dataView triggers an excelDownloadRequested event, redirect to the download location
        //// this is a huuuuuge hack
        //$(this.dataView).on('excelDownloadRequested', function(e) {
        //    window.location = '/' + this.client + '/' + this.id + '/excel';
        //});

        // - Web vs. Desktop
        // -- Desktop:
        // launch links in external browser
        $(this.el).on('click', 'a[href]', function(event) {
            event.preventDefault();
            shell.openExternal(this.href);
        });

        clearInterval(this.updatedAtTimer);
        this.updatedAtTimer = setInterval(function() { this.renderTime(); }.bind(this), 5000);
    }
    getDataView() {
        if(this.mode == 'pie') {
            return new PieDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'area') {
            return new AreaDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'bar') {
            return new BarDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'gauge') {
            return new GaugeDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'markdown') {
            return new MarkdownDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'json') {
            return new JSONDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'location') {
            return new LocationDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'card') {
            return new CardDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'grouped-bar') {
            return new GroupedBarChartDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'image') {
            return new ImageDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'number') {
            return new NumberDataView(this.data, this.dataViewOptions);
        } else if(this.mode == 'table') {
            return new TableDataView(this.data, this.dataViewOptions);
        } else {
            return new RawDataView(this.data, this.dataViewOptions);
        }
    }
    update(data) {
        this.data = data;

        // if the data is valid for the current data view, update it
        // otherwise, get a new default mode and re-render
        if(this.dataView.constructor.isValid(data)) {
            this.dataView.update(data);
        } else {
            this.mode = this.getDefaultMode();
            this.render();
        }

        this.updatedAt = new Date();
        this.renderTime();
    }
    getLink() {
        window.location = '/' + this.client + '/' + this.id;
    }
    remove() {
        // - Web vs. Desktop
        // -- Web:
        //var el = this.el;
        //$.ajax('/delete/' + this.id, {
        //    method: 'POST',
        //    success: function() {
        //        $(el).remove();
        //    }
        //});
        ////window.location = '/' + this.client + '/' + this.id;
        ////alert('needs to be handled');
        ////messageServer.emit('remove', this);

        // -- Desktop:
        $(this.el).remove();
        messageServer.emit('remove', this);
    }
    getDefaultMode() {
        if(LocationDataView.isValidStrong(this.data)) {
            return 'location';
        } else if(CardDataView.isValidStrong(this.data)) {
            return 'card';
        } else if(TableDataView.isValid(this.data)) {
            return 'table';
        } else if(GroupedBarChartDataView.isValid(this.data)) {
            return 'grouped-bar';
        } else if(GaugeDataView.isValid(this.data)) {
            return 'gauge';
        } else if(AreaDataView.isValid(this.data)) {
            return 'area';
        } else if(PieDataView.isValid(this.data)) {
            return 'pie';
        } else if(BarDataView.isValid(this.data)) {
            return 'bar';
        } else if(JSONDataView.isValid(this.data)) {
            return 'json';
        } else if(ImageDataView.isValid(this.data)) {
            return 'image';
        } else if(MarkdownDataView.isValid(this.data)) {
            return 'markdown';
        } else if(LocationDataView.isValidWeak(this.data)) {
            return 'location';
        } else if(NumberDataView.isValid(this.data)) {
            return 'number';
        } else {
            return 'raw';
        }
    }
}

module.exports = PanelView
