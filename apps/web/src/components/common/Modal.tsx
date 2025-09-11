// Modal.tsx
import { useEffect, useRef, useState } from "preact/hooks";
import { createPortal } from "preact/compat";
import { useActionModal } from "@hooks/useActionModal";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  noHandle?: boolean;
  isFullSize?: boolean;
  style?: ModalBase.Styles;
  customHeader?: preact.VNode;
  children: preact.VNode | preact.VNode[];
  onRequestClose: () => void;
}

const ANIMATION_MILLISECOND = 300;

const getModalStyle = (
  isOpen: boolean,
  isFullSize: boolean,
  style: ModalBase.Styles | undefined
): { overlay: preact.JSX.CSSProperties; content: preact.JSX.CSSProperties } => ({
  overlay: {
    position: "fixed",
    inset: 0,
    height: "100%",
    backgroundColor: isFullSize
      ? "transparent"
      : isOpen
        ? "rgba(0, 0, 0, 0.7)"
        : "rgba(0, 0, 0, 0)",
    transition: `background-color ${ANIMATION_MILLISECOND}ms`,
    zIndex: 5000,
  },
  content: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    margin: "0 auto",
    padding: "0",
    border: "none",
    borderRadius: "0",
    background: "transparent",
    outline: "none",
    overflow: "hidden",
    zIndex: 6000,
    opacity: isOpen ? 1 : 0,
    transition: `opacity ${ANIMATION_MILLISECOND}ms`,
    ...style?.content,
  },
});

/** 메인 Modal */
function DefaultModal(props: ModalProps) {
  const {
    isOpen,
    title,
    noHandle,
    isFullSize,
    style,
    customHeader,
    children,
    onRequestClose,
  } = props;

  const [animationFinished, setAnimationFinished] = useState(true);

  const {
    isClose,
    getSheetData,
    reset,
    setSheetPosition,
    onRefChange,
    onContentRefChange,
  } = useActionModal();

  const { height, sheetHeight } = getSheetData();

  useEffect(() => {
    if (isOpen) {
      setAnimationFinished(false);
      setSheetPosition(true);
    } else {
      const timeout = setTimeout(
        () => setAnimationFinished(true),
        ANIMATION_MILLISECOND
      );
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isClose) {
      onRequestClose();
      reset();
    }
  }, [isClose]);

  if (!isOpen && animationFinished) return null;

  const animationStyle = getModalStyle(isOpen, !!isFullSize, style);

  return createPortal(
    <div style={animationStyle.overlay} onClick={onRequestClose}>
      <div
        ref={onRefChange}
        style={{
          ...animationStyle.content,
          // top: sheetHeight,
          // height,
        }}
        className="flex flex-col fixed z-[6000] w-full max-w-(--max-width) rounded-t-2xl bg-white shadow-lg transition-transform duration-150"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
      >
        <div
          ref={onContentRefChange}
          className="overflow-y-auto overscroll-contain"
          style={{
            maxHeight: style?.content?.maxHeight
              ? `calc(${style.content.maxHeight} - 64px)`
              : "80dvh",
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export type ModalElementType = {
  className?: string;
  children?: preact.VNode;
}

/** Modal Header */
function ModalHeader(props: ModalElementType) {
  const {
    className,
    children,
  } = props;

  return (
    <div className={`sticky top-0 z-[2000] w-full rounded-t-2xl bg-white px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}

/** Modal Content */
function ModalContent(props: ModalElementType) {
  const {
    className,
    children,
  } = props;

  return (
    <div className={`overflow-auto overscroll-contain ${className}`}>
      {children}
    </div>
  );
}

/** Modal Footer */
function ModalFooter(props: ModalElementType) {
  const {
    className,
    children,
  } = props;

  return (
    <div className={`sticky bottom-0 w-full bg-white ${className}`}>
      <div className="flex w-full gap-2">{children}</div>
    </div>
  );
}

export { DefaultModal as Modal, ModalHeader, ModalContent, ModalFooter };
