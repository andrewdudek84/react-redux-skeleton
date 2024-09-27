import { factories, models, service } from 'powerbi-client';
import React, { useEffect, useRef, useState } from 'react';

const powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);

export function UUID() {
  const nbr = Math.random();
  let randStr = '';
  do {
    randStr += nbr.toString(16).substr(2);
  } while (randStr.length < 30);

  // tslint:disable-next-line: no-bitwise
  return [
    randStr.substr(0, 8), 
    '-', 
    randStr.substr(8, 4), 
    '-4', 
    randStr.substr(12, 3), 
    '-', 
    (((nbr * 4) | 0) + 8).toString(16),
    randStr.substr(15, 3), 
    '-', 
    randStr.substr(18, 12),
  ].join('');
}

export const getIdentity = (dataPoints, column) => {
  let val;
  if (dataPoints) {
    for (const data of dataPoints) {
      for (const identity of data.identity) {
        if (identity.target.column === column)
          val = identity.equals;
      }
    }
  }
  return val;
}

export const getValue = (dataPoints, column) => {
  let val;
  if (dataPoints) {
    for (const data of dataPoints) {
      for (const v of data.values) {
        if (v.target.column === column)
          val = v.formattedValue;
      }
    }
  }
  return val;
}

export function substituteParams(url, params) {
  if (params && url) {
    url = url.replaceAll('&', '&');   // Be defensive about encoding
    for (const p in params) {
      let pattern = '${' + p + '}';
      let newUrl = url.replace(pattern, params[p]).replaceAll(pattern, params[p]);
      if (newUrl !== url && !params[p]) {
        newUrl = '';
      }
      url = newUrl;
    }
  }
  return url || '';
}

export const EmbedPowerBI = ({ className, onDataSelected, onButtonClicked, onLoaded, embedUrl, hideSensitivity, hideRefresh, transparentBackground }) => {
  const onDataSelectedRef = useRef();
  const onButtonClickedRef = useRef();
  const frameId = useRef(UUID());
  const prevUrlRef = useRef('');
  const dontUseREST = embedUrl && embedUrl.toLowerCase().indexOf('powerbi.com') < 0;  // Don't use REST API for non-PBI urls
  const [alternateEmbedMethod, setAlternateEmbedMethod] = useState(dontUseREST);
  const reportRef = useRef(null);

  onDataSelectedRef.current = onDataSelected;
  onButtonClickedRef.current = onButtonClicked;

  if (dontUseREST && !alternateEmbedMethod) {
    setAlternateEmbedMethod(true);
  }

  const [reportConfig, setReportConfig] = useState({
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Aad,
    accessToken: undefined,
    settings: {
      navContentPaneEnabled: false,
      background: transparentBackground ? models.BackgroundType.Transparent : undefined,
      panes: {
        filters: {
          expanded: false,
          visible: false,
        },
      },
    },
  });

  const onDataSelect = (e) => {
    if (onDataSelectedRef.current) {
      onDataSelectedRef.current({ detail: e.detail });
    }
  };

  const onButtonClick = (e) => {
    if (onButtonClickedRef.current) {
      onButtonClickedRef.current({ detail: e.detail });
    }
  };

  useEffect(() => {
    if (!alternateEmbedMethod) {
      if (prevUrlRef.current !== embedUrl) {
        prevUrlRef.current = embedUrl;
        const url = embedUrl.replace('&autoAuth=true', '');
        if (url) {

            const config = {
              ...reportConfig,
              embedUrl: url,
              accessToken: undefined,
            };

            setReportConfig(config);

        } else {
          const config = {
            ...reportConfig,
            embedUrl: '',
          };

          setReportConfig(config);
        }
      }
    }
  }, [embedUrl, alternateEmbedMethod, prevUrlRef, reportConfig]);

  useEffect(() => {
    if (!alternateEmbedMethod) {
      try {
        let report = null;
        const iframe = document.getElementById(frameId.current);
        if (reportConfig.embedUrl && reportConfig.embedUrl.toLowerCase().indexOf('powerbi.com') > 0 && iframe) {
          report = powerbi.embed(iframe, reportConfig);
          reportRef.current = report;
          if (!report.iframeLoaded) {
            report.off('dataSelected');
            report.on('dataSelected', (e) => onDataSelect(e));
            report.off('buttonClicked');
            report.on('buttonClicked', (e) => onButtonClick(e));
            if (onLoaded) {
              report.off('loaded');
              report.on('loaded', onLoaded);
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }

    return () => {
      // Cleanup if necessary
    };
  }, [reportConfig, alternateEmbedMethod]);

  return (
    <div className={className}>
      <iframe
        id={frameId.current}
        title="Power BI Report"
        style={{ border: 'none', width: '100%', height: '100%' }}
      />
      
    </div>
  );
};