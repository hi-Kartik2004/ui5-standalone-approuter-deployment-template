sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ui5/rest/restwithui5/model/DataRepository",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "ui5/rest/restwithui5/utils/utilFunctions"
], function (
    Controller,
    JSONModel,
    DataRepository,
    MessageToast,
    Dialog,
    Button,
    library,
    List,
    StandardListItem,
    Text,
    utilFunctions
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.Detail", {
        /**
         * @override
         */
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("detail").attachPatternMatched(this.fetchDetails.bind(this));
            this.DataRepository = this.getOwnerComponent().DataRepository;

            this.oBus = sap.ui.getCore().getEventBus();
            this.oBus.subscribe("AircraftStructure", "RenderPassengerForm", this.renderPassengerView, this);

        },
        fetchDetails: function (oEvent) {

            // console.log("_handleRoutePatternMatched", this.getOwnerComponent().getModel().getProperty("/flight/passengers"));
            const flightId = oEvent.getParameter("arguments").flightId;
            const oModel = this.getView().getModel();
            const sPath = "/flight/" + flightId;

            const oFlight = oModel.getProperty(sPath);
            if (!oFlight) {
                this.DataRepository.getFlight(flightId);
            }
            this._bindview(sPath);
        },
        convertToISOString: function (timestamp) {
            console.log("convertToISOString called");

            if (timestamp) {
                var date = new Date(timestamp);

                // Check if the date is valid
                if (!isNaN(date)) {
                    return date.toISOString();
                } else {
                    return "Invalid date";
                }
            }

            return "N/A";
        },
        _bindview: function (sPath) {
            this.getView().bindElement(sPath);
        },
        length: function (array) {
            return array ? array.length : 0;
        },
        onNavBack: function () {
            const callBack = this.getOwnerComponent().onNavBack();
            callBack();
        },
        payAmountButtonPress: async function () {
            console.log("payAmountButtonPress called");
            const oModel = this.getView().getModel();
            const passengers = this.getOwnerComponent().getModel().getProperty("/flight/passengers");
            if (!passengers || passengers.length == 0) {
                MessageToast.show("No passengers found");
                return;
            }
            const flightId = oModel.getProperty("/flight/flightId");
            console.log(passengers, flightId);
            const formattedPassengers = this.formatPassengers(passengers);
            console.log("formattedPassengers", formattedPassengers);
            if (this._verifyPassengers()) {
                this.oBooking = null;
                try {
                    this.oBooking = await this.DataRepository.createBooking(formattedPassengers, flightId);
                    this.showBookingDialog(this.oBooking);
                } catch (err) {
                    console.log(err);
                    MessageToast.show("Please login...", {
                        duration: 3000,
                        closeOnBrowserNavigation: false
                    });
                    this.oRouter.navTo("login");
                }
                console.log(this.oBooking);
            }
        },
        showBookingDialog: function (oBooking) {
            console.log("show Booking dialog received", oBooking);

            var htmlContent = "<div class='p-2'>" +
                "<p><strong>Booking ID:</strong> " + oBooking.bookingId + "</p>" +
                "<p><strong>Traveler Name:</strong> " + oBooking.traveler.name + "</p>" +
                "<hr />" +
                "<div><strong>Passenger(s):</strong>" +
                oBooking.passengers.map(passenger =>
                    `<p><strong>Name</strong>: ${passenger.name}, <strong>ID Proof:</strong> ${passenger.idProof}, <strong>Age</strong>: ${passenger.age}, <strong>Seat No</strong>: ${passenger.seat}</p>`).join("") +
                "</div>" +
                "<hr />" +
                "<p><strong>Flight:</strong> " + oBooking.flight.flightName + "</p>" +
                "<p><strong>Source Airport:</strong> " + oBooking.flight.sourceAirport.airportName + " (" + oBooking.flight.sourceAirport.city + ", " + oBooking.flight.sourceAirport.country + ")</p>" +
                "<p><strong>Destination Airport:</strong> " + oBooking.flight.destinationAirport.airportName + " (" + oBooking.flight.destinationAirport.city + ", " + oBooking.flight.destinationAirport.country + ")</p>" +
                "<p><strong>Departure:</strong> " + new Date(oBooking.flight.departureDateTime).toLocaleString() + "</p>" +
                "<p><strong>Arrival:</strong> " + new Date(oBooking.flight.arrivalDateTime).toLocaleString() + "</p>" +
                "<p><strong>Amount Paid:</strong> Rs " + oBooking.amount.toFixed(2) + "</p>" +
                "</div>";

            if (!this.oDefaultDialog) {
                this.oDefaultDialog = new Dialog({
                    title: "Happy Journey, your booking is confirmed!",
                    contentWidth: "auto",
                    endButton: new Button({
                        text: "OK",
                        press: function () {
                            this.getOwnerComponent().getRouter().navTo("Booking");
                            this.oDefaultDialog.close();
                        }.bind(this)
                    })
                });

                this.getView().addDependent(this.oDefaultDialog);
            }

            this.oDefaultDialog.removeAllContent();
            this.oDefaultDialog.addContent(new sap.ui.core.HTML({ content: htmlContent }));

            this.oDefaultDialog.open();
        },
        formatPassengers: function (passengers) {
            const renamedAndFilteredArray = passengers
                .map(obj => {
                    // Step 2: Rename properties
                    return {
                        name: obj.passengerName,
                        age: obj.passengerAge,
                        idProof: obj.passengerIdProof,
                        requestedSeat: obj.seat
                    };
                });

            return renamedAndFilteredArray;
        },
        _verifyPassengers: function () {
            const oView = this.getView();
            const oBindingContext = oView.getBindingContext().getProperty("/flight/passengers");
            let resp = true;
            oBindingContext.forEach(element => {
                if (Object.values(element).includes('')) {
                    MessageToast.show("All the Passenger details are required");
                    resp = false;
                } else if (typeof (Number(element.passengerAge)) !== 'number') {
                    MessageToast.show("All the Passenger's Age must be a number");
                    resp = false;
                }
            })

            return resp;
        },
        getDuration: function (startTimestampStr, endTimestampStr) {
            console.log("getDuration", startTimestampStr, endTimestampStr);
            const resp = utilFunctions.getDuration(startTimestampStr, endTimestampStr);
            console.log(resp);
            return resp;
        },
        renderPassengerView: function () {
            this.getView().rerender();
        },
        /**
         * @override
         */
        onRouteLeaving: function () {
            console.log("Details controller onexit fired...");
            this.getOwnerComponent().getModel().setProperty("/flight/selectedSeats", null);
        }
    });
});