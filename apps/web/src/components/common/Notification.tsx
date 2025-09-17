import clsx from 'clsx';

interface NotificationBannerProps {
  type?: 'info' | 'error' | 'warning' | 'success' | 'default';
  children: preact.VNode | preact.VNode[];
}

export default function NotificationBanner(props: NotificationBannerProps) {
  const { type = 'default', children } = props;

  const typeStyles: Record<
    NonNullable<NotificationBannerProps['type']>,
    { bg: string; text: string }
  > = {
    info: {
      bg: 'bg-[#f0f6ff]',
      text: 'text-info',
    },
    error: {
      bg: 'bg-[#fff0f0]',
      text: 'text-error',
    },
    warning: {
      bg: 'bg-[#fffbe5]',
      text: 'text-warning',
    },
    success: {
      bg: 'bg-[#f0fff4]',
      text: 'text-success',
    },
    default: {
      bg: 'bg-[#f7f7f7]',
      text: 'text-gray-700',
    },
  };

  const { bg, text } = typeStyles[type];

  return (
    <div className={clsx('flex items-center justify-center py-2.5 body5', bg, text)}>
      {children}
    </div>
  );
}
