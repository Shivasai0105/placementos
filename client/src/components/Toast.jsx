import { useState, useEffect, useCallback } from 'react';

let showToastFn = null;

export const showToast = (title, msg, type = 'success') => {
  if (showToastFn) showToastFn(title, msg, type);
};

export default function Toast() {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  const show = useCallback((t, m) => {
    setTitle(t);
    setMsg(m);
    setVisible(true);
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setVisible(false), 4000);
    setTimeoutId(id);
  }, [timeoutId]);

  useEffect(() => {
    showToastFn = show;
    return () => { showToastFn = null; };
  }, [show]);

  return (
    <div className={`notif-toast${visible ? ' show' : ''}`}>
      <div className="nt-icon">⚡</div>
      <div className="nt-body">
        <div className="nt-title">{title}</div>
        <div className="nt-msg">{msg}</div>
      </div>
      <div className="nt-close" onClick={() => setVisible(false)}>✕</div>
    </div>
  );
}
