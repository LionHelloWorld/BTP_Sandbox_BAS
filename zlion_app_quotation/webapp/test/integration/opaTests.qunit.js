sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zlionappquotation/test/integration/FirstJourney',
		'zlionappquotation/test/integration/pages/QuotationList',
		'zlionappquotation/test/integration/pages/QuotationObjectPage',
		'zlionappquotation/test/integration/pages/QuotationItemObjectPage'
    ],
    function(JourneyRunner, opaJourney, QuotationList, QuotationObjectPage, QuotationItemObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zlionappquotation') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheQuotationList: QuotationList,
					onTheQuotationObjectPage: QuotationObjectPage,
					onTheQuotationItemObjectPage: QuotationItemObjectPage
                }
            },
            opaJourney.run
        );
    }
);