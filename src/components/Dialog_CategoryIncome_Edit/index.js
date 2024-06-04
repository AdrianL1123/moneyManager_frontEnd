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
import TimelapseIcon from "@mui/icons-material/Timelapse";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useCookies } from "react-cookie";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import {
  getCategoriesIncome,
  updateCategoryIncome,
} from "../../utils/api_categoriesIncome";

export default function DialogCategoryIncomeEdit({
  openCategoryIncomeEditDialog,
  handleCloseCategoryIncomeEditDialog,
  item,
}) {
  const snackbar = useCustomSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const { data: categoriesIncome = [] } = useQuery({
    queryKey: ["categoriesIncome", token],
    queryFn: () => getCategoriesIncome(token),
  });

  const [editName, setEditName] = useState(item?.name || "");
  const [editIcon, setEditIcon] = useState(item?.icon || "Icons");

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
    if (!editName || editIcon === "Icons") {
      snackbar.showWarning("Please fill in the details.");
    } else {
      editIncomesMutation.mutate({
        _id: item._id,
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
