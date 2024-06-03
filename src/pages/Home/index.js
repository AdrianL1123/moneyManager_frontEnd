import { useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

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
import { getExpenses } from "../../utils/api_expense";
import { getIncomes } from "../../utils/api_income";
import { getCategories } from "../../utils/api_categories";
import DialogMainAdd from "../../components/Dialog_MainAdd";
import { getCategoriesIncome } from "../../utils/api_categoriesIncome";
import DialogIncomeAdd from "../../components/Dialog_Add_Income";

export default function Home() {
  // const queryClient = useQueryClient();
  // const snackbar = useCustomSnackbar();

  //expenses
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const handleOpenMainDialog = () => setOpenMainDialog(true);
  const handleCloseMainDialog = () => setOpenMainDialog(false);
  //expenses

  // Income
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const handleOpenIncomeDialog = () => setOpenIncomeDialog(true);
  const handleCloseIncomeDialog = () => setOpenIncomeDialog(false);
  // Income

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", token],
    queryFn: () => getExpenses(token),
  });

  const { data: incomes = [] } = useQuery({
    queryKey: ["incomes", token],
    queryFn: () => getIncomes(token),
  });

  // const { data: categoriesIncome = [] } = useQuery({
  //   queryKey: ["categoriesIncome", token],
  //   queryFn: () => getCategoriesIncome(token),
  // });

  // const { data: categories = [] } = useQuery({
  //   queryKey: ["categories", token],
  //   queryFn: () => getCategories(token),
  // });

  const today = new Date();
  const currentDay = today.getDay();
  const currentMonth = today.getMonth();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDayName = days[currentDay];
  const currentMonthName = months[currentMonth];

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
        <Box sx={{ display: "flex", padding: "20px" }}>
          <Button
            endIcon={<AddCircleIcon />}
            color="warning"
            onClick={handleOpenMainDialog}
            sx={{ justifyContent: "center", color: "#FEE12B" }}
          >
            Add Expenses
          </Button>
          <Divider
            sx={{
              borderColor: "#FEE12B",
              height: "30px",
              margin: "auto",
            }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <Button
            endIcon={<AddCircleIcon />}
            color="warning"
            onClick={handleOpenIncomeDialog}
            sx={{ justifyContent: "center", color: "#FEE12B" }}
          >
            Add Income
          </Button>
        </Box>

        <DialogMainAdd
          openMainDialog={openMainDialog}
          handleCloseMainDialog={handleCloseMainDialog}
        />

        <DialogIncomeAdd
          openIncomeDialog={openIncomeDialog}
          handleCloseIncomeDialog={handleCloseIncomeDialog}
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
          {expenses.length > 0 || incomes.length > 0 ? (
            <TableContainer sx={{ maxWidth: "100%", width: "100%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={"5%"} sx={{ color: "white" }}>
                      {currentMonthName}
                    </TableCell>
                    <TableCell align="left" sx={{ color: "white" }}>
                      {currentDayName}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "white" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense._id}>
                      <TableCell width={"20%"} sx={{ color: "white" }}>
                        {getIconComponent(expense.category.name)}
                      </TableCell>
                      <TableCell align="left" sx={{ color: "white" }}>
                        {expense.name}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        {expense.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                  {incomes.map((income) => (
                    <TableRow key={income._id}>
                      <TableCell width={"20%"} sx={{ color: "white" }}>
                        {getIconComponent(income.category.name)}
                      </TableCell>
                      <TableCell align="left" sx={{ color: "white" }}>
                        {income.name}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        {income.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography align="center" variant="h4" sx={{ color: "white" }}>
                No Expenses/Income added yet.
              </Typography>
            </Container>
          )}
        </Container>
      </Container>
      <BottomNav />
    </>
  );
}
