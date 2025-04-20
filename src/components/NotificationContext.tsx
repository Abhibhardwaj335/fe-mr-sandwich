// NotificationContext.tsx
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  AlertColor,
} from '@mui/material';

type NotifyFn = (message: string, severity?: AlertColor) => void;

const NotificationContext = createContext<NotifyFn>(() => {});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<AlertColor>('info');

  const notify = useCallback<NotifyFn>((msg, sev = 'info') => {
    setMessage(msg);
    setSeverity(sev);
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}

      <Dialog open={!!message} onClose={() => setMessage(null)}>
        <DialogTitle>
          {severity === 'error' ? 'Error' : severity === 'warning' ? 'Warning' : 'Notice'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessage(null)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);
