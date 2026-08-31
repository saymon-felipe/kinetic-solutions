import KsiLoader, { type KsiLoaderProps } from './KsiLoader';

export type BlogLoaderProps = {
  title?: string;
  message?: string;
  kicker?: string;
  theme?: 'light' | 'dark' | 'auto';
  fullScreen?: boolean;
  minHeight?: string | number;
  className?: string;
  logoSrc?: string;
};

export default function BlogLoader({ 
  title = 'Carregando...', 
  message = 'Aguarde um momento...', 
  kicker = 'KSI LAB', 
  theme = 'light',
  fullScreen = false,
  minHeight,
  className,
  logoSrc
}: BlogLoaderProps) {
  return (
    <KsiLoader 
      title={title} 
      message={message} 
      kicker={kicker} 
      theme={theme} 
      fullScreen={fullScreen}
      minHeight={minHeight}
      className={className}
      logoSrc={logoSrc}
    />
  );
}
