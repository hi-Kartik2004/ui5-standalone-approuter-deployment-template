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
            this.oRouter.getRoute("addAirport").attachPatternMatched(this._onPatternMatched, this);
        },
        _onPatternMatched: function () {
            this.getAllAirports();
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
            delete oData.aiportCode;

            if (this.DataRepository.modifyAirport) {
                BusyIndicator.show();
            }

            console.log(this.DataRepository.modifyAirport(oData)());

            this.DataRepository.createAirport(oData, true)().then(() => {
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
            const aiportId = oBindingContext.getProperty("airportId");
            const callBack = this.DataRepository.deleteAirport(aiportId);
            console.log(callBack);
            const table = this.getView().byId("allAirportsTable");
            const binding = table.getBinding("rows");
            const model = binding.getModel();
            const path = binding.getPath();
            const allAirports = model.getProperty(path);
            console.log(allAirports);
            callBack().then((oData) => {
                console.log("oData after deletion", oData);
                binding.filter(new Filter("airportId", FilterOperator.NE, oData.airportId));
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
        getAllAirports: function () {
            const allAirportsTable = this.getView().byId("allAirportsTable");
            console.log(allAirportsTable);
            allAirportsTable.setBusy(true);
            console.log("Getting all airports...");
            this.DataRepository.fetchAllAirports()().then((data) => {
                data.forEach(element => {
                    element["edit"] = false;
                });
                console.log("data", data);
                this.getView().getModel("airportsModel").setProperty("/airports", data);
                allAirportsTable.setBusy(false);
            }).catch((err) => {
                console.error(err);
                MessageToast.show("Unbale to fetch all airports...");
                allAirportsTable.setBusy(false);
            });
        }
    });
});