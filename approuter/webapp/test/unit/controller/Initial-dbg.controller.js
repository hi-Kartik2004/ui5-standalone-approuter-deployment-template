/*global QUnit*/

sap.ui.define([
	"ui5rest/restwithui5/controller/Initial.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Initial Controller");

	QUnit.test("I should test the Initial controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
