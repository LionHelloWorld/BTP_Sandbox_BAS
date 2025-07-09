sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("lion.zlionui5002.controller.ProductList", {
      onInit() {
        const oViewModel = new JSONModel({
          currency: "EUR",
        });
        this.getView().setModel(oViewModel, "view");

        const oTable = this.byId("productList");
        const oBinding = oTable.getBinding("items");
        oTable.attachEventOnce("updateFinished", function (oEvent) {
          console.log("Loaded items:", oEvent.getParameter("total"));
        });
      },

      onFilterProducts(oEvent) {
        // build filter array
        const aFilter = [];
        const sQuery = oEvent.getParameter("query");
        if (sQuery) {
          aFilter.push(
            new Filter("product_category", FilterOperator.Contains, sQuery)
          );
        }

        // filter binding with table id
        const oList = this.byId("productList");
        const oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
      },

      onPress(oEvent) {
        const oItem = oEvent.getSource();
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detail", {
          productPath: window.encodeURIComponent(
            oItem.getBindingContext("product").getPath().substring(1)
          ),
        });
      },
    });
  }
);
