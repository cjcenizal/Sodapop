define( [],
  function() {
    'use strict';

    /**
     * Data structure for storing a Unit in the Grid.
     */
    function Cell( params ) {

      params = params || {};
      this.x = params[ "x" ];
      this.y = params[ "y" ];
      
      this.contents = null;

      // Figure out how to relate a cell with its neighbors, so we insert, remove, and trade cell contents.
      this.neighbors = {
        n: null,
        e: null,
        s: null,
        w: null,
        nw: null,
        ne: null,
        se: null,
        sw: null
      }

    };

    // Define Cell API.
    Cell.prototype = {
      
      constructor : Cell,

      print : function() {
        var content = ( this.contents ) ? this.contents.print() : "   ";
        return "[" + content + "]";
      },

      setContents : function( contents ) {
        this.contents = contents;
        if ( contents ) {
          this.contents.setCell( this );
        }
      },

      getContents : function() {
        return this.contents;
      },

      hasContents : function () {
        return this.contents != null;
      },

      setNeighborAt : function( direction, neighbor ) {
        this.neighbors[ direction ] = neighbor;
      },

      getNeighborAt : function( direction ) {
        return this.neighbors[ direction ];
      },

      hasNeighborAt : function( direction ) {
        return this.neighbors[ direction ] != null;
      }

    }

    return Cell;
  }
);
