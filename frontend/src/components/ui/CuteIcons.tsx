import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// ⚡ Staff Infra Engineer Avatar SVG
export const AvatarInfraIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-amber-500 fill-amber-500/20 ${className}`}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

// ⚖️ General Counsel Legal Avatar SVG
export const AvatarLegalIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-indigo-600 fill-indigo-500/20 ${className}`}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 3v18M5 8l7-5 7 5M4 14l3-6 3 6m-6 0a3 3 0 0 0 6 0M14 14l3-6 3 6m-6 0a3 3 0 0 0 6 0" />
  </svg>
);

// 🚀 Product Lead Avatar SVG
export const AvatarProductIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-purple-600 fill-purple-500/20 ${className}`}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.5 1.26-2.5a4 4 0 0 0-4-4c-1 0-1.79.55-2.5 1.26z" />
    <path d="M12 15l-3-3M15 12l-3-3M16 6.5C18.5 4 21 3 21 3s-1 2.5-3.5 5c-1.5 1.5-3 2.5-5 2.5s-3.5-1-5-2.5C5 6.5 4 4 4 4s2.5 1 5 3.5c1.5 1.5 3 2.5 5 2.5s3.5-1 5-2.5z" />
  </svg>
);

// 🌐 External Contractor Avatar SVG
export const AvatarExternalIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-blue-500 fill-blue-500/20 ${className}`}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
  </svg>
);

// 📘 Confluence Wiki Connector SVG
export const ConnectorConfluenceIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-blue-600 fill-blue-500/20 ${className}`}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M6 6h10M6 10h10M6 14h6" />
  </svg>
);

// 📁 Google Drive Connector SVG
export const ConnectorDriveIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-emerald-600 fill-emerald-500/20 ${className}`}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L8.6 3.3A2 2 0 0 0 6.93 2.4H4a2 2 0 0 0-2 2v13.6a2 2 0 0 0 2 2Z" />
  </svg>
);

// 🎧 Zendesk KB Connector SVG
export const ConnectorZendeskIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-purple-600 fill-purple-500/20 ${className}`}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
  </svg>
);

// 💬 Slack Workspace Connector SVG
export const ConnectorSlackIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-rose-500 fill-rose-500/20 ${className}`}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);

// Helper function to render cute avatar SVG by avatar key or fallback
export const renderCuteAvatar = (avatarKey: React.ReactNode | string, sizeClass: string = 'w-5 h-5') => {
  if (typeof avatarKey !== 'string') return avatarKey;

  switch (avatarKey) {
    case '⚡':
      return <AvatarInfraIcon className={sizeClass} />;
    case '⚖️':
      return <AvatarLegalIcon className={sizeClass} />;
    case '🚀':
      return <AvatarProductIcon className={sizeClass} />;
    case '🌐':
      return <AvatarExternalIcon className={sizeClass} />;
    default:
      return <span className="font-bold font-mono text-indigo-600">EK</span>;
  }
};

// Helper function to render cute connector SVG by icon key or fallback
export const renderCuteConnectorIcon = (iconKey: string, sizeClass: string = 'w-6 h-6') => {
  switch (iconKey) {
    case '📘':
      return <ConnectorConfluenceIcon className={sizeClass} />;
    case '📁':
      return <ConnectorDriveIcon className={sizeClass} />;
    case '🎧':
      return <ConnectorZendeskIcon className={sizeClass} />;
    case '💬':
      return <ConnectorSlackIcon className={sizeClass} />;
    default:
      return <ConnectorConfluenceIcon className={sizeClass} />;
  }
};
