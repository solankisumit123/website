import React, { useEffect } from 'react';

const AdBanner: React.FC = () => {
  useEffect(() => {
    // @ts-ignore
    if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
      // @ts-ignore
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div className="flex justify-center my-4">
      <ins className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: 90, maxWidth: 728 }}
        data-ad-client="ca-pub-3011928119413564"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

export default AdBanner; 