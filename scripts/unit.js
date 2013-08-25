define( ["underscore"],
  function(_) {
    'use strict';

    /**
     * Data structure for a Unit.
     */
    function Unit( params ) {

      params = params || {};
      this.typeId = params[ "typeId" ] || this.getRandomTypeId();
      this.isConnected = false;
      this.cell = null;
      
    }

    Unit.TYPES = {
      A : "A",
      B: "B",
      C: "C",
      D: "D"
    }

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
        return ( this.isConnected ) ? "-" + this.typeId.toUpperCase() + "-" : " " +  this.typeId.toLowerCase() + " ";
      },

      setCell : function( cell ) {
        this.cell = cell;
      },

      setConnected : function( isConnected ) {
        this.isConnected = isConnected;
      },

      destroy : function() {
        this.cell.setContents( null );
      }

    }

    return Unit;
  }
);
