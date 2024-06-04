import { useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Divider,
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
import DialogMainAdd from "../../components/Dialog_MainAdd";
import DialogIncomeAdd from "../../components/Dialog_Add_Income";

export default function Home() {
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const handleOpenMainDialog = () => setOpenMainDialog(true);
  const handleCloseMainDialog = () => setOpenMainDialog(false);

  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const handleOpenIncomeDialog = () => setOpenIncomeDialog(true);
  const handleCloseIncomeDialog = () => setOpenIncomeDialog(false);

  const [category, setCategory] = useState("Category");

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", category, token],
    queryFn: () => getExpenses(category, token),
  });
  console.log(expenses);

  const { data: incomes = [] } = useQuery({
    queryKey: ["incomes", category, token],
    queryFn: () => getIncomes(category, token),
  });

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
          {expenses.length > 0 ? (
            <TableContainer
              sx={{ maxWidth: "100%", width: "100%", marginBottom: "20px" }}
            >
              <Typography align="center" variant="h6" sx={{ color: "white" }}>
                Expenses
              </Typography>
              <Table>
                {expenses.map((expense) => (
                  <>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "gray", width: "30%" }}>
                          {expense.created_at.split("T")[0]}
                        </TableCell>
                        <TableCell align="left" sx={{ color: "white" }}>
                          Name
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          Amount
                        </TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={expense._id}>
                        <TableCell sx={{ color: "white", width: "30%" }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {getIconComponent(expense.category.name)}
                            <Box sx={{ margin: "5px" }}>
                              {expense.category.name}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="left" sx={{ color: "white" }}>
                          {expense.name}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          {`$${expense.amount}`}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          <Button>Edit</Button>
                          <Button>Delete</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </>
                ))}
              </Table>
            </TableContainer>
          ) : (
            <Typography align="center" variant="h6" sx={{ color: "white" }}>
              No Expenses added yet.
            </Typography>
          )}

          {incomes.length > 0 ? (
            <TableContainer sx={{ maxWidth: "100%", width: "100%" }}>
              <Typography align="center" variant="h6" sx={{ color: "white" }}>
                Incomes
              </Typography>
              <Table>
                {incomes.map((income) => (
                  <>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "gray", width: "30%" }}>
                          {income.created_at.split("T")[0]}
                        </TableCell>
                        <TableCell align="left" sx={{ color: "white" }}>
                          Name
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          Amount
                        </TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={income._id}>
                        <TableCell sx={{ color: "white", width: "30%" }}>
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
                        <TableCell align="center" sx={{ color: "white" }}>
                          {`$${income.amount}`}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          <Button>Edit</Button>
                          <Button>Delete</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </>
                ))}
              </Table>
            </TableContainer>
          ) : (
            <Typography align="center" variant="h6" sx={{ color: "white" }}>
              No Income added yet.
            </Typography>
          )}
        </Container>
      </Container>
      <BottomNav />
    </>
  );
}
