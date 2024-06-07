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
  DialogActions,
  Select,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  MenuItem,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import PetsIcon from "@mui/icons-material/Pets";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useCookies } from "react-cookie";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, updateCategory } from "../../utils/api_categories";
import DialogCategoryAdd from "../../components/Dialog_Category_Add";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../../utils/api_categories";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const queryClient = useQueryClient();
  const snackbar = useCustomSnackbar();

  // Add category dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [cookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getCategories(token),
  });

  //to open edit dialog
  const [openEditModal, setOpenEditModal] = useState(false);
  //states for edit
  const [editName, setEditName] = useState("");
  const [editNameID, setEditNameID] = useState("");

  const [editIcon, setEditIcon] = useState("");
  const [editIconID, setEditIconID] = useState("");

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

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      snackbar.showSuccess("Category has been successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleDeleteCategory = (_id) => {
    const answer = window.confirm(
      "Are you sure you want to remove this category?"
    );
    if (answer) {
      deleteCategoryMutation.mutate({ token, _id });
    }
  };

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      snackbar.showSuccess("Category has been updated successfully.");
      queryClient.invalidateQueries(["categories"]);
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
      {currentUser.role !== "admin" ? (
        <Container
          sx={{
            height: "100vh",
            width: "100%",
            display: " flex",
            justifyContent: "center",
            color: "white",
            flexDirection: "column",
          }}
        >
          <Typography variant="h2" align="center" color={"error"}>
            Page not found
          </Typography>
          <Button
            color="warning"
            onClick={() => {
              navigate("/profile");
            }}
          >
            Return back to profile
          </Button>
        </Container>
      ) : (
        <>
          {" "}
          <Container style={{ paddingTop: "20px", width: "100%" }}>
            <Typography
              variant="h4"
              color={"white"}
              align="center"
              paddingBottom={"20px"}
            >
              Categories For Expenses
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
                onClick={handleOpenDialog}
              >
                Add A Category
              </Button>

              <DialogCategoryAdd
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
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
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <TableRow key={c._id}>
                          <TableCell width={"20%"} sx={{ color: "white" }}>
                            {getIconComponent(c.icon)}
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
                              onClick={() => handleDeleteCategory(c._id)}
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
                          No categories added yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Container>
          <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
            <DialogTitle>Edit Category For Expenses</DialogTitle>
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
      )}
    </>
  );
}
