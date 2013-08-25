define( [ "models/unit" ],
  function( Unit ) {
    'use strict';

    /**
     * Data structure for operating a game.
     */
    function Rules() {
    }

    // Define Game API.
    Rules.prototype = {

      constructor : Rules,

      fillGridWithRandomUnits : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        for ( var x = 0; x < gridWidth; x++ ) {
          for ( var y = 0; y < gridHeight; y++ ) {
            grid.getCellAt( x, y ).setContents( Unit.create() );
          }
        }

      },

      getAllConnectionsInGrid : function( grid, connectionLength ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        // Collect horizontal connections by moving left to right, row by row.
        var horizontalConnections = [];
        for ( var y = 0; y < gridHeight; y++ ) {
          var hits = 0;
          var currentTypeId = null;
          var connection = [];
          for ( var x = 0; x < gridWidth; x++ ) {
            var unit = grid.getCellAt( x, y ).getContents();
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
        for ( var x = 0; x < gridWidth; x++ ) {
          var hits = 0;
          var currentTypeId = null;
          var connection = [];
          for ( var y = 0; y < gridHeight; y++ ) {
            var unit = grid.getCellAt( x, y ).getContents();
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

      resetConnectionsInGrid : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        for ( var y = 0; y < gridHeight; y++ ) {
          for ( var x = 0; x < gridWidth; x++ ) {
            var cell = grid.getCellAt( x, y );
            if ( cell.hasContents() ) {
              cell.getContents().setConnected( false );
            }
          }
        }
      },

      areAnyCellsEmptyInGrid : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        for ( var y = 0; y < gridHeight; y++ ) {
          for ( var x = 0; x < gridWidth; x++ ) {
            var cell = grid.getCellAt( x, y );
            if ( !cell.hasContents() ) {
              return true;
            }
          }
        }
        return false;
      },

      addUnitsToTopOfGrid : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        for ( var x = 0; x < gridWidth; x++ ) {
          var cell = grid.getCellAt( x, 0 );
          if ( !cell.hasContents() ) {
            cell.setContents( Unit.create() );
          }
        }
      },

      canUnitsMoveDownInGrid : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        for ( var y = 0; y < gridHeight; y++ ) {
          for ( var x = 0; x < gridWidth; x++ ) {
            var cell = grid.getCellAt( x, y );
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

      moveUnitsDownInGrid : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        // Work our way from the bottom, up.
        for ( var y = gridHeight - 1; y >= 0; y-- ) {
          for ( var x = 0; x < gridWidth; x++ ) {
            var cell = grid.getCellAt( x, y );
            if ( cell.hasContents() ) {
              var southCell = cell.getNeighborAt( 's' );
              if ( southCell ) {
                if ( !southCell.hasContents() ) {
                  this.moveUnitDownToCell( southCell );
                }
              }
            }
          }
        }

      },

      moveUnitDownToCell : function( bottomCell ) {
        var northCell = bottomCell.getNeighborAt( 'n' );
        if ( northCell ) {
          bottomCell.setContents( northCell.getContents() );
          northCell.setContents( null );
          this.moveUnitDownToCell( northCell );
        }
      },

      canUnitsMoveDownRightInGrid : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        for ( var y = 0; y < gridHeight; y++ ) {
          for ( var x = 0; x < gridWidth; x++ ) {
            var cell = grid.getCellAt( x, y );
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

      moveUnitsDownRightInGrid : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        // Work our way from the bottom, up.
        for ( var y = gridHeight - 1; y >= 0; y-- ) {
          for ( var x = 0; x < gridWidth; x++ ) {
            var cell = grid.getCellAt( x, y );
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

      canUnitsMoveDownLeftInGrid : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        for ( var y = 0; y < gridHeight; y++ ) {
          for ( var x = 0; x < gridWidth; x++ ) {
            var cell = grid.getCellAt( x, y );
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

      moveUnitsDownLeftInGrid : function( grid ) {
        var gridHeight = grid.height;
        var gridWidth = grid.width;

        // Work our way from the bottom, up.
        for ( var y = gridHeight - 1; y >= 0; y-- ) {
          for ( var x = 0; x < gridWidth; x++ ) {
            var cell = grid.getCellAt( x, y );
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

    return Rules;

  }
);
