sap.ui.define([
    "sap/ui/base/ManagedObject"
], function (
    ManagedObject
) {
    "use strict";

    return {
        redirectBackIfAuthenticated: function (that) {
            if (window.localStorage.getItem("FBS_token")) {
                console.log("FBS_token found");
                const claims = that.getOwnerComponent().getModel().getProperty("/user");
                console.log(claims.exp * 1000);
                console.log(Date.now())
                console.log(claims.exp * 1000 > Date.now());
                if (claims.exp * 1000 > Date.now()) {
                    console.log("redirecting...BackIfAuthenticated..");
                    this.onNavBack(that);

                }
            }
        },
        onNavBack: function (that) {
            const callBack = that.getOwnerComponent().onNavBack();
            callBack();
        },
        sayHello: function () {
            alert("Hello from UtilFunction's test method");
        }
    };
});