// sap.ui.define([
//     "sap/m/MessageToast"
// ], function(MessageToast) {
//     'use strict';

//     return {
//         UploadCollection: function(oEvent) {
//             MessageToast.show("Custom handler invoked.");
//         }
//     };
// });

sap.ui.define(
  [
    //"sap/ui/core/mvc/Controller",
    //"sap/ui/core/Component",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
    "sap/m/Dialog",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button",
  ],
  function (
    MessageToast,
    BusyIndicator,
    Dialog,
    List,
    StandardListItem,
    Button
  ) {
    "use strict";

    return {
      // onUploadPress: function (oEvent) {
      //   const oModel = this.getModel();
      //   if (!oModel) {
      //     MessageToast.show("Model not found");
      //     return;
      //   }

      //   const fileInput = document.createElement("input");
      //   fileInput.type = "file";
      //   fileInput.multiple = true;
      //   fileInput.style.display = "none";
      //   fileInput.onchange = function (event) {
      //     const files = event.target.files;
      //     if (!files || files.length === 0) {
      //       MessageToast.show("No files selected.");
      //       return;
      //     }

      //     BusyIndicator.show(0);
      //     let uploadCount = 0;
      //     const totalFiles = files.length;
      //     const handleUploadCompletion = () => {
      //       uploadCount++;
      //       if (uploadCount === totalFiles) {
      //         BusyIndicator.hide();
      //         MessageToast.show(
      //           `Upload completed: ${uploadCount}/${totalFiles} files`
      //         );
      //       }
      //     };

      //     Array.from(files).forEach((file) => {
      //       const reader = new FileReader();

      //       reader.onload = (e) => {
      //         const base64 = e.target.result.split(",")[1];
      //         const payload = {
      //           attachment: base64,
      //           mime_type: file.type,
      //           file_name: file.name,
      //         };

      //         try {
      //           const sPath = oModel.sServiceUrl;
      //           const oAction = oModel.bindContext(
      //             "/file2order/com.sap.gateway.srvd.zui_lion_file2order_o4.v0001.upload(...)"
      //           ); //Static action
      //           for (const key in payload) {
      //             if (Object.prototype.hasOwnProperty.call(payload, key)) {
      //               oAction.setParameter(key, payload[key]);
      //             }
      //           }
      //           oAction
      //             .execute()
      //             .then(() => {
      //               MessageToast.show(`Uploaded: ${file.name}`);
      //               handleUploadCompletion();
      //             })
      //             .catch((err) => {
      //               MessageToast.show(`Failed: ${file.name} - ${err.message}` );
      //               handleUploadCompletion();
      //             });
      //         } catch (oError) {
      //           MessageToast.show(`Failed: ${file.name} - ${oError.message}`);
      //           handleUploadCompletion();
      //         }
      //       };

      //       reader.onerror = () => {
      //         MessageToast.show(`Read error: ${file.name}`);
      //         handleUploadCompletion();
      //       };

      //       reader.readAsDataURL(file);
      //     });
      //   }.bind(this);

      //   document.body.appendChild(fileInput);
      //   fileInput.click();
      //   document.body.removeChild(fileInput);
      // },

      onUploadPress: function (oEvent) {
        //Get OData Model
        const oModel = this.getModel(); //Main Service Model
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
                oAction.setParameter("dummy", '');
                oAction.setParameter("_child", payloadArray);

                oAction
                  .execute()
                  .then(() => {
                    BusyIndicator.hide();
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
    };
  }
);
