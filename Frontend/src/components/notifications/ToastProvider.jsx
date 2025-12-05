import { Toaster } from "react-hot-toast";

/**
 * ToastProvider with UBER styling
 * 
 * Configuration:
 * - Position: top-center
 * - Duration by type: success 3s, error 4s, custom 30s
 * - UBER colors and styling
 * - Smooth animations
 */
function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#000000',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '14px',
        },
        success: {
          duration: 3000,
          style: {
            background: '#fff',
            color: '#000000',
            border: '2px solid #05A357',
          },
          iconTheme: {
            primary: '#05A357', // UBER green
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000000',
            border: '2px solid #CD0A29',
          },
          iconTheme: {
            primary: '#CD0A29', // UBER red
            secondary: '#fff',
          },
        },
        loading: {
          style: {
            background: '#fff',
            color: '#000000',
            border: '2px solid #276EF1',
          },
          iconTheme: {
            primary: '#276EF1', // UBER blue
            secondary: '#fff',
          },
        },
        // Custom toasts (like ride requests) have longer duration
        custom: {
          duration: 30000,
        },
      }}
    />
  );
}

export default ToastProvider;
