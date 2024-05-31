import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Dialog_add() {
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title" sx={{ color: "black" }}>
      {"Are you sure you want to delete this plan?"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description" sx={{ color: "black" }}>
        This action is not reversible.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} sx={{ color: "black" }}>
        Cancel
      </Button>
      <Button onClick={deleteHandler} sx={{ color: "black" }} autoFocus>
        Yes
      </Button>
    </DialogActions>
  </Dialog>;
}
