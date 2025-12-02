import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  inline?: boolean;
}

export default function LoadingSpinner({
  text,
  size = 'medium',
  inline = false
}: LoadingSpinnerProps) {
  const sizeClass = size === 'small'
    ? 'loading-spinner--small'
    : size === 'large'
      ? 'loading-spinner--large'
      : '';

  const containerClass = inline
    ? 'loading-container loading-container--inline'
    : 'loading-container';

  return (
    <div className={containerClass}>
      <div className={`loading-spinner ${sizeClass}`} />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}
