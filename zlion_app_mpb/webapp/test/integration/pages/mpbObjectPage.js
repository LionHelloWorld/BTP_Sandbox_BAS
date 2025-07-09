sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'zlionappmpb',
            componentId: 'mpbObjectPage',
            contextPath: '/mpb'
        },
        CustomPageDefinitions
    );
});