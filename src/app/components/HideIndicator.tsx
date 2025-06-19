"use client";

import Script from 'next/script';

export default function CustomHideIndicator() {
  return (
    <Script id="hide-next-dev-indicator" strategy="afterInteractive">
      {`
        (function() {
          try {
            // Create a style element
            const style = document.createElement('style');
            style.innerHTML = '.__next-build-watcher { display: none !important; }';
            
            // Append to document head
            document.head.appendChild(style);
            
            // Also try to find and remove directly
            const indicators = document.querySelectorAll('.__next-build-watcher');
            indicators.forEach(el => {
              el.style.display = 'none';
              el.remove();
            });
          } catch (e) {
            console.error('Error hiding Next.js indicator:', e);
          }
        })();
      `}
    </Script>
  );
}
