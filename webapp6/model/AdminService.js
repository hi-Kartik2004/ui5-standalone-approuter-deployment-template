sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/m/MessageToast"
], function (
    ManagedObject,
    MessageToast
) {
    "use strict";
    const token = window.localStorage.getItem("FBS_token");
    return {
        createAirport: function (payload) {

            return () => jQuery.post({
                url: `${this._baseURL}/airport`,
                headers: {
                    Authorization: "Bearer " + token
                },
                data: JSON.stringify(payload),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    MessageToast.show("Airport added successfully");
                    return data;
                },
                error: function (error) {
                    console.log(error);
                    if (error.status == 400) {
                        const message = error.responseJSON.message;
                        if (message) {
                            MessageToast.show(message);
                            return;
                        } else {
                            return error.responseJSON;
                        }
                    }
                    MessageToast.show("Something went wrong!");
                }
            })
        },
        fetchAllAirports: function () {
            console.log(this._baseURL);
            return () => jQuery.get({
                url: `${this._baseURL}/airport/all`,
                success: function (data) {
                    console.log("fetchAllAirports", data);
                    return data;
                },
                error: function (error) {
                    console.error(error);
                    return error.responseJSON;
                }
            })
        },
        modifyAirport: function (oData) {
            return () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(oData);
                    }, 5000);
                })
            }
        },
        deleteAirport: function (oCode) {

            return () => {
                return jQuery.ajax({
                    url: `${this._baseURL}/airport?code=${oCode}`,
                    type: "DELETE",
                    success: function (oData) {
                        return oData;
                    },
                    error: function (e) {
                        return e;
                    }
                })
            }
        }
    }
});