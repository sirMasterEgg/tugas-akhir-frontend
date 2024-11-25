declare global {
  interface AdsByGoogle {
    loaded: boolean;
    push: (args?: unknown) => void;
  }

  interface Window {
    adsbygoogle: AdsByGoogle;
  }
}

interface AdSenseProps {
  slot: string;
}

const AdSense = ({ slot }: AdSenseProps) => {
  /*const [adsReady, setAdsReady] = useState<boolean>(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2024295751488460";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    script.onload = () => {
      console.log("[Adsense]", "AdSense script loaded.");
      setAdsReady(true);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };

    // Cleanup function to remove the script from the DOM
    return () => {
      console.log("[Adsense]", "Cleaning up AdSense script.");
      document.body.removeChild(script);
    };
  }, []);*/

  if (window.adsbygoogle && !window.adsbygoogle.loaded) {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  return (
    <div className="w-full h-full">
      <ins
        className="adsbygoogle"
        data-adtest="on"
        style={{ display: "block", maxHeight: "7rem" }}
        data-ad-client="ca-pub-2024295751488460"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
export default AdSense;
