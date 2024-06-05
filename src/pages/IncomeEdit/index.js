import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
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
import { getIncome, updateIncome } from "../../utils/api_income";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BottomNav from "../../components/bottomNav";
import { getCategoriesIncome } from "../../utils/api_categoriesIncome";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useNavigate } from "react-router-dom";
import useCustomSnackbar from "../../components/useCustomSnackbar";

export default function IncomeEdit() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token, _id } = currentUser;
  const snackbar = useCustomSnackbar();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // get data from product api: /products/:id
  const {
    data: income,
    // error,
    // isLoading,
  } = useQuery({
    queryKey: ["incomes", categoriesIncome, token, _id],
    queryFn: () => getIncome(_id),
  });

  console.log(income);

  const { data: categoriesIncome = [] } = useQuery({
    queryKey: ["categoriesIncome"],
    queryFn: () => getCategoriesIncome(),
  });

  // when data is fetched from API, set the states for all the fields with its current value
  useEffect(() => {
    // if product is not undefined
    if (income) {
      setName(income.name);
      setDescription(income.description);
      setAmount(income.amount);
      setCategory(income.category);
    }
  }, [income]);

  const updateIncomeMutation = useMutation({
    mutationFn: updateIncome,
    onSuccess: () => {
      navigate("/income");
      snackbar.showSuccess("Income has been updated");
    },
    onError: (error) => {
      snackbar.showError(error.message.response.data.message);
    },
  });

  const handleIncomeUpdate = () => {
    // trigger the mutation to call the API
    updateIncomeMutation.mutate({
      _id: _id,
      name: name,
      description: description,
      amount: amount,
      category: category,
      token: token,
    });
  };

  return (
    <>
      <TopNav />
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          color: "white",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">Edit Income</Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
      <BottomNav />
    </>
  );
}
