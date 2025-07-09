sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zlionappmpb/test/integration/FirstJourney',
		'zlionappmpb/test/integration/pages/mpbList',
		'zlionappmpb/test/integration/pages/mpbObjectPage'
    ],
    function(JourneyRunner, opaJourney, mpbList, mpbObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zlionappmpb') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThempbList: mpbList,
					onThempbObjectPage: mpbObjectPage
                }
            },
            opaJourney.run
        );
    }
);