sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (
    Controller,
    JSONModel
) {
    "use strict";

    return Controller.extend("ui5.rest.restwithui5.controller.About", {
        onInit: function () {
            // set mock model
            // var sPath = sap.ui.require.toUrl("sap/m/sample/FeedListItem/feed.json");
            var oModel = new JSONModel({
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
            this.getView().setModel(oModel);
        },
    });
});