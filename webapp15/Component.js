sap.ui.define([
    "sap/ui/core/UIComponent",
    "ui5/rest/restwithui5/model/models",
    "ui5/rest/restwithui5/model/DataRepository",
    "sap/ui/core/routing/History",
    "ui5/rest/restwithui5/utils/securityConfig"
], (UIComponent,
    models,
    DataRepository,
    History,
    securityConfig) => {
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
            const oRouter = this.getRouter();
            // this.validateAdmin = securityConfig.validateAdmin();
            // this.validateUser = securityConfig.validateUser();

            // enable routing
            this.getRouter().initialize();

            securityConfig.getAdminRouteNames().forEach((route) => {
                console.log(route);
                oRouter.getRoute(route).attachPatternMatched(() => { securityConfig.validateAdmin(this) })
            })

            securityConfig.getPrivateRouteNames().forEach((route) => {
                console.log(route);
                oRouter.getRoute(route).attachPatternMatched(() => { securityConfig.validateUser(this) });
            })
        },
        checker: function () {
            alert("ok");
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