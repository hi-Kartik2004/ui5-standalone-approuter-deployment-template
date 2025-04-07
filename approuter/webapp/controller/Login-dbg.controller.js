sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "ui5/rest/restwithui5/utils/jwtParser",
    "ui5/rest/restwithui5/utils/authenticatedEndpoints",
    "ui5/rest/restwithui5/utils/utilFunctions"
], function (
    Controller,
    MessageToast,
    jwtParser,
    authenticatedEndpoints,
    utils
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.Login", {
        /**
         * @override
         */
        onInit: function () {
            console.log("Login Controller fired");
            this.oRouter = this.getOwnerComponent().getRouter();
            const resp = authenticatedEndpoints(this);
            this.DataRepository = this.getOwnerComponent().DataRepository
            this.oRouter.getRoute("loginAdmin").attachPatternMatched(this.adminLogin, this);
            this.oRouter.getRoute("login").attachPatternMatched(this.userLogin, this);
            console.log(utils);
        },
        redirectBackIfAuthenticated: function () {
            if (window.localStorage.getItem("FBS_token")) {
                const claims = this.getOwnerComponent().getModel().getProperty("/user");
                if (claims.exp < new Date().getUTCMilliseconds)
                    this.onNavBack();
            }
        },
        userLogin: function () {
            utils.redirectBackIfAuthenticated(this);
            this.oModel = this.getView().getModel();
            this.oModel.setProperty("/username", null);
            this.oModel.setProperty("/password", null);
            this.admin = false;
            this.getView().byId("LoginForm").setTitle("Login to proceed");
        },
        adminLogin: function () {
            utils.redirectBackIfAuthenticated(this);
            console.log("Called onPatternMatched");
            this.oModel = this.getView().getModel();
            this.oModel.setProperty("/username", null);
            this.oModel.setProperty("/password", null);
            this.getView().getModel().refresh();
            this.admin = true;
            this.getView().byId("LoginForm").setTitle("Admin Login to proceed");


        },
        handleFormSubmit: function () {
            console.log("handleFromSubmit fired...");
            console.log(this.DataRepository);
            const oModel = this.getView().getModel();
            // oModel.setProperty("/username", "user");
            // oModel.setProperty("/password", "user");
            const userName = oModel.getProperty("/username");
            const password = oModel.getProperty("/password")
            console.log(oModel);
            if (this.isUsernameAndPasswordNotBlank(userName, password)) {
                // create the traveler
                const getToken = this.DataRepository.login(userName, password, this.admin);
                console.log("resp in Login controller", getToken);

                var oBus = sap.ui.getCore().getEventBus();
                oBus.subscribe("Traveler", "LoginSuccess", this.handleRedirect, this);
            } else {
                MessageToast.show("Both username and password are required fields");
            }
        },
        isUsernameAndPasswordNotBlank: function (username, password) {
            return (username && username.trim().length > 0) && (password && password.trim().length > 0);
        },
        onNavBack: function () {
            const callBack = this.getOwnerComponent().onNavBack();
            callBack();
        },
        handleRedirect: function () {
            console.log("redirect fired...")
            const token = window.localStorage.getItem("FBS_token");
            const claims = jwtParser(token);
            console.log("claims", claims);
            if (claims !== null) {
                this.getOwnerComponent().getModel().setProperty("/user", claims);
            }
            if (claims.userType.toUpperCase() == "ADMIN") {
                this.oRouter.navTo("addAirport");
            } else {
                this.onNavBack();
            }
        }
    });
});