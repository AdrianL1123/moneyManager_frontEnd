import BottomNav from "../../components/bottomNav";
import {
  Container,
  Divider,
  Table,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DialogCategoryIncomeAdd from "../../components/Dialog_CategoryIncome_Add";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import {
  deleteCategoryIncome,
  getCategoriesIncome,
  updateCategoryIncome,
} from "../../utils/api_categoriesIncome";

export default function CategoryIncome() {
  //to open edit dialog
  const [openEditModal, setOpenEditModal] = useState(false);
  const queryClient = useQueryClient();
  const snackbar = useCustomSnackbar();

  const [openDialogIncome, setOpenDialogIncome] = useState(false);
  const handleOpenDialogIncome = () => setOpenDialogIncome(true);
  const handleCloseDialogIncome = () => setOpenDialogIncome(false);

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const [editName, setEditName] = useState("");
  const [editNameID, setEditNameID] = useState("");

  //states for edit
  const [editIcon, setEditIcon] = useState("");
  const [editIconID, setEditIconID] = useState("");

  const { data: categoriesIncome = [] } = useQuery({
    queryKey: ["categoriesIncome", token],
    queryFn: () => getCategoriesIncome(token),
  });
  // console.log(categoriesIncome);

  const getIconIncomeComponent = (iconName) => {
    switch (iconName) {
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

  const deleteCategoryIncomeMutation = useMutation({
    mutationFn: deleteCategoryIncome,
    onSuccess: () => {
      snackbar.showSuccess("Category has been successfully deleted");
      queryClient.invalidateQueries(["categoriesIncome"]);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleDeleteCategoryIncome = (_id) => {
    if (window.confirm("Are you sure you want to remove this category?")) {
      deleteCategoryIncomeMutation.mutate({ token, _id });
    }
  };

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategoryIncome,
    onSuccess: () => {
      snackbar.showSuccess("Category has been updated successfully.");
      queryClient.invalidateQueries(["categoriesIncome"]);
      setOpenEditModal(false);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleEdit = () => {
    if (editName === "" || editIcon === "") {
      snackbar.showWarning("Please fill in the details.");
    } else {
      updateCategoryMutation.mutate({
        _id: editNameID,
        name: editName,
        icon: editIcon,
        token: token,
      });
    }
  };

  return (
    <>
      <Container style={{ paddingTop: "20px", width: "100%" }}>
        <Typography
          variant="h4"
          color="white"
          align="center"
          paddingBottom="20px"
        >
          Categories For Income
        </Typography>
        <Divider sx={{ borderColor: "white" }} />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "20px",
            flexDirection: "column",
          }}
        >
          <Button
            endIcon={<PlaylistAddIcon />}
            sx={{ fontSize: "12px", color: "#FEE12B" }}
            onClick={handleOpenDialogIncome}
          >
            Add A Category
          </Button>

          <DialogCategoryIncomeAdd
            openDialogIncome={openDialogIncome}
            handleCloseDialogIncome={handleCloseDialogIncome}
          />

          <TableContainer sx={{ maxWidth: "600px", width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={"20%"} sx={{ color: "white" }}>
                    Icon
                  </TableCell>
                  <TableCell align="left" sx={{ color: "white" }}>
                    Name
                  </TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoriesIncome.length > 0 ? (
                  categoriesIncome.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell width={"20%"} sx={{ color: "white" }}>
                        {getIconIncomeComponent(c.icon)}
                      </TableCell>
                      <TableCell align="left" sx={{ color: "white" }}>
                        {c.name}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        <Button
                          sx={{ color: "#FEE12B" }}
                          onClick={() => {
                            setOpenEditModal(true);
                            setEditName(c.name);
                            setEditNameID(c._id);
                            setEditIcon(c.icon);
                            setEditIconID(c._id);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ color: "#FEE12B" }}
                          onClick={() => handleDeleteCategoryIncome(c._id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ color: "white" }}
                    >
                      No categories (Income) added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Container>
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Category For Income</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Category"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "10px" }}
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
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setOpenEditModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => handleEdit()}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      <BottomNav />
    </>
  );
}
