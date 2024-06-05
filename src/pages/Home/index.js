import { useState } from "react";
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
import { deleteExpense, getExpenses } from "../../utils/api_expense";
import DialogMainAdd from "../../components/Dialog_MainAdd";
import { getCategories } from "../../utils/api_categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const queryClient = useQueryClient();
  const snackbar = useCustomSnackbar();

  // add dialog
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const handleOpenMainDialog = () => setOpenMainDialog(true);
  const handleCloseMainDialog = () => setOpenMainDialog(false);

  const [category, setCategory] = useState("Category");

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
        style={{
          paddingTop: "20px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            <TextField
              color="warning"
              sx={{ backgroundColor: "#FEE12B", borderRadius: "4px" }}
              placeholder="Search by name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ManageSearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              color="warning"
              value={category}
              sx={{ backgroundColor: "#FEE12B", borderRadius: "4px" }}
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
            <>
              <TableContainer
                sx={{ maxWidth: "100%", width: "100%", marginBottom: "20px" }}
              >
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
                              <Button sx={{ color: "#FEE12B" }}>Edit</Button>
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
            </>
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

      <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <Button
          endIcon={<AddCircleIcon />}
          color="warning"
          onClick={handleOpenMainDialog}
          sx={{ justifyContent: "center", color: "#FEE12B" }}
        >
          Add Expenses
        </Button>
      </Box>
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
      <BottomNav />
    </>
  );
}
