import {
  Container,
  Divider,
  Grid,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import BottomNav from "../../components/bottomNav";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
// import ButtonInfo from "../../components/buttonInfo";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useCookies } from "react-cookie";
import { useState } from "react";
import DialogLogout from "../../components/DialogLogout";

export default function Profile() {
  //logout
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const handleOpenLogoutDialog = () => setOpenLogoutDialog(true);
  const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);
  //logout

  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["currentUser"]);
  const { currentUser } = cookies;

  return (
    <>
      <div>
        <Container
          sx={{
            display: "flex",
            paddingTop: "10px",
            paddingBottom: "10px",
            height: "auto",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <AccountCircleIcon
            sx={{
              fontSize: 100,
              color: "#FEE12B",
              width: "100%",
            }}
          />
          <Typography
            variant="h4"
            color={"white"}
            align="center"
            paddingBottom={"15px"}
          >
            {currentUser ? (
              <>{`${currentUser.name}'s profile`}</>
            ) : (
              <>{"Profile"}</>
            )}
          </Typography>
          <Divider sx={{ borderColor: "white" }} />
        </Container>
        {currentUser ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "20px",
              width: "auto",
            }}
          >
            <Button
              sx={{
                color: "black",
                padding: "10px",
                border: "2px solid",
                borderRadius: "10px",
                minWidth: "70%",
                height: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                backgroundColor: "#333333",
              }}
              onClick={handleOpenLogoutDialog}
            >
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={1} container justifyContent="center">
                  <LogoutIcon sx={{ color: "#FEE12B" }} />
                </Grid>
                <Grid item xs={10} container alignItems="center">
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: "15px",
                    }}
                  >
                    Log out
                  </Typography>
                </Grid>
              </Grid>
            </Button>
            <DialogLogout
              openLogoutDialog={openLogoutDialog}
              handleCloseLogoutDialog={handleCloseLogoutDialog}
            />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "20px",
              }}
            >
              <Button
                sx={{
                  color: "black",
                  padding: "10px",
                  border: "2px solid",
                  borderRadius: "10px",
                  width: "700px",
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  backgroundColor: "#333333",
                  minWidth: "70%",
                }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={1} container justifyContent="center">
                    <LoginIcon sx={{ color: "#FEE12B" }} />
                  </Grid>
                  <Grid item xs={10} container alignItems="center">
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "15px",
                      }}
                    >
                      Log in
                    </Typography>
                  </Grid>
                </Grid>
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "20px",
              }}
            >
              <Button
                sx={{
                  color: "black",
                  padding: "10px",
                  border: "2px solid",
                  borderRadius: "10px",
                  width: "700px",
                  height: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  backgroundColor: "#333333",
                  minWidth: "70%",
                }}
                onClick={() => {
                  navigate("/signup");
                }}
              >
                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={1} container justifyContent="center">
                    <AssignmentIndIcon sx={{ color: "#FEE12B" }} />
                  </Grid>
                  <Grid item xs={10} container alignItems="center">
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "15px",
                      }}
                    >
                      Sign up
                    </Typography>
                  </Grid>
                </Grid>
              </Button>
            </Box>
          </>
        )}
        {/* <ButtonInfo /> */}

        <BottomNav />
      </div>
    </>
  );
}
