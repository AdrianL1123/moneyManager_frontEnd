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
import { useCookies } from "react-cookie";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import PetsIcon from "@mui/icons-material/Pets";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { addExpense } from "../../utils/api_expense";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { getCategories } from "../../utils/api_categories";

export default function DialogMainAdd({
  openMainDialog,
  handleCloseMainDialog,
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

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getCategories(token),
  });

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "Shopping":
        return <ShoppingBagIcon />;
      case "Food":
        return <RestaurantIcon />;
      case "Transportation":
        return <EmojiTransportationIcon />;
      case "Entertainment":
        return <SportsEsportsIcon />;
      case "Pet":
        return <PetsIcon />;
      case "Health":
        return <FavoriteIcon />;
      case "Gift":
        return <CardGiftcardIcon />;
      default:
        return null;
    }
  };

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Category");
  const [description, setDescription] = useState("");

  const addMainExpensesMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      snackbar.showSuccess("Expense added.");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setName("");
      setAmount(0);
      setCategory("Category");
      setDescription("");
      handleCloseMainDialog(false);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleAddExpenses = () => {
    if (!name || amount < 0 || !category) {
      snackbar.showWarning("Please fill in the details.");
    } else if (category === "Category") {
      snackbar.showWarning("Please choose a Category.");
    } else if (amount <= 0) {
      snackbar.showWarning("Amount cannot be zero");
    } else {
      addMainExpensesMutation.mutate({
        name,
        amount,
        description,
        category,
        token,
      });
    }
  };

  return (
    <Dialog open={openMainDialog} onClose={handleCloseMainDialog}>
      <DialogTitle>What did you Spend Today?</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Expenses"
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
          <MenuItem value="Category">Category</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {getIconComponent(c.icon)}
              {c.name}
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
          onClick={handleCloseMainDialog}
        >
          Cancel
        </Button>
        <Button variant="contained" color="warning" onClick={handleAddExpenses}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
