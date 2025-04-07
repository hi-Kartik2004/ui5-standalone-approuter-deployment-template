sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "ui5/rest/restwithui5/model/DataRepository",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], (Controller,
    DataRepository,
    History,
    Filter,
    FilterOperator,
    MessageToast) => {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.SearchFlights", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            this.DataRepository = this.getOwnerComponent().DataRepository;
            oRouter.getRoute("searchFlights").attachPatternMatched(this.onPatternMatched, this);

        },
        onPatternMatched: function (oEvent) {
            this.time = [
                {
                    title: 'All Day',
                    startTime: '00:00',
                    endTime: '23:59'
                },
                {
                    title: 'Morning',
                    startTime: '00:00',
                    endTime: '11:59'
                },
                {
                    title: 'Afternoon',
                    startTime: '12:00',
                    endTime: '16:59'
                },
                {
                    title: 'Evening',
                    startTime: '17:00',
                    endTime: '19:59'
                }, {
                    title: 'Night',
                    startTime: '20:00',
                    endTime: '23:59'
                }
            ]
            const globalContext = this.getOwnerComponent().getModel();
            const parameters = oEvent.getParameter("arguments");
            const oModel = this.getView().getModel();
            oModel.setProperty("/srcCode", parameters.srcCode);
            oModel.setProperty("/destCode", parameters.destCode);
            oModel.setProperty("/departureDate", parameters.date.split('-').reverse().join('-'));


            const destAirport = globalContext.getProperty("/destAirport");
            const srcAirport = globalContext.getProperty("/srcAirport");
            console.log("srcAirport variable", srcAirport);


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

            globalContext.setProperty("/date", parameters.date.split('-').reverse().join('/'))
            this.getView().getModel().setProperty("/time", this.time);

            const oView = this.getView();
            const sQueryCompany = oView.getModel().setProperty("/queryCompany", null);
            const queryMinSeats = oView.getModel().setProperty("/queryMinSeats", null);

            this.getView().getModel().setProperty("/SelectedTime", this.time[0]);
            this.onFilterButtonPress(null);


            // this.getView().getModel().setProperty("/SelectedTime", this.time[0]);



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
        onFilterButtonPress: function (oEvent) {
            const oView = this.getView();
            const aFilter = [];

            const sQueryCompany = oView.getModel().getProperty("/queryCompany");
            const queryMinSeats = oView.getModel().getProperty("/queryMinSeats");
            const selectedTime = oView.getModel().getProperty("/SelectedTime");

            if (sQueryCompany)
                aFilter.push(new Filter("company", FilterOperator.Contains, sQueryCompany));

            if (queryMinSeats)
                aFilter.push(new Filter("availableSeatsCount", FilterOperator.GE, queryMinSeats));

            if (selectedTime) {
                const selectedTime = this.getView().getModel().getProperty("/SelectedTime");
                console.log("selectedTime", selectedTime);
                console.log(this.time);

                const selectedTimeObjArr = this.time.filter((ele) => {
                    return ele.title == selectedTime;
                });

                if (selectedTimeObjArr.length > 1) {
                    MessageToast.show("Unable to filter based on time");
                    return;
                }

                const selectedTimeObj = selectedTimeObjArr[0];
                console.log(selectedTimeObj);

                const date = this.getOwnerComponent().getModel().getProperty("/date");

                // Parse date in DD/MM/YYYY format
                const [day, month, year] = date.split('/');
                const newDate = new Date(year, month - 1, day);  // JavaScript months are 0-indexed

                // Get the timezone offset in minutes (timezone of the user)
                const zoneOffset = newDate.getTimezoneOffset(); // in minutes
                const hoursOffset = Math.floor(Math.abs(zoneOffset) / 60);
                const minutesOffset = Math.abs(zoneOffset) % 60;
                console.log(hoursOffset, minutesOffset);

                // Set start time to the date object (adjust time)
                const customStartTime = new Date(newDate); // Create a new date object to avoid mutating the original
                customStartTime.setMinutes((Number(selectedTimeObj.startTime.split(":")[0]) * 60) + Number(selectedTimeObj.startTime.split(":")[1]));
                console.log(customStartTime);

                // Set end time to the date object (adjust time)
                const customEndTime = new Date(newDate); // Same here, use a new date object
                customEndTime.setMinutes((Number(selectedTimeObj.endTime.split(":")[0]) * 60) + Number(selectedTimeObj.endTime.split(":")[1]));
                console.log(customEndTime);

                // Use toISOString() to convert to ISO format
                const isoStartTime = customStartTime.toISOString();
                const isoEndTime = customEndTime.toISOString();
                console.log(isoStartTime);
                console.log(isoEndTime);

                // Apply the filter
                aFilter.push(new Filter("departureDateTime", FilterOperator.BT, isoStartTime, isoEndTime));
            }



            // filter binding
            const oList = this.byId("flightsList");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        createDateTimeFilter: function () {

            if (selectedTime) {
                const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-ddTHH:mm:ssZ", UTC: false });

                const targetDate = new Date(this.getOwnerComponent().getModel().getProperty("departureDateTimeLocal"));
                const startTime = new Date(targetDate.setHours(parseInt(selectedTimeObj.startTime.split(":")[0]), parseInt(selectedTimeObj.startTime.split(":")[1])));
                const endTime = new Date(targetDate.setHours(parseInt(selectedTimeObj.endTime.split(":")[0]), parseInt(selectedTimeObj.endTime.split(":")[1])));

                return new Filter("departureDateTime", FilterOperator.BT, oDateFormat.format(startTime), oDateFormat.format(endTime));
            }

        },
        onNavBack: function () {
            const callBack = this.getOwnerComponent().onNavBack();
            callBack();
        }
    })

});