import React, { useEffect, useState } from "react";
import { useMsal } from '@azure/msal-react';
import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';

const EmbedPowerBI = (props) => {

  const { selectAsset, unselectAllAsset, powerBIVisualName,powerBITable,powerBIColumn, powerBIVisualReportId, powerBIVisualReportEmbedURL, selectedAssetIds } = props;
  const [isBusy, setBusy] = useState(true)
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const [token, setTokenVal] = useState();

  const setPowerBIEmbededToken = async () => {
    const request = {
      scopes: ['https://analysis.windows.net/powerbi/api/Report.Read.All'],
      account: activeAccount
    };

    const authResult = await instance.acquireTokenSilent(request);
    setTokenVal(authResult.accessToken)
    setBusy(false)
  };

  useEffect(() => {
    setBusy(true)
    setPowerBIEmbededToken()
  }, []);

  const basicFilter = {
    $schema: "http://powerbi.com/product/schema#basic",
    target: {
      table: powerBITable,
      column: powerBIColumn
    },
    operator: "In",
    values: selectedAssetIds,
    filterType: models.FilterType.BasicFilter
  };

  const setSlicer = () => {
    if (window.report) {
      window.report.getPages().then(pages => {
        pages[0].getVisuals().then(visuals => {
          const slicers = visuals.find(visual => visual.type === 'slicer');
          for (let x = 0; x < visuals.length; x++) {
            if (visuals[x].type === 'slicer' && visuals[x].name == powerBIVisualName) {
              if (basicFilter.values.length > 0)
                visuals[x].setSlicerState({ 'filters': [basicFilter] });
              else
                visuals[x].setSlicerState({ 'filters': [] });
            }
          }
        });
      });
    }
  };

  return (

    <div>

      {setSlicer()}

      {isBusy ? (
        <div className="pbi-div">Loading</div>
      ) : (

 
        <div className="pbi-div">
          <PowerBIEmbed
            embedConfig={{
              type: 'report',   // Since we are reporting a BI report, set the type to report
              id: powerBIVisualReportId, // Add the report Id here
              embedUrl: powerBIVisualReportEmbedURL, // Add the embed url here
              accessToken: token,
              tokenType: models.TokenType.Aad, // Since we are using an Azure Active Directory access token, set the token type to Aad
              settings: {
                panes: {
                  filters: {
                    expanded: false,
                    visible: false
                  },
                  pageNavigation: {
                    visible: false
                  },
                  layoutType: models.LayoutType.Custom,
                  customLayout: {
                    displayOption: models.DisplayOption.FitToPage
                  },
                },
                background: models.BackgroundType.Transparent,
              }
            }}

            eventHandlers={
              new Map([
                ['loaded', function () {

                  setSlicer()

                  window.report.on('visualClicked', async function () {
                    window.report.getPages().then(pages => {
                      pages[0].getVisuals().then(async visuals => {
                        const slicers = visuals.find(visual => visual.type === 'slicer');
                        for (let x = 0; x < visuals.length; x++) {

                          if (visuals[x].type === 'slicer' && visuals[x].name == powerBIVisualName) {

                            let state = await visuals[x].getSlicerState();

                            unselectAllAsset()

                            if (state.filters.length > 0) {
                              state.filters[0].values.forEach((val, index) => {
                                selectAsset(val)
                              });
                            }

                          }
                        }
                      });
                    });
                  });
                }],
                ['rendered', function () { console.log('Report rendered'); }],
                ['error', function (event) { console.log(event.detail); }],
              ])
            }

            cssClassName={"bi-embedded"}

            getEmbeddedComponent={(embeddedReport) => {
              window.report = embeddedReport;

            }}
          />

        </div>
      )}

    </div>
  );
};

export default EmbedPowerBI;
