sap.ui.define(
  [
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/core/Fragment",    
    "sap/m/MessageToast",
    //"sap/ui/core/mvc/Controller",
    //"sap/ui/core/Component",
    "sap/ui/core/BusyIndicator",
    "sap/m/Dialog",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button",
  ],
  function (
    ControllerExtension,
    Fragment,
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
          // Get the main OData model from the Fiori Elements extension API
          const oModel = this.base.getExtensionAPI().getModel();
          if (!oModel) {
            // Show error if the OData model is not found
            MessageToast.show("Model not found");
            return;
          }

          // Create a hidden <input type="file"> element dynamically
          const fileInput = document.createElement("input");
          fileInput.type = "file"; // Set input type as file
          fileInput.multiple = true; // Allow multiple file selection
          fileInput.style.display = "none"; // Hide the input element

          // Define what happens when user selects files
          fileInput.onchange = function (event) {
            const files = event.target.files; // Get selected files
            if (!files || files.length === 0) {
              // If no file selected, show message
              MessageToast.show("No files selected.");
              return;
            }

            // Show busy indicator while processing files
            BusyIndicator.show(0);

            // Convert each file to base64 asynchronously
            const promises = Array.from(files).map((file) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader(); // Create FileReader to read file content
                reader.onload = (e) => {
                  // Extract base64 string (remove "data:...;base64," prefix)
                  const base64 = e.target.result.split(",")[1];
                  // Resolve with file info and base64 content
                  resolve({
                    attachment: base64,
                    mime_type: file.type,
                    file_name: file.name,
                  });
                };
                // Reject promise if reading fails
                reader.onerror = () =>
                  reject(new Error(`Read error: ${file.name}`));
                // Start reading file as DataURL
                reader.readAsDataURL(file);
              });
            });

            // After all files are read
            Promise.all(promises)
              .then((payloadArray) => {
                try {
                  // Bind to OData V4 static action for upload
                  const oAction = oModel.bindContext(
                    "/file2order/com.sap.gateway.srvd.zui_lion_file2order_o4.v0001.upload(...)"
                  ); //OData V4 Static action
                  // Set dummy parameter (if required by backend)
                  oAction.setParameter("dummy", "");
                  // Pass the array of file payloads to _child parameter
                  oAction.setParameter("_child", payloadArray);

                  // Execute OData action
                  oAction
                    .execute()
                    .then(() => {
                      // Execute OData action
                      BusyIndicator.hide();
                      // Build results array for dialog display
                      const results = payloadArray.map((file) => {
                        return {
                          fileName: file.file_name,
                          message: "Upload completed, waiting for background processing",
                          status: "Success",
                        };
                      });
                      // Call _showResultDialog to show results in dialog
                      this._showResultDialog(results);
                      // Toast message showing how many files uploaded
                      MessageToast.show(
                        `Upload completed: ${payloadArray.length} files`
                      );
                    })
                    .catch((err) => {
                      // Hide busy indicator and show error if upload fails
                      BusyIndicator.hide();
                      MessageToast.show(`Upload failed: ${err.message}`);
                    });
                } catch (oError) {
                  // Catch unexpected error during OData action
                  BusyIndicator.hide();
                  MessageToast.show(`Upload failed: ${oError.message}`);
                }
              })
              .catch((err) => {
                // Catch file read error (before upload)
                BusyIndicator.hide();
                MessageToast.show(`File read error: ${err.message}`);
              });
          }.bind(this); // Bind "this" so we can call _showResultDialog later

          // Programmatically trigger the file input dialog
          document.body.appendChild(fileInput); // Add input to DOM temporarily
          fileInput.click(); // Trigger file picker
          document.body.removeChild(fileInput); // Remove input after use
        },

        // Function to show a dialog with upload results
        _showResultDialog: function (results) {
          const oView = this.getView();
          // 1. Wrap results array into a JSON model
          // results = [ { fileName, message, status }, ... ]
          const oModel = new sap.ui.model.json.JSONModel({ files: results });

          // 2. Attach model to view under name "uploadResults"
          // The fragment will bind to this model          
          oView.setModel(oModel, "uploadResults");
          
          // 3. Load fragment (lazy load, only once)
          if (!this._pDialog) {
            this._pDialog = Fragment.load({
              id: oView.getId(), // Ensure fragment IDs are unique within this view
              name: "zlionappf2o.ext.fragment.ShowResultDialog", // Fragment path
              controller: this, // Allow fragment to call controller event handlers
            }).then(function (oDialog) {
              // Add dialog as dependent of view (for lifecycle & model inheritance)
              oView.addDependent(oDialog);
              return oDialog;
            }.bind(this));
          }

          // 4. Open the dialog (once loaded)
          this._pDialog.then(function (oDialog) {
            oDialog.open();
          });
        },
        // Event handler: when user clicks OK button
        onUploadResultDialogOk: function () {
          this._pDialog.then(function (oDialog) {
            oDialog.close(); // Simply close the dialog
          });
        },
        // Event handler: after dialog is closed
        onUploadResultDialogClose: function () {
          this._pDialog.then(
            function (oDialog) {
              oDialog.destroy(); // Destroy the dialog to free memory
              this._pDialog = null; // Reset reference so it can be recreated next time
            }.bind(this)
          );
        },
        // _showResultDialog: function (results) {
        //   const oList = new List(); // Create a list UI element
        //   results.forEach((res) => {
        //     oList.addItem(
        //       new StandardListItem({
        //         title: res.fileName,
        //         description: res.message,
        //         info: res.status,
        //         type: "Inactive",
        //         infoState: res.status === "Success" ? "Success" : "Error",
        //       })
        //     );
        //   });
        //   const oDialog = new Dialog({
        //     title: "Upload Results",
        //     contentWidth: "400px",
        //     contentHeight: "300px",
        //     resizable: true,
        //     draggable: true,
        //     content: [oList],
        //     beginButton: new Button({
        //       text: "OK",
        //       press: function () {
        //         oDialog.close();
        //       },
        //     }),
        //     afterClose: function () {
        //       oDialog.destroy();
        //     },
        //   });
        //   oDialog.open();
        // },

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
