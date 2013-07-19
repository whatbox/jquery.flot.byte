(function ($) {
	"use strict";

	var options = {};

	//Round to nearby lower multiple of base
	function floorInBase(n, base) {
		return base * Math.floor(n / base);
	}

	function init(plot) {
		plot.hooks.processDatapoints.push(function (plot, series, datapoints) {
			$.each(plot.getAxes(), function(axisName, axis) {
				var opts = axis.options;
				if (opts.mode === "byte" || opts.mode === "byteRate") {
					axis.tickGenerator = function (axis) {
						//Set the reference for the formatter
						if (opts.mode === "byteRate") {
							axis.rate = true;
						}

						//Enforce maximum tick Decimals
						if (typeof opts.tickDecimals === 'number') {
							axis.tickDecimals = opts.tickDecimals;
						} else {
							axis.tickDecimals = 2;
						}

						//Determine the scales
						var delta = axis.delta,
							size,
							steps = 0;

						while (Math.abs(delta) >= 1024) {
							steps++;
							delta /= 1024;
						}

						var b2 = 2;
						while (b2 <= 1024) {
							if (delta <= b2) {
								size = b2;
								break;
							}

							b2 *= 2;
						}

						axis.tickSize = size * Math.pow(1024,steps);

						if (typeof opts.minTickSize !== 'undefined' && size < opts.minTickSize) {
							axis.tickSize = opts.minTickSize;
						}

						//Calculate the new ticks
						var ticks = [],
							start = floorInBase(axis.min, axis.tickSize),
							i = 0,
							val,
							prev;

						//Write new ticks
						do {
							prev = val;
							val = start + i * axis.tickSize;
							ticks.push(val);
							++i;
						} while (val < axis.max && val !== prev);


						return ticks;
					};

					axis.tickFormatter = function(size, axis) {
						var ext, steps = 0;

						while (Math.abs(size) >= 1024) {
							steps++;
							size /= 1024;
						}


						switch (steps) {
							case 0: ext = ' B';  break;
							case 1: ext = ' KiB'; break;
							case 2: ext = ' MiB'; break;
							case 3: ext = ' GiB'; break;
							case 4: ext = ' TiB'; break;
							case 5: ext = ' PiB'; break;
							case 6: ext = ' EiB'; break;
							case 7: ext = ' ZiB'; break;
							case 8: ext = ' YiB'; break;
						}


						if (typeof axis.rate !== "undefined") {
							ext += '/s';
						}
											
						return (size.toFixed(axis.tickDecimals) + ext);
					};
				}
			});
		});
	}

	$.plot.plugins.push({
		init: init,
		options: options,
		name: 'byte',
		version: '0.1'
	});
})(jQuery);
