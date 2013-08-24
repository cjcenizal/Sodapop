/**
 * Sploder game.
 *
 * @author CJ Cenizal
 */

( function( window, document, undefined ) {

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

  /**
   * Data structure for operating a game on the Grid.
   */
  function Game( params ) {

    params = params || {};
    this.grid = params[ "grid" ];
    this.gridHeight = grid.height;
    this.gridWidth = grid.width;
    this.connectionLength = params[ "connectionLength" ] || 3;

  }

  // Define Game API.
  Game.prototype = {

    constructor : Game,

    print : function() {
      return this.grid.print();
    },

    randomize : function() {

      for ( var x = 0; x < this.gridWidth; x++ ) {
        for ( var y = 0; y < this.gridHeight; y++ ) {
          this.grid.getCellAt( x, y ).setContents( this.createUnit() );
        }
      }

    },

    createUnit : function( params ) {

      params = params || {};
      var typeId = params[ "typeId" ] || Unit.getRandomTypeId();
      var unit = new Unit( {
        typeId : typeId
      } );
      return unit;

    },

    getAllConnections : function( params ) {

      params = params || {};
      var connectionLength = params[ "connectionLength" ] || this.connectionLength;

      // Collect horizontal connections by moving left to right, row by row.
      var horizontalConnections = [];
      for ( var y = 0; y < this.gridHeight; y++ ) {
        var hits = 0;
        var currentTypeId = null;
        var connection = [];
        for ( var x = 0; x < this.gridWidth; x++ ) {
          var unit = this.grid.getCellAt( x, y ).getContents();
          if ( currentTypeId == unit.typeId ) {
            hits ++;
          } else {
            if ( hits >= connectionLength ) {
              horizontalConnections.push( connection );
            }
            hits = 0;
            currentTypeId = unit.typeId;
            connection = [];
          }
          connection.push( unit );
        }
        if ( hits >= connectionLength ) {
          horizontalConnections.push( connection );
        }
      }

      var verticalConnections = [];
      for ( var x = 0; x < this.gridWidth; x++ ) {
        var hits = 0;
        var currentTypeId = null;
        var connection = [];
        for ( var y = 0; y < this.gridHeight; y++ ) {
          var unit = this.grid.getCellAt( x, y ).getContents();
          if ( currentTypeId == unit.typeId ) {
            hits ++;
          } else {
            if ( hits >= connectionLength ) {
              verticalConnections.push( connection );
            }
            hits = 0;
            currentTypeId = unit.typeId;
            connection = [];
          }
          connection.push( unit );
        }
        if ( hits >= connectionLength ) {
          verticalConnections.push( connection );
        }
      }

      return verticalConnections.concat( horizontalConnections );

    },

    resetConnections : function() {
      for ( var y = 0; y < this.gridHeight; y++ ) {
        for ( var x = 0; x < this.gridWidth; x++ ) {
          var cell = this.grid.getCellAt( x, y );
          if ( cell.hasContents() ) {
            cell.getContents().setConnected( false );
          }
        }
      }
    },

    hasEmptyCells : function() {
      for ( var y = 0; y < this.gridHeight; y++ ) {
        for ( var x = 0; x < this.gridWidth; x++ ) {
          var cell = this.grid.getCellAt( x, y );
          if ( !cell.hasContents() ) {
            return true;
          }
        }
      }
      return false;
    },

    addUnitsToEmptyCellsInTopRow : function() {
      for ( var x = 0; x < this.gridWidth; x++ ) {
        var cell = this.grid.getCellAt( x, 0 );
        if ( !cell.hasContents() ) {
          cell.setContents( this.createUnit() );
        }
      }
    },

    hasDownMoves : function() {
      for ( var y = 0; y < this.gridHeight; y++ ) {
        for ( var x = 0; x < this.gridWidth; x++ ) {
          var cell = this.grid.getCellAt( x, y );
          if ( cell.hasContents() ) {
            var southCell = cell.getNeighborAt( 's' );
            if ( southCell ) {
              if ( !southCell.hasContents() ) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },

    moveUnitsDown : function() {

      // Work our way from the bottom, up.
      for ( var y = this.gridHeight - 1; y >= 0; y-- ) {
        for ( var x = 0; x < this.gridWidth; x++ ) {
          var cell = this.grid.getCellAt( x, y );
          if ( cell.hasContents() ) {
            var southCell = cell.getNeighborAt( 's' );
            if ( southCell ) {
              if ( !southCell.hasContents() ) {
                this.shiftDown( southCell );
              }
            }
          }
        }
      }

    },

    shiftDown : function( bottomCell ) {
      var northCell = bottomCell.getNeighborAt( 'n' );
      if ( northCell ) {
        bottomCell.setContents( northCell.getContents() );
        northCell.setContents( null );
        this.shiftDown( northCell );
      }
    },

    hasDownRightMoves : function() {
      for ( var y = 0; y < this.gridHeight; y++ ) {
        for ( var x = 0; x < this.gridWidth; x++ ) {
          var cell = this.grid.getCellAt( x, y );
          if ( cell.hasContents() ) {
            var southEastCell = cell.getNeighborAt( 'se' );
            if ( southEastCell ) {
              if ( !southEastCell.hasContents() ) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },

    moveUnitsDownRight : function() {

      // Work our way from the bottom, up.
      for ( var y = this.gridHeight - 1; y >= 0; y-- ) {
        for ( var x = 0; x < this.gridWidth; x++ ) {
          var cell = this.grid.getCellAt( x, y );
          if ( cell.hasContents() ) {
            var southEastCell = cell.getNeighborAt( 'se' );
            if ( southEastCell ) {
              if ( !southEastCell.hasContents() ) {
                southEastCell.setContents( cell.getContents() );
                cell.setContents( null );
                return;
              }
            }
          }
        }
      }

    },

    hasDownLeftMoves : function() {
      for ( var y = 0; y < this.gridHeight; y++ ) {
        for ( var x = 0; x < this.gridWidth; x++ ) {
          var cell = this.grid.getCellAt( x, y );
          if ( cell.hasContents() ) {
            var southWestCell = cell.getNeighborAt( 'sw' );
            if ( southWestCell ) {
              if ( !southWestCell.hasContents() ) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },

    moveUnitsDownLeft : function() {

      // Work our way from the bottom, up.
      for ( var y = this.gridHeight - 1; y >= 0; y-- ) {
        for ( var x = 0; x < this.gridWidth; x++ ) {
          var cell = this.grid.getCellAt( x, y );
          if ( cell.hasContents() ) {
            var southWestCell = cell.getNeighborAt( 'sw' );
            if ( southWestCell ) {
              if ( !southWestCell.hasContents() ) {
                southWestCell.setContents( cell.getContents() );
                cell.setContents( null );
                return;
              }
            }
          }
        }
      }

    }

  }

  // Create grid.
  var grid = new Grid( {
  } );

  var game = new Game( {
    "grid" : grid
  } );


  // Fill empty Cells with new Units.
  while ( game.hasEmptyCells() ) {
    
    // Move down.
    if ( game.hasDownMoves() ) {
      game.moveUnitsDown();
    }

    // Fill in empty top row cells.
    game.addUnitsToEmptyCellsInTopRow();
    
    console.log( game.print() );
  }

  // Detect and cache connections.
  var connections = game.getAllConnections();
  for ( var i = 0; i < connections.length; i++ ) {
    for ( var j = 0; j < connections[i].length; j++ ) {
      connections[i][j].setConnected( true );
    }
  }
  console.log( game.print() );

  // Randomly destroy one connection.
  if ( connections.length > 0 ) {
    var connection = connections[ Math.floor( Math.random() * connections.length ) ];
    for ( var i = 0; i < connection.length; i++ ) {
      connection[ i ].destroy();
    }
  }
  console.log( game.print() );

  // Reset connections.
  game.resetConnections();

  // Apply reorganization algo:
  // Cycle: shift-down, shift-down-right, shift-down, shift-down-left, repeat.

  var movingUnits = true;
  var isDownLeft = true;

  while ( movingUnits ) {

    // 1) Units move to neighboring empty cells in a downwards fashion
    while ( game.hasDownMoves() ) {
      game.moveUnitsDown();
      console.log( game.print() );
    }

    // 2) Move units down-right/down-left to fill empty column.
    if ( isDownLeft ) {
      if ( game.hasDownRightMoves() ) {
        game.moveUnitsDownRight();
        console.log( game.print() );
      } else {
        if ( !game.hasDownLeftMoves() ) {
          movingUnits = false;
        }
      }
    } else {
      if ( game.hasDownLeftMoves() ) {
        game.moveUnitsDownLeft();
        console.log( game.print() );
      } else {
        if ( !game.hasDownRightMoves() ) {
          movingUnits = false;
        }
      }
    }

    if ( game.hasDownMoves() ) {
      movingUnits = true;
    }

    isDownLeft = !isDownLeft;

  }

  // Fill empty Cells with new Units.
  while ( game.hasEmptyCells() ) {

    // Move down.
    if ( game.hasDownMoves() ) {
      game.moveUnitsDown();
    }

    // Fill in empty top row cells.
    game.addUnitsToEmptyCellsInTopRow();
    
    console.log( game.print() );
  }




  
  // Apply graphics.

  // Respond to mouse interaction.

  // Keep score.

  // Limit moves.

  // Grant special moves (bombs, sonar, etc).

  // Visual effects.

  // Sound.

  // Develop for mobile (JOE!).

  // Social layer.

  // Scalable servers.

  // Charge for moves, specials.

  // Profit!

  // 


} )( window, document );