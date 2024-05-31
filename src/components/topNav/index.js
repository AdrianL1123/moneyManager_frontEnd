import { useCookies } from "react-cookie";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SavingsIcon from "@mui/icons-material/Savings";

const currentDate = new Date();
const currentMonth = currentDate.getMonth();

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function TopNav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          color: "white",
          marginBottom: "30px",
          backgroundColor: "#333333",
        }}
      >
        <Toolbar sx={{ flexDirection: "column", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "20px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Money Manager
            </Typography>
            <SavingsIcon
              sx={{
                color: "#FEE12B",
                marginLeft: "8px",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              paddingTop: "10px",
              paddingBottom: "10px",
              color: "gray",
            }}
          >
            <Typography sx={{ margin: "0 10px" }}>
              Month:
              <span
                style={{ color: "white" }}
              >{` ${monthNames[currentMonth]}`}</span>
            </Typography>
            <Typography sx={{ margin: "0 10px" }}>Income:</Typography>
            <Typography sx={{ margin: "0 10px" }}>Expenses:</Typography>
            <Typography sx={{ margin: "0 10px" }}>Balance:</Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
