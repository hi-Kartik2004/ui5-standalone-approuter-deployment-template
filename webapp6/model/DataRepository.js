sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"./FlightService",
	"ui5/rest/restwithui5/utils/config",
	"./TravelerService",
	"./AdminService"
], function (
	baseObject,
	JSONModel,
	FlightService,
	config,
	TravelerService,
	AdminService
) {
	"use strict";
	var commonAPIs = {
		baseData: {
			airports: []
		},
		/**
		 * @override
		 * @returns {sap.ui.base.Object}
		 */
		constructor: function (oComp) {
			this.oComp = oComp;
			var oModel = new JSONModel(jQuery.extend(true, {}, this.baseData));
			this.oComp.setModel(oModel);
		},
		getDataModel: function () {
			return this.oComp.getModel();
		},
		getRouter: function () {
			return this.oComp.getRouter();
		}
	},
		oFinalService = jQuery.extend(true, commonAPIs, FlightService, TravelerService, AdminService, config),
		oService = baseObject.extend("ui5.rest.restwithui5.model.DataRepository", oFinalService)
	return oService;
});