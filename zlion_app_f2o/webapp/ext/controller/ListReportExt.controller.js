sap.ui.define(
  [
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageToast",
    // "sap/ui/core/mvc/Controller",
    //"sap/ui/core/Component",
    "sap/ui/core/BusyIndicator",
    "sap/m/Dialog",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button",
  ],
  function (
    ControllerExtension,
    MessageToast,
    BusyIndicator,
    Dialog,
    List,
    StandardListItem,
    Button
  ) {
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

        onUploadPress: function (oEvent) {
          //Get OData Model
          const oModel = this.base.getExtensionAPI().getModel(); //Main Service Model
          if (!oModel) {
            MessageToast.show("Model not found");
            return;
          }

          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.multiple = true;
          fileInput.style.display = "none";
          fileInput.onchange = function (event) {
            const files = event.target.files;
            if (!files || files.length === 0) {
              MessageToast.show("No files selected.");
              return;
            }

            BusyIndicator.show(0);

            const promises = Array.from(files).map((file) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const base64 = e.target.result.split(",")[1];
                  resolve({
                    attachment: base64,
                    mime_type: file.type,
                    file_name: file.name,
                  });
                };
                reader.onerror = () =>
                  reject(new Error(`Read error: ${file.name}`));
                reader.readAsDataURL(file);
              });
            });

            Promise.all(promises)
              .then((payloadArray) => {
                try {
                  const oAction = oModel.bindContext(
                    "/file2order/com.sap.gateway.srvd.zui_lion_file2order_o4.v0001.upload(...)"
                  ); //Static action
                  oAction.setParameter("dummy", "");
                  oAction.setParameter("_child", payloadArray);

                  oAction
                    .execute()
                    .then(() => {
                      BusyIndicator.hide();
                      // Build Results Array
                      const results = payloadArray.map((file) => {
                        return {
                          fileName: file.file_name,
                          message: "Upload completed, waiting for background processing",
                          status: "Success"
                        };
                      });
                      // Call _showResultDialog
                      this._showResultDialog(results);
                      MessageToast.show(
                        `Upload completed: ${payloadArray.length} files`
                      );
                    })
                    .catch((err) => {
                      BusyIndicator.hide();
                      MessageToast.show(`Upload failed: ${err.message}`);
                    });
                } catch (oError) {
                  BusyIndicator.hide();
                  MessageToast.show(`Upload failed: ${oError.message}`);
                }
              })
              .catch((err) => {
                BusyIndicator.hide();
                MessageToast.show(`File read error: ${err.message}`);
              });
          }.bind(this);

          document.body.appendChild(fileInput);
          fileInput.click();
          document.body.removeChild(fileInput);
        },

        _showResultDialog: function (results) {
          const oList = new List();

          results.forEach((res) => {
            oList.addItem(
              new StandardListItem({
                title: res.fileName,
                description: res.message,
                info: res.status,
                type: "Inactive",
                infoState: res.status === "Success" ? "Success" : "Error",
              })
            );
          });

          const oDialog = new Dialog({
            title: "Upload Results",
            contentWidth: "400px",
            contentHeight: "300px",
            resizable: true,
            draggable: true,
            content: [oList],
            beginButton: new Button({
              text: "OK",
              press: function () {
                oDialog.close();
              },
            }),
            afterClose: function () {
              oDialog.destroy();
            },
          });

          oDialog.open();
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

        // onUploadPress: function (oEvent) {
        //   if (!this._oDialog) {
        //     this.base
        //       .getExtensionAPI()
        //       .loadFragment({
        //         name: "zlionappf2o.ext.fragment.UploadFileDialog",
        //         type: "XML",
        //         controller: this,
        //       })
        //       .then(
        //         function (oDialog) {
        //           this._oDialog = oDialog;
        //           this._oDialog.open();
        //         }.bind(this)
        //       )
        //       .catch(function (err) {
        //         console.error("Dialog load failed:", err);
        //         sap.m.MessageToast.show("Dialog load failed");
        //       });
        //   } else {
        //     this._oDialog.open();
        //   }
        // },

        // // On File Change
        // onFileChange: function (oEvent) {
        //   // Read file
        //   var files = oEvent.getParameter("files");
        //   if (!files || files.length === 0) {
        //     return;
        //   }
        //   Array.from(files).forEach((file) => {
        //     //Instantiate JavaScript FileReader API
        //     var fileReader = new FileReader();
        //     //Read file content using JavaScript FileReader API
        //     fileReader.onload = (e) => {
        //       const base64 = e.target.result.split(",")[1];
        //       const payload = {
        //         attachment: base64,
        //         mime_type: file.type,
        //         file_name: file.name,
        //       };
        //     };
        //     fileReader.readAsDataURL(file);

        //     // new Action(readFile(file))
        //     //   .executeWithBusyIndicator()
        //     //   .then(function (result) {
        //     //     fileContent = result;
        //     //   });
        //   });
        // },

        // //perform upload
        // onUploadButtonPress: function (oEvent) {
        //   //check file has been entered
        //   if (payload.attachment === undefined || payload.attachment === "") {
        //     MessageToast.show(oResourceBundle.getText("uploadFileErrMsg"));
        //     return;
        //   }
        // },

        // //Cancel
        // onCancelButtonPress: function () {
        //   if (this._oDialog) {
        //     this._oDialog.close();
        //   }
        // },
      }
    );
  }
);
