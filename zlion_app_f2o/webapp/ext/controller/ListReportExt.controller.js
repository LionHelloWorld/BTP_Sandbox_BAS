sap.ui.define(
  ["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageToast"],
  function (ControllerExtension, MessageToast) {
    "use strict";

    return ControllerExtension.extend(
      "zlionappf2o.ext.controller.ListReportExt",
      {
        // this section allows to extend lifecycle hooks or hooks provided by Fiori elements
        override: {
          /**
           * Called when a controller is instantiated and its View controls (if available) are already created.
           * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
           * @memberOf zlionappf2o.ext.controller.ListReportExt
           */
          onInit: function () {
            // you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
            var oModel = this.base.getExtensionAPI().getModel();
          },
        },

        // onUploadPress: function (oEvent) {
        //   MessageToast.show('Custom handler invoked');
        //   this.base
        //     .getExtensionAPI()
        //     .loadFragment({
        //       name: "zlionappf2o.ext.fragment.UploadFileDialog",
        //       type: "XML",
        //       controller: this,
        //     })
        //     .then(function (oDialogResult) {
        //       var oDialog = oDialogResult;
        //       oDialogResult.open();
        //     });
        // },
        onUploadPress: function (oEvent) {
          if (!this._oDialog) {
            this.base
              .getExtensionAPI()
              .loadFragment({
                name: "zlionappf2o.ext.fragment.UploadFileDialog",
                type: "XML",
                controller: this,
              })
              .then(
                function (oDialog) {
                  this._oDialog = oDialog;
                  this._oDialog.open();
                }.bind(this)
              )
              .catch(function (err) {
                console.error("Dialog load failed:", err);
                sap.m.MessageToast.show("Dialog load failed");
              });
          } else {
            this._oDialog.open();
          }
        },

        // On File Change
        onFileChange: function (oEvent) {
          // Read file
          var files = oEvent.getParameter("files");
          if (!files || files.length === 0) {
            return;
          }
          Array.from(files).forEach((file) => {
            //Instantiate JavaScript FileReader API
            var fileReader = new FileReader();
            //Read file content using JavaScript FileReader API
            fileReader.onload = (e) => {
              const base64 = e.target.result.split(",")[1];
              const payload = {
                attachment: base64,
                mime_type: file.type,
                file_name: file.name,
              };
            };
            fileReader.readAsDataURL(file);

            // new Action(readFile(file))
            //   .executeWithBusyIndicator()
            //   .then(function (result) {
            //     fileContent = result;
            //   });
          });
        },

        //perform upload
        onUploadButtonPress: function (oEvent) {
          //check file has been entered
          if (payload.attachment === undefined || payload.attachment === "") {
            MessageToast.show(oResourceBundle.getText("uploadFileErrMsg"));
            return;
          }
        },

        //Cancel
        onCancelButtonPress: function () {
          if (this._oDialog) {
            this._oDialog.close();
          }
        },
      }
    );
  }
);
