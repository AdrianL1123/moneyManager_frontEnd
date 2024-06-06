import { useCookies } from "react-cookie";
import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { Link } from "react-router-dom";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import useCustomSnackbar from "../../components/useCustomSnackbar";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addNewSubscription,
  getSubscriptions,
} from "../../utils/api_subscription";

export default function BottomNav() {
  const snackbar = useCustomSnackbar();

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscription", token],
    queryFn: () => getSubscriptions(token),
  });

  //payment
  const addNewSubscriptionMutation = useMutation({
    mutationFn: addNewSubscription,
    onSuccess: (responseData) => {
      const billplz_url = responseData.data.billplz_url;
      window.location.href = billplz_url;
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleCheckout = () => {
    addNewSubscriptionMutation.mutate({
      user_id: subscriptions.user_id,
      totalPrice: 5,
      token,
    });
  };
  //payment

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
        sx={{
          backgroundColor: "#333333",
        }}
        showLabels
      >
        <BottomNavigationAction
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
          <DialogContent>Do you still want to proceed?</DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="warning"
              onClick={() => setOpenChartsModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleCheckout}
            >
              Yes, Pay now
            </Button>
          </DialogActions>
        </Dialog>
        <BottomNavigationAction
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
          component={Link}
          to="/income"
          label="Income"
          icon={<PaidIcon />}
          sx={{
            color: "white",
          }}
        />
        {currentUser.role === "admin" && [
          <BottomNavigationAction
            key="categories-expenses"
            label="Categories For Expenses"
            icon={<CategoryIcon />}
            sx={{
              color: "white",
            }}
            onClick={() => {
              navigate("/categories");
            }}
          />,
          <BottomNavigationAction
            key="categories-income"
            label="Categories For Income"
            icon={<CategoryIcon />}
            sx={{
              color: "white",
            }}
            onClick={() => {
              navigate("/categoriesIncome");
            }}
          />,
        ]}
        <BottomNavigationAction
          label="Subscriptions"
          icon={<PaidIcon />}
          sx={{
            color: "white",
          }}
          onClick={() => {
            navigate("/subscription");
          }}
        />
      </BottomNavigation>
    </Box>
  );
}
