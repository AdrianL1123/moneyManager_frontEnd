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
import { useCookies } from "react-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { addNewCategoriesIncome } from "../../utils/api_categoriesIncome";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
export default function DialogCategoryIncomeAdd({
  openDialogIncome,
  handleCloseDialogIncome,
}) {
  const snackbar = useCustomSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Icons");

  const addNewCategoriesMutation = useMutation({
    mutationFn: addNewCategoriesIncome,
    onSuccess: () => {
      snackbar.showSuccess("Category added.");
      queryClient.invalidateQueries({ queryKey: ["categoriesIncome"] });
      setName("");
      setIcon("Icons");
      handleCloseDialogIncome(true);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleAddCategoryIncome = () => {
    if (name === "" || icon === "Icons") {
      snackbar.showWarning("Please fill in the details.");
    } else {
      addNewCategoriesMutation.mutate({ name, icon, token });
    }
  };

  return (
    <Dialog open={openDialogIncome} onClose={handleCloseDialogIncome}>
      <DialogTitle>Add Category (Income)</DialogTitle>
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
          onClick={handleCloseDialogIncome}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleAddCategoryIncome}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
