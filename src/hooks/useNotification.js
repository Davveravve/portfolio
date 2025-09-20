import { useState, useCallback } from 'react';

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const notify = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const success = useCallback((message) => notify(message, 'success'), [notify]);
  const error = useCallback((message) => notify(message, 'error'), [notify]);
  const info = useCallback((message) => notify(message, 'info'), [notify]);
  const warning = useCallback((message) => notify(message, 'warning'), [notify]);

  return {
    notifications,
    notify,
    success,
    error,
    info,
    warning,
    setNotifications
  };
};

export default useNotification;