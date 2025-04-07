sap.ui.define(["sap/ui/core/format/DateFormat",
    "sap/m/MessageToast"], function (
        DateFormat,
        MessageToast) {
    "use strict";
    return {
        getFlights: function (srcCode, destCode, date) {
            console.log("getFlights called with ", srcCode, destCode, date);
            jQuery.get({
                url: `${this._baseURL}/flight?srcCode=${srcCode}&destCode=${destCode}&date=${date}`,
                success: function (aFlights) {
                    const formattedFlights = aFlights.map((flight) => {
                        flight.departureDateTimeLocalTimeStamp = new Date(flight.departureDateTimeLocal).toLocaleString();
                        flight.arrivalDateTimeLocalTimeStamp = new Date(flight.arrivalDateTimeLocal).toLocaleString();
                        const temp = new Date(flight.departureDateTimeLocal);
                        flight.departureDate = temp.getDate() + '-' + (Number(temp.getMonth()) + 1) + '-' + temp.getFullYear();

                        flight.duration = this._getDurationBetweenTimestamps(flight.departureDateTimeLocal, flight.arrivalDateTimeLocal);

                        flight.departureTimeLocal = this._formatTimeFromMilliseconds(new Date(flight.departureDateTimeLocal).getTime());
                        flight.arrivalTimeLocal = this._formatTimeFromMilliseconds(new Date(flight.arrivalDateTimeLocal).getTime());

                        const splittedFlightNameArr = flight.flightName.split('-');

                        flight.splittedFlightName = splittedFlightNameArr[1] + '-' + splittedFlightNameArr[2] + '-' +
                            splittedFlightNameArr[3];
                        return flight;
                    })
                    var oModel = this.getDataModel();
                    oModel.setProperty("/flights", formattedFlights)
                }.bind(this)
            });
        },
        getFlight: function (flightId) {
            jQuery.get({
                url: this._baseURL + '/flight/single' + '?flightId=' + flightId,
                success: function (oFlight) {
                    oFlight.departureDateTimeLocalTimeStamp = new Date(oFlight.departureDateTimeLocal).toLocaleString();
                    oFlight.arrivalDateTimeLocalTimeStamp = new Date(oFlight.arrivalDateTimeLocal).toLocaleString();

                    var oModel = this.getDataModel();
                    oModel.setProperty("/flight", oFlight);

                    var oBus = sap.ui.getCore().getEventBus();
                    oBus.publish("Flight", "DataLoaded", {
                        flight: oFlight,
                        message: "Flight data is ready"
                    });
                }.bind(this),
                error: function (err) {
                    console.log(err);
                    alert("Something went wrong!");
                }
            });
        },
        searchAirport: function (keyword) {
            jQuery.get({
                url: this._baseURL + '/airport' + '?keyword=' + keyword,
                success: function (aAirports) {
                    console.log(aAirports);
                    var oModel = this.getDataModel();
                    oModel.setProperty("/suggestedAirports", aAirports);
                }.bind(this),
                error: function (err) {
                    console.log(err);
                    alert("Something went wrong");
                }
            });
        },
        getAirport: function (airportCode) {
            return jQuery.get({
                url: this._baseURL + '/airport' + '?airportCode=' + airportCode,
                success: function (aAirports) {
                    return aAirports;
                }.bind(this),
                error: function (err) {
                    console.log(err);
                }
            });
        },
        createBooking: function (passengers, flightId) {
            console.log("passengers in flightService ", passengers);
            const FBS_token = window.localStorage.getItem("FBS_token");
            return jQuery.post({
                url: this._baseURL + '/booking',
                contentType: 'application/json',
                data: JSON.stringify({
                    "passengers": passengers,
                    flightId: flightId,
                    travelerId: "6f4b48f8-d263-426d-9154-1e5add4d1ad5"
                }),
                headers: {
                    Authorization: "Bearer " + FBS_token
                },
                success: function (oBooking) {
                    return oBooking;
                },
                error: function (err) {
                    console.log(err);
                    console.error(err.responseJSON.message);
                    var oBus = sap.ui.getCore().getEventBus();
                    oBus.publish("Flight", "UnauthenticatedUser", {
                        err: err
                    })
                }
            })
        },
        _formatTimeFromMilliseconds: function (milliseconds) {
            // Create a new Date object using the milliseconds value
            let date = new Date(milliseconds);

            // Get the hours and minutes, pad with leading zero if necessary
            let hours = date.getHours().toString().padStart(2, '0');
            let minutes = date.getMinutes().toString().padStart(2, '0');

            // Return the formatted time as "HH:mm"
            return `${hours}:${minutes}`;
        },
        cancelSeats: function (seats, bookingId) {
            console.log("CancelSeats called");
            const FBS_token = window.localStorage.getItem("FBS_token");
            jQuery.ajax({
                url: this._baseURL + '/booking',
                type: 'PATCH',
                contentType: 'application/json',
                headers: {
                    Authorization: "Bearer " + FBS_token
                },
                data: JSON.stringify({
                    "cancelSeats": seats,
                    "bookingId": bookingId
                }),
                success: function (response) {
                    console.log("response in cancelSeats", response);
                    MessageToast.show("Seats cancelled successfully");
                    var oBus = sap.ui.getCore().getEventBus();
                    oBus.publish("FlightService", "cancelSeatsSuccess", {
                        booking: response
                    });
                },
                error: function (err) {
                    MessageToast.show(err.responseJSON.message);
                    console.log(err);
                }
            });
            // jQuery({
            //     url: this._baseURL + '/booking',
            //     contentType: 'application/json',
            //     method: ''
            //     data: JSON.stringify({
            //         "cancelSeats": seats,
            //         "bookingId": bookingId
            //     }),
            //     headers: {
            //         Authorization: "Bearer " + FBS_token
            //     },
            //     success: function (oBooking) {
            //         console.log(oBooking);
            //         var oBus = sap.ui.getCore().getEventBus();
            //         oBus.publish("Flight", "cancelSeatsSuccess", {
            //             booking: oBooking
            //         })
            //         return oBooking;
            //     },
            //     error: function (err) {
            //         console.log(err);
            //         console.error(err.responseJSON.message);
            //         // var oBus = sap.ui.getCore().getEventBus();
            //         // oBus.publish("Flight", "cancelSeatsError", {
            //         //     err: err
            //         // })
            //         MessageToast.show(err.responseJSON.message);
            //     }
            // })
        },
        _getDurationBetweenTimestamps: function (startTimestampStr, endTimestampStr) {
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
        }

    }
})