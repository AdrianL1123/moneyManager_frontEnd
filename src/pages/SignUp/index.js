import { Box, Container, Divider, Typography } from "@mui/material";
import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";
import { getSignUp } from "../../utils/api_signup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import BottomNav from "../../components/bottomNav";
import useCustomSnackbar from "../../components/useCustomSnackbar";

export default function Signup() {
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(["currentUser"]);
  const snackbar = useCustomSnackbar();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //mutation for sign up
  const SignUpMutation = useMutation({
    mutationFn: getSignUp,
    onSuccess: (data) => {
      setCookie("currentUser", data, {
        maxAge: 60 * 60 * 24 * 30,
      });
      snackbar.showSuccess("Successfully logged-in !");
      // redirect to profile page
      navigate("/profile");
    },
    onError: (error) => {
      snackbar.showSuccess(error.response.data.message);
    },
  });

  //handle mutation function here
  const handleSignUp = (e) => {
    if (name === "" || email === "" || password === "") {
      snackbar.showError("Please fill in all details !");
    } else if (confirmPassword !== password) {
      snackbar.showError("Password does not match !!");
    } else {
      e.preventDefault();
      SignUpMutation.mutate({
        name,
        email,
        password,
      });
    }
  };

  return (
    <>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          flexDirection: {
            xs: "column-reverse",
            sm: "column-reverse",
            md: "row",
          },
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            color={"white"}
            paddingTop={"20px"}
            paddingBottom={"20px"}
          >
            Sign Up
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                sx={{
                  backgroundColor: "#e6e6e6",
                  border: "2px black",
                  borderRadius: "10px",
                }}
                placeholder="Name"
                type="text"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  backgroundColor: "#e6e6e6",
                  border: "2px black",
                  borderRadius: "10px",
                }}
                placeholder="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  backgroundColor: "#e6e6e6",
                  border: "2px black",
                  borderRadius: "10px",
                }}
                placeholder="password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  backgroundColor: "#e6e6e6",
                  border: "2px black",
                  borderRadius: "10px",
                }}
                placeholder="confirm password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleSignUp}
                variant="outlined"
                fullWidth
                sx={{ backgroundColor: "#FEE12B", color: "black" }}
              >
                Sign up
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={() => {
                  navigate("/profile");
                }}
                fullWidth
                sx={{ color: "#FEE12B" }}
              >
                back to profile
              </Button>
            </Grid>
          </Grid>
        </Container>
        <Divider
          sx={{
            borderColor: "white",
            height: "700px",
            margin: "auto",
            display: { lg: "block", xs: "none" },
          }}
          orientation="vertical"
          variant="middle"
          flexItem
        />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <SavingsIcon
            sx={{
              fontSize: "50px",
              color: "#FEE12B",
              width: "100%",
            }}
          />
          <Typography variant="h3" color={"white"} fontWeight={"900"}>
            Money Manager
          </Typography>
        </Container>
        <BottomNav />
      </Container>
    </>
  );
}
