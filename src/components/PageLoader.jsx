import React from 'react';

export default function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        padding: '40px 20px'
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          border: '3px solid #e2e8f0',
          borderTopColor: 'var(--color-primary, #0284c7)',
          borderRadius: '50%',
          animation: 'pageLoaderSpin 0.75s linear infinite'
        }}
      />
      <style>{`
        @keyframes pageLoaderSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
