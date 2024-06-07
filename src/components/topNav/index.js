import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SavingsIcon from "@mui/icons-material/Savings";
import { getExpenses } from "../../utils/api_expense";
import { getIncomes } from "../../utils/api_income";
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

export default function TopNav() {
  const [cookies] = useCookies(["currentUser"]);
  const token = cookies.token;
  const { currentUser = {} } = cookies;
  const { role, _id } = currentUser;

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          color: "white",
          marginBottom: "30px",
          backgroundColor: "#333333",
        }}
      >
        <Toolbar sx={{ flexDirection: "column", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "20px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Money Manager
            </Typography>
            <SavingsIcon
              sx={{
                color: "#FEE12B",
                marginLeft: "8px",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              paddingTop: "10px",
              paddingBottom: "10px",
              color: "gray",
            }}
          >
            <Typography sx={{ margin: "0 10px" }}>
              Month:
              <span style={{ color: "white" }}>
                {` ${monthNames[currentMonth]}`}
              </span>
            </Typography>
            <Typography sx={{ margin: "0 10px" }}>
              Income:
              <span style={{ color: "white" }}>{` $${totalIncome.toFixed(
                2
              )}`}</span>
            </Typography>
            <Typography sx={{ margin: "0 10px" }}>
              Expenses:
              <span style={{ color: "white" }}>{` $${totalExpenses.toFixed(
                2
              )}`}</span>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
