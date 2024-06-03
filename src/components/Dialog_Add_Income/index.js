import { useState } from "react";
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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { useCookies } from "react-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense } from "../../utils/api_expense";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { addIncome } from "../../utils/api_income";

export default function DialogIncomeAdd({
  openIncomeDialog,
  handleCloseIncomeDialog,
}) {
  const snackbar = useCustomSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Category");
  const [description, setDescription] = useState("");

  const addIncomeMutation = useMutation({
    mutationFn: addIncome,
    onSuccess: () => {
      snackbar.showSuccess("Income added.");
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      setName("");
      setAmount(0);
      setCategory("Category");
      setDescription("");
      handleCloseIncomeDialog(false);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleAddIncome = () => {
    if (!name || !amount || !category) {
      snackbar.showWarning("Please fill in the details.");
    } else if (category === "Category") {
      snackbar.showWarning("Please choose a Category.");
    } else if (amount === 0) {
      snackbar.showWarning("Amount cannot be zero");
    } else {
      addIncomeMutation.mutate({
        name,
        amount,
        description,
        category,
        token,
      });
    }
  };

  return (
    <Dialog open={openIncomeDialog} onClose={handleCloseIncomeDialog}>
      <DialogTitle>Your Income</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Income"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          placeholder="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ marginTop: "10px", marginBottom: "10px" }}
        />
        <TextField
          placeholder="Amount"
          type="number"
          variant="outlined"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select
          labelId="icon-select-label"
          id="icon-select"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ marginTop: "10px" }}
        >
          <MenuItem value="Category">
            <Typography>Category</Typography>
          </MenuItem>
          <MenuItem value="Salary">
            <AttachMoneyIcon />
            <Typography>Salary</Typography>
          </MenuItem>
          <MenuItem value="Part-Time">
            <TimelapseIcon />
            <Typography>Part Time</Typography>
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
          onClick={handleCloseIncomeDialog}
        >
          Cancel
        </Button>
        <Button variant="contained" color="warning" onClick={handleAddIncome}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
