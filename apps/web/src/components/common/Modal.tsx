import { useRef, useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';

interface ModalProps {
  isOpen: boolean;
  children: preact.VNode | preact.VNode[];
  onClose: () => void;
}

function DefaultModal(props: ModalProps) {
  const { isOpen, children, onClose } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    
    return () => {
      dialog.removeEventListener('close', handleClose);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className='modal z-[3000]'
      onClose={onClose}
      onClick={onClose}
    >
      <div
        className='modal-box  p-0 bg-white rounded-t-2xl rounded-b-none shadow-lg flex flex-col max-w-(--max-width) w-full fixed bottom-0 pb-[--sait]'
        onClick={(e) => e.stopPropagation()}
      >
        <form method='dialog' className='absolute right-2 top-2'>
          <button
            type='button'
            className='btn btn-sm btn-circle btn-ghost'
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <div
          className={'overflow-y-auto overscroll-contain max-h-[90dvh]'}
        >
          {children}
        </div>
      </div>
    </dialog>,
    document.body
  );
}

export type ModalElementType = {
  className?: string;
  children?: preact.VNode | preact.VNode[];
};

function ModalHeader(props: ModalElementType) {
  const { className, children } = props;

  return (
    <div
      className={`sticky top-0 z-[2000] w-full rounded-t-2xl bg-white px-4 py-4 ${className}`}
    >
      {children}
    </div>
  );
}

function ModalContent(props: ModalElementType) {
  const { className, children } = props;

  return (
    <div className={`overflow-auto overscroll-contain ${className}`}>
      {children}
    </div>
  );
}

function ModalFooter(props: ModalElementType) {
  const { className, children } = props;

  return (
    <div className={`sticky bottom-0 w-full bg-white ${className}`}>
      <div className='flex w-full gap-2'>{children}</div>
    </div>
  );
}

export { DefaultModal as Modal, ModalHeader, ModalContent, ModalFooter };
