define( [ "cell" ],
  function( Cell ) {
    'use strict';

    /**
     * Data structure for managing relationships between Cells.
     */
    function Grid( params ) {

      params = params || {};
      this.width = params[ "width" ] || 10;
      this.height = params[ "height" ] || 16;
      this.cells = [];

      this.createCells( this.width, this.height );

    };

    // Define Grid API.
    Grid.prototype = {
      
      constructor : Grid,

      print : function() {
        var buffer = "";
        for ( var y = 0; y < this.height; y++ ) {
          for ( var x = 0; x < this.width; x++ ) {
            buffer += this.getCellAt( x, y ).print();
          }
          buffer += "\n"
        }
        return buffer;
      },

      createCells : function( width, height ) {

        for ( var x = 0; x < width; x++ ) {
          var column = [];
          for ( var y = 0; y < height; y++ ) {
            column.push( new Cell( {
              "x": x,
              "y": y
            } ) );
          }
          this.cells.push( column );
        }

        // Set neighbor relationships.
        for ( var x = 0; x < width; x++ ) {
          for ( var y = 0; y < height; y++ ) {
            var cell = this.getCellAt( x, y );

            var eastCell = this.getCellAt( x + 1, y );
            var sorthCell = this.getCellAt( x, y + 1 );
            var northEastCell = this.getCellAt( x + 1, y - 1 );
            var southEastCell = this.getCellAt( x + 1, y + 1 );
            
            if ( sorthCell ) {
              cell.setNeighborAt( "s", sorthCell );
              sorthCell.setNeighborAt( "n", cell )
            }

            if ( eastCell ) {
              cell.setNeighborAt( "e", eastCell );
              eastCell.setNeighborAt( "w", cell )
            }

            if ( northEastCell ) {
              cell.setNeighborAt( "ne", northEastCell );
              northEastCell.setNeighborAt( "sw", cell )
            }

            if ( southEastCell ) {
              cell.setNeighborAt( "se", southEastCell );
              southEastCell.setNeighborAt( "nw", cell )
            }

          }
        }

      },

      getCellAt : function( x, y ) {
        var column = this.cells[ x ];
        if ( column ) {
          return this.cells[ x ][ y ];
        }
        return column;
      }

    }

    return Grid;
  }
);
