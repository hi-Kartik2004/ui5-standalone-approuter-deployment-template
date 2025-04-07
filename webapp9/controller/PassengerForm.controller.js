sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (
    Controller,
    MessageToast
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.PassengerForm", {

        onInit: function () {
            console.log("PassengerForm controller fired");
            const oModel = this.getOwnerComponent().getModel();

            const selectedSeats = oModel.getProperty("/flight/selectedSeats");

            const emptyPassenger = {
                passengerName: '',
                passengerAge: 0,
                passengerIdProof: ''
            }
            const bindingContext = this.getView();
            this.oBus = sap.ui.getCore().getEventBus();
            this.oBus.subscribe("Flight", "SeatSelected", this.handleSeatSelectedEvent, this);
            console.log("Binding Context", bindingContext);

            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("detail").attachPatternMatched(this._handleRoutePatternMatched, this);
        },
        _handleRoutePatternMatched: function () {
            this.getView().getModel().setProperty("/passengersCount", 0);
        },
        handleSeatSelectedEvent: function (sChannelId, sEventId, oData) {
            console.log("handleSeatSelectedEvent called");
            const oModel = this.getOwnerComponent().getModel();
            console.log("oModel in passengerForm", oModel);
            console.log("oData in passengerForm", oData);
            const bindingContext = this.getView().getBindingContext();
            console.log("Passenger BindingConetxt is", bindingContext);
            const count = oModel.getProperty("/flight/passengers").length;
            let passengers = oModel.getProperty("/flight/passengers");
            const emptyPassenger = {
                index: count + 1,
                passengerName: '',
                passengerAge: null,
                passengerIdProof: '',
                seat: oData.seatPressed
            }

            if (oData.create) {
                passengers.push(emptyPassenger);
                console.log("Passenger after adding of seat", this.passengers);
                oModel.setProperty("/flight/passengers", passengers.slice());
            } else {
                console.log("Calling...");
                console.log(passengers);
                console.log(oData);
                passengers = passengers.filter((passenger) => {
                    return passenger.seat != oData.seatPressed;
                });
                console.log("Passenger after removal of seat", passengers);
                console.log(this.getView());
                oModel.setProperty("/flight/passengers", passengers.slice());
            }

            this.getView().getModel().setProperty("/passengersCount", passengers.length);
            console.log("View", this.getView());

        },
        onSaveAllPassengersButtonPress: function () {
            const oView = this.getView();

            if (this._verifyPassengers()) {
                disableInputs(oView);
            }

            function disableInputs(oControl) {
                if (oControl instanceof sap.m.Input) {
                    oControl.setEnabled(false);
                } else if (oControl.getContent) {
                    var aContent = oControl.getContent();
                    if (aContent) {
                        aContent.forEach(disableInputs);
                    }
                } else if (oControl.getItems) {
                    var aItems = oControl.getItems();
                    if (aItems) {
                        aItems.forEach(disableInputs);
                    }
                }
            };

        },

        isSelectedSeats: function (selectedSeats) {
            return selectedSeats != null && selectedSeats.length > 0
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
        onEditFormButtonPress: function () {
            console.log("onEditFormButtonPress called");

            const oView = this.getView();


            const enableInputs = function (oControl) {
                if (oControl instanceof sap.m.Input) {
                    oControl.setEnabled(true);
                } else if (oControl.getContent) {
                    var aContent = oControl.getContent();
                    if (aContent) {
                        aContent.forEach(enableInputs);
                    }
                } else if (oControl.getItems) {
                    var aItems = oControl.getItems();
                    if (aItems) {
                        aItems.forEach(enableInputs);
                    }
                }
            };


            enableInputs(oView);
        },
        getAmount: function (seats) {
            if (!seats) return 0;
            return seats * this.selectedSeats.length;
        },
        onExit: function () {
            console.log("Passenger Form exit called");
            const oModel = this.getOwnerComponent().getModel();
            oModel.setProperty("/flight/selectedSeats", null);
        }

        // /** 
        //  * @override
        //  */
        // onExit: function() {
        //     const oModel = this.getOwnerComponent().getModel();
        //     // oModel.setProperty("/passengers", null);


        // }
    });
});