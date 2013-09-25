Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance",function(){this.sandbox=null,this.started=!1,this.plugins={},this.localization=null,this.popupHandler=null,this.selectionPlugin=null},{__name:"FeatureData2",getName:function(){return this.__name},setSandbox:function(e){this.sandbox=e},getSandbox:function(){return this.sandbox},getLocalization:function(e){return this._localization||(this._localization=Oskari.getLocalization(this.getName())),e?this._localization[e]:this._localization},start:function(){var e=this;if(e.started)return;e.started=!0;var t=this.conf,n=(t?t.sandbox:null)||"sandbox",r=Oskari.getSandbox(n);e.sandbox=r,this.localization=Oskari.getLocalization(this.getName()),r.register(e);for(var i in e.eventHandlers)r.registerForEventByName(e,i);var s=r.getRequestBuilder("userinterface.AddExtensionRequest")(this);r.request(this,s),e.createUi();var o=this.getLocalization("popup");if(this.conf&&this.conf.selectionTools===!0){this.popupHandler=Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.PopupHandler",this);var u=r.getRequestBuilder("Toolbar.AddToolButtonRequest"),a={iconCls:"tool-feature-selection",tooltip:o.tools.select.tooltip,sticky:!1,callback:function(){e.popupHandler.showSelectionTools()}};r.request(this,u("dialog","selectiontools",a))}var f=r.findAllSelectedMapLayers();for(var l=0;l<f.length;++l)f[l].isLayerOfType("WFS")&&(this.plugin.update(),this.plugins["Oskari.userinterface.Flyout"].layerAdded(f[l]));r.addRequestHandler("ShowFeatureDataRequest",this.requestHandlers.showFeatureHandler)},init:function(){var e=this;return this.requestHandlers={showFeatureHandler:Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequestHandler",e)},null},getSelectionPlugin:function(){return this.selectionPlugin},update:function(){},onEvent:function(e){var t=this.eventHandlers[e.getName()];if(!t)return;return t.apply(this,[e])},eventHandlers:{AfterMapLayerRemoveEvent:function(e){e.getMapLayer().isLayerOfType("WFS")&&(this.plugin.update(),this.plugins["Oskari.userinterface.Flyout"].layerRemoved(e.getMapLayer()))},AfterMapLayerAddEvent:function(e){e.getMapLayer().isLayerOfType("WFS")&&(this.plugin.update(),this.plugins["Oskari.userinterface.Flyout"].layerAdded(e.getMapLayer()))},WFSPropertiesEvent:function(e){var t=e.getLayer();this.plugins["Oskari.userinterface.Flyout"].updateData(t)},WFSFeatureEvent:function(e){var t=e.getLayer();this.plugins["Oskari.userinterface.Flyout"].updateData(t)},WFSFeaturesSelectedEvent:function(e){this.plugins["Oskari.userinterface.Flyout"].featureSelected(e)},"userinterface.ExtensionUpdatedEvent":function(e){var t=this.plugins["Oskari.userinterface.Flyout"];if(e.getExtension().getName()!==this.getName())return;e.getViewState()==="close"?t.setEnabled(!1):t.setEnabled(!0)}},stop:function(){var e=this.sandbox();for(p in this.eventHandlers)e.unregisterFromEventByName(this,p);var t=e.getRequestBuilder("userinterface.RemoveExtensionRequest")(this);e.request(this,t),this.sandbox.unregister(this),this.started=!1},startExtension:function(){this.plugins["Oskari.userinterface.Flyout"]=Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.Flyout",this)},stopExtension:function(){this.plugins["Oskari.userinterface.Flyout"]=null},getPlugins:function(){return this.plugins},getTitle:function(){return this.getLocalization("title")},getDescription:function(){return this.getLocalization("desc")},createUi:function(){var e=this;this.plugins["Oskari.userinterface.Flyout"].createUi();var t=this.sandbox.findRegisteredModuleInstance("MainMapModule"),n=Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin",{instance:this});t.registerPlugin(n),t.startPlugin(n),this.plugin=n;var r={id:"FeatureData"};this.selectionPlugin=Oskari.clazz.create("Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin",r),t.registerPlugin(this.selectionPlugin),t.startPlugin(this.selectionPlugin)}},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.module.Module","Oskari.userinterface.Extension"]}),define("bundles/framework/bundle/featuredata2/instance",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.PopupHandler",function(e){this.instance=e,this.localization=e.getLocalization("popup");var t=this,n=t.instance.getSelectionPlugin();this.buttons={point:{iconCls:"selection-point",tooltip:t.localization.tools.point.tooltip,sticky:!1,callback:function(){n.startDrawing({drawMode:"point"})}},line:{iconCls:"selection-line",tooltip:t.localization.tools.line.tooltip,sticky:!1,callback:function(){n.startDrawing({drawMode:"line"})}},polygon:{iconCls:"selection-area",tooltip:t.localization.tools.polygon.tooltip,sticky:!1,callback:function(){n.startDrawing({drawMode:"polygon"})}},square:{iconCls:"selection-square",tooltip:t.localization.tools.square.tooltip,sticky:!1,callback:function(){n.startDrawing({drawMode:"square"})}},circle:{iconCls:"selection-circle",tooltip:t.localization.tools.circle.tooltip,sticky:!1,callback:function(){n.startDrawing({drawMode:"circle"})}}},this.template={};for(p in this.__templates)this.template[p]=jQuery(this.__templates[p])},{__templates:{wrapper:"<div></div>",toolsButton:'<div style= "display: inline-block; border: 1px solid;"></div>',instructions:'<div class="instructions" style="padding: 20px 0px 0px 0px;"></div>',link:'<div class="link"><a href="javascript:void(0);"></a></div></div>'},showSelectionTools:function(){var e=this;e.instance.sandbox.postRequestByName("userinterface.UpdateExtensionRequest",[e.instance,"close"]);var t=function(t){return function(){e.buttons[t].callback(),n.close(),e._selectionStarted()}},n=Oskari.clazz.create("Oskari.userinterface.component.Popup"),r=this.localization.title,i=e.template.wrapper.clone();for(var s in this.buttons){var o=e.template.toolsButton.clone(),u=this.buttons[s];o.attr("title",u.tooltip),o.addClass(u.iconCls),o.bind("click",t(s)),i.append(o)}var a=e.template.instructions.clone();a.append(this.localization.instructions),i.append(a);var f=n.createCloseButton(this.localization.button.cancel);f.addClass("primary"),n.addClass("tools_selection"),n.show(r,i,[f]),n.moveTo("#toolbar div.toolrow[tbgroup=selectiontools]","top")},_selectionStarted:function(){var e=this,t=e._sandbox,n=Oskari.clazz.create("Oskari.userinterface.component.Popup"),r=e.localization.title,i=e.template.wrapper.clone(),s=e.template.wrapper.clone(),o=Oskari.clazz.create("Oskari.userinterface.component.Button");o.setTitle(e.localization.button.edit),o.setHandler(function(){n.close(),e.showSelectionTools(),e.instance.getSelectionPlugin().startDrawing({drawMode:"modify"})}),s.append(o.getButton());var u=n.createCloseButton(e.localization.button.close);s.append(u.getButton()),u.setHandler(function(){n.close(),e.instance.getSelectionPlugin().stopDrawing(),e.showSelectionTools()}),i.append(s);var a=e.template.link.clone();a.append(e.localization.link.title),a.bind("click",function(){n.close(),e.showSelectionTools()}),i.append(a);var f=Oskari.clazz.create("Oskari.userinterface.component.Button");f.setTitle(e.localization.button.show),f.addClass("primary showSelection"),f.setHandler(function(){var t=e.instance.getSelectionPlugin().getFeaturesAsGeoJSON();e.instance.getSelectionPlugin().stopDrawing();var r=e.instance.sandbox.getEventBuilder("WFSSetFilter")(t);e.instance.sandbox.notifyAll(r),e.instance.sandbox.postRequestByName("userinterface.UpdateExtensionRequest",[e.instance,"detach"]),n.close()});var l=Oskari.clazz.create("Oskari.userinterface.component.Button");l.setTitle(e.localization.button.cancel),l.setHandler(function(){n.close(),e.instance.getSelectionPlugin().stopDrawing()}),n.show(r,i,[l,f]),n.moveTo("#toolbar div.toolrow[tbgroup=selectiontools]","top")}}),define("bundles/framework/bundle/featuredata2/PopupHandler",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin",function(e){this.mapModule=null,this.pluginName=null,this._sandbox=null,this._map=null,this.drawControls=null,this.drawLayer=null,this.editMode=!1,this.listeners=[],this.currentDrawMode=null,this.prefix="Default.",e&&e.id&&(this.prefix=e.id+"."),e&&e.graphicFill&&(this.graphicFill=e.graphicFill),this.multipart=e&&e.multipart===!0},{__name:"MapSelectionPlugin",getName:function(){return this.prefix+this.pluginName},getMapModule:function(){return this.mapModule},setMapModule:function(e){this.mapModule=e,this._map=e.getMap(),this.pluginName=e.getName()+this.__name},addListener:function(e){this.listeners.push(e)},startDrawing:function(e){if(e.isModify)this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);else if(e.geometry){this.editMode=!0;var t=[new OpenLayers.Feature.Vector(e.geometry)];this.drawLayer.addFeatures(t),this.drawControls.modify.selectControl.select(this.drawLayer.features[0])}else this.editMode=!1,this._toggleControl(e.drawMode)},stopDrawing:function(){this._toggleControl(),this.drawLayer.removeAllFeatures()},setDrawing:function(e){var t=[new OpenLayers.Feature.Vector(e)];this.drawLayer.addFeatures(t)},forceFinishDraw:function(){this._finishedDrawing(!0)},_finishedDrawing:function(e){(!this.multipart||e)&&this._toggleControl();if(!this.editMode){var t=this.drawLayer.features.length-1;this.drawControls.modify.selectControl.select(this.drawLayer.features[t])}var n;!this.multipart||e?(n=this._sandbox.getEventBuilder(this.prefix+"FinishedDrawingEvent")(this.getDrawing(),this.editMode),this._sandbox.notifyAll(n)):(n=this._sandbox.getEventBuilder(this.prefix+"AddedFeatureEvent")(this.getDrawing(),this.currentDrawMode),this._sandbox.notifyAll(n))},_toggleControl:function(e){this.currentDrawMode=e;for(var t in this.drawControls){var n=this.drawControls[t];e==t?n.activate():n.deactivate()}},init:function(e){var t=this;this.drawLayer=new OpenLayers.Layer.Vector(this.prefix+"FeatureData Draw Layer",{eventListeners:{featuresadded:function(e){t._finishedDrawing()}}}),this.drawControls={point:new OpenLayers.Control.DrawFeature(t.drawLayer,OpenLayers.Handler.Point),line:new OpenLayers.Control.DrawFeature(t.drawLayer,OpenLayers.Handler.Path),polygon:new OpenLayers.Control.DrawFeature(t.drawLayer,OpenLayers.Handler.Polygon),square:new OpenLayers.Control.DrawFeature(t.drawLayer,OpenLayers.Handler.RegularPolygon,{handlerOptions:{sides:4}}),circle:new OpenLayers.Control.DrawFeature(t.drawLayer,OpenLayers.Handler.RegularPolygon,{handlerOptions:{sides:40}}),modify:new OpenLayers.Control.ModifyFeature(t.drawLayer)};if(this.graphicFill!=null){var n=this.graphicFill,r=new OpenLayers.Format.SLD,i=r.read(n);if(i&&i.namedLayers)for(var s in i.namedLayers){this.drawLayer.styleMap.styles["default"]=i.namedLayers[s].userStyles[0],this.drawLayer.redraw();break}}this._map.addLayers([t.drawLayer]);for(var o in this.drawControls)this._map.addControl(this.drawControls[o]);this.geojson_format=new OpenLayers.Format.GeoJSON},getDrawing:function(){if(this.drawLayer.features.length===0)return null;var e=this.drawLayer.features[0].geometry.CLASS_NAME;if(e==="OpenLayers.Geometry.MultiPoint"||e==="OpenLayers.Geometry.MultiLineString"||e==="OpenLayers.Geometry.MultiPolygon")return this.drawLayer.features[0].geometry;var t=null,n=[];for(var r=0;r<this.drawLayer.features.length;r++)n.push(this.drawLayer.features[r].geometry);switch(e){case"OpenLayers.Geometry.Point":t=new OpenLayers.Geometry.MultiPoint(n);break;case"OpenLayers.Geometry.LineString":t=new OpenLayers.Geometry.MultiLineString(n);break;case"OpenLayers.Geometry.Polygon":t=new OpenLayers.Geometry.MultiPolygon(n)}return t},getFeatures:function(){return this.drawLayer.features},getFeaturesAsGeoJSON:function(){var e=this.geojson_format.write(this.getFeatures()),t=JSON.parse(e);return t.crs=this._getSRS(),t},getFullScreenSelection:function(){var e=this._sandbox.getMap().getBbox(),t=e.toGeometry(),n=this.geojson_format.write(t),r=JSON.parse(n),i={type:"FeatureCollection",crs:this._getSRS(),features:[]},s={type:"Feature",geometry:r,properties:{geom_type:"polygon",buffer_radius:"0"}};return i.features.push(s),i},_getSRS:function(){return{type:"EPSG",properties:{code:3067}}},register:function(){},unregister:function(){},startPlugin:function(e){this._sandbox=e,e.register(this)},stopPlugin:function(e){e.unregister(this),this._map=null,this._sandbox=null},start:function(e){},stop:function(e){}},{protocol:["Oskari.mapframework.module.Module","Oskari.mapframework.ui.module.common.mapmodule.Plugin"]}),define("bundles/framework/bundle/featuredata2/plugin/MapSelectionPlugin",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.event.FinishedDrawingEvent",function(e,t){this._drawing=e,this._modification=t==1},{__name:"FeatureData.FinishedDrawingEvent",getName:function(){return this.__name},getDrawing:function(){return this._drawing},isModification:function(){return this._modification}},{protocol:["Oskari.mapframework.event.Event"]}),define("bundles/framework/bundle/featuredata2/event/FinishedDrawingEvent",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.event.WFSSetFilter",function(e){this._geojson=e},{__name:"WFSSetFilter",getName:function(){return this.__name},getGeoJson:function(){return this._geojson}},{protocol:["Oskari.mapframework.event.Event"]}),define("bundles/framework/bundle/featuredata2/event/WFSSetFilter",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.event.AddedFeatureEvent",function(e,t){this._drawing=e,this._drawingMode=t},{__name:"FeatureData.AddedFeatureEvent",getName:function(){return this.__name},getDrawing:function(){return this._drawing},getDrawingMode:function(){return this._drawingMode}},{protocol:["Oskari.mapframework.event.Event"]}),define("bundles/framework/bundle/featuredata2/event/AddedFeatureEvent",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.Flyout",function(e){this.instance=e,this.container=null,this.state=null,this.layers={},this.tabsContainer=null,this.selectedTab=null,this.active=!1,this.mapDivId="#mapdiv",this.templateLink=jQuery('<a href="JavaScript:void(0);"></a>'),this.resizable=!0,this.resizing=!1,this.resized=!1},{getName:function(){return"Oskari.mapframework.bundle.featuredata2.Flyout"},setEl:function(e,t,n){this.container=e[0],jQuery(this.container).hasClass("featuredata")||jQuery(this.container).addClass("featuredata")},startPlugin:function(){this.tabsContainer=Oskari.clazz.create("Oskari.userinterface.component.TabContainer",this.instance.getLocalization("nodata"));var e=this.instance.sandbox.findRegisteredModuleInstance("MainMapModule"),t=e.getMap().div;t&&(this.mapDivId=t)},stopPlugin:function(){},getTitle:function(){return this.instance.getLocalization("title")},getDescription:function(){return this.instance.getLocalization("desc")},getOptions:function(){},setState:function(e){this.state=e},setResizable:function(e){this.resizable=e},createUi:function(){var e=this,t=jQuery(this.container);t.empty();var n=this.instance.sandbox,r=n.getRequestBuilder("DimMapLayerRequest"),i=n.getRequestBuilder("HighlightMapLayerRequest");this.tabsContainer.addTabChangeListener(function(t,s){if(t){var o=r(t.layer.getId());n.request(e.instance.getName(),o)}e.selectedTab=s;if(s){e.updateData(s.layer);if(e.active){var o=i(s.layer.getId());n.request(e.instance.getName(),o)}}}),this.tabsContainer.insertTo(t)},layerAdded:function(e){var t=Oskari.clazz.create("Oskari.userinterface.component.TabPanel");t.setTitle(e.getName()),t.getContainer().append(this.instance.getLocalization("loading")),t.layer=e,this.layers[""+e.getId()]=t,this.tabsContainer.addPanel(t)},layerRemoved:function(e){var t=""+e.getId(),n=this.layers[t];this.tabsContainer.removePanel(n),n.grid=null,delete n.grid,n.layer=null,delete n.layer,this.layers[t]=null,delete this.layers[t]},updateData:function(e){if(!this.active)return;var t=this.instance.sandbox.getMap(),n=this.layers[""+e.getId()],r=null;n.grid&&(r=n.grid.getSelection()),n.getContainer().empty();if(!e.isInScale(t.getScale())){n.getContainer().append(this.instance.getLocalization("errorscale"));return}n.getContainer().append(this.instance.getLocalization("loading")),this._prepareData(e);if(r&&r.length>0&&typeof r[0].featureId!="undefined")for(var i=0;i<r.length;++i)n.grid.select(r[i].featureId,!0);if(n.grid&&e.getClickedFeatureIds().length>0)for(var s=0;s<e.getClickedFeatureIds().length;++s)n.grid.select(e.getClickedFeatureIds()[s],!0);if(n.grid&&e.getSelectedFeatures().length>0)for(var o=0;o<e.getSelectedFeatures().length;++o)n.grid.select(e.getSelectedFeatures()[o][0],!0)},updateGrid:function(){if(!this.selectedTab)return;this.updateData(this.selectedTab.layer)},_enableResize:function(){var e=this,t=jQuery("div.oskari-flyoutcontent.featuredata"),n=t.parent().parent(),r=t.parent(),i=t.find("div.tabsContent"),s=0,o=0;n.find("div.tab-content").css({"padding-top":"1px","padding-right":"1px"});var u=jQuery("<div/>");u.addClass("flyout-resizer");var a=16;u.removeClass("allowHover"),u.addClass("icon-drag"),u.bind("dragstart",function(e){e.preventDefault()}),u.mousedown(function(t){if(e.resizing)return;e.resizing=!0,s=t.pageX-n[0].offsetWidth-n[0].offsetLeft,o=t.pageY-n[0].offsetHeight-n[0].offsetTop,jQuery(document).attr("unselectable","on").css("user-select","none").on("selectstart",!1)}),jQuery(document).mouseup(function(t){e.resizing=!1,e.resized=!0}),jQuery(document).mousemove(function(t){if(!e.resizing)return;var i=100,u=60,f=n.offset(),l=r.offset();if(t.pageX>f.left){var c=t.pageX-f.left-s;n.css("max-width",c.toString()+"px"),n.css("width",c.toString()+"px")}if(t.pageY-f.top>i){var h=t.pageY-f.top-o;n.css("max-height",h.toString()+"px"),n.css("height",h.toString()+"px");var p=t.pageY-l.top-o;r.css("max-height",(p-a).toString()+"px"),r.css("height",(p-a).toString()+"px");var d=jQuery("div.oskari-flyoutcontent.featuredata").find("div.tabsContent"),v=t.pageY-d[0].offsetTop-a-u;n.find("div.tab-content").css("max-height",v.toString()+"px")}}),n.find("div.oskari-flyoutcontent").css("padding-bottom","5px"),jQuery("div.flyout-resizer").length===0&&n.append(u)},_prepareData:function(e){var t=this,n=this.layers[""+e.getId()],r=this.tabsContainer.isSelected(n);if(r){n.getContainer().empty();var i=Oskari.clazz.create("Oskari.userinterface.component.GridModel");i.setIdField("__fid");var s=e.getFields().slice(0);remove_item=function(e,t){for(key in e)if(e[key]==t){e.splice(key,1);break}return e};var o,u,a=e.getFields().slice(0),f=e.getActiveFeatures().slice(0),l=e.getSelectedFeatures().slice(0);this._addFeatureValues(i,a,s,f,l),this._addFeatureValues(i,a,s,l,null),a=i.getFields(),s.push("__fid");if(!n.grid){var c=Oskari.clazz.create("Oskari.userinterface.component.Grid",this.instance.getLocalization("columnSelectorTooltip")),h=e.getLocales().slice(0);if(h)for(var p=0;p<h.length;p++)c.setColumnUIName(a[p],h[p]);c.addSelectionListener(function(n,r){t._handleGridSelect(e,r)});var d=this.instance.getLocalization("showmore");c.setAdditionalDataHandler(d,function(e,t){var n=Oskari.clazz.create("Oskari.userinterface.component.Popup");n.show(d,t),n.moveTo(e,"bottom")});var v=function(e,t){for(var n=0;n<e.length;n++)if(e[n]==t)return!0;return!1},m=[];for(var g=0;g<a.length;++g)v(s,a[g])||m.push(a[g]);c.setVisibleFields(m),c.setColumnSelector(!0),c.setResizableColumns(!0),n.grid=c}n.grid.setDataModel(i),n.grid.renderTo(n.getContainer());var y=jQuery(t.mapDivId),b=jQuery("div.oskari-flyoutcontent.featuredata"),w=b.parent().parent();t.resized||(w.find("div.tab-content").css("max-height",(y.height()/4).toString()+"px"),w.css("max-width",y.width().toString()+"px")),t.resizable&&this._enableResize()}},_addFeatureValues:function(e,t,n,r,i){for(var s=0;s<r.length;s++){featureData={},values=r[s];if(i!=null&&i.length>0)for(var o=0;o<i.length;o++)values[0]==i[o][0]&&i.splice(o,1);for(var u=0;u<t.length;u++)values[u]==null||values[u]==""?featureData[t[u]]="":(featureData[t[u]]=values[u],remove_item(n,t[u]));e.addData(featureData)}},_handleGridSelect:function(e,t,n){var r=this.instance.sandbox,i=[t],s=r.getEventBuilder("WFSFeaturesSelectedEvent");n===undefined&&(n=r.isCtrlKeyDown());var o=s(i,e,n);r.notifyAll(o)},featureSelected:function(e){if(!this.active)return;var t=e.getMapLayer(),n=this.layers[""+t.getId()],r=e.getWfsFeatureIds();if(r!=null&&r.length>0){n.grid.select(r[0],e.isKeepSelection());if(r.length>1)for(var i=1;i<r.length;++i)n.grid.select(r[i],!0)}else n.grid.removeSelections()},setEnabled:function(e){if(this.active==e)return;this.active=e==1;var t=this.instance.sandbox,n=t.getRequestBuilder("MapModulePlugin.GetFeatureInfoActivationRequest");n&&t.request(this.instance.getName(),n(!this.active));if(!this.active){if(this.selectedTab){var r=t.getRequestBuilder("DimMapLayerRequest"),i=r(this.selectedTab.layer.getId());t.request(this.instance.getName(),i)}for(var s in this.layers)s.getContainer&&s.getContainer().empty()}else if(this.selectedTab){var o=t.getRequestBuilder("HighlightMapLayerRequest"),i=o(this.selectedTab.layer.getId());t.request(this.instance.getName(),i),this.updateGrid()}}},{protocol:["Oskari.userinterface.Flyout"]}),define("bundles/framework/bundle/featuredata2/Flyout",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin",function(e){this.mapModule=null,this.pluginName=null,this._sandbox=null,this._map=null,this._conf=e,this.__elements={},this.instance=e.instance,this.template={};for(p in this.__templates)this.template[p]=jQuery(this.__templates[p])},{__name:"FeaturedataPlugin",__templates:{main:'<div class="mapplugin featuredataplugin"><a href="javascript:void(0);"></a></div>'},getName:function(){return this.pluginName},getMapModule:function(){return this.mapModule},setMapModule:function(e){this.mapModule=e,e&&(this.pluginName=e.getName()+this.__name)},hasUI:function(){return!0},init:function(e){},register:function(){},unregister:function(){},startPlugin:function(e){this._sandbox=e,this._map=this.getMapModule().getMap(),e.register(this),this._createUI()},stopPlugin:function(e){this.__elements.main&&(this.__elements.main.remove(),delete this.__elements.main),e.unregister(this)},start:function(e){},stop:function(e){},_createUI:function(){var e=this._sandbox,t=this,n=jQuery(this._map.div);t.__elements.main||(t.__elements.main=t.template.main.clone());var r=t.__elements.main.find("a");r.html(this.instance.getLocalization("title")),r.bind("click",function(){return t.instance.sandbox.postRequestByName("userinterface.UpdateExtensionRequest",[t.instance,"detach"]),!1}),t.__elements.main.mousedown(function(e){e.stopPropagation()}),n.append(t.__elements.main),this.update()},update:function(){var e=this.mapModule.getSandbox(),t=e.findAllSelectedMapLayers(),n=0;for(var r=0;r<t.length;r++){var i=t[r];i.isLayerOfType("WFS")&&n++}var s=this;n>0?s.__elements.main.show():s.__elements.main.hide()},onEvent:function(e){}},{protocol:["Oskari.mapframework.module.Module","Oskari.mapframework.ui.module.common.mapmodule.Plugin"]}),define("bundles/framework/bundle/featuredata2/plugin/FeaturedataPlugin",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequest",function(e){this._id=e},{__name:"ShowFeatureDataRequest",getName:function(){return this.__name},getId:function(){return this._id}},{protocol:["Oskari.mapframework.request.Request"]}),define("bundles/framework/bundle/featuredata2/request/ShowFeatureDataRequest",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.featuredata2.request.ShowFeatureDataRequestHandler",function(e){this.featureData=e},{handleRequest:function(e,t){var n=t.getId(),r=this.featureData.plugins["Oskari.userinterface.Flyout"],i=r.tabsContainer.panels;for(var s=0;s<i.length;s++)if(i[s].layer.getId()===n){r.tabsContainer.select(i[s]);break}this.featureData.sandbox.postRequestByName("userinterface.UpdateExtensionRequest",[this.featureData,"detach"])}},{protocol:["Oskari.mapframework.core.RequestHandler"]}),define("bundles/framework/bundle/featuredata2/request/ShowFeatureDataRequestHandler",function(){}),define("normalize",["require","module"],function(e,t){function o(e,t,n){if(e.indexOf("data:")===0)return e;e=r(e);if(e.match(/^\//)||e.match(s))return e;var i=n.match(s),o=t.match(s);return o&&(!i||i[1]!=o[1]||i[2]!=o[2])?u(e,t):a(u(e,t),n)}function u(e,t){e.substr(0,2)=="./"&&(e=e.substr(2));var n=t.split("/"),r=e.split("/");n.pop();while(curPart=r.shift())curPart==".."?n.pop():n.push(curPart);return n.join("/")}function a(e,t){var n=t.split("/");n.pop(),t=n.join("/")+"/",i=0;while(t.substr(i,1)==e.substr(i,1))i++;while(t.substr(i,1)!="/")i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");out="";while(n.shift())out+="../";while(curPart=r.shift())out+=curPart+"/";return out.substr(0,out.length-1)}var n=/([^:])\/+/g,r=function(e){return e.replace(n,"$1/")},s=/[^\:\/]*:\/\/([^\/])*/,f=function(e,t,n,i){t=r(t),n=r(n);var s=/@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig,u,a,e;while(u=s.exec(e)){a=u[3]||u[2]||u[5]||u[6]||u[4];var f;i&&a.substr(0,1)=="/"?f=i+a:f=o(a,t,n);var l=u[5]||u[6]?1:0;e=e.substr(0,s.lastIndex-a.length-l-1)+f+e.substr(s.lastIndex-l-1),s.lastIndex=s.lastIndex+(f.length-a.length)}return e};return f.convertURIBase=o,f}),define("css",["./normalize"],function(e){function t(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}if(typeof window=="undefined")return{load:function(e,t,n){n()}};var n=!1,r=document.getElementsByTagName("head")[0],i=window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)/),s=!1;!i||(i[1]||i[7]?(s=parseInt(i[1])<6||parseInt(i[7])<=9,i="trident"):i[2]?(s=!0,i="webkit"):i[3]||(i[4]?(s=parseInt(i[4])<18,i="gecko"):n&&alert("Engine detection failed")));var o={},u=/^\/|([^\:\/]*:)/;o.pluginBuilder="./css-builder";var a=[],f={},l=[];o.addBuffer=function(e){if(t(a,e)!=-1)return;if(t(l,e)!=-1)return;a.push(e),l.push(e)},o.setBuffer=function(t,n){var r=window.location.pathname.split("/");r.pop(),r=r.join("/")+"/";var i=require.toUrl("base_url").split("/");i.pop();var s=i.join("/")+"/";s=e.convertURIBase(s,r,"/"),s.match(u)||(s="/"+s),s.substr(s.length-1,1)!="/"&&(s+="/"),o.inject(e(t,s,r));for(var l=0;l<a.length;l++)(n&&a[l].substr(a[l].length-5,5)==".less"||!n&&a[l].substr(a[l].length-4,4)==".css")&&(function(e){f[e]=f[e]||!0,setTimeout(function(){typeof f[e]=="function"&&f[e](),delete f[e]},7)}(a[l]),a.splice(l--,1))},o.attachBuffer=function(e,n){for(var r=0;r<a.length;r++)if(a[r]==e)return f[e]=n,!0;if(f[e]===!0)return f[e]=n,!0;if(t(l,e)!=-1)return n(),!0};var c=function(e,t){setTimeout(function(){for(var n=0;n<document.styleSheets.length;n++){var r=document.styleSheets[n];if(r.href==e.href)return t()}c(e,t)},10)},h=function(e,t){setTimeout(function(){try{return e.sheet.cssRules,t()}catch(n){}h(e,t)},10)};if(i=="trident"&&s)var p=[],d=[],v=0,m=function(e,t){var n;d.push({url:e,cb:t}),n=p.shift(),!n&&v++<31&&(n=document.createElement("style"),r.appendChild(n)),n&&g(n)},g=function(e){var t=d.shift();if(!t){e.onload=b,p.push(e);return}e.onload=function(){t.cb(t.ss),g(e)};var n=e.styleSheet;t.ss=n.imports[n.addImport(t.url)]};var y=function(e){var t=document.createElement("link");return t.type="text/css",t.rel="stylesheet",t.href=e,t},b=function(){};o.linkLoad=function(e,t){var o=setTimeout(function(){n&&alert("timeout"),t()},L*1e3-100),u=function(){clearTimeout(o),a&&(a.onload=b),setTimeout(t,7)};if(!s){var a=y(e);a.onload=u,r.appendChild(a)}else if(i=="webkit"){var a=y(e);c(a,u),r.appendChild(a)}else if(i=="gecko"){var f=document.createElement("style");f.textContent='@import "'+e+'"',h(f,u),r.appendChild(f)}else i=="trident"&&m(e,u)};var w=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],E={},S=function(e,t,n){if(E[e]){t(E[e]);return}var r,i,s;if(typeof XMLHttpRequest!="undefined")r=new XMLHttpRequest;else if(typeof ActiveXObject!="undefined")for(i=0;i<3;i+=1){s=w[i];try{r=new ActiveXObject(s)}catch(o){}if(r){w=[s];break}}r.open("GET",e,requirejs.inlineRequire?!1:!0),r.onreadystatechange=function(i){var s,o;r.readyState===4&&(s=r.status,s>399&&s<600?(o=new Error(e+" HTTP status: "+s),o.xhr=r,n(o)):(E[e]=r.responseText,t(r.responseText)))},r.send(null)},x=0,T;o.inject=function(e){x<31&&(T=document.createElement("style"),T.type="text/css",r.appendChild(T),x++),T.styleSheet?T.styleSheet.cssText+=e:T.appendChild(document.createTextNode(e))};var N=/@import\s*(url)?\s*(('([^']*)'|"([^"]*)")|\(('([^']*)'|"([^"]*)"|([^\)]*))\))\s*;?/g,C=window.location.pathname.split("/");C.pop(),C=C.join("/")+"/";var k=function(t,n,r){t.match(u)||(t="/"+e.convertURIBase(t,C,"/")),S(t,function(i){i=e(i,t,C);var s=[],o=[],u=[],a;while(a=N.exec(i)){var f=a[4]||a[5]||a[7]||a[8]||a[9];s.push(f),o.push(N.lastIndex-a[0].length),u.push(a[0].length)}var l=0;for(var c=0;c<s.length;c++)(function(e){k(s[e],function(t){i=i.substr(0,o[e])+t+i.substr(o[e]+u[e]);var r=t.length-u[e];for(var a=e+1;a<s.length;a++)o[a]+=r;l++,l==s.length&&n(i)},r)})(c);s.length==0&&n(i)},r)};o.normalize=function(e,t){return e.substr(e.length-4,4)==".css"&&(e=e.substr(0,e.length-4)),t(e)};var L,A=!1;return o.load=function(e,t,r,i,u){L=L||i.waitSeconds||7;var a=e+(u?".less":".css");if(o.attachBuffer(a,r))return;var f=t.toUrl(a);!A&&n&&(alert(s?"hacking links":"not hacking"),A=!0),u?k(f,function(e){u&&(e=u(e,function(e){o.inject(e),setTimeout(r,7)}))}):o.linkLoad(f,r)},n&&(o.inspect=function(){if(stylesheet.styleSheet)return stylesheet.styleSheet.cssText;if(stylesheet.innerHTML)return stylesheet.innerHTML}),o}),requirejs.s.contexts._.nextTick=function(e){e()},require(["css"],function(e){e.addBuffer("resources/framework/bundle/featuredata2/css/style.css")}),requirejs.s.contexts._.nextTick=requirejs.nextTick,Oskari.registerLocalization({lang:"fi",key:"FeatureData2",value:{title:"Kohdetiedot",desc:"",loading:"Ladataan...",showmore:"Näytä",nodata:"Valitsemillasi karttatasoilla ei ole kohdetietoja.",featureNameAll:"Tietotyyppi",errorscale:"Tällä mittakaavatasolla ei voida näyttää kohdetietoja. Muuta mittakaavatasoa.",errordata:"Palvelimelta saatu tieto oli virheellistä. Siirrä hieman karttaa päivittääksesi tiedot.",columnSelectorTooltip:"Näytä sarakkeet",popup:{title:"Valitse kohteita kartalta",instructions:" ",link:{title:"Lisää valinta"},button:{cancel:"Peruuta",show:"Näytä kohteet",close:"Sulje",edit:"Muokkaa"},tools:{point:{tooltip:"Lisää piste"},line:{tooltip:"Lisää viiva"},polygon:{tooltip:"Lisää alue"},square:{tooltip:"Lisää suorakulmio"},circle:{tooltip:"Lisää ympyrä"},select:{tooltip:"Valitse kohteita"}}}}}),define("bundles/framework/bundle/featuredata2/locale/fi",function(){}),Oskari.registerLocalization({lang:"sv",key:"FeatureData2",value:{title:"Objektuppgifter",desc:"",loading:"Laddar ned",showmore:"Visa",nodata:"Kartlagren du valt saknar uppgifter om objekt.",featureNameAll:"Datatyp",errorscale:"Uppgifter om objekt kan inte visas på denna skalnivå. Byt skalnivå.",errordata:"Fel i data från servern. Flytta något på kartan för att uppdatera.",columnSelectorTooltip:"Visa kolumner",popup:{title:"Markera objekt på kartan",instructions:" ",link:{title:"välja mer"},button:{cancel:"Avbryt",show:"Visa",close:"Stäng",edit:"Redigera"},tools:{point:{tooltip:"Lägg punkt"},line:{tooltip:"Lägg rad"},polygon:{tooltip:"Lägg polygon"},square:{tooltip:"Lägg kvadrat"},circle:{tooltip:"Lägg cirkel"},select:{tooltip:"Markera objekt"}}}}}),define("bundles/framework/bundle/featuredata2/locale/sv",function(){}),Oskari.registerLocalization({lang:"en",key:"FeatureData2",value:{title:"Object data",desc:"",loading:"Loading",showmore:"Show",nodata:"Selected map layers contain no attribute data.",featureNameAll:"Data type",errorscale:"Data cannot be shown at this scale level. Please change the scale level.",errordata:"Data provided by the server contains errors. Please move the map slightly to update it.",columnSelectorTooltip:"Show columns",popup:{title:"Select features on the map",instructions:" ",link:{title:"Select more"},button:{cancel:"Cancel",show:"View places",close:"Close",edit:"Edit"},tools:{point:{tooltip:"Add point"},line:{tooltip:"Add line"},polygon:{tooltip:"Add polygon"},square:{tooltip:"Add rectangle"},circle:{tooltip:"Add circle"},select:{tooltip:"Select objects"}}}}}),define("bundles/framework/bundle/featuredata2/locale/en",function(){}),define("bundles/framework/bundle/featuredata2/module",["oskari","jquery","./instance","./PopupHandler","./plugin/MapSelectionPlugin","./event/FinishedDrawingEvent","./event/WFSSetFilter","./event/AddedFeatureEvent","./Flyout","./plugin/FeaturedataPlugin","./request/ShowFeatureDataRequest","./request/ShowFeatureDataRequestHandler","css!resources/framework/bundle/featuredata2/css/style.css","./locale/fi","./locale/sv","./locale/en"],function(e,t){return e.bundleCls("featuredata2").category({create:function(){var t=this,n=e.clazz.create("Oskari.mapframework.bundle.featuredata2.FeatureDataBundleInstance");return n},update:function(e,t,n,r){}})}),requirejs.s.contexts._.nextTick=function(e){e()},require(["css"],function(e){e.setBuffer("/* Selected row hightlighting */\n.featuredata tbody tr.selected {\n  background-color: #FEF2BA; }\n\n/* Override common table settings */\n.featuredata th, .featuredata td {\n  text-align: left;\n  padding-left: 2px;\n  padding-right: 15px; }\n\n/* Override sort img position */\n.featuredata th.asc {\n  background-position: right center; }\n\n/* Override sort img position */\n.featuredata th.desc {\n  background-position: right center; }\n\n.featuredata div.tab-content {\n  max-height: 535px;\n  overflow: auto; }\n\ndiv.featuredataplugin.mapplugin {\n  top: 450px;\n  right: 30px;\n  display: block;\n  color: #3C3C3C;\n  background: white;\n  font-size: 12px;\n  font-weight: bold;\n  border: 1px solid;\n  padding: 5px;\n  z-index: 15000; }\n\ndiv.flyout-resizer {\n  height: 16px;\n  width: 16px;\n  margin: 0;\n  padding: 0;\n  float: right;\n  right: 0;\n  bottom: 16px;\n  cursor: nw-resize; }\n\n.link {\n  padding: 20px 0px 0px 0px;\n  color: #0066ff;\n  font-size: 13px;\n  text-decoration: underline;\n  display: block; }\n")}),requirejs.s.contexts._.nextTick=requirejs.nextTick;