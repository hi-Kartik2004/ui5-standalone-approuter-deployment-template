sap.ui.define(["sap/ui/base/Object","sap/ui/model/json/JSONModel","./FlightService","ui5/rest/restwithui5/utils/config","./TravelerService","./AdminService"],function(e,t,i,r,o,s){"use strict";var u={baseData:{airports:[]},constructor:function(e){this.oComp=e;var i=new t(jQuery.extend(true,{},this.baseData));this.oComp.setModel(i)},getDataModel:function(){return this.oComp.getModel()},getRouter:function(){return this.oComp.getRouter()}},n=jQuery.extend(true,u,i,o,s,r),a=e.extend("ui5.rest.restwithui5.model.DataRepository",n);return a});
//# sourceMappingURL=DataRepository.js.map