import React from 'react';

export type KsiLoaderProps = {
  kicker?: string;
  title?: string;
  message?: string;
  theme?: 'light' | 'dark' | 'auto';
  fullScreen?: boolean;
  minHeight?: string | number;
  className?: string;
  logoSrc?: string;
};

export default function KsiLoader({
  kicker = 'KSI',
  title = 'Carregando...',
  message = 'Aguarde um momento enquanto sincronizamos tudo.',
  theme = 'auto',
  fullScreen = false,
  minHeight,
  className = '',
  logoSrc
}: KsiLoaderProps) {
  const resolvedLogo = logoSrc || (theme === 'dark' ? '/img/ksi.png' : '/img/ksi_lab.png');

  return (
    <div 
      className={`ksi-loader-container ${fullScreen ? 'ksi-loader-fullscreen' : ''} theme-${theme} ${className}`}
      style={minHeight ? { minHeight } : undefined}
      role="status" 
      aria-live="polite"
    >
      <div className="ksi-loader-shell">
        <div className="ksi-loader-mark" aria-hidden="true">
          <span className="ksi-loader-ring" />
          <span className="ksi-loader-orbit" />
          <div className="ksi-loader-disc">
            <img src={resolvedLogo} alt="" className="ksi-loader-logo" />
          </div>
        </div>

        <div className="ksi-loader-copy">
          {kicker && <p className="ksi-loader-kicker">{kicker}</p>}
          {title && <h2>{title}</h2>}
          {message && <p>{message}</p>}
        </div>

        <div className="ksi-loader-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
