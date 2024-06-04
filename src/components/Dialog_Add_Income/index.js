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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { addIncome } from "../../utils/api_income";
import { getCategoriesIncome } from "../../utils/api_categoriesIncome";

export default function DialogIncomeAdd({
  openIncomeDialog,
  handleCloseIncomeDialog,
}) {
  const today = new Date();
  const currentDay = today.getDay();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
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
  const date = [
    "1st of",
    "2nd of",
    "3rd of",
    "4th of",
    "5th of",
    "6th of",
    "7th of",
    "8th of",
    "9th of",
    "10th of",
    "11th of",
    "12th of",
    "13th of",
    "14th of",
    "15th of",
    "16th of",
    "17th of",
    "18th of",
    "19th of",
    "20th of",
    "21st of",
    "22nd of",
    "23rd of",
    "24th of",
    "25th of",
    "26th of",
    "27th of",
    "28th of",
    "29th of",
    "30th of",
    "31st of",
  ];
  const currentDayName = days[currentDay];
  const currentMonthName = months[currentMonth];
  const currentDateName = date[currentDate];

  const snackbar = useCustomSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Category");
  const [description, setDescription] = useState("");

  const { data: categoriesIncomes = [] } = useQuery({
    queryKey: ["categoriesIncome", token],
    queryFn: () => getCategoriesIncome(token),
  });
  const getIconIncomeComponent = (iconNameIncome) => {
    switch (iconNameIncome) {
      case "Salary":
        return <AttachMoneyIcon />;
      case "Part-Time":
        return <TimelapseIcon />;
      case "Investments":
        return <PriceCheckIcon />;
      case "Bonus":
        return <NewReleasesIcon />;
      default:
        return null;
    }
  };

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
    } else if (amount <= 0) {
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
          {categoriesIncomes.map((ci) => (
            <MenuItem key={ci._id} value={ci._id}>
              {getIconIncomeComponent(ci.icon)}
              {ci.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          sx={{ paddingTop: "10px" }}
          variant="outlined"
          fullWidth
          disabled
          value={`${currentDateName} ${currentMonthName}, ${currentDayName}`}
        />
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
