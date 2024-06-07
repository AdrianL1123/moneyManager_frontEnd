import BottomNav from "../../components/bottomNav";
import {
  Container,
  Divider,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import SavingsIcon from "@mui/icons-material/Savings";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { getLogin } from "../../utils/api_login";
import useCustomSnackbar from "../../components/useCustomSnackbar";

export default function Login() {
  const snackbar = useCustomSnackbar();
  const navigate = useNavigate();
  const [cookie, setCookie] = useCookies(["currentUser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //mutation here
  const loginMutation = useMutation({
    mutationFn: getLogin,
    onSuccess: (data) => {
      //* save current User data
      setCookie("currentUser", data, { maxAge: 60 * 60 * 24 * 30 });
      navigate("/profile");
      snackbar.showSuccess("Successfully logged-in !");
    },
    onError: (error) => {
      // if API call is error, do what?
      snackbar.showWarning(error.response.data.message);
    },
  });
  //handle mutation function here
  const handleLogin = (e) => {
    if (email === "" || password === "") {
      snackbar.showWarning("Please fill in the details");
    } else {
      e.preventDefault();
      loginMutation.mutate({
        email: email,
        password: password,
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
            Log in
          </Typography>
          <Grid container spacing={2}>
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
            <Grid item xs={12} sx={{ paddingBottom: "20px" }}>
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
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ backgroundColor: "#FEE12B", color: "black" }}
              onClick={handleLogin}
            >
              Log In
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ paddingTop: "10px" }}>
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
      <BottomNav />
    </>
  );
}
