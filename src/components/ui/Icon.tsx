import React from 'react';
import { cn } from '@/lib/utils';

export type IconName = 'home' | 'book' | 'calendar' | 'clipboard' | 'chart' | 'sparkles' | 'user' | 'logout' | 'menu' | 'x' | 'chevron' | 'trendUp' | 'trendDown' | 'alert' | 'check' | 'users' | 'cap' | 'settings' | 'file' | 'award' | 'activity' | 'plus' | 'search' | 'filter' | 'bell' | 'arrowRight' | 'clock' | 'download' | 'mail' | 'printer' | 'edit' | 'trash' | 'star' | 'help';

const ICONS: Record<IconName, string> = {
  home: "M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13ZM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5",
  calendar: "M8 2v4M16 2v4M3.5 9h17M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  clipboard: "M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1ZM6 6h12v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6ZM9 12h6M9 16h6",
  chart: "M4 19V5M4 19h16M8 19v-6M13 19v-9M18 19v-4",
  sparkles: "M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3ZM19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z",
  user: "M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM4.5 20.5c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  menu: "M3 6h18M3 12h18M3 18h18",
  x: "M6 6l12 12M18 6 6 18",
  chevron: "m9 6 6 6-6 6",
  trendUp: "M3 17 9 11l4 4 8-8M15 7h6v6",
  trendDown: "M3 7l6 6 4-4 8 8M15 17h6v-6",
  alert: "M12 3 2 20h20L12 3ZM12 10v4M12 17h.01",
  check: "m5 13 4 4L19 7",
  users: "M8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20c.7-3 2.6-5 5-5s4.3 2 5 5M17 12a3 3 0 1 0 0-6M21 20c-.5-2.3-1.8-4-3.5-4.6",
  cap: "M2 9 12 4l10 5-10 5L2 9Zm5 3v4.5c0 1.1 2.2 2.5 5 2.5s5-1.4 5-2.5V12",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 12a8 8 0 0 1 .2-1.8L2.5 9l1.6-2.8 2 .7A8 8 0 0 1 8 5.3l.3-2.1h3.4L12 5.3a8 8 0 0 1 1.9.6l2-1L17.5 6l-1.7 1.2c.2.6.3 1.2.3 1.8s-.1 1.2-.3 1.8l1.7 1.2-1.6 2.8-2-.9a8 8 0 0 1-1.9.6l-.3 2.1H8.3L8 15.5a8 8 0 0 1-1.9-.6l-2 .9-1.6-2.8 1.7-1.2A8 8 0 0 1 4 12Z",
  file: "M13 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-6-6ZM13 2v6h6M9 13h6M9 17h6",
  award: "M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM8.2 14 6 22l6-3 6 3-2.2-8",
  activity: "M22 12h-4l-3 8-6-16-3 8H2",
  plus: "M12 5v14M5 12h14",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3",
  filter: "M4 6h16M7 12h10M10 18h4",
  bell: "M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9ZM9.5 18a2.5 2.5 0 0 0 5 0",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  clock: "M12 7v5l3.5 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  download: "M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  mail: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM3 5l9 7 9-7",
  printer: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8Z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01",
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  strokeWidth?: number | string;
}

export function Icon({ name, size = 18, className, strokeWidth = 1.8, ...props }: IconProps) {
  const path = ICONS[name];
  if (!path) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      {...props}
    >
      <path d={path} />
    </svg>
  );
}
