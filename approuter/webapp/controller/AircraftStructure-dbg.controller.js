sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ui5/rest/restwithui5/utils/utilFunctions"
], function (
    Controller,
    utilFunctions
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.AircraftStructure", {
        /**
         * @override
         */
        onInit: function () {
            console.log("AircraftStructure controller called");
            this.oBus = sap.ui.getCore().getEventBus();
            this.oBus.subscribe("Flight", "DataLoaded", this.handleFlightDataLoaded, this);

            this.oBus.publish("AircraftStructure", "RenderPassengerForm", {
                ok: "OK"
            })
            this.DataRepository = this.getOwnerComponent().DataRepository;
            const oModel = this.getOwnerComponent().getModel();
            console.log(oModel);
            this.selectedSeats = null;
        },
        handleFlightDataLoaded: function (sChannelId, sEventId, oData) {
            console.log("Flight data loaded for flight ID:", oData.flight);
            const oModel = this.getOwnerComponent().getModel();
            const seats = oData.flight.seats;
            const availableSeats = oData.flight.availableSeats;
            console.log("availableSeats in AircraftStructureController is ", availableSeats);
            let arr = [];
            for (let i = 0; i < seats; i++) {
                let bDisabled = true;
                if (availableSeats.includes(i + 1)) {
                    bDisabled = false;
                }

                arr.push({
                    seat: i + 1,
                    disabled: bDisabled,
                    icon: bDisabled ? "sap-icon://color-fill" : "sap-icon://border"
                });
            }

            oModel.setProperty("/flight/duration", utilFunctions.getDuration(oData.flight.departureDateTimeLocal, oData.flight.arrivalDateTimeLocal));
            oModel.setProperty("/flight/allSeats", arr);
            oModel.setProperty("/flight/selectedSeats", []);
            console.log(oModel.getProperty("/flight/selectedSeats"));
            oModel.setProperty("/flight/passengers", []);
        },
        selectSeat: function (oEvent) {
            console.log("selectSeat function called");
            const oButton = oEvent.getSource();
            const oBindingContext = oButton.getBindingContext();
            console.log("Aircraft seat Button binding Context", oBindingContext);
            const oModel = oBindingContext.getModel();
            const globalContext = this.getOwnerComponent().getModel();

            const oData = oModel.getProperty(oBindingContext.getPath());
            // console.log(oData);
            const selectedSeat = oData.seat;
            const oModelForFlight = this.getView().getModel();

            if (oButton.getIcon() === "sap-icon://border") {
                oButton.setIcon("sap-icon://color-fill");
                if (!this.selectedSeats || !this.selectedSeats.length) {
                    this.selectedSeats = [selectedSeat];
                    console.log(this.selectedSeats);
                } else {
                    this.selectedSeats.push(selectedSeat);
                    console.log(this.selectedSeats);
                }
                this.oBus.publish("Flight", "SeatSelected", {
                    selectedSeats: this.selectedSeats,
                    create: true,
                    seatPressed: selectedSeat
                });
            }
            else {
                oButton.setIcon("sap-icon://border")
                this.selectedSeats = this.selectedSeats.filter(element => element != selectedSeat);
                console.log(this.selectedSeats);

                this.oBus.publish("Flight", "SeatSelected", {
                    selectedSeats: this.selectedSeats,
                    create: false,
                    seatPressed: selectedSeat
                });
            }

            globalContext.setProperty("/flight/selectedSeats", this.selectedSeats.slice());

            console.log(oModelForFlight);
        },
        onExit: function () {
            console.log("AircraftStructure exit called");
            const oModel = this.getOwnerComponent().getModel();
            oModel.setProperty("/flight/selectedSeats", null);
        }
    });
});