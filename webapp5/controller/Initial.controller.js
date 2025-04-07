sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (
    Controller
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.Initial", {
        /**
         * @override
         */
        onInit: function () {
            console.log("Init called");


        },
        onButtonPress: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Details", {
                "srcCode": sourceAirportCode,
                "destCode": destinationAirportCode,
                "date": departureDate
            });
        }
    });
});