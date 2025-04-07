sap.ui.define([
    "sap/ui/base/ManagedObject",
    "ui5/rest/restwithui5/utils/jwtParser"
], function (
    ManagedObject,
    jwtParser
) {
    "use strict";

    return function hidePageIfAuthenticated(that) {
        const jwtToken = window.localStorage.getItem("FBS_token");
        if (jwtToken == null) {
            return false;
        }
        const claims = jwtParser(jwtToken);
        console.log("Claims from jwtToken", claims);
        if (claims.exp > Date.now() / 1000) {
            console.log("Token is still valid");
            that.onNavBack();
        }
        return true;
    }
});