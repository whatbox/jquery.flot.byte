# Byte mode plugin for jQuery Flot
[![Build Status](https://travis-ci.org/whatbox/jquery.flot.byte.png?branch=master)](https://travis-ci.org/whatbox/jquery.flot.byte)

## About
This is a plugin for the jQuery powered Flot plotting library. It's goal is to make it easy to manage and display byte values on a chart. It uses labels everything as binary multiples rather than decimal figures (ie: GiB rather than GB).

This is developed by [Whatbox Inc.](https://whatbox.ca/) for internal use and released as on Open Source project under the MIT license. Patches and bug reports are welcome, please see our [CLA](https://whatbox.ca/policies/contributions).


## Dependencies
The following packages are necessary for this module.
* [jQuery](https://github.com/jquery/jquery)
* [Flot](https://github.com/flot/flot)


## Usage
The usage integrates in the same way as the native flot plugins, such as jquery.flot.time.

	yaxis: {
		min: 0, 
		mode: "byte", 
		axisLabel: "Bytes of data"
	}

Similarly, when expressing transfer rates, such as MiB/s.

	yaxis: {
		min: 0, 
		mode: "byteRate", 
		axisLabel: "Transfer rate"
	}