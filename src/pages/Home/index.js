import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import PetsIcon from "@mui/icons-material/Pets";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TopNav from "../../components/topNav";
import BottomNav from "../../components/bottomNav";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import {
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../../utils/api_expense";
import DialogMainAdd from "../../components/Dialog_MainAdd";
import { getCategories } from "../../utils/api_categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const NotFoundPage = ({ currentUser }) => {
    useEffect(() => {
      if (!currentUser) {
        navigate("/profile");
      }
    }, [currentUser]);
  };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const snackbar = useCustomSnackbar();

  // add dialog
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const handleOpenMainDialog = () => setOpenMainDialog(true);
  const handleCloseMainDialog = () => setOpenMainDialog(false);

  const [category, setCategory] = useState("Category");
  const [amount, setAmount] = useState("Normal");

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token, _id } = currentUser;

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", category, token],
    queryFn: () => getExpenses(category, token),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  //to open delete dialog
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // use state here cuz when user press in i put in the argument as expense_id if not is null
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  //to open edit dialog
  const [openEditModal, setOpenEditModal] = useState(false);
  //states for edit
  const [editName, setEditName] = useState("");
  const [editNameID, setEditNameID] = useState("");

  const [editAmount, setEditAmount] = useState(0);
  const [editAmountID, setEditAmountID] = useState(0);

  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionID, setEditDescriptionID] = useState("");

  const [editCategory, setEditCategory] = useState("");
  const [editCategoryID, setEditCategoryID] = useState("");

  //delete
  const deleteExpensesMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      snackbar.showSuccess("Expenses has been successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
      setOpenDeleteModal();
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleDeleteExpenses = (_id) => {
    deleteExpensesMutation.mutate({ token, _id });
  };

  //edit
  const updateCategoryMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      snackbar.showSuccess("Expense has been updated successfully.");
      queryClient.invalidateQueries(["expenses"]);
      setOpenEditModal(false);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleEdit = () => {
    if (
      editName === "" ||
      editAmount <= 0 ||
      editDescription === "" ||
      editCategory === "All Types"
    ) {
      snackbar.showWarning("Please fill in the details.");
    } else {
      updateCategoryMutation.mutate({
        id: editNameID,
        name: editName,
        amount: editAmount,
        category: editCategory,
        description: editDescription,
        token: token,
      });
    }
  };

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

  return (
    <>
      <TopNav />
      <Container
        maxWidth="xl"
        style={{
          height: "auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <DialogMainAdd
          openMainDialog={openMainDialog}
          handleCloseMainDialog={handleCloseMainDialog}
        />

        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "20px",
            flexDirection: "column",
          }}
        >
          <Typography
            align="center"
            variant="h4"
            sx={{
              color: "#FEE12B",
              paddingBottom: "10px",
              fontWeight: 900,
            }}
          >
            Expenses
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              endIcon={<AddCircleIcon />}
              color="warning"
              onClick={handleOpenMainDialog}
              sx={{ justifyContent: "center", color: "#FEE12B" }}
            >
              Add Expenses
            </Button>
            <Select
              color="warning"
              variant="standard"
              value={category}
              sx={{
                color: "#FEE12B",
                padding: "15px",
              }}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <MenuItem value="Category">All Types</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Divider
            sx={{
              borderColor: "white",
              width: "350px",
              paddingTop: "10px",
            }}
          />
          {expenses.length > 0 ? (
            <div
              style={{
                height: "auto",
                width: "100%",
                overflow: "auto",
              }}
            >
              <TableContainer>
                <Table>
                  <>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="left"
                          sx={{ color: "white", width: "23%" }}
                        >
                          Date
                        </TableCell>
                        <TableCell align="left" sx={{ color: "white" }}>
                          Type
                        </TableCell>
                        <TableCell align="left" sx={{ color: "white" }}>
                          Name
                        </TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          Amount
                        </TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expenses
                        .filter((expense) => expense.user_id === _id)
                        .map((expense) => (
                          <TableRow key={expense._id}>
                            <TableCell align="left" sx={{ color: "gray" }}>
                              {expense.created_at.split("T")[0]}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ color: "white", width: "20%" }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {getIconComponent(expense.category.name)}
                                <Box sx={{ margin: "5px" }}>
                                  {expense.category.name}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="left" sx={{ color: "white" }}>
                              {expense.name}
                            </TableCell>
                            <TableCell align="right" sx={{ color: "white" }}>
                              {`$${expense.amount}`}
                            </TableCell>
                            <TableCell align="right" sx={{ color: "white" }}>
                              <Button
                                sx={{ color: "#FEE12B" }}
                                onClick={() => {
                                  setOpenEditModal(true);

                                  setEditName(expense.name);
                                  setEditNameID(expense._id);

                                  setEditAmount(expense.amount);
                                  setEditAmountID(expense._id);

                                  setEditDescription(expense.description);
                                  setEditDescriptionID(expense._id);

                                  setEditCategory(expense.category._id);
                                  setEditCategoryID(expense._id);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                sx={{ color: "#FEE12B" }}
                                onClick={() => {
                                  setSelectedExpenseId(expense._id);
                                  setOpenDeleteModal(true);
                                }}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <Typography
              align="center"
              variant="h6"
              sx={{ color: "white", paddingTop: "20px" }}
            >
              No Expenses added yet.
            </Typography>
          )}
        </Container>
      </Container>

      {/* delete */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>
          Are you sure you want to delete this expenses ?
        </DialogTitle>
        <DialogContent>
          <Typography>This action is not reversible.</Typography>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setOpenDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteExpenses(selectedExpenseId)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* delete */}

      {/* //edit dialog */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit For Expenses</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Category"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "10px" }}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            type="number"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "10px" }}
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
          />
          <TextField
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "10px" }}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <Select
            fullWidth
            value={editCategory}
            onChange={(e) => {
              setEditCategory(e.target.value);
            }}
          >
            {categories.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {getIconComponent(c.icon)}
                {c.name}
              </MenuItem>
            ))}
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
      {/* //edit dialog */}

      <BottomNav />
    </>
  );
}
