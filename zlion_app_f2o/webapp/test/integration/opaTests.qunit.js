sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zlionappf2o/test/integration/FirstJourney',
		'zlionappf2o/test/integration/pages/file2orderList',
		'zlionappf2o/test/integration/pages/file2orderObjectPage'
    ],
    function(JourneyRunner, opaJourney, file2orderList, file2orderObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zlionappf2o') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThefile2orderList: file2orderList,
					onThefile2orderObjectPage: file2orderObjectPage
                }
            },
            opaJourney.run
        );
    }
);