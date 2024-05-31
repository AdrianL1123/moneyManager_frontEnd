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
import { addNewCategories } from "../../utils/api_categories";
import useCustomSnackbar from "../../components/useCustomSnackbar";

export default function DialogCategoryAdd({ openDialog, handleCloseDialog }) {
  const snackbar = useCustomSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Icons");

  const addNewCategoriesMutation = useMutation({
    mutationFn: addNewCategories,
    onSuccess: () => {
      snackbar.showSuccess("Category added.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      setIcon("Icons");
      handleCloseDialog(true);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleAddCategory = () => {
    if (name === "" || icon === "Icons") {
      snackbar.showWarning("Please fill in the details.");
    } else {
      addNewCategoriesMutation.mutate({ name, icon, token });
    }
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Add Category (Expenses)</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Category name here..."
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          labelId="icon-select-label"
          id="icon-select"
          fullWidth
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
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
        <Button variant="contained" color="warning" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button variant="contained" color="warning" onClick={handleAddCategory}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
