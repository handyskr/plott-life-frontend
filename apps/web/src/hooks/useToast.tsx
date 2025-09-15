// import { useCallback, useState } from 'preact/hooks';
//
// export type Toast = {
//   id: number;
//   message: string;
//   type?: 'info' | 'success' | 'warning' | 'error';
// };
//
// export function useToast() {
//   const [toasts, setToasts] = useState<Toast[]>([]);
//
//   const showToast = useCallback(
//     (message: string, type: Toast['type'] = 'info', duration = 3000) => {
//       const id = Date.now();
//       const newToast: Toast = { id, message, type };
//
//       setToasts((prev) => [...prev, newToast]);
//
//       setTimeout(() => {
//         setToasts((prev) => prev.filter((t) => t.id !== id));
//       }, duration);
//     },
//     []
//   );
//
//   const ToastContainer = useCallback(() => {
//     return (
//       <div className='toast toast-center z-50'>
//         {toasts.map((toast) => (
//           <div
//             key={toast.id}
//             className={`alert alert-${toast.type}`}
//           >
//             <span>{toast.message}</span>
//           </div>
//         ))}
//       </div>
//     );
//   }, [toasts]);
//
//   return { showToast, ToastContainer };
// }
