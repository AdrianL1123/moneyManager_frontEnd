import { useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Container,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
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
import { getCategories } from "../../utils/api_categories";
import DialogMainAdd from "../../components/Dialog_MainAdd";

export default function Home() {
  const queryClient = useQueryClient();
  const snackbar = useCustomSnackbar();
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const handleOpenMainDialog = () => setOpenMainDialog(true);
  const handleCloseMainDialog = () => setOpenMainDialog(false);

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", token],
    queryFn: () => getExpenses(token),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getCategories(token),
  });

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

  return (
    <>
      <TopNav />
      <Container style={{ paddingTop: "20px", width: "100%" }}>
        <Button
          endIcon={<AddCircleIcon />}
          color="warning"
          fullWidth
          onClick={handleOpenMainDialog}
        >
          Add
        </Button>
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
          {expenses.length > 0 ? (
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
                No Expenses added yet.
              </Typography>
            </Container>
          )}
        </Container>
      </Container>
      <BottomNav />
    </>
  );
}
