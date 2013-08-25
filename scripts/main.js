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
  "loop"
], function(
  _,
  loop
) {
  //loop.start();
} );