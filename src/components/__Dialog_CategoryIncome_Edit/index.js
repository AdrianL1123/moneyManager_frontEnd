import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useCookies } from "react-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { updateCategoryIncome } from "../../utils/api_categoriesIncome";
import { getIncome } from "../../utils/api_income";

export default function DialogCategoryIncomeEdit({
  openCategoryIncomeEditDialog,
  handleCloseCategoryIncomeEditDialog,
  id,
}) {
  const snackbar = useCustomSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("Icons");

  // Fetch income data
  const { data: income } = useQuery({
    queryKey: ["income", id],
    queryFn: () => getIncome(id),
  });

  useEffect(() => {
    if (income) {
      setEditName(income.name);
      setEditIcon(income.icon);
    }
  }, [income]);

  const editIncomesMutation = useMutation({
    mutationFn: updateCategoryIncome,
    onSuccess: () => {
      snackbar.showSuccess("Category (income) Updated.");
      queryClient.invalidateQueries({ queryKey: ["categoriesIncome"] });
      handleCloseCategoryIncomeEditDialog();
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleEditIncome = () => {
    if (editName === "" || editIcon === "Icons") {
      snackbar.showWarning("Please fill in the details.");
    } else {
      editIncomesMutation.mutate({
        _id: id,
        name: editName,
        icon: editIcon,
        token,
      });
    }
  };

  return (
    <Dialog
      open={openCategoryIncomeEditDialog}
      onClose={handleCloseCategoryIncomeEditDialog}
    >
      <DialogTitle>Edit Category (Income)</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <Select
          labelId="icon-select-label"
          id="icon-select"
          fullWidth
          value={editIcon}
          onChange={(e) => setEditIcon(e.target.value)}
          margin="normal"
        >
          <MenuItem value="Icons">
            <Typography>Icons</Typography>
          </MenuItem>
          <MenuItem value="Salary">
            <AttachMoneyIcon />
            <Typography>Salary</Typography>
          </MenuItem>
          <MenuItem value="Part-Time">
            <TimelapseIcon />
            <Typography>Part-Time</Typography>
          </MenuItem>
          <MenuItem value="Investments">
            <PriceCheckIcon />
            <Typography>Investments</Typography>
          </MenuItem>
          <MenuItem value="Bonus">
            <NewReleasesIcon />
            <Typography>Bonus</Typography>
          </MenuItem>
        </Select>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          color="warning"
          onClick={handleCloseCategoryIncomeEditDialog}
        >
          Cancel
        </Button>
        <Button variant="contained" color="warning" onClick={handleEditIncome}>
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
