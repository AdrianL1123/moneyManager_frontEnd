import { useCookies } from "react-cookie";
import TopNav from "../../components/topNav";
import BottomNav from "../../components/bottomNav";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import PetsIcon from "@mui/icons-material/Pets";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import {
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { getExpenses } from "../../utils/api_expense";
import { getCategories } from "../../utils/api_categories";
import { useState } from "react";
export default function Home() {
  const queryClient = useQueryClient();
  const snackbar = useCustomSnackbar();

  //dialogExpenses
  const [openMainDialog, setOpenMainDialog] = useState(false);
  const handleOpenMainDialog = () => {
    setOpenMainDialog(true);
  };

  const handleCloseMainDialog = () => {
    setOpenMainDialog(false);
  };
  //dialogExpenses

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", token],
    queryFn: () => getExpenses(token),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getCategories(token),
  });

  let todayDay = new Date();
  let showDay = todayDay.getDay();
  let answerDay = "";

  if (showDay === 0) {
    answerDay = "Sunday";
  } else if (showDay === 1) {
    answerDay = "Monday";
  } else if (showDay === 2) {
    answerDay = "Tuesday";
  } else if (showDay === 3) {
    answerDay = "Wednesday";
  } else if (showDay === 4) {
    answerDay = "Thursday";
  } else if (showDay === 5) {
    answerDay("Friday");
  } else if (showDay === 6) {
    answerDay = "Saturday";
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
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
            expenses.map((e) => (
              <TableContainer sx={{ maxWidth: "100%", width: "100%" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width={"5%"} sx={{ color: "white" }}>
                        {` ${monthNames[currentMonth]} `}
                      </TableCell>
                      <TableCell align="left" sx={{ color: "white" }}>
                        {`${answerDay}`}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        {/* {${expenses.income}} */}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={e.id}>
                      <TableCell width={"20%"} sx={{ color: "white" }}>
                        {getIconComponent(e.icon)}
                      </TableCell>
                      <TableCell align="left" sx={{ color: "white" }}>
                        {e.name}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "white" }}
                      ></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ))
          ) : (
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                align="center"
                variant="h4"
                sx={{
                  color: "white",
                }}
              >
                No Expenses added yet.
              </Typography>
              <Button
                endIcon={<AddCircleIcon />}
                color="warning"
                fullWidth
                onClick={() => {
                  setOpenMainDialog(true);
                }}
              >
                Add one now
              </Button>
            </Container>
          )}
        </Container>
      </Container>
      <BottomNav />
    </>
  );
}
