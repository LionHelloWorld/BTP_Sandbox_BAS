/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"lion/zlionui5003/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
