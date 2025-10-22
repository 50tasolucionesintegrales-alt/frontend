import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "50TA",
  description: "Soluciones Integrales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="strip-ext-attrs" strategy="beforeInteractive">
          {`
      (function () {
        try {
          var PREF = ['bis_', '__processed_'];
          var EXACT = ['bis_register'];
          var SEL = EXACT.map(a => '['+a+']').join(',') +
                    (EXACT.length ? ',' : '') +
                    PREF.map(p => '*['+p+']').join(',');
          var nodes = document.querySelectorAll(SEL);
          nodes.forEach(function (el) {
            EXACT.forEach(function (a){ if (el.hasAttribute(a)) el.removeAttribute(a); });
            Array.from(el.attributes).forEach(function (attr) {
              var n = attr.name || '';
              if (PREF.some(function (p){ return n.startsWith(p); })) el.removeAttribute(n);
            });
          });
        } catch (e) {}
      })();
    `}
        </Script>
      </head>
      <body
        className={outfit.className}
      >
        <NextTopLoader
          color="#63B23D"  // Color principal (puedes usar tu color branding)
          height={3}      // Un poco más gruesa para mejor visibilidad
          crawlSpeed={200} // Animación un poco más rápida
          easing="ease"    // Suaviza la animación
          speed={400}      // Velocidad de progreso
          showSpinner={false}
          initialPosition={0.08}
          shadow="0 0 8px #4f46e5, 0 0 4px #4f46e5" // Sombra sutil con efecto glow
          template='<div class="bar" role="bar"><div class="peg"></div></div>'
          zIndex={1600}    // Asegura que esté por encima de otros elementos
        />
        <div suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  );
}
