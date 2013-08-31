define( [ ],
  function() {

    'use strict';

    var Events = {};

    Events.listenersByEvent = {};

    Events.UNIT_ADDED = "unit_added";
    Events.UNIT_MOVED = "unit_moved";
    Events.UNIT_REMOVED = "unit_removed";

    Events.dispatchEvent = function( eventName, payload ) {
    	
    	var listeners = this.listenersByEvent[ eventName ];
    	if ( listeners ) {
	    	var len = listeners.length;
	    	for ( var i = 0; i < len; i++ ) {
	    		listeners[ i ]( payload );
	    	}
	    }

    }

    Events.addListener = function( eventName, callback ) {
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
