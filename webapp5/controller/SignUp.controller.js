sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "ui5/rest/restwithui5/utils/authenticatedEndpoints"
], function (
    Controller,
    MessageToast,
    JSONModel,
    authenticatedEndpoints
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.SignUp", {
        /**
         * @override
         */
        onInit: function () {
            this.DataRepository = this.getOwnerComponent().DataRepository;
            console.log("Sign up controller fired");
            authenticatedEndpoints(this);
            const emptyFormObject = {
                name: "",
                username: "",
                password: "",
                cPassword: "",
                picture: ""
            }
            const jsonModel = new JSONModel(emptyFormObject);
            this.getView().setModel(jsonModel);
            this.oRouter = this.getOwnerComponent().getRouter();
        },
        onNavBack: function () {
            this.getOwnerComponent().onNavBack()();
        },

        handleFormSubmit: function () {
            const oModel = this.getView().getModel();
            const userName = oModel.getProperty("/username");
            const password = oModel.getProperty("/password");
            const cPassword = oModel.getProperty("/cPassword");
            const name = oModel.getProperty("/name");
            const picture = oModel.getProperty("/picture");
            console.log(password, cPassword);

            if (password.trim() !== cPassword.trim()) {
                MessageToast.show("Password mismatch");
                return;
            }

            if (!userName || !password || !cPassword || !name || !picture) {
                MessageToast.show("All fields are required");
                return;
            }
            this.DataRepository.createTravelerWithUserRole({ userName, password, name, picture });
            var oBus = sap.ui.getCore().getEventBus();
            oBus.subscribe("Traveler", "AddTravelerSuccess", this.handleRedirectOnSuccess, this);
        },
        handleRedirectOnSuccess: function () {
            this.oRouter.navTo("login");
            MessageToast.show("User created Successfully", {
                duration: 5000
            });
        }
    });
});