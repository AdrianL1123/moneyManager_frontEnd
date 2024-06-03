import BottomNav from "../../components/bottomNav";
import {
  Container,
  Divider,
  Table,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TimelapseIcon from "@mui/icons-material/Timelapse";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DialogCategoryIncomeAdd from "../../components/Dialog_CategoryIncome_Add";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import {
  deleteCategoryIncome,
  getCategoriesIncome,
} from "../../utils/api_categoriesIncome";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DialogCategoryIncomeEdit from "../../components/Dialog_CategoryIncome_Edit";

export default function CategoryIncome() {
  const queryClient = useQueryClient();
  const snackbar = useCustomSnackbar();

  const [openDialogIncome, setOpenDialogIncome] = useState(false);
  const handleOpenDialogIncome = () => {
    setOpenDialogIncome(true);
  };

  const handleCloseDialogIncome = () => {
    setOpenDialogIncome(false);
  };

  // Edit category dialog state
  const [openCategoryIncomeEditDialog, setOpenEditIncomeDialog] =
    useState(false);
  const [selectedIncomeCategory, setSelectedIncomeCategory] = useState(null);

  const handleOpenEditIncomeDialog = (category) => {
    setSelectedIncomeCategory(category);
    setOpenEditIncomeDialog(true);
  };
  const handleCloseEditIncomeDialog = () => {
    setOpenEditIncomeDialog(false);
    setSelectedIncomeCategory(null);
  };

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: categoriesIncome = [] } = useQuery({
    queryKey: ["categoriesIncome", token],
    queryFn: () => getCategoriesIncome(token),
  });

  const getIconComponent = (iconName) => {
    switch (iconName) {
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

  const deleteCategoryIncomeMutation = useMutation({
    mutationFn: deleteCategoryIncome,
    onSuccess: () => {
      snackbar.showSuccess("Category has been successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["categoriesIncome"] });
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleDeleteCategoryIncome = (_id) => {
    if (window.confirm("Are you sure you want to remove this order?")) {
      deleteCategoryIncomeMutation.mutate({ token, _id });
    }
  };

  return (
    <>
      <Container style={{ paddingTop: "20px", width: "100%" }}>
        <Typography
          variant="h4"
          color={"white"}
          align="center"
          paddingBottom={"20px"}
        >
          Categories For Income
        </Typography>
        <Divider sx={{ borderColor: "white" }} />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "20px",
            flexDirection: "column",
          }}
        >
          <Button
            endIcon={<PlaylistAddIcon />}
            sx={{ fontSize: "12px", color: "#FEE12B" }}
            onClick={() => {
              setOpenDialogIncome(true);
            }}
          >
            Add A Category
          </Button>
          <DialogCategoryIncomeAdd
            openDialogIncome={openDialogIncome}
            handleCloseDialogIncome={handleCloseDialogIncome}
          />

          <TableContainer sx={{ maxWidth: "600px", width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={"20%"} sx={{ color: "white" }}>
                    Icon
                  </TableCell>
                  <TableCell align="left" sx={{ color: "white" }}>
                    Name
                  </TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoriesIncome.length > 0 ? (
                  categoriesIncome.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell width={"20%"} sx={{ color: "white" }}>
                        {getIconComponent(c.icon)}
                      </TableCell>
                      <TableCell align="left" sx={{ color: "white" }}>
                        {c.name}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        <Button
                          sx={{ color: "#FEE12B" }}
                          onClick={() => handleOpenEditIncomeDialog(c)}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ color: "#FEE12B" }}
                          onClick={() => handleDeleteCategoryIncome(c._id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ color: "white" }}
                    >
                      No categories (Income) added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Container>

      {selectedIncomeCategory && (
        <DialogCategoryIncomeEdit
          openCategoryIncomeEditDialog={setOpenEditIncomeDialog}
          handleCloseCategoryIncomeEditDialog={handleCloseEditIncomeDialog}
          item={selectedIncomeCategory}
        />
      )}

      <BottomNav />
    </>
  );
}
