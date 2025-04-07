sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ui5/rest/restwithui5/model/DataRepository",
    "sap/ui/core/routing/History"
], (Controller,
    DataRepository,
    History) => {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.SearchFlights", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            this.DataRepository = this.getOwnerComponent().DataRepository;
            oRouter.getRoute("searchFlights").attachPatternMatched(this.onPatternMatched, this);
        },
        onPatternMatched: function (oEvent) {
            const parameters = oEvent.getParameter("arguments");
            const oModel = this.getView().getModel();
            oModel.setProperty("/srcCode", parameters.srcCode);
            oModel.setProperty("/destCode", parameters.destCode);
            oModel.setProperty("/departureDate", parameters.date.split('-').reverse().join('-'));
            const globalContext = this.getOwnerComponent().getModel();
            const destAirport = globalContext.getProperty("/destAirport");
            const srcAirport = globalContext.getProperty("/srcAirport");
            console.log("srcAirport variable", srcAirport);
            globalContext.setProperty("/date", parameters.date.split('-').reverse().join('/'))

            globalContext.setProperty("/srcAirport", srcAirport);
            globalContext.setProperty("/destAirport", destAirport);


            if (globalContext.getProperty("/srcAirport") == null) {
                this.DataRepository.getAirport(parameters.srcCode).then((oAirports) => {
                    globalContext.setProperty("/srcAirport", oAirports);
                })
            }

            if (globalContext.getProperty("/destAirport") == null) {
                this.DataRepository.getAirport(parameters.destCode).then((oAirports) => {
                    globalContext.setProperty("/destAirport", oAirports);
                })
            }

            this.DataRepository.getFlights(parameters.srcCode, parameters.destCode, parameters.date);
        },
        onCustomListItemPress: function () {
            console.log("Hello from SearchFlights");
        },
        navigateToDetails: function (oEvent) {
            const oRouter = this.getOwnerComponent().getRouter();
            const oSource = oEvent.getSource();
            const bindingContext = oSource.getBindingContext();
            const flightId = bindingContext.getProperty("flightId");
            oRouter.navTo("detail", { flightId: flightId });
        },
        length: function (array) {
            return array ? array.length : 0;
        },
        onRefreshButtonPress: function () {
            console.log("onRefreshButtonPress called");
            var oModel = this.getView().getModel();
            oModel.refresh(true);
        },
        onNavBack: function () {
            const callBack = this.getOwnerComponent().onNavBack();
            callBack();
        }
    });
});