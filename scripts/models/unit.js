define( [ "underscore", "services/events" ],
  function( _, Events ) {
    'use strict';

    /**
     * Data structure for a Unit.
     */
    function Unit( params ) {

      params = params || {};
      this.type = Unit.TYPES[ params[ "typeId" ] || this.getRandomTypeId() ];
      this.isConnected = false;
      this.cell = null;
      
    }

    Unit.TYPES = {
      BANANA : {
        id : "BANANA",
        char : "B",
        name : "banana",
        image : "images/banana.png"
      },
      GRAPES : {
        id : "GRAPES",
        char : "G",
        name : "grapes",
        image : "images/grapes.png"
      },
      STRAWVBERRY : {
        id : "STRAWVBERRY",
        char : "S",
        name : "strawberry",
        image : "images/strawberry.png"
      },
      WATERMELON : {
        id : "WATERMELON",
        char : "W",
        name : "watermelon",
        image : "images/watermelon.png"
      }
    }

    Unit.WIDTH = 60;
    Unit.HEIGHT = 60;

    Unit.TYPE_IDS = _.keys( Unit.TYPES );

    Unit.getRandomTypeId = function() {
      return Unit.TYPE_IDS[ Math.floor( Math.random() * Unit.TYPE_IDS.length ) ];
    }

    Unit.create = function( params ) {
        params = params || {};
        var typeId = params[ "typeId" ] || Unit.getRandomTypeId();
        var unit = new Unit( {
          typeId : typeId
        } );
        return unit;
    }

    // Define Unit API.
    Unit.prototype = {

      constructor : Unit,

      print : function() {
        return ( this.isConnected ) ? "-" + this.type.char.toUpperCase() + "-" : " " +  this.type.char.toLowerCase() + " ";
      },

      setCell : function( cell ) {
        this.cell = cell;
      },

      setConnected : function( isConnected ) {
        this.isConnected = isConnected;
      },

      destroy : function() {
        this.cell.setContents( null );
        Events.dispatchEvent( Events.UNIT_REMOVED, this );
      }

    }

    return Unit;
  }
);
