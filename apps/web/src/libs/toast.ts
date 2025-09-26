type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';

let instance: ToastManager | null = null;

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

class ToastManager {
  private container: HTMLElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.container = document.getElementById('global-toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'global-toast-container';
        this.container.className = 'toast toast-center z-[5000]';
        document.body.appendChild(this.container);
      }
    }
  }

  show({ message, type = 'info', duration = 3000 }: ToastOptions) {
    if (!this.container) return;

    const toast = document.createElement('div');

    let typeClass = '';
    switch (type) {
      case 'info':
        typeClass = 'alert-info';
        break;
      case 'success':
        typeClass = 'alert-success';
        break;
      case 'warning':
        typeClass = 'alert-warning';
        break;
      case 'error':
        typeClass = 'alert-error';
        break;
      case 'default':
      default:
        typeClass = 'alert-default';
        break;
    }

    toast.className = `alert ${typeClass} mb-2`;
    toast.innerHTML = `<span>${message}</span>`;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  }
}

export const toast = (() => {
  if (typeof window === 'undefined') {
    return {} as ToastManager;
  }

  if (!instance) {
    instance = new ToastManager();
  }

  return instance;
})();
