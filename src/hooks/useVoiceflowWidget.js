import { useEffect } from 'react';

export default function useVoiceflowWidget() {
  useEffect(() => {
    // Remove any existing Voiceflow script to prevent duplicates
    const existing = document.querySelector('script[data-voiceflow-widget]');
    if (existing) existing.remove();

    // Create a new script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.setAttribute('data-voiceflow-widget', 'true');
    script.innerHTML = `
      (function(d, t) {
        var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
        v.onload = function() {
          window.voiceflow.chat.load({
            verify: { projectID: '65d22081181f78db9b9e6068' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production',
            voice: {
              url: "https://runtime-api.voiceflow.com"
            }
          });
        }
        v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
      })(document, 'script');
    `;
    document.body.appendChild(script);

    // Cleanup: remove the script and widget on unmount
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
      const vfEls = document.querySelectorAll('[data-voiceflow]');
      vfEls.forEach(el => el.remove());
    };
  }, []);
  return null;
}

