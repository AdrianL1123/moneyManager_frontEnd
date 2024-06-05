import { useCookies } from "react-cookie";
import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { Link } from "react-router-dom";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import MoneyIcon from "@mui/icons-material/Money";
import PaidIcon from "@mui/icons-material/Paid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

export default function BottomNav() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const [openChartsModal, setOpenChartsModal] = useState(false);

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
        {/* // dialog  */}
        <BottomNavigationAction
          disableTouchRipple
          disableRipple
          onClick={() => {
            setOpenChartsModal(true);
          }}
          label="Charts"
          icon={<DataSaverOffIcon />}
          sx={{
            color: "white",
          }}
        />
        <Dialog
          open={openChartsModal}
          onClose={() => setOpenChartsModal(false)}
        >
          <DialogTitle>In order to access Charts, PAY FIRST LA BRO</DialogTitle>
          <DialogContent>Do you still want to proceed ?</DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="warning"
              onClick={() => setOpenChartsModal()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                navigate("/");
                setOpenChartsModal();
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        {/* // dialog  */}
        <BottomNavigationAction
          disableTouchRipple
          disableRipple
          onClick={() => {
            navigate("/");
          }}
          label="Expenses"
          icon={<MoneyIcon />}
          sx={{
            color: "white",
          }}
        />
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
          component={Link}
          to="/income"
          label="Income"
          icon={<PaidIcon />}
          sx={{
            color: "white",
          }}
        />

        {/* <BottomNavigationAction
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
        /> */}
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
