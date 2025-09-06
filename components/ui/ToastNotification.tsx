'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

export default function ToastNotification() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={750}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="colored" // otras opciones: "light", "dark"
      toastClassName="rounded-xl shadow-lg"
      className="text-sm font-medium"
    />
  );
}
