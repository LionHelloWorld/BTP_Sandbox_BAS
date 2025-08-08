sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'zlionappf2o',
            componentId: 'file2orderList',
            contextPath: '/file2order'
        },
        CustomPageDefinitions
    );
});