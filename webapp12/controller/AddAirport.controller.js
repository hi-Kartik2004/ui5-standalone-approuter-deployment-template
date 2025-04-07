sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
], function (
    Controller,
    MessageToast,
    JSONModel,
    BusyIndicator
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.AddAirport", {
        /**
        * @override
        */
        onInit: function () {
            console.log("Controller of AddAirport fired");
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("addAirport").attachPatternMatched(this.onPatternMatched, this);
            this.globalContext = this.getOwnerComponent().getModel();
            this.DataRepository = this.getOwnerComponent().DataRepository;
        },
        onPatternMatched: function (oEvent) {
            console.log("onPatternMatched called");
            const userType = this.globalContext.getProperty("/user/userType");
            console.log(userType);
            if (!userType || userType.toUpperCase() !== "ADMIN") {
                MessageToast.show("You are not authorized to view that page", {
                    closeOnBrowserNavigation: false
                });
                this.oRouter.navTo("RouteInitial");
                return;
            }
            this.getView().setModel(new JSONModel({}), "formModel");
            this.getView().setModel(new JSONModel({}), "airportsModel");
        },
        addAirportButtonPress: function () {
            console.log("addAirportButtonPress clicked...");

            const formModel = this.getView().getModel("formModel");
            const formData = formModel.getData();

            if (Object.keys(formData).length < 8) {
                MessageToast.show("All fields are mandatory");
                return;
            }
            BusyIndicator.show();
            this.DataRepository.createAirport(formData)()
                .then((data) => {
                    BusyIndicator.hide();
                    console.log('Data saved successfully:', data);
                    MessageToast.show('Airport added successfully!');
                    const airports = this.getView().getModel("airportsModel").getProperty("/airports");
                    airports.push({ ...data, edit: false });
                    this.getView().getModel("airportsModel").setProperty("/airports", airports);
                    this.getView().setModel(new JSONModel({}), "formModel");
                })
                .catch((error) => {
                    console.error("error", error);
                    if (error && error.responseJSON) {
                        formModel.setProperty("/errors", error.responseJSON);
                        console.log("Errors set in form model:", formModel.getProperty("/errors"));

                    } else {
                        console.error("Unexpected error format:", error);
                        MessageToast.show("Failed to add airport due to unexpected error.");
                    }
                    BusyIndicator.hide();
                });
        }
    });
});