Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance",function(){this._localization=null,this._pluginInstances={},this._startupState=null,this._historyPollingInterval=1500,this._historyTimer=null,this._historyPrevious=[],this._historyNext=[],this._historyEnabled=!0,this._defaultViewId=1,typeof window.viewId!="undefined"?this._currentViewId=window.viewId:this._currentViewId=this._defaultViewId},{__name:"StateHandler",getName:function(){return this.__name},setSandbox:function(e){this.sandbox=e},getSandbox:function(){return this.sandbox},start:function(){var e=this;if(e.started)return;e.started=!0;var t=this.conf,n=(t?t.sandbox:null)||"sandbox",r=Oskari.getSandbox(n);e.sandbox=r,r.register(e);for(p in e.eventHandlers)r.registerForEventByName(e,p);var i=r.getAjaxUrl(),s=Oskari.clazz.create("Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin",i);this.registerPlugin(s),this.startPlugin(s),r.addRequestHandler("StateHandler.SetStateRequest",this.requestHandlers.setStateHandler),r.addRequestHandler("StateHandler.SaveStateRequest",this.requestHandlers.saveStateHandler)},update:function(){},stop:function(){var e=this.sandbox();e.removeRequestHandler("StateHandler.SetStateRequest",this.requestHandlers.setStateHandler),e.removeRequestHandler("StateHandler.SaveStateRequest",this.requestHandlers.saveStateHandler);var t=e.getRequestBuilder("MapControls.ToolButtonRequest");t&&e.request(this,t(this.toolbar.config,"remove"));for(p in this.eventHandlers)e.unregisterFromEventByName(this,p);this.sandbox.unregister(this),this.started=!1},init:function(){var e=this,t=this.sandbox;return this.requestHandlers={setStateHandler:Oskari.clazz.create("Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler",t,this),saveStateHandler:Oskari.clazz.create("Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler",t,this)},null},getLocalization:function(e){return this._localization||(this._localization=Oskari.getLocalization(this.getName())),e?this._localization[e]:this._localization},onEvent:function(e){var t=this.eventHandlers[e.getName()];if(!t)return;return t.apply(this,[e])},eventHandlers:{AfterMapMoveEvent:function(e){var t=this;t._pushState()},AfterMapLayerAddEvent:function(e){var t=this;t._pushState()},AfterMapLayerRemoveEvent:function(e){var t=this;t._pushState()},AfterChangeMapLayerStyleEvent:function(e){var t=this;t._pushState()},MapLayerVisibilityChangedEvent:function(e){var t=this;t._pushState()}},registerPlugin:function(e){e.setHandler(this);var t=e.getName();this.sandbox.printDebug("["+this.getName()+"]"+" Registering "+t),this._pluginInstances[t]=e},unregisterPlugin:function(e){var t=e.getName();this.sandbox.printDebug("["+this.getName()+"]"+" Unregistering "+t),this._pluginInstances[t]=undefined,e.setHandler(null)},startPlugin:function(e){var t=e.getName();this.sandbox.printDebug("["+this.getName()+"]"+" Starting "+t),e.startPlugin(this.sandbox)},stopPlugin:function(e){var t=e.getName();this.sandbox.printDebug("["+this.getName()+"]"+" Starting "+t),e.stopPlugin(this.sandbox)},setCurrentViewId:function(e){this._currentViewId=e},getCurrentViewId:function(){return this._currentViewId},_stateComparators:[{rule:"nohistory",cmp:function(e,t){if(!e)return!0}},{rule:"location",cmp:function(e,t){if(e.east!=t.east||e.north!=t.north)return!0;if(e.zoom!=t.zoom)return!0}},{rule:"layers",cmp:function(e,t){var n=this,r=e.selectedLayers,i=t.selectedLayers;if(r.length!=i.length)return!0;for(var s=0;s<i.length;s++){var o=r[s],u=i[s];n.sandbox.printDebug("[StateHandler] comparing layer state "+o.id+" vs "+u.id);if(o.id!==u.id)return!0;if(o.opacity!==u.opacity)return!0;if(o.hidden!==u.hidden)return!0;if(o.style!==u.style)return!0}return!1}}],_compareState:function(e,t,n){var r={result:!1,rule:null,rulesMatched:{}},i=this;for(var s=0;s<i._stateComparators.length;s++){var o=i._stateComparators[s];i.sandbox.printDebug("[StateHandler] comparing state "+o.rule);if(o.cmp.apply(this,[e,t])){i.sandbox.printDebug("[StateHandler] comparing state MATCH "+o.rule),r.result=!0,r.rule=o.rule,r.rulesMatched[o.rule]=o.rule;if(n)return r}}return r},_logState:function(){var e=this,t=e.conf.logUrl+"?"+e.sandbox.generateMapLinkParameters();jQuery.ajax({type:"GET",url:t})},_pushState:function(){var e=this;if(e._historyEnabled){var t=e._historyPrevious,n=this._getMapState(),r=t.length==0?null:t[t.length-1],i=e._compareState(r,n,!0);i.result&&(e.sandbox.printDebug("[StateHandler] PUSHING state"),n.rule=i.rule,e._historyPrevious.push(n),e._historyNext=[],e.conf&&e.conf.logUrl&&e._logState())}},historyMoveNext:function(){var e=this.getSandbox();if(this._historyNext.length>0){var t=this._historyNext.pop();this._historyPrevious.push(t);var n=e.findRegisteredModuleInstance("MainMapModule");this._historyEnabled=!1;var r=this._getMapState();this._setMapState(n,t,r),this._historyEnabled=!0}},historyMovePrevious:function(){var e=this.getSandbox();switch(this._historyPrevious.length){case 0:break;case 1:var t=this._historyNext;this.resetState(),this._historyNext=t;break;default:var n=this._historyPrevious.pop();this._historyNext.push(n);var r=this._historyPrevious[this._historyPrevious.length-1],i=e.findRegisteredModuleInstance("MainMapModule"),s=this._getMapState();this._historyEnabled=!1,this._setMapState(i,r,s),this._historyEnabled=!0}},_getMapState:function(){var e=this.getSandbox(),t=e.getMap(),n=e.findAllSelectedMapLayers(),r=t.getZoom(),i=t.getX(),s=t.getY(),o={north:s,east:i,zoom:t.getZoom(),selectedLayers:[]};for(var u=0;u<n.length;u++){var a=n[u],f={id:a.getId(),opacity:a.getOpacity()};a.isVisible()||(f.hidden=!0),a.getCurrentStyle&&a.getCurrentStyle()&&a.getCurrentStyle().getName()&&a.getCurrentStyle().getName()!="!default!"&&(f.style=a.getCurrentStyle().getName()),o.selectedLayers.push(f)}return o},_setMapState:function(e,t,n){var r=this.getSandbox(),i=this._compareState(n,t,!1);if(t.selectedLayers&&i.rulesMatched.layers){r.printDebug("[StateHandler] restoring LAYER state"),this._teardownState(e);var s=r.getRequestBuilder("AddMapLayerRequest"),o=r.getRequestBuilder("ChangeMapLayerOpacityRequest"),u=r.getRequestBuilder("MapModulePlugin.MapLayerVisibilityRequest"),a=r.getRequestBuilder("ChangeMapLayerStyleRequest"),f=t.selectedLayers.length;for(var l=0;l<f;++l){var c=t.selectedLayers[l];r.request(e.getName(),s(c.id,!0)),c.hidden?r.request(e.getName(),u(c.id,!1)):r.request(e.getName(),u(c.id,!0)),c.style&&r.request(e.getName(),a(c.id,c.style)),c.opacity&&r.request(e.getName(),o(c.id,c.opacity))}}t.east&&(r.printDebug("[StateHandler] restoring LOCATION state"),this.getSandbox().getMap().moveTo(t.east,t.north,t.zoom)),r.syncMapState(!0)},_teardownState:function(e){var t=this.getSandbox(),n=t.findAllSelectedMapLayers(),r=t.getRequestBuilder("RemoveMapLayerRequest");for(var i=0;i<n.length;i++)t.request(e.getName(),r(n[i].getId()))}},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.module.Module"]}),define("bundles/framework/bundle/statehandler/instance",function(){}),Oskari.clazz.category("Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance","state-methods",{useState:function(e){if(!e)return[];var t=this.sandbox.getStatefulComponents(),n=[];for(var r in e)t[r]&&t[r].setState&&t[r].setState(e[r].state),n.push(r);return n},resetState:function(){var e=this;e._historyEnabled=!1,e._historyPrevious=[],e._historyNext=[];for(var t in this._pluginInstances)e.sandbox.printDebug("["+e.getName()+"]"+" resetting state on "+t),e._pluginInstances[t].resetState();e._currentViewId=this._defaultViewId,e._startupState?e._resetComponentsWithNoStateData(e.useState(this._startupState)):jQuery.ajax({dataType:"json",type:"GET",url:e.sandbox.getAjaxUrl()+"action_route=GetAppSetup&noSavedState=true",success:function(t){t&&t.configuration?(e._startupState=t.configuration,e._resetComponentsWithNoStateData(e.useState(t.configuration)),e._historyEnabled=!0):alert("error in getting configuration")},error:function(){alert("error loading conf"),e._historyEnabled=!0},complete:function(){e._historyEnabled=!0}}),e._historyEnabled=!0},_resetComponentsWithNoStateData:function(e){var t=this.sandbox.getStatefulComponents();for(var n in t){var r=!1;for(var i=0;i<e.length;++i)if(n==e[i]){r=!0;break}r||t[n].setState()}},saveState:function(e,t){if(!t){for(var t in this._pluginInstances)this.saveState(e,t);return}this.sandbox.printDebug("["+this.getName()+"]"+" saving state with "+t),this._pluginInstances[t].saveState(e)},getCurrentState:function(){var e={},t=this.sandbox.getStatefulComponents();for(var n in t)t[n].getState?e[n]={state:t[n].getState()}:this.sandbox.printWarn("Stateful component "+n+" doesnt have getState()");return e},getSavedState:function(e){return this._pluginInstances[e].getState()}}),define("bundles/framework/bundle/statehandler/state-methods",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.plugin.Plugin",function(){throw"Oskari.mapframework.bundle.statehandler.Plugin should not be instantiated"},{getName:function(){throw"Implement your own"},setHandler:function(e){throw"Implement your own"},startPlugin:function(e){throw"Implement your own"},stopPlugin:function(e){throw"Implement your own"},getState:function(){throw"Implement your own"},resetState:function(){throw"Implement your own"},saveState:function(e,t){throw"Implement your own"}}),define("bundles/framework/bundle/statehandler/plugin/Plugin",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin",function(e){this.handler=null,this.pluginName=null,this._sandbox=null,this._ajaxUrl=e},{__name:"statehandler.SaveViewPlugin",getName:function(){return this.pluginName},getHandler:function(){return this.handler},setHandler:function(e){this.handler=e,this.pluginName=e.getName()+this.__name},getState:function(){},resetState:function(){},saveState:function(e,t){var n=t,r=this;n||(n=this.handler.getCurrentState());var i={currentViewId:r.handler.getCurrentViewId(),viewData:n};e&&(i.viewName=e.name,i.viewDescription=e.description);var s=r._sandbox.getEventBuilder("StateSavedEvent"),o=s(i.viewName,n);jQuery.cookie.json=!0;var u=7;jQuery.cookie("oskaristate",i,{expires:u}),jQuery.ajax({type:"POST",beforeSend:function(e){e&&e.overrideMimeType&&e.overrideMimeType("application/j-son;charset=UTF-8")},url:this._ajaxUrl+"action_route=AddView",data:i,success:function(e){r._sandbox.notifyAll(o),r.handler.setCurrentViewId(e.id)},error:function(){i.viewName&&(o.setError(!0),r._sandbox.notifyAll(o))}})},serializeJSON:function(e){var t=this,n=typeof e;if(n!="object"||e===null)return n=="string"&&(e='"'+e+'"'),String(e);var r=[],i=e&&e.constructor==Array;return jQuery.each(e,function(e,s){n=typeof s,n=="string"?s='"'+s+'"':n=="object"&s!==null&&(s=t.serializeJSON(s)),r.push((i?"":'"'+e+'":')+String(s))}),(i?"[":"{")+String(r)+(i?"]":"}")},startPlugin:function(e){this._sandbox=e;var t=this;jQuery(document).ready(function(){window.onbeforeunload=function(){t.saveState()}})},stopPlugin:function(e){this._sandbox=null}},{protocol:["Oskari.mapframework.bundle.statehandler.plugin.Plugin"]}),define("bundles/framework/bundle/statehandler/plugin/SaveViewPlugin",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.request.SetStateRequest",function(e){this._creator=null,this._state=e,this._currentViewId=1},{__name:"StateHandler.SetStateRequest",getName:function(){return this.__name},getState:function(){return this._state},getCurrentViewId:function(){return this._currentViewId},setCurrentViewId:function(e){this.currentViewId=e}},{protocol:["Oskari.mapframework.request.Request"]}),define("bundles/framework/bundle/statehandler/request/SetStateRequest",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler",function(e,t){this.sandbox=e,this.statehandler=t},{handleRequest:function(e,t){t.getState()?(this.statehandler.setCurrentViewId(t.getCurrentViewId()),this.statehandler.useState(t.getState())):this.statehandler.resetState()}},{protocol:["Oskari.mapframework.core.RequestHandler"]}),define("bundles/framework/bundle/statehandler/request/SetStateRequestHandler",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.event.StateSavedEvent",function(e,t){this._name=e,this._state=t,this._error=!1},{__name:"StateSavedEvent",getName:function(){return this.__name},getViewName:function(){return this._name},getState:function(){return this._state},isError:function(){return this._error},setError:function(e){this._error=e==1}},{protocol:["Oskari.mapframework.event.Event"]}),define("bundles/framework/bundle/statehandler/event/StateSavedEvent",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.request.SaveStateRequest",function(e,t){this._viewName=e,this._viewDescription=t},{__name:"StateHandler.SaveStateRequest",getName:function(){return this.__name},getViewName:function(){return this._viewName},getViewDescription:function(){return this._viewDescription}},{protocol:["Oskari.mapframework.request.Request"]}),define("bundles/framework/bundle/statehandler/request/SaveStateRequest",function(){}),Oskari.clazz.define("Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler",function(e,t){this.sandbox=e,this.statehandler=t},{handleRequest:function(e,t){this.statehandler.saveState({name:t.getViewName(),description:t.getViewDescription()})}},{protocol:["Oskari.mapframework.core.RequestHandler"]}),define("bundles/framework/bundle/statehandler/request/SaveStateRequestHandler",function(){}),define("bundles/framework/bundle/statehandler/module",["oskari","jquery","./instance","./state-methods","./plugin/Plugin","./plugin/SaveViewPlugin","./request/SetStateRequest","./request/SetStateRequestHandler","./event/StateSavedEvent","./request/SaveStateRequest","./request/SaveStateRequestHandler"],function(e,t){return e.bundleCls("statehandler").category({create:function(){return e.clazz.create("Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance")},update:function(e,t,n,r){}})});