(function ($) {
	"use strict";

	var options = {};

	//Round to nearby lower multiple of base
	function floorInBase(n, base) {
		return base * Math.floor(n / base);
	}

	function init(plot) {
		plot.hooks.processDatapoints.push(function (plot) {
			$.each(plot.getAxes(), function(axisName, axis) {
				var opts = axis.options;

				if (typeof opts.base === "number" && opts.base === 10) {
					// Gigabytes, Terabytes
					var EXTENSIONS = [
						'B',
						'kB',
						'MB',
						'GB',
						'TB',
						'PB',
						'EB',
						'ZB',
						'YB',
						'RB',
						'QB',
					];
					var STEP_SIZE = 1000;

				} else {
					// Gibibytes, Tebibytes
					var EXTENSIONS = [
						'B',
						'KiB',
						'MiB',
						'GiB',
						'TiB',
						'PiB',
						'EiB',
						'ZiB',
						'YiB',
					];
					var STEP_SIZE = 1024;
				}


				if (opts.mode === "byte" || opts.mode === "byteRate") {
					if (typeof opts.base === "undefined" || opts.base === 2) {
						axis.tickGenerator = function (axis) {
							var returnTicks = [],
								tickSize = 2,
								delta = axis.delta,
								steps = 0,
								tickMin = 0,
								tickVal,
								tickCount = 0;

							// Enforce maximum tick Decimals
							if (typeof opts.tickDecimals === "number") {
								axis.tickDecimals = opts.tickDecimals;
							} else {
								axis.tickDecimals = 2;
							}

							// Count the steps
							while (Math.abs(delta) >= STEP_SIZE) {
								steps++;
								delta /= STEP_SIZE;
							}

							// Set the tick size relative to the remaining delta
							while (tickSize <= STEP_SIZE) {
								if (delta <= tickSize) {
									break;
								}
								tickSize *= 2;
							}

							// Tell flot the tickSize we've calculated
							if (typeof opts.minTickSize !== "undefined" && tickSize < opts.minTickSize) {
								axis.tickSize = opts.minTickSize;
							} else {
								axis.tickSize = tickSize * Math.pow(STEP_SIZE, steps);
							}

							// Calculate the new ticks
							tickMin = floorInBase(axis.min, axis.tickSize);
							do {
								tickVal = tickMin + (tickCount++) * axis.tickSize;
								returnTicks.push(tickVal);
							} while (tickVal < axis.max);

							return returnTicks;
						};
					}

					axis.tickFormatter = function(size, axis) {
						var steps = 0;

						while (Math.abs(size) >= STEP_SIZE) {
							steps++;
							size /= STEP_SIZE;
						}

						var ext = ' ' + EXTENSIONS[steps];
						if (opts.mode === "byteRate") {
							ext += "/s";
						}

						return (size.toFixed(axis.tickDecimals) + ' ' + ext);
					};
				}
			});
		});
	}

	$.plot.plugins.push({
		init: init,
		options: options,
		name: "byte",
		version: "0.1"
	});
})(jQuery);

