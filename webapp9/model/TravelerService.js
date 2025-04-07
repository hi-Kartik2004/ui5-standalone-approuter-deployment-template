sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
], function (
    MessageToast,
    BusyIndicator,
) {
    "use strict";

    return {
        createTravelerWithUserRole: function (args) {
            BusyIndicator.show();
            console.log(args);
            jQuery.post({
                url: this._baseURL + '/traveler',
                contentType: 'application/json',
                data: JSON.stringify({
                    ...args
                }),
                success: function (oTraveler) {
                    console.log("oTraveler in travelerService", oTraveler);

                    var oBus = sap.ui.getCore().getEventBus();
                    oBus.publish("Traveler", "AddTravelerSuccess", {
                        oTraveler: oTraveler
                    });
                    BusyIndicator.hide();
                }.bind(this),
                error: function (err) {
                    console.log(err);
                    MessageToast.show(err.responseJSON.message);
                    BusyIndicator.hide();
                }
            });
        },

        login: function (userName, password, isAdmin = false) {
            BusyIndicator.show();
            console.log("Login function called in traveler service with ", userName, password, isAdmin);
            jQuery.post({
                url: this._baseURL + '/authenticate',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: userName,
                    password: password,
                    isAdmin: isAdmin ? isAdmin : false
                }),
                success: function (oJwt) {
                    console.log("oTraveler in travelerService", oJwt);
                    MessageToast.show("User login Successfully");
                    window.localStorage.setItem("FBS_token", oJwt.jwt);
                    var oBus = sap.ui.getCore().getEventBus();
                    oBus.publish("Traveler", "LoginSuccess", {
                        oJwt: oJwt
                    });
                    BusyIndicator.hide();
                }.bind(this),
                error: function (err) {
                    console.log(err);
                    MessageToast.show("Incorrect username or password");
                    BusyIndicator.hide();
                }
            });
        },

        getTravelerBookings: function () {
            BusyIndicator.show();
            console.log("getTravelerBookings function called in traveler service with ");
            const FBS_token = window.localStorage.getItem("FBS_token");
            if (FBS_token == null) {
                MessageToast.show("Please login...", {
                    closeOnBrowserNavigation: false
                });
                console.log("this", this.getRouter().navTo("login"));
                // this.DataRepository.getRouter().navTo("login");
                return;
            }
            jQuery.get({
                url: this._baseURL + '/traveler/bookings',
                contentType: 'application/json',
                headers: {
                    Authorization: "Bearer " + FBS_token
                },
                success: function (oBookings) {
                    console.log("oBookings in travelerService", oBookings);

                    var oBus = sap.ui.getCore().getEventBus();
                    oBus.publish("Traveler", "GetBookingsSuccess", {
                        oBookings: oBookings
                    });
                    BusyIndicator.hide();
                }.bind(this),
                error: function (err) {
                    console.log(err);
                    MessageToast.show("Please login before...", {
                        closeOnBrowserNavigation: false
                    });
                    BusyIndicator.hide();
                }.bind(this)
            });
        },
        cancelBooking: function (bookingId) {
            BusyIndicator.show();
            const FBS_token = window.localStorage.getItem("FBS_token");
            if (!FBS_token) {
                MessageToast.show("Login please...", {
                    closeOnBrowserNavigation: false
                });
                this.getRouter().navTo("login");
                return;
            }
            jQuery.ajax({
                url: this._baseURL + '/booking/cancel',
                type: 'PATCH',
                contentType: 'application/json',
                headers: {
                    Authorization: "Bearer " + FBS_token
                },
                data: JSON.stringify({
                    "bookingId": bookingId
                }),
                success: function (response) {
                    console.log("response in cancelSeats", response);
                    MessageToast.show("Booking cancelled successfully");
                    var oBus = sap.ui.getCore().getEventBus();
                    oBus.publish("FlightService", "cancelSeatsSuccess", {
                        booking: response
                    });
                    BusyIndicator.hide();
                },
                error: function (err) {
                    MessageToast.show(err.responseJSON.message);
                    console.log(err);
                    BusyIndicator.hide();
                }
            });
        },
        onNavBack: function () {
            const callBack = this.onNavBack();
            callBack();
        }
    }
});