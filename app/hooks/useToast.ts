import { useState, useCallback } from "react";

export function useToast(defaultDuration = 1500) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(defaultDuration);

  const triggerToast = useCallback(
    (msg: string, customDuration?: number) => {
      setMessage(msg);
      setShow(true);
      setDuration(customDuration ?? defaultDuration);
    },
    [defaultDuration],
  );

  const onClose = useCallback(() => setShow(false), []);

  return {
    show,
    message,
    duration,
    triggerToast,
    onClose,
    setShow,
    setMessage,
  };
}
