sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ui5/rest/restwithui5/utils/jwtParser"
], function (
    Controller,
    jwtParser
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.ShellBar", {
        /**
         * @override
         */
        onInit: function () {
            console.log("Shellbar controller fired...");
            const token = window.localStorage.getItem("FBS_token");

            const claims = token && jwtParser(token);
            console.log("claims", claims);
            if (claims !== null) {
                this.getOwnerComponent().getModel().setProperty("/user", claims);
            }
            this.oRouter = this.getOwnerComponent().getRouter();
        },
        onNavBack: function () {
            this.getOwnerComponent().onNavBack()();
        },
        redirectToBookings: function () {
            this.oRouter.navTo("Booking");
        },
        onLoginPress: function () {
            this.oRouter.navTo("login")
        },
        onLogoutPress: function () {
            console.log("onLogoutPress called");
            window.localStorage.removeItem("FBS_token");
            this.oRouter.navTo("RouteInitial");
            this.getOwnerComponent().getModel().setProperty("/user", null);

        },
        onShellBarHomeIconPressed: function () {
            this.oRouter.navTo("RouteInitial");
        }
    });
});