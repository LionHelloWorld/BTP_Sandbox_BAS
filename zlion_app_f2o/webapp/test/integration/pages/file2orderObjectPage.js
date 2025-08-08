sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'zlionappf2o',
            componentId: 'file2orderObjectPage',
            contextPath: '/file2order'
        },
        CustomPageDefinitions
    );
});