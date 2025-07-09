sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (Controller,Table, AutoRowMode) {
  "use strict";
  return Controller.extend("zlionui5001.controller.App", {
    onInit() {
    },
  });
});

// sap.ui.define(
//   [
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "sap/m/MessageToast",
//     "sap/m/MessageBox",
//   ],
//   function (Controller, JSONModel, MessageToast, MessageBox) {
//     "use strict";

//     return Controller.extend("lion.zlionui5003.controller.App", {
//       onInit: function () {
//         const oViewModel = new JSONModel({
//           selectedItem: null,
//           page: 1,
//           pageSize: 2,
//         });
//         this.getView().setModel(oViewModel, "viewModel");

//         this._oModel = this.getView().getModel("quotations");

//         this._loadPage();
//       },

//       _loadPage: function () {
//         const oViewModel = this.getView().getModel("viewModel");
//         const iPage = oViewModel.getProperty("/page");
//         const iPageSize = oViewModel.getProperty("/pageSize");

//         this._oModel.read("/Quotation", {
//           urlParameters: {
//             $skip: (iPage - 1) * iPageSize,
//             $top: iPageSize,
//           },
//           success: (oData) => {
//             const oJSONModel = new JSONModel({ Quotations: oData.results });
//             this.getView().setModel(oJSONModel, "quotations");
//           },
//           error: () => {
//             MessageBox.error(this._getText("loadFailed"));
//           },
//         });
//       },

//       onRowSelectionChange: function (oEvent) {
//         const oTable = oEvent.getSource();
//         const oSelected = oTable.getSelectedIndex();
//         const oContext = oTable.getContextByIndex(oSelected);
//         const oViewModel = this.getView().getModel("viewModel");
//         oViewModel.setProperty(
//           "/selectedItem",
//           oContext ? oContext.getObject() : null
//         );
//       },

//       onAdd: function () {
//         MessageToast.show(this._getText("addNotImplemented"));
//       },

//       onEditSelected: function () {
//         const oItem = this.getView()
//           .getModel("viewModel")
//           .getProperty("/selectedItem");
//         if (oItem) {
//           MessageToast.show(this._getText("editItem", [oItem.ID]));
//         }
//       },

//       onDeleteSelected: function () {
//         const oItem = this.getView()
//           .getModel("viewModel")
//           .getProperty("/selectedItem");
//         if (!oItem) return;

//         MessageBox.confirm(this._getText("confirmDelete", [oItem.ID]), {
//           onClose: (sAction) => {
//             if (sAction === "OK") {
//               this._oModel.remove("/Quotations(" + oItem.ID + ")", {
//                 success: () => {
//                   MessageToast.show(this._getText("deleteSuccess"));
//                   this._loadPage();
//                 },
//                 error: () => {
//                   MessageBox.error(this._getText("deleteFailed"));
//                 },
//               });
//             }
//           },
//         });
//       },

//       onSearch: function (oEvent) {
//         const sQuery = oEvent.getParameter("query");
//         const oFilter = sQuery
//           ? new sap.ui.model.Filter(
//               "customer",
//               sap.ui.model.FilterOperator.Contains,
//               sQuery
//             )
//           : null;

//         const oTable = this.byId("quotationTable");
//         const oBinding = oTable.getBinding("rows");
//         if (oBinding && oFilter) {
//           oBinding.filter([oFilter]);
//         } else if (oBinding) {
//           oBinding.filter([]);
//         }
//       },

//       onPrevPage: function () {
//         const oViewModel = this.getView().getModel("viewModel");
//         let iPage = oViewModel.getProperty("/page");
//         if (iPage > 1) {
//           oViewModel.setProperty("/page", iPage - 1);
//           this._loadPage();
//         }
//       },

//       onNextPage: function () {
//         const oViewModel = this.getView().getModel("viewModel");
//         oViewModel.setProperty("/page", oViewModel.getProperty("/page") + 1);
//         this._loadPage();
//       },

//       _getText: function (sKey, aArgs) {
//         const oBundle = this.getView().getModel("i18n").getResourceBundle();
//         return oBundle.getText(sKey, aArgs);
//       },
//     });
//   }
// );
