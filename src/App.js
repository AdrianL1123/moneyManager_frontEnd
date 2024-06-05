import "./index.css"; // Ensure this file exists and is correctly located

import { BrowserRouter, Routes, Route } from "react-router-dom"; // Ensure you're using React Router v6
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import CategoryIncome from "./pages/CategoriesIncome";
import { SnackbarProvider } from "material-ui-snackbar-provider"; // Ensure this package is installed and imported correctly
import CustomSnackbar from "./components/CustomSnackbar";
import Income from "./pages/Income";
import IncomeEdit from "./pages/IncomeEdit";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <SnackbarProvider
          SnackbarComponent={CustomSnackbar}
          SnackbarProps={{ autoHideDuration: 4000 }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/income" element={<Income />} />
              <Route path="/incomeEdit/:id" element={<IncomeEdit />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categoriesIncome" element={<CategoryIncome />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
}
