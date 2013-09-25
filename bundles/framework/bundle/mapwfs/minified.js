/** modifications free software  (c) 2009-IV maanmittauslaitos.fi **/

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/* 
/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. 
 */

Oskari.clazz.define("Oskari.mapframework.domain.WfsLayer",function(){this._layerType="WFS"},{},{extend:["Oskari.mapframework.domain.AbstractLayer"]}),define("bundles/framework/bundle/mapwfs/domain/WfsLayer",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs.domain.WfsLayerModelBuilder",function(e){this.sandbox=e,this.localization=Oskari.getLocalization("MapWfs")},{parseLayerData:function(e,t,n){var r=this,i=this.localization["object-data"],s=Oskari.clazz.builder("Oskari.mapframework.domain.Tool"),o=s();o.setName("objectData"),o.setTitle(i),o.setTooltip(i),o.setCallback(function(){r.sandbox.postRequestByName("ShowFeatureDataRequest",[e.getId()])}),e.addTool(o)}}),define("bundles/framework/bundle/mapwfs/domain/WfsLayerModelBuilder",function(){}),Oskari.clazz.define("Oskari.mapframework.gridcalc.QueuedTile",function(e){for(p in e)this[p]=e[p]},{getBounds:function(){return this.bounds}}),define("bundles/framework/bundle/mapwfs/domain/QueuedTile",function(){}),Oskari.clazz.define("Oskari.mapframework.gridcalc.TileQueue",function(){this.queue=[]},{getQueue:function(){return this.queue},getLength:function(){return this.queue.length},popJob:function(){var e=this.queue,t=e.length;if(t===0)return null;if(t<4)return e.shift(-1);var n=null,r=Math.floor(t/2);return n=e[r],this.queue=e.slice(0,r).concat(e.slice(r+1)),n},pushJob:function(e){this.queue.push(e)},flushQueue:function(){this.queue=[]}}),define("bundles/framework/bundle/mapwfs/domain/TileQueue",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs.domain.WfsTileRequest",function(e,t,n,r,i,s){this._bbox=t,this._mapWidth=n,this._mapHeight=r,this._mapLayer=e,this._creator=i,this._sequenceNumber=s},{getMapLayer:function(){return this._mapLayer},getBbox:function(){return this._bbox},getMapWidth:function(){return this._mapWidth},getMapHeight:function(){return this._mapHeight},getSequenceNumber:function(){return this._sequenceNumber}}),define("bundles/framework/bundle/mapwfs/domain/WfsTileRequest",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs.event.WFSFeaturesSelectedEvent",function(e,t,n){this._wfsFeatureIds=e,this._addToSelection=n,this._mapLayer=t},{__name:"WFSFeaturesSelectedEvent",getName:function(){return this.__name},getWfsFeatureIds:function(){return this._wfsFeatureIds},isKeepSelection:function(){return this._addToSelection?this._addToSelection:!1},getMapLayer:function(){return this._mapLayer}},{protocol:["Oskari.mapframework.event.Event"]}),define("bundles/framework/bundle/mapwfs/event/WFSFeaturesSelectedEvent",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs.service.WfsTileService",function(e){this.plugin=e,this._TILE_SIZE_IN_PIXELS=256,this._componentName="WfsRequestTiler",this._mapPollingInterval=100,this._simultaneousPngRequest=4,this._wfsMapUpdateRequests={},this._WFSFeaturesSelectedEvent=null,this._tileCount=16,this._doMapLayerReArrange=!1,this.sandbox=e._sandbox,this.pngUrl=this.sandbox.getAjaxUrl()},{__qname:"Oskari.mapframework.bundle.mapwfs.service.WfsTileService",getQName:function(){return this.__qname},__name:"WfsTileService",getName:function(){return this.__name},scheduleMapLayerRearrangeAfterWfsMapTilesAreReady:function(){this._doMapLayerReArrange=!0},removeWFsLayerRequests:function(e){var t=e.getId();this._wfsMapUpdateRequests[t]!==null&&(this._wfsMapUpdateRequests[t]=null,delete this._wfsMapUpdateRequests[t])},removeWFSMapHighlightRequest:function(){this._WFSFeaturesSelectedEvent=null},scheduleWFSMapLayerUpdate:function(e,t,n,r,i){var s=e.getId(),o=this._wfsMapUpdateRequests[s];o!==null&&(this._wfsMapUpdateRequests[s]=null,delete this._wfsMapUpdateRequests[s]),this._wfsMapUpdateRequests[s]=[];var u=this.splitBbox(t,n,r,this._TILE_SIZE_IN_PIXELS);this._tileCount=u.length;var a=Oskari.clazz.builder("Oskari.mapframework.bundle.mapwfs.domain.WfsTileRequest");for(var f=0;f<u.length;f++){var l=a(e,u[f],n,r,i,f);this._wfsMapUpdateRequests[s].push(l)}this._doMapLayerReArrange=!0},scheduleWFSMapHighlightUpdate:function(e){this._WFSFeaturesSelectedEvent=e,this.processHighlightQueue()},splitBbox:function(e,t,n,r){var i=this.sandbox.getMap(),s=[];if(i){var o=this.plugin.getTileQueue();o&&(s=o.getQueue())}return s},processMapQueue:function(){var e=this;this.sandbox.printDebug("[WfsTileService.processMapQueue] Looping this._wfsMapUpdateRequests...");for(var t in this._wfsMapUpdateRequests){var n=this._wfsMapUpdateRequests[t];if(n!==null&&n.length>0){this.sandbox.printDebug("[WfsTileService.processMapQueue] Got requestArray of size "+n.length+" for id "+t);var r=n[0];this.sandbox.printDebug("[WfsTileService.processMapQueue] Creating request for '"+r.getMapLayer().getName()+"'");var i=r.getBbox(),s=this.sandbox.getMap().getZoom(),o=this.pngUrl+"&flow_pm_wfsLayerId="+r.getMapLayer().getId()+"&flow_pm_bbox_min_x="+i.bounds.left+"&flow_pm_bbox_min_y="+i.bounds.bottom+"&flow_pm_bbox_max_x="+i.bounds.right+"&flow_pm_bbox_max_y="+i.bounds.top+"&flow_pm_map_width="+this._TILE_SIZE_IN_PIXELS+"&flow_pm_map_height="+this._TILE_SIZE_IN_PIXELS+"&flow_pm_zoom_level="+s+"&srs="+this.sandbox.getMap().getSrsName()+"&action_route=GET_PNG_MAP",u="WFS_LAYER_IMAGE_"+r.getMapLayer().getId()+"_"+r.getSequenceNumber();e.plugin.drawImageTile(r.getMapLayer(),o,i,u),this.sandbox.printDebug("[WfsTileService.processMapQueue] removing handled element"),n.splice(0,1),n.length===0&&(delete this._wfsMapUpdateRequests[t],this.sandbox.printDebug("[WfsTileService.processMapQueue] deleting empty requestArray"));return}}this.sandbox.printDebug("[WfsTileService.processMapQueue] _doMapLayerReArrange is "+this._doMapLayerReArrange);if(this._doMapLayerReArrange){var a=this.sandbox.getRequestBuilder("RearrangeSelectedMapLayerRequest"),f=a();this.sandbox.request(this.plugin,f),this._doMapLayerReArrange=!1}},processHighlightQueue:function(){var e=this._WFSFeaturesSelectedEvent;if(!e)return;try{var t=e.getMapLayer();if(!t.isLayerOfType("WFS"))throw"Trying to highlight feature from layer that is not WFS layer!";var n=e.getWfsFeatureIds();if(!n||n.length==0){e.isKeepSelection()||this.plugin.removeHighlightOnMapLayer(t.getId());return}var r=this.sandbox.getMap(),i=r.getBbox(),s=r.getWidth(),o=r.getHeight(),u=this,a=u.pngUrl+"&flow_pm_wfsLayerId="+t.getId()+"&flow_pm_bbox_min_x="+i.left+"&flow_pm_bbox_min_y="+i.bottom+"&flow_pm_bbox_max_x="+i.right+"&flow_pm_bbox_max_y="+i.top+"&flow_pm_map_width="+s+"&flow_pm_map_height="+o+"&action_route=GET_HIGHLIGHT_WFS_FEATURE_IMAGE",f=function(r){u.plugin.drawImageTile(t,a+"&wfsFeatureId="+r,i,"HIGHLIGHTED_FEATURE",e.isKeepSelection()||n.length>1)};for(var l=0;l<n.length;++l)f(n[l])}finally{}},startPollers:function(){for(i=0;i<this._tileCount;i++)this.processMapQueue()}},{protocol:["Oskari.mapframework.service.Service"]}),define("bundles/framework/bundle/mapwfs/service/WfsTileService",function(){}),Oskari.clazz.define("Oskari.mapframework.gridcalc.QueuedTilesGrid",function(e){this.grid=[],this.map=null,this.tileSize=null,this.maxExtent=null,this.buffer=0,this.numLoadingTiles=0;for(p in e)this[p]=e[p]},{destroy:function(){this.clearGrid(),this.grid=null,this.tileSize=null},clearGrid:function(){if(this.grid){for(var e=0,t=this.grid.length;e<t;e++){var n=this.grid[e];for(var r=0,i=n.length;r<i;r++){var s=n[r];s.destroy()}}this.grid=[]}},moveTo:function(e,t){e=e||this.map.getExtent();if(e!=null){var n=!this.grid.length||t,r=this.getTilesBounds();n||!r.containsBounds(e,!0)?this.initGriddedTiles(e):this.moveGriddedTiles(e)}},setTileSize:function(e){},getTilesBounds:function(){var e=null;if(this.grid.length){var t=this.grid.length-1,n=this.grid[t][0],r=this.grid[0].length-1,i=this.grid[0][r];e=new OpenLayers.Bounds(n.bounds.left,n.bounds.bottom,i.bounds.right,i.bounds.top)}return e},calculateGridLayout:function(e,t,n){var r=n*this.tileSize.w,i=n*this.tileSize.h,s=e.left-t.left,o=Math.floor(s/r)-this.buffer,u=s/r-o,a=-u*this.tileSize.w,f=t.left+o*r,l=e.top-(t.bottom+i),c=Math.ceil(l/i)+this.buffer,h=c-l/i,p=-h*this.tileSize.h,d=t.bottom+c*i;return{tilelon:r,tilelat:i,tileoffsetlon:f,tileoffsetlat:d,tileoffsetx:a,tileoffsety:p}},initGriddedTiles:function(e){var t=this.map.getSize(),n=Math.ceil(t.h/this.tileSize.h)+Math.max(1,2*this.buffer),r=Math.ceil(t.w/this.tileSize.w)+Math.max(1,2*this.buffer),i=this.maxExtent,s=this.map.getResolution(),o=this.calculateGridLayout(e,i,s),u=Math.round(o.tileoffsetx),a=Math.round(o.tileoffsety),f=o.tileoffsetlon,l=o.tileoffsetlat,c=o.tilelon,h=o.tilelat;this.origin=new OpenLayers.Pixel(u,a);var p=u,d=f,v=0,m=parseInt(this.map.layerContainerDiv.style.left),g=parseInt(this.map.layerContainerDiv.style.top);do{var y=this.grid[v++];y||(y=[],this.grid.push(y)),f=d,u=p;var b=0;do{var w=new OpenLayers.Bounds(f,l,f+c,l+h),E=u;E-=m;var S=a;S-=g;var x=new OpenLayers.Pixel(E,S),T=y[b++];T?T.moveTo(w,x,!1):(T=this.addTile(w,x),y.push(T)),f+=c,u+=this.tileSize.w}while(f<=e.right+c*this.buffer||b<r);l-=h,a+=this.tileSize.h}while(l>=e.bottom-h*this.buffer||v<n);this.removeExcessTiles(v,b)},addTile:function(e,t){return new OpenLayers.Tile(this.layer,e,t,"",this.tileSize)},moveGriddedTiles:function(e){var t=this.buffer||1;for(;;){var n=this.grid[0][0].position,r=this.map.getViewPortPxFromLayerPx(n);if(r.x>-this.tileSize.w*(t-1))this.shiftColumn(!0);else if(r.x<-this.tileSize.w*t)this.shiftColumn(!1);else if(r.y>-this.tileSize.h*(t-1))this.shiftRow(!0);else{if(!(r.y<-this.tileSize.h*t))break;this.shiftRow(!1)}}},shiftRow:function(e){var t=e?0:this.grid.length-1,n=this.grid,r=n[t],i=this.map.getResolution(),s=e?-this.tileSize.h:this.tileSize.h,o=i*-s,u=e?n.pop():n.shift();for(var a=0,f=r.length;a<f;a++){var l=r[a],c=l.bounds.clone(),h=l.position.clone();c.bottom=c.bottom+o,c.top=c.top+o,h.y=h.y+s,u[a].moveTo(c,h)}e?n.unshift(u):n.push(u)},shiftColumn:function(e){var t=e?-this.tileSize.w:this.tileSize.w,n=this.map.getResolution(),r=n*t;for(var i=0,s=this.grid.length;i<s;i++){var o=this.grid[i],u=e?0:o.length-1,a=o[u],f=a.bounds.clone(),l=a.position.clone();f.left=f.left+r,f.right=f.right+r,l.x=l.x+t;var c=e?this.grid[i].pop():this.grid[i].shift();c.moveTo(f,l),e?o.unshift(c):o.push(c)}},removeExcessTiles:function(e,t){while(this.grid.length>e){var n=this.grid.pop();for(var r=0,i=n.length;r<i;r++){var s=n[r];s.destroy()}}while(this.grid[0].length>t)for(var r=0,i=this.grid.length;r<i;r++){var n=this.grid[r],s=n.pop();s.destroy()}},onMapResize:function(){},CLASS_NAME:"NLSFI.OpenLayers.Strategy.QueuedTilesGrid"}),define("bundles/framework/bundle/mapwfs/plugin/wfslayer/QueuedTilesGrid",function(){}),Oskari.clazz.define("Oskari.mapframework.gridcalc.QueuedTilesStrategy",function(e){this.debugGridFeatures=!0,this.options=e,this.tileQueue=e.tileQueue,this.autoActivate=!0,this.autoDestroy=!1,this.grid=null,this.bounds=null;for(p in e)this[p]=e[p];this.active=!1},{setLayer:function(e){this.layer=e},flushTileQueue:function(){var e=this.tileQueue.queue,t=[];for(var n=0;n<e.length;n++)e[n].tileFeature!=null&&(t.push(e[n].tileFeature),e[n].tileFeature=null);t.length>0&&this.layer.destroyFeatures(t),this.tileQueue.flushQueue()},unloadOutOfViewFeatures:function(){},ratio:1,activate:function(){return this.active?!1:(this.active=!0,this.grid=Oskari.clazz.create("Oskari.mapframework.gridcalc.QueuedTilesGrid",{map:this.layer.map,layer:this.layer,maxExtent:this.layer.map.getMaxExtent(),tileSize:this.layer.map.getTileSize()}),this.layer.events.on({refresh:this.updateRefresh,scope:this}),!0)},deactivate:function(){return this.active?(this.layer.events.un({refresh:this.update,scope:this}),this.grid.destroy(),this.grid=null,!0):!1},updateRefresh:function(e){this.update()},updateMoveEnd:function(e){this.update()},update:function(e){var t=this.layer.map.getExtent();this.grid.moveTo(t,!0),this.flushTileQueue();var n=this.layer.map.getZoom();if(n<this.minZoom)return;this.triggerRead()},invalidBounds:function(e){return e||(e=this.layer.map.getExtent()),!this.bounds||!this.bounds.containsBounds(e)},triggerUnload:function(e){this.layer.destroyFeatures()},triggerRead:function(){var e=this.grid.grid,t=[],n=this.debugGridFeatures;for(var r=0;r<e.length;r++)for(var i=0;i<e[r].length;i++){var s=e[r][i].bounds.clone(),o={left:s.left,top:s.top,right:s.right,bottom:s.bottom},u=null;if(n){var a=new OpenLayers.Geometry.Point(s.left,s.bottom),f=new OpenLayers.Geometry.Point(s.right,s.top),l=new OpenLayers.Geometry.Point(s.left,s.top),c=new OpenLayers.Geometry.Point(s.right,s.bottom),h=new OpenLayers.Geometry.LineString([a,c,f,l,a]),u=new OpenLayers.Feature.Vector(h,{featureClassName:this.CLASS_NAME,description:""});u.renderIntent="tile",t.push(u)}var p=Oskari.clazz.create("Oskari.mapframework.gridcalc.QueuedTile",{bounds:o,tileFeature:u});this.tileQueue.pushJob(p)}n&&this.layer.addFeatures(t)},merge:function(e){var t=e.features;t&&t.length>0&&this.layer.addFeatures(t)},CLASS_NAME:"NLSFI.OpenLayers.Strategy.QueuedTilesStrategy"}),define("bundles/framework/bundle/mapwfs/plugin/wfslayer/QueuedTilesStrategy",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs.plugin.wfslayer.WfsLayerPlugin",function(e){this.mapModule=null,this.pluginName=null,this._sandbox=null,this._map=null,this._supportedFormats={},this.service=null,this.config=e},{__name:"WfsLayerPlugin",getName:function(){return this.pluginName},getMapModule:function(){return this.mapModule},setMapModule:function(e){this.mapModule=e,this.pluginName=e.getName()+this.__name},init:function(){var e=(this.config?this.config.sandbox:null)||"sandbox",t=Oskari.getSandbox(e),n=t.getService("Oskari.mapframework.service.MapLayerService");if(n){n.registerLayerModel("wfslayer","Oskari.mapframework.domain.WfsLayer");var r=Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs.domain.WfsLayerModelBuilder",t);n.registerLayerModelBuilder("wfslayer",r)}},register:function(){this.getMapModule().setLayerPlugin("wfslayer",this)},unregister:function(){this.getMapModule().setLayerPlugin("wfslayer",null)},startPlugin:function(e){this._sandbox=e,this._map=this.getMapModule().getMap(),this.createTilesGrid(),this.service=Oskari.clazz.create("Oskari.mapframework.bundle.mapwfs.service.WfsTileService",this),e.register(this);for(p in this.eventHandlers)e.registerForEventByName(this,p)},stopPlugin:function(e){for(p in this.eventHandlers)e.unregisterFromEventByName(this,p);e.unregister(this),this._map=null,this._sandbox=null},start:function(e){},stop:function(e){},eventHandlers:{AfterMapMoveEvent:function(e){var t=this._sandbox.getObjectCreator(e);this._sandbox.printDebug("[WfsLayerPlugin] got AfterMapMoveEvent from "+t),this.afterAfterMapMoveEvent()},AfterMapLayerAddEvent:function(e){this.afterMapLayerAddEvent(e)},AfterMapLayerRemoveEvent:function(e){var t=e.getMapLayer();t.isLayerOfType("WFS")&&this.afterMapLayerRemoveEvent(e)},AfterHighlightWFSFeatureRowEvent:function(e){this.handleAfterHighlightWFSFeatureRowEvent(e)},AfterChangeMapLayerOpacityEvent:function(e){this.afterChangeMapLayerOpacityEvent(e)},AfterDimMapLayerEvent:function(e){this.handleAfterDimMapLayerEvent(e)},MapClickedEvent:function(e){if(this._sandbox.getMap().isMoving())return;var t=e.getLonLat(),n=e.getMouseX(),r=e.getMouseY();this._getFeatureIds(t,n,r)},WFSFeaturesSelectedEvent:function(e){this.service.scheduleWFSMapHighlightUpdate(e)},MapLayerVisibilityChangedEvent:function(e){e.getMapLayer().isVisible()&&this.afterAfterMapMoveEvent()}},onEvent:function(e){return this.eventHandlers[e.getName()].apply(this,[e])},preselectLayers:function(e){var t=this._sandbox;for(var n=0;n<e.length;n++){var r=e[n],i=r.getId();if(!r.isLayerOfType("WFS"))continue;t.printDebug("[WfsLayerPlugin] preselecting "+i),this.addMapLayerToMap(r,!0,r.isBaseLayer())}},afterChangeMapLayerOpacityEvent:function(e){var t=e.getMapLayer();if(!t.isLayerOfType("WFS"))return;var n=this.getOLMapLayers(t);for(var r=0;r<n.length;r++)n[r].setOpacity(t.getOpacity()/100)},handleAfterDimMapLayerEvent:function(e){var t=e.getMapLayer();if(t.isLayerOfType("WFS")){var n=new RegExp("wfs_layer_"+t.getId()+"_HIGHLIGHTED_FEATURE*","i"),r=this._map.getLayersByName(n);for(var i=0;i<r.length;i++)r[i].destroy()}},afterMapLayerAddEvent:function(e){this.addMapLayerToMap(e.getMapLayer(),e.getKeepLayersOrder(),e.isBasemap()),this.afterAfterMapMoveEvent()},addMapLayerToMap:function(e,t,n){},afterMapLayerRemoveEvent:function(e){var t=e.getMapLayer();this.service.removeWFsLayerRequests(t),this.removeMapLayerFromMap(t)},removeMapLayerFromMap:function(e){var t=this.getOLMapLayers(e);for(var n=0;n<t.length;n++)t[n].destroy()},getOLMapLayers:function(e){if(e&&!e.isLayerOfType("WFS"))return;var t="";e&&(t="_"+e.getId());var n=new RegExp("wfs_layer"+t+"_*","i");return this._map.getLayersByName(n)},drawImageTile:function(e,t,n,r,i){var s="wfs_layer_"+e.getId()+"_"+r,o=null;n.bounds&&n.bounds.left&&n.bounds.right&&n.bounds.top&&n.bounds.bottom?o=new OpenLayers.Bounds(n.bounds.left,n.bounds.bottom,n.bounds.right,n.bounds.top):n.left&&n.right&&n.top&&n.bottom&&(o=new OpenLayers.Bounds(n.left,n.bottom,n.right,n.top));if(!(t&&e&&o))return;var u=this.mapModule.calculateLayerScales(e.getMaxScale(),e.getMinScale()),a=null;if(!i){var f=this._map.getLayersByName(s);for(var l=0;l<f.length;l++)a=this._map.getLayerIndex(f[l]),f[l].destroy()}var c=new OpenLayers.Size(256,256),h=new OpenLayers.Layer.Image(s,t,o,c,{scales:u,transparent:!0,format:"image/png",isBaseLayer:!1,displayInLayerSwitcher:!0,visibility:!0,buffer:0});h.opacity=e.getOpacity()/100,this._map.addLayer(h),h.setVisibility(!0),h.redraw(!0);var p=this._map.layers.length,d=this._map.getLayersByName("Markers");d.length>0&&(this._map.setLayerIndex(d[0],p),p--),a!==null&&h!==null&&this._map.setLayerIndex(h,a);var v=new RegExp("wfs_layer_"+e.getId()+"_WFS_LAYER_IMAGE*","i"),m=this._map.getLayersByName(v);if(m.length>0){var g=this._map.getLayerIndex(m[m.length-1]),y=this._map.getLayersByName(s);y.length>0&&this._map.setLayerIndex(y[0],g)}},handleAfterHighlightWFSFeatureRowEvent:function(e){var t=e.getWfsFeatureIds();if(t.length==0&&!e.isKeepSelection()){var n=e.getMapLayer();this.removeHighlightOnMapLayer(n.getId())}},removeHighlightOnMapLayer:function(e){var t="";e&&(t="wfs_layer_"+e);var n=new RegExp(t+"_HIGHLIGHTED_FEATURE*","i"),r=this._map.getLayersByName(n);for(var i=0;i<r.length;i++)r[i].destroy()},updateWfsImages:function(e){var t=Oskari.$().sandbox.findAllSelectedMapLayers();for(var n=0;n<t.length;n++)t[n].isInScale()&&t[n].isVisible()&&t[n].isLayerOfType("WFS")&&this.doWfsLayerRelatedQueries(t[n])},doWfsLayerRelatedQueries:function(e){if(!e.isInScale())return;var t=this._sandbox.getMap(),n=t.getBbox(),r=t.getWidth(),i=t.getHeight();this.service.scheduleWFSMapLayerUpdate(e,n,r,i,this.getName()),this.service.startPollers()},afterAfterMapMoveEvent:function(){this.tileStrategy.update(),this._tilesLayer.redraw(),this.updateWfsImages(this.getName()),this.service.processHighlightQueue()},createTilesGrid:function(){var e=this,t=e._sandbox,n=Oskari.clazz.create("Oskari.mapframework.gridcalc.TileQueue"),r=Oskari.clazz.create("Oskari.mapframework.gridcalc.QueuedTilesStrategy",{tileQueue:n});r.debugGridFeatures=!1,this.tileQueue=n,this.tileStrategy=r;var i=new OpenLayers.StyleMap({"default":new OpenLayers.Style({pointRadius:3,strokeColor:"red",strokeWidth:2,fillColor:"#800000"}),tile:new OpenLayers.Style({strokeColor:"#008080",strokeWidth:5,fillColor:"#ffcc66",fillOpacity:.5}),select:new OpenLayers.Style({fillColor:"#66ccff",strokeColor:"#3399ff"})});this._tilesLayer=new OpenLayers.Layer.Vector("Tiles Layer",{strategies:[r],styleMap:i,visibility:!0}),this._map.addLayer(this._tilesLayer),this._tilesLayer.setOpacity(.3)},getTileQueue:function(){return this.tileQueue},_getFeatureIds:function(e,t,n){var r=this,i=this._sandbox,s=i.findAllHighlightedLayers();if(s.length==0||!s[0]||!s[0].isLayerOfType("WFS"))return;if(s.length!=1){i.printDebug("Trying to highlight WFS feature but there is either too many or none selected WFS layers. Size: "+s.length);return}var o=s[0];if(!o.isInScale()){i.printDebug("Trying to hightlight WFS feature from wfs layer that is not in scale!");return}var u=i.getMap(),a=this._map.getExtent(),f="&flow_pm_wfsLayerId="+o.getId()+"&flow_pm_point_x="+e.lon+"&flow_pm_point_y="+e.lat+"&flow_pm_bbox_min_x="+a.left+"&flow_pm_bbox_min_y="+a.bottom+"&flow_pm_bbox_max_x="+a.right+"&flow_pm_bbox_max_y="+a.top+"&flow_pm_zoom_level="+u.getZoom()+"&flow_pm_map_width="+u.getWidth()+"&flow_pm_map_height="+u.getHeight()+"&srs="+u.getSrsName()+"&action_route=GET_HIGHLIGHT_WFS_FEATURE_IMAGE_BY_POINT",l=i.isCtrlKeyDown();jQuery.ajax({dataType:"json",type:"POST",beforeSend:function(e){e&&e.overrideMimeType&&e.overrideMimeType("application/j-son;charset=UTF-8")},url:i.getAjaxUrl()+f,data:f,success:function(e){r._handleGetFeatureIdsResponse(e,o,l)}})},_handleGetFeatureIdsResponse:function(response,layer,keepCollection){var sandbox=this._sandbox;if(!response||response.error=="true"){sandbox.printWarn("Couldn't get feature id for selected map point.");return}var selectedFeatures=eval("("+response.selectedFeatures+")"),featureIds=[];selectedFeatures!=null&&selectedFeatures.id!=null&&featureIds.push(selectedFeatures.id);var builder=sandbox.getEventBuilder("WFSFeaturesSelectedEvent"),event=builder(featureIds,layer,keepCollection);sandbox.notifyAll(event)}},{protocol:["Oskari.mapframework.module.Module","Oskari.mapframework.ui.module.common.mapmodule.Plugin"]}),define("bundles/framework/bundle/mapwfs/plugin/wfslayer/WfsLayerPlugin",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs.MapWfsBundleInstance",function(){this._localization=null,this._pluginInstances={}},{__name:"MapWFS",getName:function(){return this.__name},setSandbox:function(e){this.sandbox=e},getSandbox:function(){return this.sandbox},start:function(){var e=this;if(e.started)return;e.started=!0;var t=this.conf,n=(t?t.sandbox:null)||"sandbox",r=Oskari.getSandbox(n);e.sandbox=r,r.register(e);for(p in e.eventHandlers)r.registerForEventByName(e,p)},update:function(){},stop:function(){var e=this.sandbox;for(p in this.eventHandlers)e.unregisterFromEventByName(this,p);this.sandbox.unregister(this),this.started=!1},init:function(){var e=this;return null},getLocalization:function(e){return this._localization||(this._localization=Oskari.getLocalization(this.getName())),e?this._localization[e]:this._localization},onEvent:function(e){var t=this.eventHandlers[e.getName()];if(!t)return;return t.apply(this,[e])},eventHandlers:{MapClickedEvent:function(e){if(this.sandbox.getMap().isMoving())return;var t=e.getLonLat(),n=e.getMouseX(),r=e.getMouseY();this._getFeatureIds(t,n,r)}},_getFeatureIds:function(e,t,n){var r=this,i=this.sandbox,s=i.findAllHighlightedLayers();if(s.length==0||!s[0]||!s[0].isLayerOfType("WFS"))return;if(s.length!=1)throw"Trying to highlight WFS feature but there is either too many or none selected WFS layers. Size: "+s.length;var o=s[0];if(!o.isInScale()){core.printDebug("Trying to hightlight WFS feature from wfs layer that is not in scale!");return}var u=i.getMap(),a=this._map.getExtent(),f="&flow_pm_wfsLayerId="+o.getId()+"&flow_pm_point_x="+e.lon+"&flow_pm_point_y="+e.lat+"&flow_pm_bbox_min_x="+a.left+"&flow_pm_bbox_min_y="+a.bottom+"&flow_pm_bbox_max_x="+a.right+"&flow_pm_bbox_max_y="+a.top+"&flow_pm_zoom_level="+u.getZoom()+"&flow_pm_map_width="+u.getWidth()+"&flow_pm_map_height="+u.getHeight()+"&srs="+u.getSrsName()+"&actionKey=GET_HIGHLIGHT_WFS_FEATURE_IMAGE_BY_POINT",l=i.isCtrlKeyDown();jQuery.ajax({dataType:"json",type:"POST",url:this.endpointUrl+f,data:f,success:function(e){r._handleGetFeatureIdsResponse(e,o,l)}})},_handleGetFeatureIdsResponse:function(response,layer,keepCollection){var sandbox=this.sandbox;response.error=="true"&&sandbox.printWarn("Couldn't get feature id for selected map point.");var selectedFeatures=eval("("+response.selectedFeatures+")"),featureIds=[];selectedFeatures!=null&&selectedFeatures.id!=null&&(featureIds=selectedFeatures.id);var builder=sandbox.getEventBuilder("WFSFeaturesSelectedEvent"),event=builder(featureIds,layer,keepCollection);sandbox.notifyAll(event)}},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.module.Module"]}),define("bundles/framework/bundle/mapwfs/instance",function(){}),Oskari.registerLocalization({lang:"fi",key:"MapWfs",value:{"object-data":"Kohdetiedot"}}),define("bundles/framework/bundle/mapwfs/locale/fi",function(){}),Oskari.registerLocalization({lang:"sv",key:"MapWfs",value:{"object-data":"Objektuppgifter"}}),define("bundles/framework/bundle/mapwfs/locale/sv",function(){}),Oskari.registerLocalization({lang:"en",key:"MapWfs",value:{"object-data":"Object data"}}),define("bundles/framework/bundle/mapwfs/locale/en",function(){}),define("bundles/framework/bundle/mapwfs/module",["oskari","jquery","./domain/WfsLayer","./domain/WfsLayerModelBuilder","./domain/QueuedTile","./domain/TileQueue","./domain/WfsTileRequest","./event/WFSFeaturesSelectedEvent","./service/WfsTileService","./plugin/wfslayer/QueuedTilesGrid","./plugin/wfslayer/QueuedTilesStrategy","./plugin/wfslayer/WfsLayerPlugin","./instance","./locale/fi","./locale/sv","./locale/en"],function(e,t){return e.bundleCls("mapwfs").category({create:function(){return e.clazz.create("Oskari.mapframework.bundle.mapwfs.MapWfsBundleInstance")},update:function(e,t,n,r){e.alert("RECEIVED update notification "+r)}})});