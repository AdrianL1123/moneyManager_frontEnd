import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../../utils/api_expense";
import { useCookies } from "react-cookie";

export default function PieChartz() {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const [category, setCategory] = useState("Category");
  const { token } = currentUser;

  const {
    data: expenses = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["expenses", category, token],
    queryFn: () => getExpenses(category, token),
  });

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) {
    console.error("Error loading data:", error);
    return <div>Error loading data</div>;
  }

  // Map data if necessary
  const chartData = expenses.map((expense) => ({
    name: expense.category,
    value: expense.amount,
  }));

  return (
    <PieChart width={800} height={400}>
      <Pie
        data={chartData}
        cx={120}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      {/* <Tooltip /> */}
    </PieChart>
  );
}
