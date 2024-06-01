import { useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
} from "@mui/material";

import { useCookies } from "react-cookie";

export default function DialogInfo({ openInfoDialog, handleCloseInfoDialog }) {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  return (
    <Container>
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        PaperProps={{
          sx: {
            backgroundColor: "#232323",
            color: "white",
          },
        }}
      >
        <DialogTitle variant="h4" align="center">
          Info About the App
        </DialogTitle>
        <DialogContent>
          <Typography>How do I Add My Expenses ?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            color="warning"
            variant="contained"
            onClick={handleCloseInfoDialog}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
