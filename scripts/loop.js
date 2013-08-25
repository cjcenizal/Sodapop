define( [ "unit", "cell", "grid", "rules" ],
  function( Unit, Cell, Grid, Rules ) {

    'use strict';

    // Constants.
    var CONNECTION_LENGTH = 4;


		// Create game stuff.
		var grid = new Grid();
		var rules = new Rules();


		// Fill empty Cells with new Units.
		while ( rules.areAnyCellsEmptyInGrid( grid ) ) {

			// Move down.
			if ( rules.canUnitsMoveDownInGrid( grid ) ) {
				rules.moveUnitsDownInGrid( grid );
			}

			// Fill in empty top row cells.
			rules.addUnitsToTopOfGrid( grid );

			draw();
		}

		// Detect and cache connections.
		var connections = rules.getAllConnectionsInGrid( grid, CONNECTION_LENGTH );
		for ( var i = 0; i < connections.length; i++ ) {
			for ( var j = 0; j < connections[i].length; j++ ) {
				connections[i][j].setConnected( true );
			}
		}
		draw();

		// Randomly destroy one connection.
		if ( connections.length > 0 ) {
			var connection = connections[ Math.floor( Math.random() * connections.length ) ];
			for ( var i = 0; i < connection.length; i++ ) {
				connection[ i ].destroy();
			}
		}
		draw();

		// Reset connections.
		rules.resetConnectionsInGrid( grid );

		// Apply reorganization algo:
		// Cycle: shift-down, shift-down-right, shift-down, shift-down-left, repeat.

		var movingUnits = true;
		var isDownLeft = true;

		while ( movingUnits ) {

			// 1) Units move to neighboring empty cells in a downwards fashion
			while ( rules.canUnitsMoveDownInGrid( grid) ) {
				rules.moveUnitsDownInGrid( grid );
				draw();
			}

			// 2) Move units down-right/down-left to fill empty column.
			if ( isDownLeft ) {
				if ( rules.canUnitsMoveDownRightInGrid( grid ) ) {
					rules.moveUnitsDownRightInGrid( grid );
					draw();
				} else {
					if ( !rules.canUnitsMoveDownLeftInGrid( grid ) ) {
				  	movingUnits = false;
					}
				}
			} else {
				if ( rules.canUnitsMoveDownLeftInGrid( grid ) ) {
					rules.moveUnitsDownLeftInGrid( grid );
					draw();
				} else {
					if ( !rules.canUnitsMoveDownRightInGrid( grid ) ) {
					  movingUnits = false;
					}
				}
			}

			if ( rules.canUnitsMoveDownInGrid( grid ) ) {
				movingUnits = true;
			}

			isDownLeft = !isDownLeft;

		}

		// Fill empty Cells with new Units.
		while ( rules.areAnyCellsEmptyInGrid( grid ) ) {

			// Move down.
			if ( rules.canUnitsMoveDownInGrid( grid ) ) {
				rules.moveUnitsDownInGrid( grid );
			}

			// Fill in empty top row cells.
			rules.addUnitsToTopOfGrid( grid );

			draw();
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




    function draw() {
    	console.log( grid.print() );
    }

 	}
);
