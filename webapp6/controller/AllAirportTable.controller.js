sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
], function (
    Controller,
    MessageToast,
    BusyIndicator,
    Filter,
    FilterOperator,
    JSONModel
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.AllAirportTable", {
        /**
         * @override
         */
        onInit: function () {
            console.log("All AirportTableController called...");
            this.DataRepository = this.getOwnerComponent().DataRepository;
            this.oRouter = this.getOwnerComponent().getRouter();
            this.aFilters = [];
            this.getView().setModel(new JSONModel({}), "filterModel");
        },
        onEditPress: function (oEvent) {
            console.log("onEditPress...");
            const oSource = oEvent.getSource();
            const oContext = oSource.data("bindingContext");
            oContext["edit"] = true;
            const oBinding = oSource.getBindingContext("airportsModel");
            console.log(oBinding.getProperty("edit"));
            oBinding.setProperty("edit", true);
        },
        onSavePress: function (oEvent) {
            console.log("onSavePress...");
            const oSource = oEvent.getSource();
            const oContext = oSource.getBindingContext("airportsModel");
            const oModel = this.getView().getModel("airportsModel");
            const oData = oModel.getProperty(oContext.getPath());

            if (this.DataRepository.modifyAirport) {
                BusyIndicator.show();
            }

            console.log(this.DataRepository.modifyAirport(oData)());

            this.DataRepository.createAirport(oData)().then(() => {
                MessageToast.show("Airport updated successfully");
                BusyIndicator.hide();
                oContext.setProperty("edit", false);
            }).catch((err) => {
                BusyIndicator.hide();
                console.log(err);
                console.log(err.status);
                if (err.status == 401) {
                    window.localStorage.removeItem("FBS_token");
                    this.getOwnerComponent().getModel().setProperty("/user", null);
                    MessageToast.show("Please login...", {
                        closeOnBrowserNavigation: false
                    });
                    this.oRouter.navTo("login");
                    return;
                } else if (err.status == 400) {
                    const keys = Object.keys(err.responseJSON);
                    const values = Object.values(err.responseJSON);
                    const errorMessages = [];
                    keys.forEach((key, index) => {
                        const message = `${key}: ${values[index]}`;
                        errorMessages.push(message);
                    })

                    MessageToast.show(JSON.stringify(...errorMessages));
                } else {
                    MessageToast.show("Unable to update Airport...");
                }


            });
        },
        onDeletePress: function (oEvent) {
            console.log("onDeletePress called");
            const oSource = oEvent.getSource();
            const oBindingContext = oSource.getBindingContext("airportsModel");
            const aiportCode = oBindingContext.getProperty("airportCode");
            const callBack = this.DataRepository.deleteAirport(aiportCode);
            console.log(callBack);
            callBack().then(() => {
                MessageToast.show("Airport Deleted successfully");
            }).catch((err) => {
                console.error(err);
                MessageToast.show("Something went wrong unable to delete airport");
            })
        },
        filterAirports: function (oEvent) {
            const filterModel = this.getView().getModel("filterModel");

            const keywordAirportCode = filterModel.getProperty("/airportCodeKeyword");
            const keywordAirportCity = filterModel.getProperty("/airportCityKeyword");
            const aFilters = [];
            if (keywordAirportCity) {
                aFilters.push(new Filter("city", FilterOperator.Contains, keywordAirportCity))
            }

            if (keywordAirportCode) {
                aFilters.push(new Filter("airportCode", FilterOperator.Contains, keywordAirportCode))
            }

            const table = this.getView().byId("allAirportsTable");
            const oBinding = table.getBinding();
            oBinding.filter(aFilters);
        },
    });
});