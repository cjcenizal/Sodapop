define( [
	"easel",
	"models/unit",
	"models/grid",
	"controllers/rules",
	"services/events"
	],
  function( easel, Unit, Grid, Rules, Events ) {

    'use strict';

		// Constants.
    var CONNECTION_LENGTH = 2;
    var FPS = 5;
    var SPEED = 1000 / FPS;

		function Loop( params ) {

			// Models.
			this.grid = new Grid( {
				width : 8,
				height : 12
			} );

			// Logic.
			this.rules = new Rules();

			// View.
	    this.canvas = document.getElementById( "gameCanvas" );
	    this.stage = new createjs.Stage( this.canvas );

	    // Units.
	    this.units = [];

	    // State.
	    this.movingUnits = false;
	    this.isDownLeft = false;
	    this.timeStep = 0;

	    // Events.
			var self = this;

			Events.addListener( Events.UNIT_ADDED, function( unit ) {
				var sprite = unit.sprite =  new createjs.Bitmap( unit.type.image );
				self.stage.addChild( sprite );
			} );

			Events.addListener( Events.UNIT_MOVED, function( unit ) {
				unit.sprite.x = Unit.WIDTH * unit.cell.x;
				unit.sprite.y = Unit.HEIGHT * unit.cell.y;
			} );

			Events.addListener( Events.UNIT_REMOVED, function( unit ) {
				self.stage.removeChild( unit.sprite );
			} );

    };

    Loop.prototype = {
      
      constructor : Loop,

    	start : function() {
	 			
				var self = this;
				this.intervalidId = setInterval( function() {
					self.update();
				}, SPEED );

    	},

    	stop : function() {
    		this.timeStep = 0;
    		clearInterval( this.intervalidId );
    	},

    	update : function() {

    		this.timeStep++;

    		if ( this.timeStep > 40 ) {
    			this.stop();
    			console.log("LOOP STOPPED")
    		}
    		console.log(this.timeStep)

    		this.stage.update();

				var rules = this.rules;
				var grid = this.grid;


				// Move first.
				// Apply reorganization algo:
			 	// Cycle: shift-down, shift-down-right, shift-down, shift-down-left, repeat.
				if ( this.movingUnits ) {

					// 1) Units move to neighboring empty cells in a downwards fashion
					if ( rules.canUnitsMoveDownInGrid( grid) ) {
						rules.moveUnitsDownInGrid( grid );
					}

					// 2) Move units down-right/down-left to fill empty column.
					if ( this.isDownLeft ) {
						if ( rules.canUnitsMoveDownRightInGrid( grid ) ) {
							rules.moveUnitsDownRightInGrid( grid );
						} else {
							if ( !rules.canUnitsMoveDownLeftInGrid( grid ) ) {
						  	this.movingUnits = false;
							}
						}
					} else {
						if ( rules.canUnitsMoveDownLeftInGrid( grid ) ) {
							rules.moveUnitsDownLeftInGrid( grid );
						} else {
							if ( !rules.canUnitsMoveDownRightInGrid( grid ) ) {
							  this.movingUnits = false;
							}
						}
					}

					// if ( rules.canUnitsMoveDownInGrid( grid ) ) {
					// 	this.movingUnits = true;
					// }

					this.isDownLeft = !this.isDownLeft;

				} else {


					// Fill empty Cells with new Units.
					if ( rules.areAnyCellsEmptyInGrid( grid ) ) {

						// Move down.
						if ( rules.canUnitsMoveDownInGrid( grid ) ) {
							rules.moveUnitsDownInGrid( grid );
						}

						// Fill in empty top row cells.
						rules.addUnitsToTopOfGrid( grid );

					} else {

						// Detect and cache connections.
						var connections = rules.getAllConnectionsInGrid( grid, CONNECTION_LENGTH );
						for ( var i = 0; i < connections.length; i++ ) {
							for ( var j = 0; j < connections[i].length; j++ ) {
								connections[i][j].setConnected( true );
							}
						}

						// Randomly destroy one connection.
						if ( connections.length > 0 ) {
							var connection = connections[ Math.floor( Math.random() * connections.length ) ];
							for ( var i = 0; i < connection.length; i++ ) {
								connection[ i ].destroy();
							}
						}

						// Reset connections.
						rules.resetConnectionsInGrid( grid );

					}

				}


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



    	},

    	draw : function() {
    		console.log( this.grid.print() );
    	}
    }

	  return Loop;

 	}
);
