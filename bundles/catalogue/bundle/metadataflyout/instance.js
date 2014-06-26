/**
 * @class Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundleInstance
 */
Oskari.clazz.define("Oskari.catalogue.bundle.metadataflyout.MetadataFlyoutBundleInstance", function () {
    this.map = null;
    this.core = null;
    this.sandbox = null;
    this.mapmodule = null;
    this.started = false;
    this.plugins = {};
    this._locale = null;
    this._requestHandlers = {};
    this.loader = null;

    this.layerPlugin = null;
    this.layer = null;
}, {
    /**
     * @static
     * @property __name
     *
     */
    __name: 'catalogue.bundle.metadataflyout',
    "getName": function () {
        return this.__name;
    },
    /**
     * @method getSandbox
     */
    getSandbox: function () {
        return this.sandbox;
    },
    getLocale: function () {
        return this._locale;
    },
    getLoader: function () {
        return this.loader;
    },
    /**
     * @property defaults
     *
     * some defaults for this bundle
     */

    layerSpec: {
        "text": "",
        "name": "Metadata",
        "wmsName": "1",
        "type": "vectorlayer",
        "styles": {
            "title": "Trains",
            "legend": "",
            "name": "1"
        },
        "descriptionLink": "",
        "orgName": "Metadata",
        "inspire": "Metadata",
        "legendImage": "",
        "info": "",
        "isQueryable": true,
        "formats": {
            "value": "text/html"
        },
        "id": 'catalogue_metadataflyout_layer',
        "minScale": 36000000,
        "maxScale": 1,
        "style": "",
        "dataUrl": "",
        "wmsUrl": "x",
        "opacity": 60,
        "checked": "false",
        "styledLayerDescriptor": '<StyledLayerDescriptor version="1.0.0" ' + 'xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" ' + '    xmlns="http://www.opengis.net/sld" ' + '    xmlns:ogc="http://www.opengis.net/ogc" ' + '    xmlns:xlink="http://www.w3.org/1999/xlink" ' + '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> ' + '  <NamedLayer> ' + '    <Name>Simple point with stroke</Name> ' + '   <UserStyle><Title>GeoServer SLD Cook Book: Simple point with stroke</Title> ' + '    <FeatureTypeStyle><Rule>' + '<PolygonSymbolizer>' + ' <Graphic><Mark><WellKnownName>circle</WellKnownName>' + '<Fill>' + '        <CssParameter name="fill">#000040</CssParameter>' + '       </Fill>' + '<Stroke>' + '          <CssParameter name="stroke">#000040</CssParameter>' + '           <CssParameter name="stroke-width">2</CssParameter>' + '          </Stroke>' + '</Mark><Size>12</Size></Graphic>' + '     </PolygonSymbolizer>' + '<TextSymbolizer><Label><ogc:PropertyName>title</ogc:PropertyName></Label>' + '<Fill><CssParameter name="fill">#000000</CssParameter></Fill></TextSymbolizer>' + '</Rule></FeatureTypeStyle>' + '</UserStyle></NamedLayer></StyledLayerDescriptor>'
    },

    /**
     * @method implements BundleInstance start methdod
     *
     */
    "start": function () {
        if (this.started) {
            return;
        }

        this.started = true;

        /* locale */
        this._locale = Oskari.getLocalization(this.getName());

        /* sandbox */
        var conf = this.conf;
        var sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName),
            p;

        this.sandbox = sandbox;

        /* loader */
        this.loader = Oskari.clazz.create("Oskari.catalogue.bundle.metadataflyout.service.MetadataLoader",
            this.getLocale().loader, sandbox);

        sandbox.register(this);

        for (p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.registerForEventByName(this, p);
            }
        }

        /* request handler */
        this._requestHandlers['catalogue.ShowMetadataRequest'] =
            Oskari.clazz.create('Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler', sandbox, this);

        sandbox.addRequestHandler('catalogue.ShowMetadataRequest', this._requestHandlers['catalogue.ShowMetadataRequest']);

        /*
        var layerSpec = {};

        for (p in this.layerSpec) {
            if (this.layerSpec.hasOwnProperty(p)) {
                layerSpec[p] = this.layerSpec[p];
            }
        }

        var layerLocale = this.getLocale().layer;
        for (p in layerLocale) {
            if (layerLocale.hasOwnProperty(p)) {
                layerSpec[p] = layerLocale[p];
            }
        }

        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var mapLayer = mapLayerService.createMapLayer(layerSpec);
        mapLayerService.addLayer(mapLayer, true);
        this.layer = mapLayer;

        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var layerPlugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.MetadataLayerPlugin');
        layerPlugin.setMapLayer(mapLayer);


        mapModule.registerPlugin(layerPlugin);
        mapModule.startPlugin(layerPlugin);
        this.layerPlugin = layerPlugin;
*/
        /*layerPlugin.addMapLayerToMap(mapLayer, true, false);*/

        /* */

        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

        sandbox.request(this, request);

        /* stateful */
        sandbox.registerAsStateful(this.mediator.bundleId, this);

    },
    "init": function () {
        return null;
    },
    /**
     * @method update
     *
     * implements bundle instance update method
     */
    "update": function () {

    },
    /**
     * @method onEvent
     */
    onEvent: function (event) {

        var handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [event]);

    },
    /**
     * @property eventHandlers
     * @static
     *
     */
    eventHandlers: {
        'AfterMapLayerAddEvent': function (event) {
            /* this might react when layer added */
            /* this.scheduleShowMetadata(event.getMapLayer().getMetadataResourceUUID(); */
        },
        /**
         * @method AfterMapLayerRemoveEvent
         */
        'AfterMapLayerRemoveEvent': function (event) {
            /* this might react when layer removed */
            /* this.scheduleShowMetadata(event.getMapLayer().getMetadataResourceUUID(); */
        },
        /**
         * @method AfterMapLayerRemoveEvent
         */
        'AfterMapMoveEvent': function (event) {
            /* this might react when map moved */

        }
    },

    /**
     * @method stop
     *
     * implements bundle instance stop method
     */
    "stop": function () {

        var sandbox = this.sandbox,
            p;

        /* request handler cleanup */
        sandbox.removeRequestHandler('catalogue.ShowMetadataRequest', this._requestHandlers['catalogue.ShowMetadataRequest']);

        /* sandbox cleanup */

        for (p in this.eventHandlers) {
            if (this.eventHandlers.hasOwnProperty(p)) {
                sandbox.unregisterFromEventByName(this, p);
            }
        }

        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

        sandbox.request(this, request);

        this.sandbox.unregisterStateful(this.mediator.bundleId);
        this.sandbox.unregister(this);
        this.started = false;
    },
    setSandbox: function (sandbox) {
        this.sandbox = null;
    },
    startExtension: function () {

        this.plugins['Oskari.userinterface.Flyout'] =
            Oskari.clazz.create('Oskari.catalogue.bundle.metadataflyout.Flyout', this, this.getLocale().flyout, this.getLoader());

        //this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.catalogue.bundle.metadataflyout.Tile', this, this.getLocale()['tile']);
    },
    stopExtension: function () {
        this.plugins['Oskari.userinterface.Flyout'] = null;
        //this.plugins['Oskari.userinterface.Tile'] = null;
    },
    getTitle: function () {
        return this.getLocale().title;
    },
    getDescription: function () {
        return "Sample";
    },
    getPlugins: function () {
        return this.plugins;
    },
    /**
     * @method scheduleShowMetadata
     * schedules a refresh of the UI to load metadata asynchronously
     */
    scheduleShowMetadata: function (allMetadata) {

        /** update flyout content */
        this.plugins['Oskari.userinterface.Flyout'].scheduleShowMetadata(allMetadata);

        this.getSandbox().requestByName(this, 'userinterface.UpdateExtensionRequest', [this, 'detach']);
    },
    /**
     *  @method showExtentOnMap
     */
    showExtentOnMap: function (uuid, env, atts) {

        var me = this;
        if (!env) {
            return;
        }

        var feats = [],
            n,
            vals,
            e,
            ep,
            ef;

        for (n = 0; n < env.length; n++) {
            vals = env[n];
            e = new OpenLayers.Bounds(vals.westBoundLongitude, vals.southBoundLatitude, vals.eastBoundLongitude, vals.northBoundLatitude);

            ep = e.toGeometry();

            ef = new OpenLayers.Feature.Vector(ep);
            ef.attributes = atts || ef.attributes;
            feats.push(ef);
        }

//        console.log("metadataflyout.showExtentOnMap", Oskari.getSandbox().getMap().getSrsName(), "should match", "EPSG:3067");

        var event = me.getSandbox().getEventBuilder("FeaturesAvailableEvent")(
            this.layer,
            feats,
            "application/nlsfi-x-openlayers-feature",
            Oskari.getSandbox().getMap().getSrsName(),
            //"EPSG:3067",
            "replace"
        );

        me.sandbox.notifyAll(event);
    },
    /**
     * @method setState
     * @param {Object} state bundle state as JSON
     */
    setState: function (state) {
        this.plugins['Oskari.userinterface.Flyout'].setContentState(state);
    },
    /**
     * @method getState
     * @return {Object} bundle state as JSON
     */
    getState: function () {
        return this.plugins['Oskari.userinterface.Flyout'].getContentState();
        /*
         var state = {

         };

         return state;
         */
    }
}, {
    "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
