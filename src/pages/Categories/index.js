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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import PetsIcon from "@mui/icons-material/Pets";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useCookies } from "react-cookie";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../utils/api_categories";
import { useNavigate } from "react-router-dom";
import DialogCategoryAdd from "../../components/Dialog_Category_Add";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../../utils/api_categories";

export default function () {
  const queryClient = useQueryClient();

  const snackbar = useCustomSnackbar();

  //dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  //dialog

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", token],
    queryFn: () => getCategories(token),
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

  const navigate = useNavigate();

  //delete
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // display success message
      snackbar.showSuccess("Category has been successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error) => {
      // display error message
      snackbar.showError(error.response.data.message);
    },
  });
  const handleDeleteCategory = (_id) => {
    const answer = window.confirm(
      "Are you sure you want to remove this order?"
    );
    if (answer) {
      deleteCategoryMutation.mutate({ token, _id });
    }
  };
  //delete

  return (
    <>
      <Container style={{ paddingTop: "20px", width: "100%" }}>
        <Typography
          variant="h4"
          color={"white"}
          align="center"
          paddingBottom={"20px"}
        >
          Categories For Expenses
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
              setOpenDialog(true);
            }}
          >
            Add A Category
          </Button>
          <DialogCategoryAdd
            openDialog={openDialog}
            handleCloseDialog={handleCloseDialog}
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
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell width={"20%"} sx={{ color: "white" }}>
                        {getIconComponent(c.icon)}
                      </TableCell>
                      <TableCell align="left" sx={{ color: "white" }}>
                        {c.name}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        <Button sx={{ color: "#FEE12B" }}>Edit</Button>
                        <Button
                          sx={{ color: "#FEE12B" }}
                          onClick={() => {
                            handleDeleteCategory(c._id);
                          }}
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
                      No categories added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Container>

      <BottomNav />
    </>
  );
}
