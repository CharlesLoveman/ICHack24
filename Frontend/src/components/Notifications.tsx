import { Alert, Snackbar } from "@mui/material";
import { FooterContainer } from "./layout/FooterContainer";
import { useGlobalData } from "../hooks/useGlobalData";
import { useEffect, useState } from "react";
import { NotificationData } from "../sharedTypes";

export function Notifications() {
  const { notifications } = useGlobalData();

  useEffect(() => {
    if (notifications.length === 0) return;
    setNotification(notifications[notifications.length - 1]);
    setOpen(true);
  }, [notifications]);

  const [notification, setNotification] = useState<
    NotificationData | undefined
  >(undefined);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <FooterContainer>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3000}
      >
        <Alert severity={notification?.severity ?? "info"} variant="filled">
          {notification?.message ?? "An error has occurred"}
        </Alert>
      </Snackbar>
    </FooterContainer>
  );
}
