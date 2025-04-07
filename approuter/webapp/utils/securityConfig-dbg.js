sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/m/MessageToast",
    "sap/ui/commons/Message"
], function (
    ManagedObject,
    MessageToast,
    Message
) {
    "use strict";
    const privateRouteNames = ["Booking"]
    const adminRouteNames = ["addAirport", "addFlight"];

    return {
        getPrivateRouteNames: function () {
            return privateRouteNames;
        },
        getAdminRouteNames: function () {
            return adminRouteNames;
        },
        validateAdmin: function (that) {
            console.log("checking isAdmin");
            console.log(that);
            const globalContext = that.getModel();
            console.log(globalContext);
            const userType = globalContext.getProperty("/user/userType");
            console.log(userType);
            this.validateUser(that, { redirectTo: "loginAdmin" });
            if (!userType || userType.toUpperCase() !== "ADMIN") {
                MessageToast.show("You are not authorized to view that page", {
                    closeOnBrowserNavigation: false
                });
                that.getRouter().navTo("RouteInitial");
            }
        },
        validateUser: function (that, params = {}) {
            console.log("checking isUser");
            console.log(that);
            var globalContext = that.getModel();
            if (window.localStorage.getItem("FBS_token")) {
                console.log("FBS_token found");
                const claims = globalContext.getProperty("/user");
                console.log(claims.exp * 1000 > Date.now());
                if (claims.exp * 1000 < Date.now()) {
                    console.log("redirecting...token expired..");
                    MessageToast.show("Session expired login again!");
                    params.redirectTo ? that.getRouter().navTo(params.redirectTo) : that.getRouter().navTo("login");
                } else {
                    console.log("success");
                    const oBus = sap.ui.getCore().getEventBus();
                    oBus.publish("auth", "user", {
                        user: globalContext.getProperty("/user")
                    })
                }
            } else {
                MessageToast.show("Please login to continue...");
                that.getRouter().navTo("login");
            }
        },
    }
});