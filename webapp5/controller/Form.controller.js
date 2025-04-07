sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ui5/rest/restwithui5/model/DataRepository",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller,
    DataRepository,
    JSONModel,
    MessageToast) => {
    "use strict";
    return Controller.extend("ui5.rest.restwithui5.controller.Form", {

        onInit: function () {
            var oReviewModel = new JSONModel({
                "EntryCollection": [
                    {
                        "Author": "Alexandrina Victoria",
                        "AuthorPicUrl": "test-resources/sap/m/images/dronning_victoria.jpg",
                        "Type": "Request",
                        "Date": "March 03 2013",
                        "Actions": [
                            {
                                "Text": "Delete",
                                "Icon": "sap-icon://delete",
                                "Key": "delete"
                            },
                            {
                                "Text": "Share",
                                "Icon": "sap-icon://share-2",
                                "Key": "share"
                            },
                            {
                                "Text": "Edit",
                                "Icon": "sap-icon://edit",
                                "Key": "edit"
                            }
                        ],
                        "Text": "Lorem <strong>ipsum dolor sit amet</strong>, <em>consetetur sadipscing elitr</em>, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, <a href='http://www.sap.com'>sed diam voluptua</a>. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod <strong>tempor invidunt ut labore et dolore magna</strong> aliquyam erat, sed diam voluptua. <em>At vero eos et accusam et justo</em> duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seddiamnonumyeirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, <u>sed diam nonumy eirmod tempor invidunt ut labore</u> et dolore magna aliquyam erat, sed diam voluptua. <strong>At vero eos et accusam</strong> et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod <a href='//www.sap.com'>tempor invidunt</a> ut labore et dolore magna aliquyam erat, sed diam voluptua. <em>At vero eos et accusam</em> et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
                    },
                    {
                        "Author": "George Washington",
                        "AuthorPicUrl": "test-resources/sap/m/images/george_washington.jpg",
                        "Type": "Reply",
                        "Date": "March 04 2013",
                        "Text": "Lorem ipsum dolor sit <a href='http://www.sap.com'>amet</a>, consetetur sadipscing elitr, <em>sed diam</em> nonumy <strong>eirmod tempor</strong> invidunt ut labore"
                    },
                    {
                        "Author": "Alexandrina Victoria",
                        "AuthorPicUrl": "test-resources/sap/m/images/dronning_victoria.jpg",
                        "Type": "Request",
                        "Date": "March 05 2013",
                        "Text": "Lorem ipsum dolor sit amet, <u>consetetur sadipscing elitr</u>, sed diam nonumy eirmod tempor <strong>invidunt ut labore et dolore magna</strong> aliquyam erat",
                        "Actions": [
                            {
                                "Text": "Delete",
                                "Icon": "sap-icon://delete",
                                "Key": "delete"
                            },
                            {
                                "Text": "Share",
                                "Icon": "sap-icon://share-2",
                                "Key": "share"
                            },
                            {
                                "Text": "Edit",
                                "Icon": "sap-icon://edit",
                                "Key": "edit"
                            }
                        ]
                    },
                    {
                        "Author": "George Washington",
                        "AuthorPicUrl": "test-resources/sap/m/images/george_washington.jpg",
                        "Type": "Rejection",
                        "Date": "March 07 2013",
                        "Text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, www.sap.com sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
                    }
                ]
            }
            );
            this.getOwnerComponent().setModel(oReviewModel, "feed");
            console.log("called", this.getOwnerComponent().getModel());

            const greetingsArr = ["Ola", "Hello", "Namaste"];
            this.DataRepository = this.getOwnerComponent().DataRepository;
            const randomIndex = this._getRandomInt(greetingsArr.length);
            console.log("RandomIndex is ", randomIndex);

            const greetingsJson = {
                greetings: greetingsArr[randomIndex]
            };

            const oModel = new JSONModel(greetingsJson);
            const datePicker = this.getView().byId("departureDate");
            datePicker.setMinDate(new Date());

            this.getView().setModel(oModel, "data");
        },
        onSuggest: function (oEvent) {
            var DataRepository = this.getOwnerComponent().DataRepository
            const oSource = oEvent.getSource();
            const oSFId = oSource.getId();
            const oSF = this.getView().byId(oSFId);
            const keyword = oSource.getValue();
            const oModel = this.getView().getModel();
            const previousKeyword = oModel.getProperty("/" + oSFId);
            if (keyword.length > 1 && previousKeyword != keyword) {
                DataRepository.searchAirport(keyword);
                oSF.suggest();
                oModel.setProperty("/" + oSFId, keyword);
            }

        },
        onSearchFlightsButtonPress: function () {
            const oView = this.getView();
            const oModel = this.getView().getModel();
            const globalContext = this.getOwnerComponent().getModel();
            const sourceAirportStr = oView.byId("searchSrcAirport").getValue();
            const destinationAirportStr = oView.byId("searchDestAirport").getValue();
            const sourceAirportCode = this._getCodeFromAirportString(sourceAirportStr);
            const destinationAirportCode = this._getCodeFromAirportString(destinationAirportStr);
            const departureDate = oView.byId("departureDate").getValue();
            const formattedDepartureDate = departureDate.split("/").reverse().join('-');
            console.log(new Date(departureDate), (new Date().getDate() - 1));
            if (new Date(departureDate) < (new Date().getDate() - 1)) {
                MessageToast.show("Date cannot be in the past", {
                    duration: 3000
                });
                return;
            }

            if (sourceAirportStr.length === 0) {
                MessageToast.show("Source Airport is required");
                return;
            }
            if (destinationAirportStr.length === 0) {
                MessageToast.show("Destination Airport is required");
                return;
            }

            if (destinationAirportCode == sourceAirportCode) {
                MessageToast.show("Source and destination airport cannot be same");
                return;
            }

            if (!departureDate) {
                MessageToast.show("Journey Date is required");
                return;
            }

            Promise.all([
                this.DataRepository.getAirport(sourceAirportCode),
                this.DataRepository.getAirport(destinationAirportCode)
            ]).then(([aSourceAirport, aDestAirport]) => {
                console.log("source Airport", aSourceAirport);


                if (!aSourceAirport) {
                    MessageToast.show("Source Airport couldn't be found!");
                    return;
                }

                if (!aDestAirport) {
                    console.log("Destination Airport", aDestAirport);
                    MessageToast.show("Destination Airport couldn't be found!");
                    return;
                }

                globalContext.setProperty("/destAirport", aDestAirport);
                globalContext.setProperty("/srcAirport", aSourceAirport);
                this._redirectToSearchFlights(sourceAirportCode, destinationAirportCode, formattedDepartureDate);

            }).catch((error) => {
                console.log("Error in formController", error);
                MessageToast.show(error.responseJSON.message);
            });
        },
        _redirectToSearchFlights: function (sourceAirportCode, destinationAirportCode, formattedDepartureDate) {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("searchFlights", {
                "srcCode": sourceAirportCode,
                "destCode": destinationAirportCode,
                "date": formattedDepartureDate
            });
        },
        onButtonPress: function () {
            console.log("called");
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("detail")
        },
        _getCodeFromAirportString: function (airportString) {
            // Bengaluru (BLR) --> Bengaluru BLR)
            const splitedAirportStringArr = airportString.split("(");
            const airportCodeWithExtraBracket = splitedAirportStringArr[splitedAirportStringArr.length - 1];
            return airportCodeWithExtraBracket.slice(0, airportCodeWithExtraBracket.length - 1);
        },
        // Random number generator for index
        _getRandomInt: function (x) {
            return Math.floor(Math.random() * x);
        }
    });
});
