import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Container,
} from "@mui/material";
import { useCookies } from "react-cookie";
import useCustomSnackbar from "../../components/useCustomSnackbar";

export default function DialogLogout({
  openLogoutDialog,
  handleCloseLogoutDialog,
}) {
  const snackbar = useCustomSnackbar();

  const [cookies, setCookie, removeCookie] = useCookies(["currentUser"]);
  const { currentUser } = cookies;

  const handleLogout = () => {
    removeCookie("currentUser");
    handleCloseLogoutDialog(true);
    snackbar.showSuccess("User has successfully logged out.");
  };

  return (
    <Container>
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        PaperProps={{
          sx: {
            backgroundColor: "#232323",
            color: "white",
          },
        }}
      >
        <DialogTitle variant="h6" align="center">
          Are you sure you want to Log out?
        </DialogTitle>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            color="warning"
            variant="contained"
            onClick={handleCloseLogoutDialog}
          >
            Back
          </Button>
          <Button color="warning" variant="contained" onClick={handleLogout}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
