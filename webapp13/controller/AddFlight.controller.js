sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function (
    Controller,
    MessageToast,
    JSONModel
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.AddFlight", {
        onInit: function () {
            console.log("Init called");
            this.DataRepository = this.getOwnerComponent().DataRepository;
            this.getView().setModel(new JSONModel({}), "addFlightFormModel");
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("addFlight").attachPatternMatched(this._onPatternMatched, this);
        },
        _onPatternMatched: function () {
            console.log("pattern matched called for all flight controller");
            if (!window.localStorage.getItem("FBS_token")) {
                this.oRouter.navTo("loginAdmin");
            }
        },
        onAddFlightButtonPress: function () {
            const formData = this.getView().getModel("addFlightFormModel");
            console.log(formData.getData());
            const formattedPayload = this._formatPayload(formData.getData());
            console.log("formattedPayload", formattedPayload);

            this.DataRepository.addFlight(formattedPayload).then((data) => {
                console.log(data);
                MessageToast.show("Flight created successfully");
                this.getView().getModel("addFlightFormModel").setData(null);
            }).catch((err) => {
                console.log(err);
                if (err.responseJSON.departureDateTime) {
                    err.responseJSON.departureDate = err.responseJSON.departureDateTime;
                    err.responseJSON.departureTime = err.responseJSON.departureDateTime;
                }

                if (err.responseJSON.arrivalDateTime) {
                    err.responseJSON.arrivalDate = err.responseJSON.arrivalDateTime;
                    err.responseJSON.arrivalTime = err.responseJSON.arrivalDateTime;
                }
                this.getView().getModel("addFlightFormModel").setProperty("/error", err.responseJSON);
                MessageToast.show("Failed to create flight");
            });
        },
        _formatPayload: function (payload) {
            console.log("_formatPayload called..", payload);
            const departureDate = payload.departureDate;
            const departureTime = payload.departureTime;
            const arrivalDate = payload.arrivalDate;
            const arrivalTime = payload.arrivalTime;

            if (departureDate && departureTime) {
                const fromattedDepartureDate = departureDate.split("/").reverse().join("-");
                const fromattedDepartureDateTime = fromattedDepartureDate + 'T' + departureTime + '+00:00';
                payload = { ...payload, "departureDateTime": fromattedDepartureDateTime };
            }

            if (arrivalDate && arrivalTime) {
                const fromattedArrivalDate = arrivalDate.split("/").reverse().join("-");
                const fromattedArrivalDateTime = fromattedArrivalDate + 'T' + arrivalTime + '+00:00';
                payload = { ...payload, "arrivalDateTime": fromattedArrivalDateTime };
            }

            return payload;
        },
        onAddFlightViaJSONButtonPress: function () {
            console.log("Adding flight via json...");
            const sJson = this.getView().getModel("addFlightFormModel").getProperty("/addFlightJson");
            console.log("Json received is ", JSON.parse(sJson));
            const oJson = JSON.parse(sJson);

            this.DataRepository.addFlight(oJson).then((data) => {
                MessageToast.show("Flight addded successfully");
            }).catch((err) => {
                MessageToast.show("Flight addition failed. " + err.responseJSON?.message);
            })

        }
    });
});