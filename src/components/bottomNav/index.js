import { useCookies } from "react-cookie";
import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { Link } from "react-router-dom";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <BottomNavigation
        showLabels
        sx={{
          backgroundColor: "#333333",
        }}
      >
        <BottomNavigationAction
          disableTouchRipple
          disableRipple
          component={Link}
          to="/"
          label="Charts"
          icon={<DataSaverOffIcon />}
          sx={{
            color: "white",
          }}
        />
        <BottomNavigationAction
          disableTouchRipple
          disableRipple
          component={Link}
          to="/"
          label="Home"
          icon={<HomeIcon />}
          sx={{
            color: "white",
          }}
        />
        {/* {location.pathname === "/" ? (
          <BottomNavigationAction
            disableTouchRipple
            disableRipple
            component={Link}
            to="/new"
            icon={<AddCircleIcon sx={{ fontSize: 40 }} />}
            sx={{
              color: "#FEE12B",
            }}
          />
        ) : null} */}

        <BottomNavigationAction
          disableTouchRipple
          disableRipple
          label="Me"
          icon={<AccountCircleIcon />}
          sx={{
            color: "white",
          }}
          onClick={() => {
            navigate("/profile");
          }}
        />
        <BottomNavigationAction
          disableTouchRipple
          disableRipple
          label="Transactions"
          icon={<ReceiptIcon />}
          sx={{
            color: "white",
          }}
          onClick={() => {
            navigate("/");
          }}
        />
        <BottomNavigationAction
          disableTouchRipple
          disableRipple
          label="Categories For Expenses"
          icon={<CategoryIcon />}
          sx={{
            color: "white",
          }}
          onClick={() => {
            navigate("/categories");
          }}
        />
        <BottomNavigationAction
          disableTouchRipple
          disableRipple
          label="Categories For Income"
          icon={<CategoryIcon />}
          sx={{
            color: "white",
          }}
          onClick={() => {
            navigate("/categoriesIncome");
          }}
        />
      </BottomNavigation>
    </Box>
  );
}
