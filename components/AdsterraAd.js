import { useEffect } from 'react';

const AdsterraAd = ({ adScriptSrc, adContainerId }) => {
  useEffect(() => {
    const loadAdScript = () => {
      const script = document.createElement('script');
      script.src = adScriptSrc;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.onload = () => console.log(`Ad script loaded: ${adScriptSrc}`);
      script.onerror = () => console.error(`Failed to load ad script: ${adScriptSrc}`);
      document.getElementById(adContainerId).appendChild(script);
    };

    if (document.getElementById(adContainerId)) {
      loadAdScript();
    } else {
      console.error(`Ad container not found: ${adContainerId}`);
    }
  }, [adScriptSrc, adContainerId]);

  return <div id={adContainerId} style={{ margin: '20px 0' }}></div>;
};

export default AdsterraAd;
