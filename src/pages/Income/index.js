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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TopNav from "../../components/topNav";
import DialogIncomeAdd from "../../components/Dialog_Add_Income";
import { deleteIncome, getIncomes } from "../../utils/api_income";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BottomNav from "../../components/bottomNav";
import { getCategoriesIncome } from "../../utils/api_categoriesIncome";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useNavigate } from "react-router-dom";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Income() {
  const queryClient = useQueryClient();
  const snackbar = useCustomSnackbar();

  const navigate = useNavigate();

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token, _id } = currentUser;
  const [category, setCategory] = useState("Category");

  const { data: incomes = [] } = useQuery({
    queryKey: ["incomes", category, token],
    queryFn: () => getIncomes(category, token),
  });

  const { data: categoriesIncome = [] } = useQuery({
    queryKey: ["categoriesIncome"],
    queryFn: () => getCategoriesIncome(),
  });

  //to open delete dialog
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // use state here cuz when user press in i put in the argument as income_id if not is null
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);

  //delete
  const deleteIncomeMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      snackbar.showSuccess("Income has been successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["incomes"],
      });
      setOpenDeleteModal();
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleDeleteIncome = (_id) => {
    deleteIncomeMutation.mutate({ token, _id });
  };

  //add
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const handleOpenIncomeDialog = () => setOpenIncomeDialog(true);
  const handleCloseIncomeDialog = () => setOpenIncomeDialog(false);

  const getIconIncomeComponent = (iconNameIncome) => {
    switch (iconNameIncome) {
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

  return (
    <>
      <TopNav />

      <DialogIncomeAdd
        openIncomeDialog={openIncomeDialog}
        handleCloseIncomeDialog={handleCloseIncomeDialog}
      />

      <Container
        sx={{
          paddingTop: "20px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          Incomes
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
            placeholder="Search by name..."
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
            sx={{ backgroundColor: "#FEE12B", borderRadius: "4px" }}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <MenuItem value="Category">All Types</MenuItem>
            {categoriesIncome.map((ci) => (
              <MenuItem key={ci._id} value={ci._id}>
                {ci.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Divider
          sx={{ borderColor: "white", width: "350px", paddingTop: "10px" }}
        />
        {incomes.length > 0 ? (
          <TableContainer
            sx={{ maxWidth: "100%", width: "100%", paddingTop: "10px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ color: "white", width: "23%" }}>
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
                {incomes
                  .filter((income) => income.user_id === _id)
                  .map((income) => (
                    <TableRow key={income._id}>
                      <TableCell align="left" sx={{ color: "gray" }}>
                        {income.created_at.split("T")[0]}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ color: "white", width: "20%" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {getIconIncomeComponent(income.category.icon)}
                          <Box sx={{ margin: "5px" }}>
                            {income.category.name}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="left" sx={{ color: "white" }}>
                        {income.name}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        {`$${income.amount}`}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        <Button sx={{ color: "#FEE12B" }}>Edit</Button>
                        <Button
                          sx={{ color: "#FEE12B" }}
                          onClick={() => {
                            setSelectedIncomeId(income._id);
                            setOpenDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            align="center"
            variant="h6"
            sx={{ color: "white", paddingTop: "20px" }}
          >
            No Income added yet.
          </Typography>
        )}
      </Container>
      <Box
        sx={{ display: "flex", justifyContent: "center", paddingTop: "30px" }}
      >
        <Button
          endIcon={<AddCircleIcon />}
          color="warning"
          onClick={handleOpenIncomeDialog}
          sx={{ justifyContent: "center", color: "#FEE12B" }}
        >
          Add Income
        </Button>
      </Box>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Are you sure you want to delete this Income ?</DialogTitle>
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
            onClick={() => handleDeleteIncome(selectedIncomeId)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <BottomNav />
    </>
  );
}
