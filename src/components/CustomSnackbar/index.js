import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function CustomSnackbar({
  message,
  action,
  ButtonProps,
  SnackbarProps,
  customParameters,
}) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={3000}
      {...SnackbarProps}
    >
      <Alert
        severity={customParameters?.type}
        action={
          action != null && (
            <Button color="inherit" size="small" {...ButtonProps}>
              {action}
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

CustomSnackbar.propTypes = {
  message: PropTypes.string,
  action: PropTypes.string,
  ButtonProps: PropTypes.object,
  SnackbarProps: PropTypes.object,
  customParameters: PropTypes.shape({
    type: PropTypes.oneOf(["error", "warning", "info", "success"]),
  }),
};
