define( [ ],
  function() {

    'use strict';

    var Events = {};

    Events.listenersByEvent = {};

    Events.UNIT_ADDED = "unit_added";
    Events.UNIT_MOVED = "unit_moved";

    Events.dispatchEvent = function( eventName, payload ) {
    	console.log("dispatch", eventName, payload)
    	var listeners = this.listenersByEvent[ eventName ];
    	var len = listeners.length;
    	for ( var i = 0; i < len; i++ ) {
    		listeners[ i ]( payload );
    	}

    }

    Events.addListener = function( eventName, callback ) {
    	console.log(eventName)
    	if ( !this.listenersByEvent[ eventName ] ) {
    		this.listenersByEvent[ eventName ] = [ callback ];
    	} else {
    		this.listenersByEvent[ eventName ].push( callback );
    	}

    }

    Events.removeListener = function( eventName, callback ) {

    	console.log("Fix removelistener in events.js")

    }

	  return Events;

 	}
);
