import { useState, useEffect } from "react";
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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateExpense } from "../../utils/api_expense";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { getCategories } from "../../utils/api_categories";

export default function DialogCategoryEdit({
  openCategoryEditDialog,
  handleCloseCategoryEditDialog,
  item,
}) {
  const snackbar = useCustomSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getCategories(token),
  });

  const [editName, setEditName] = useState(item?.name || "");
  const [editIcon, setEditIcon] = useState(item?.icon || "Icons");

  const editExpensesMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      snackbar.showSuccess("Category (expenses) Updated.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      handleCloseCategoryEditDialog(true);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleEditMain = () => {
    if (!editName || editIcon === "Icons") {
      snackbar.showWarning("Please fill in the details.");
    } else {
      editExpensesMutation.mutate({
        _id: item._id,
        name: editName,
        icon: editIcon,
        token,
      });
    }
  };

  return (
    <Dialog
      open={openCategoryEditDialog}
      onClose={handleCloseCategoryEditDialog}
    >
      <DialogTitle>Edit Category (expenses)</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          sx={{ width: "100%", marginBottom: "10px" }}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
        <Select
          labelId="icon-select-label"
          id="icon-select"
          fullWidth
          value={editIcon}
          onChange={(e) => setEditIcon(e.target.value)}
          sx={{ marginTop: "10px" }}
        >
          <MenuItem value="Icons">
            <Typography>Icons</Typography>
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
          onClick={handleCloseCategoryEditDialog}
        >
          Cancel
        </Button>
        <Button variant="contained" color="warning" onClick={handleEditMain}>
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
