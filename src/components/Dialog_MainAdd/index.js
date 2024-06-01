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
import {
  Restaurant as RestaurantIcon,
  SportsEsports as SportsEsportsIcon,
  Favorite as FavoriteIcon,
  CardGiftcard as CardGiftcardIcon,
  EmojiTransportation as EmojiTransportationIcon,
  Pets as PetsIcon,
  ShoppingBag as ShoppingBagIcon,
} from "@mui/icons-material";
import { useCookies } from "react-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense } from "../../utils/api_expense";
import useCustomSnackbar from "../../components/useCustomSnackbar";

export default function DialogMainAdd({
  openMainDialog,
  handleCloseMainDialog,
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
    if (!name || !amount || !category) {
      snackbar.showWarning("Please fill in the details.");
    } else if (category === "Category") {
      snackbar.showWarning("Please choose a Category.");
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
          <MenuItem value="Category">
            <Typography>Category</Typography>
          </MenuItem>
          <MenuItem value="Shopping">
            <ShoppingBagIcon />
            <Typography>Shopping</Typography>
          </MenuItem>
          <MenuItem value="Food">
            <RestaurantIcon />
            <Typography>Food</Typography>
          </MenuItem>
          <MenuItem value="Transportation">
            <EmojiTransportationIcon />
            <Typography>Transportation</Typography>
          </MenuItem>
          <MenuItem value="Entertainment">
            <SportsEsportsIcon />
            <Typography>Entertainment</Typography>
          </MenuItem>
          <MenuItem value="Pet">
            <PetsIcon />
            <Typography>Pet</Typography>
          </MenuItem>
          <MenuItem value="Health">
            <FavoriteIcon />
            <Typography>Health</Typography>
          </MenuItem>
          <MenuItem value="Gift">
            <CardGiftcardIcon />
            <Typography>Gift</Typography>
          </MenuItem>
        </Select>
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
