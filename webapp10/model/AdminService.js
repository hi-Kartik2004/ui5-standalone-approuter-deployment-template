sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
], function (
    ManagedObject,
    MessageToast,
    BusyIndicator
) {
    "use strict";

    return {
        createAirport: function (payload, update = false) {
            console.log("Update parameter is ", update);
            return () => jQuery.ajax({
                url: `${this._baseURL}/airport`,
                type: update ? 'put' : 'post',
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("FBS_token")
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
        },
        addFlight: function (payload) {
            BusyIndicator.show();
            return jQuery.post({
                url: this._baseURL + '/flight',
                data: JSON.stringify(payload),
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + window.localStorage.getItem("FBS_token")
                },
                success: function (data) {
                    BusyIndicator.hide();
                    return data;
                }, error: function (err) {
                    BusyIndicator.hide();
                    return err;
                }
            })

        }
    }
});