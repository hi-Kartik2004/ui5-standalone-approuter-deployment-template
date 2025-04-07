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
        getDuration: function (startTimestampStr, endTimestampStr) {
            console.log("util.getDuration got", startTimestampStr, endTimestampStr);
            const endTimestamp = new Date(endTimestampStr).getTime();
            const startTimestamp = new Date(startTimestampStr).getTime();
            // Calculate the difference in milliseconds
            let durationInMilliseconds = endTimestamp - startTimestamp;

            // Convert milliseconds into hours and minutes
            let hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60)); // hours
            let minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // minutes

            // Format the result in HH:MM format with leading zeros if necessary
            let formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            return formattedDuration;
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