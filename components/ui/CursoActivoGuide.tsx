// app/components/Tour.tsx
'use client';

import { useEffect } from 'react';
import 'driver.js/dist/driver.css';

export default function Tour() {
  useEffect(() => {
    (async () => {
      /* Carga dinámica para evitar SSR issues */
      const { driver } = await import('driver.js');

      const tour = driver({
        animate: true,
        showProgress: true,
        allowClose: false,
        overlayColor: 'rgba(0,0,0,0.55)',
        stagePadding: 8,

        nextBtnText : 'Siguiente',
        prevBtnText : 'Atrás',
        doneBtnText : 'Cerrar',

        showButtons : ['previous', 'next', 'close'],
        popoverClass: 'driverjs-theme',

        onDestroyed() {
          /* No repetir en la misma sesión */
          localStorage.setItem('dashboard-tour', 'done');
        },

        steps: [
          {
            element: '.btn-editar',
            popover: {
              title      : 'Activar curso',
              description: 'Aquí cambias el estado del curso para ponerlo en activo',
            },
          },
        ],
      });

      /* Lanza el tour solo la primera vez que entra el usuario */
      if (!localStorage.getItem('dashboard-tour')) {
        tour.drive();
      }
    })();
  }, []);

  return null;  // El componente solo dispara el tour
}
