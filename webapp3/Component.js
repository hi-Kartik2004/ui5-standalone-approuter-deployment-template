sap.ui.define([
    "sap/ui/core/UIComponent",
    "ui5/rest/restwithui5/model/models",
    "ui5/rest/restwithui5/model/DataRepository",
    "sap/ui/core/routing/History"
], (UIComponent,
    models,
    DataRepository,
    History) => {
    "use strict";

    return UIComponent.extend("ui5.rest.restwithui5.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            this.DataRepository = new DataRepository(this);
            // // set the device model
            // this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        },
        onNavBack: function () {
            return () => {
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();
                const oRouter = this.getRouter();
                console.log("sPreviousHash", sPreviousHash);
                // if (sPreviousHash === "signup" || sPreviousHash === "login") {
                //     oRouter.navTo("RouteInitial");
                //     return;
                // }
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {

                    oRouter.navTo("RouteInitial");
                }
            }
        }
    });
});