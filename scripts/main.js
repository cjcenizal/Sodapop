/**
 * Sploder game.
 *
 * @author CJ Cenizal
 */

require.config( {
  baseUrl: "scripts",
  urlArgs: "bust=" +  ( new Date() ).getTime(),
  paths: {
    "underscore" : "vendor/underscore-min"
  },
  shim: {
    underscore: {
      exports: "_"
    }
  },
  deps: ["underscore"]
} );
require( [
  "underscore",
  "controllers/loop"
], function(
  _,
  Loop
) {
  var loop = new Loop();
  loop.start();
} );