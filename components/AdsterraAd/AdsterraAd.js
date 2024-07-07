import { useEffect } from 'react';

const AdsterraAd = ({ adScriptSrc, adContainerId }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = adScriptSrc;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    document.getElementById(adContainerId).appendChild(script);
  }, [adScriptSrc, adContainerId]);

  return <div id={adContainerId} style={{ margin: '20px 0' }}></div>;
};

export default AdsterraAd;
