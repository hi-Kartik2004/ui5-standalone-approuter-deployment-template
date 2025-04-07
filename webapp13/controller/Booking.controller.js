sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    Controller,
    Dialog,
    Button,
    Fragment,
    MessageToast,
    Filter,
    FilterOperator
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.Booking", {
        /**
         * @override
         */
        onInit: function () {
            console.log("Booking controller fired");
            this.oRouter = this.getOwnerComponent().getRouter();

            this.oRouter.getRoute("Booking").attachPatternMatched(this._onRouteMatched, this);

        },
        _onRouteMatched: function () {
            this.getView().getModel().setProperty("/queryCompany", null);
            this.getView().getModel().setProperty("/querySourceCity", null);
            this.getView().getModel().setProperty("/queryDestCity", null);
            this.onFilterButtonPress(null);

            this.DataRepository = this.getOwnerComponent().DataRepository;
            const globalContext = this.getOwnerComponent().getModel();
            console.log(globalContext);

            var oBus = sap.ui.getCore().getEventBus();
            oBus.subscribe("FlightService", "cancelSeatsSuccess", this.handleCancelSeatsSuccess, this);

            oBus.subscribe("Traveler", "GetBookingsSuccess", this.handleGetBookingSuccessEvent, this);

            // oBus.subscribe("auth", "user", this._test, this);

            this.DataRepository.getTravelerBookings();
        },
        _test: function (oChannel, oEvent, oData, that) {
            console.log("test called ", oData);
            this.DataRepository.getTravelerBookings();
        },
        handleGetBookingSuccessEvent: function (oChannel, oEvent, oData, that) {
            console.log("handleGetBookingSuccessEvent got data", oData);

            if (Array.isArray(oData.oBookings) && oData.oBookings.length > 0) {

                oData.oBookings.sort(function (a, b) {
                    var dateA = new Date(a.createdAt);
                    var dateB = new Date(b.createdAt);
                    return dateB - dateA;
                });

            } else {
                console.log("No bookings available to sort.");
            }

            if (!this.getOwnerComponent().getModel().getProperty("/bookings")) {
                this.getOwnerComponent().getModel().setProperty("/bookings", oData.oBookings);
                console.log("Component", this.getOwnerComponent().getModel());
            } else {
                this.getOwnerComponent().getModel().setProperty("/bookings", oData.oBookings);
                console.log("Component", this.getOwnerComponent().getModel());

                var oList = this.getView().byId("bookingsList");
                if (oList) {
                    console.log("refresh called");
                    oList.getBinding("items").refresh();
                }
            }
        },
        isListNotEmpty: function (arr) {
            if (!arr) {
                return false;
            } else if (arr.length == 0) {
                return false;
            }
            return true;
        },
        handleCancelSeatsSuccess: function (oChannel, oEvent, oData, that) {
            console.log("handleCancelSeatsSuccess got ", oData);
            // console.log(oEvent.getBindingContext());
            console.log(this.getView().getBindingContext());
            // this.getView().setBindingContext(oData);
            this.DataRepository.getTravelerBookings();
            this.onCloseDialog(oEvent);
        },
        formatDate: function (dateTime) {
            return new Date(dateTime).toLocaleString();
        },
        getDuration: function (startTimestampStr, endTimestampStr) {
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
        onViewDetailsPress: function (oEvent) {
            console.log("called");
            const oView = this.getView();
            console.log("oEvent", oEvent);
            const oSource = oEvent.getSource();
            const bindingContext = oSource.getBindingContext();
            const passengers = bindingContext.getProperty("passengers");
            const cancelledSeats = bindingContext.getProperty("cancelledSeats");
            console.log(cancelledSeats);

            const newPassengers = passengers.map((passenger, index) => {
                return {
                    ...passenger,
                    index: index + 1,
                    cancelled: cancelledSeats && cancelledSeats.includes(passenger.seat) ? true : false
                }
            })
            console.log("newPassengers", newPassengers);

            if (!this._oDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "ui5.rest.restwithui5.view.PassengerDetailsDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    this._oDialog = oDialog;
                    const oModel = this._oDialog.getModel();
                    oModel.setProperty("/passengers", newPassengers);
                    console.log(this._oDialog);
                    this._oDialog.setBindingContext(bindingContext);
                    this._oDialog.open();
                }.bind(this)); // why bind(this)?
            } else {
                const oModel = this._oDialog.getModel();
                oModel.setProperty("/passengers", newPassengers);
                this._oDialog.setBindingContext(bindingContext);
                this._oDialog.open();
            }
        },

        addSeatToCancelList: function (oEvent) {
            console.log("addSeatToCancelList called");
            const oSource = oEvent.getSource();

            const passengerSeat = oSource.getBindingContext().getProperty("seat");
            console.log(passengerSeat);

            const passenger = oSource.getBindingContext().getProperty("");
            console.log(passenger);

            const globalContext = this.getOwnerComponent().getModel();
            let cancellationPassengers = globalContext.getProperty("/cancellationPassengers");
            console.log("before", cancellationPassengers);

            if (!cancellationPassengers) {
                passenger["included"] = true;
                globalContext.setProperty("/cancellationPassengers", [passengerSeat]);
                console.log(globalContext.getProperty("/cancellationPassengers"))
            } else {
                if (cancellationPassengers.includes(passengerSeat)) {
                    MessageToast.show("This seat is already in the cancellation seat list");
                    return;
                }
                passenger["included"] = true;
                cancellationPassengers.push(passengerSeat);
                globalContext.setProperty("/cancellationPassengers", cancellationPassengers);
            }

            console.log("after", globalContext.getProperty("/cancellationPassengers"));
            oSource.getBindingContext().setProperty("included", true);

        },
        removeSeatToCancelList: function (oEvent) {
            const oSource = oEvent.getSource();
            const seatToBeRemoved = oSource.getBindingContext().getProperty("seat");
            oSource.getBindingContext().setProperty("included", false);
            const globalContext = this.getOwnerComponent().getModel();
            const cancellationPassengers = globalContext.getProperty("/cancellationPassengers");

            const filteredPassengers = cancellationPassengers.filter((seat) => {
                return seat != seatToBeRemoved;
            });

            globalContext.setProperty("/cancellationPassengers", filteredPassengers);
            console.log(globalContext.getProperty("/cancellationPassengers"))

        },
        cancelSeats: function (oEvent) {
            const oSource = oEvent.getSource();
            console.log(oSource.getBindingContext());
            console.log("oSource from cancelSeats", oSource);
            const bindingContext = oSource.getBindingContext();
            const bookingId = bindingContext.getProperty("bookingId");
            console.log("BookingId", bookingId);

            if (!bookingId) {
                MessageToast.show("Booking ID is missing");
                return;
            }

            const model = this.getOwnerComponent().getModel();
            const cancellationPassengers = model.getProperty("/cancellationPassengers");
            console.log(cancellationPassengers);

            if (!cancellationPassengers || cancellationPassengers.length === 0) {
                MessageToast.show("No seats selected for cancellation");
                return;
            }

            this.DataRepository.cancelSeats(cancellationPassengers, bookingId);

            this.DataRepository.getTravelerBookings();
            var oBinding = this.getView().byId("bookingsList");
            if (oBinding) oBinding.refresh();
        },

        cancelBooking: function (oEvent) {
            const oSource = oEvent.getSource();
            const bindingContext = oSource.getBindingContext();
            const bookingId = bindingContext.getProperty("bookingId");
            console.log(bookingId);
            this.DataRepository.cancelBooking(bookingId);
            this.DataRepository.getTravelerBookings();

        },
        formatSeatList: function (aSeats) {
            console.log("aSeats", aSeats);
            let string = "";
            aSeats && aSeats.forEach(element => {
                string += element + ", ";
            });
            return string;
        },
        isInCancellPassengerList: function (seat) {
            console.log("isInCancellPassengerList called");
            const cancellationPassengers = this.getOwnerComponent().getModel().getProperty("/cancellationPassengers");
            console.log("cancellationPassengers", cancellationPassengers);

            return cancellationPassengers && cancellationPassengers.includes(seat);
        },
        onCloseDialog: function (oEvent) {
            if (this._oDialog)
                this._oDialog.close();
            this.getOwnerComponent().getModel().setProperty("/cancellationPassengers", null);

        },
        sumOf: function (arr) {
            if (!arr) {
                return 0;
            }
            let sum = arr.reduce(function (x, y) {
                return x + y;
            }, 0);
            return sum;
        },
        splitWithPlus: function (arr) {
            if (!arr) {
                return;
            }
            return arr.join(' + ');
        },
        onFilterButtonPress(oEvent) {
            // build filter array
            const oView = this.getView();
            const aFilter = [];

            const sQueryCompany = oView.getModel().getProperty("/queryCompany");
            const sQuerySourceCity = oView.getModel().getProperty("/querySourceCity");
            const sQueryDestCity = oView.getModel().getProperty("/queryDestCity");

            if (sQueryCompany)
                aFilter.push(new Filter("flight/company", FilterOperator.Contains, sQueryCompany));

            if (sQuerySourceCity)
                aFilter.push(new Filter("flight/sourceAirport/city", FilterOperator.Contains, sQuerySourceCity));

            if (sQueryDestCity)
                aFilter.push(new Filter("flight/destinationAirport/city", FilterOperator.Contains, sQueryDestCity));
            // aFilter.push(new Filter("flight/sourceAirport/city", FilterOperator.Contains, sQuery));


            // filter binding
            const oList = this.byId("bookingsList");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        onAirportFilter: function (oEvent) {
            const aFilter = [];
            const sQuery = oEvent.getParameter("query");
            if (sQuery) {
                aFilter.push(new Filter("flight/sourceAirport/city", FilterOperator.Contains, sQuery));
            }
            const oList = this.byId("bookingsList");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        /**
         * @override
         */
        onExit: function () {
            this.getOwnerComponent().getModel().setProperty("/bookings", null);
            this.getView().destroy();
        }
    });
});