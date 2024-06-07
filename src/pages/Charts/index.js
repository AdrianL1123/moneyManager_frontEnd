import { Container, Divider, Grid, Typography, Button } from "@mui/material";
import BottomNav from "../../components/bottomNav";
import TopNav from "../../components/topNav";
import SavingsIcon from "@mui/icons-material/Savings";
import { useCookies } from "react-cookie";
import { getExpenses } from "../../utils/api_expense";
import { getIncomes } from "../../utils/api_income";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getSubscriptions } from "../../utils/api_subscription";
import { useNavigate } from "react-router-dom";

export default function Charts() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token, _id } = currentUser;

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscription", token],
    queryFn: () => getSubscriptions(token),
  });
  console.log(subscriptions);

  const [category, setCategory] = useState("Category");

  //expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", category, token],
    queryFn: () => getExpenses(category, token),
  });

  const currentUserExpenses = expenses.filter(
    (expense) => expense.user_id === _id
  );

  const totalExpenses = currentUserExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  //income
  const { data: incomes = [] } = useQuery({
    queryKey: ["incomes", category, token],
    queryFn: () => getIncomes(category, token),
  });

  const currentUserIncome = incomes.filter((income) => income.user_id === _id);

  const totalIncome = currentUserIncome.reduce(
    (sum, income) => sum + income.amount,
    0
  );

  const totalSaved = totalIncome - totalExpenses;

  return (
    <>
      {!subscriptions.find(
        (subscription) =>
          subscription.user_id === _id && subscription.status === "paid"
      ) ? (
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
            Hello Pay First ?
          </Typography>
          <Button
            color="warning"
            onClick={() => {
              navigate("/");
            }}
          >
            Return back to home
          </Button>
        </Container>
      ) : (
        <></>
      )}
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
          flexDirection: {
            xs: "column-reverse",
            sm: "column-reverse",
            md: "row",
          },
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            color={"white"}
            paddingBottom={"20px"}
          >
            {`${currentUser.name}`}'s Summary
          </Typography>
          <Grid container spacing={2} sx={{ padding: "20px" }}>
            <Grid item xs={6} align="center">
              <Typography sx={{ color: "white" }}>
                Total Income:{" "}
                <span style={{ color: "green" }}>{` $${totalIncome.toFixed(
                  2
                )}`}</span>
              </Typography>
            </Grid>
            <Grid item xs={6} align="center">
              <Typography sx={{ color: "white" }}>
                Total Expenses:{" "}
                <span style={{ color: "red" }}>{` $${totalExpenses.toFixed(
                  2
                )}`}</span>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography sx={{ color: "white" }} variant="h6">
              TOTAL SAVED:
              <span style={{ color: "gold" }}>{` $${totalSaved.toFixed(
                2
              )}`}</span>
            </Typography>
          </Grid>
        </Container>
        <Divider
          sx={{
            borderColor: "white",
            height: "700px",
            margin: "auto",
            display: { lg: "block", xs: "none" },
          }}
          orientation="vertical"
          variant="middle"
          flexItem
        />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
            width: "100%",
            flexDirection: "column",
            paddingBottom: "20px",
          }}
        >
          <SavingsIcon
            sx={{
              fontSize: "50px",
              color: "#FEE12B",
              width: "100%",
            }}
          />
          <Typography variant="h3" color={"white"} fontWeight={"900"}>
            Money Manager
          </Typography>
        </Container>
        <BottomNav />
      </Container>
      <BottomNav />
    </>
  );
}
