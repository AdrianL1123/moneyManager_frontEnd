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
import { updateExpense } from "../../utils/api_expense";
import useCustomSnackbar from "../../components/useCustomSnackbar";

export default function DialogMainEdit(
  openMainEditDialog,
  handleCloseMainEditDialog
) {
  const snackbar = useCustomSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const [editName, setEditName] = useState("");
  const [editNameID, setEditNameID] = useState("");
  const [editAmount, setEditAmount] = useState(0);
  const [editAmountID, setEditAmountID] = useState(0);

  const [editCategory, setEditCategory] = useState("Category");
  const [editCategoryId, setEditCategoryID] = useState("Category");

  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionID, setEditDescriptionID] = useState("");

  const editExpensesMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      snackbar.showSuccess("Expenses Updated.");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      handleCloseMainEditDialog(false);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleEditMain = () => {
    if (
      !editName ||
      !editAmount ||
      !editCategory ||
      editCategory === "Category" ||
      editAmount === 0
    ) {
      snackbar.showWarning("Please fill in the details.");
    } else if (category === "Category") {
      snackbar.showWarning("Please choose a Category.");
    } else if (amount === 0) {
      snackbar.showWarning("Amount cannot be zero");
    } else {
      editExpensesMutation.mutate({
        _id: item._id,
        name: editName,
        amount: editAmount,
        description: editDescription,
        category: editCategory,
        token,
      });
    }
  };

  return (
    <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Category"
          variant="outlined"
          sx={{ width: "100%" }}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <TextField
          placeholder="Category"
          variant="outlined"
          sx={{ width: "100%" }}
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
        />
        <TextField
          placeholder="Category"
          variant="outlined"
          sx={{ width: "100%" }}
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
        <Select
          labelId="icon-select-label"
          id="icon-select"
          fullWidth
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
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
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setOpenMainEditModal(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            // // open the edit modal
            // setOpenEditModal(true);

            // setEditName(item.name);
            // setEditNameID(item._id);

            // setEditAmount(item.amount);
            // setEditAmountID(item._id);

            // setEditDescription(item.description);
            // setEditDescriptionID(item._id);

            // setEditCategory(item.category);
            // setEditCategoryID(item._id);

            onClick = { handleEditMain };
          }}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
