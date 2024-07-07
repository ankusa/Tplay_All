import { useEffect } from 'react';

const AdsterraAd = ({ adScriptSrc, adContainerId }) => {
  useEffect(() => {
    const loadAdScript = () => {
      const script = document.createElement('script');
      script.src = adScriptSrc;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.onload = () => {
        console.log(`Ad script loaded: ${adScriptSrc}`);
        checkAdLoaded(adContainerId);
      };
      script.onerror = () => console.error(`Failed to load ad script: ${adScriptSrc}`);
      document.getElementById(adContainerId).appendChild(script);
    };

    if (document.getElementById(adContainerId)) {
      loadAdScript();
    } else {
      console.error(`Ad container not found: ${adContainerId}`);
    }
  }, [adScriptSrc, adContainerId]);

  const checkAdLoaded = (adContainerId) => {
    const adContainer = document.getElementById(adContainerId);
    if (adContainer && adContainer.innerHTML.trim() === "") {
      console.warn(`Ad container is empty: ${adContainerId}`);
    } else {
      console.log(`Ad content found in container: ${adContainerId}`);
    }
  };

  return <div id={adContainerId} style={{ margin: '20px 0', minHeight: '250px', border: '1px solid #ccc' }}></div>;
};

export default AdsterraAd;
