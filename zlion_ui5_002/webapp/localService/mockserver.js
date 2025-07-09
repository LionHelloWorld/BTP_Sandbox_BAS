sap.ui.define(["sap/ui/core/util/MockServer"], (MockServer) => {
  "use strict";

  return {
    init() {
      // create
      const oMockServer = new MockServer({
        rootUri:
          sap.ui.require.toUrl("lion/zlionui5002") +
          "/sap/opu/odata/sap/ZAPI_LION_PRODUCTS/",
      });

      const oUriParameters = new URLSearchParams(window.location.search);

      // configure mock server with a delay
      MockServer.config({
        autoRespond: true,
        autoRespondAfter: oUriParameters.get("serverDelay") || 500,
      });

      // simulate
      const sPath = sap.ui.require.toUrl("lion/zlionui5002/localService");
      oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");

      // monitor all intercepted requests
      const aRequests = oMockServer.getRequests();

      // start
      oMockServer.start();
      console.log("Mock server started");      
    },
  };
});
