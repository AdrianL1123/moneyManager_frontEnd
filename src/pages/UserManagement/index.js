import { useState } from "react";
import BottomNav from "../../components/bottomNav";
import TopNav from "../../components/topNav";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { getUsers, addUser } from "../../utils/api_signup";
export default function UserManagement() {
  const queryClient = useQueryClient();
  const snackbar = useCustomSnackbar();

  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { token } = currentUser;

  // Add user  dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("User");

  const addNewUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      snackbar.showSuccess("User added.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setName("");
      setRole("User");
      handleCloseDialog(true);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleAddUser = () => {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      snackbar.showWarning("Please fill in the details.");
    } else if (password !== confirmPassword) {
      snackbar.showWarning("Password does not match.");
    } else {
      addNewUserMutation.mutate({ name, email, password, role, token });
    }
  };

  const { data: users = [] } = useQuery({
    queryKey: ["users", token],
    queryFn: () => getUsers(token),
  });

  return (
    <>
      <TopNav />
      <Container style={{ paddingTop: "20px", width: "100%" }}>
        <Typography
          variant="h4"
          color={"white"}
          align="center"
          paddingBottom={"20px"}
        >
          User Management
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
            onClick={handleOpenDialog}
          >
            Add A User
          </Button>
          <TableContainer sx={{ maxWidth: "600px", width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={"20%"} sx={{ color: "white" }}>
                    Name
                  </TableCell>
                  <TableCell align="left" sx={{ color: "white" }}>
                    Email
                  </TableCell>
                  <TableCell align="left" sx={{ color: "white" }}>
                    Role
                  </TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell width={"20%"} sx={{ color: "white" }}>
                        {u.name}
                      </TableCell>
                      <TableCell align="left" sx={{ color: "white" }}>
                        {u.email}
                      </TableCell>
                      <TableCell align="left" sx={{ colosr: "white" }}>
                        {u.role === "admin" ? (
                          <Typography color={"orange"}>Admin</Typography>
                        ) : (
                          <Typography color={"white"}>User</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        <Button sx={{ color: "#FEE12B" }} onClick={() => {}}>
                          Edit
                        </Button>
                        <Button sx={{ color: "#FEE12B" }}>Remove</Button>
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
                      No Users added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Container>
      <BottomNav />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add User</DialogTitle>;
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography gutterBottom>Name</Typography>
              <TextField
                placeholder="Your name here..."
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Email</Typography>
              <TextField
                placeholder="Your email here..."
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Password</Typography>
              <TextField
                placeholder="Your password here..."
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Confirm Password</Typography>
              <TextField
                placeholder="Confirm Password"
                variant="outlined"
                fullWidth
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Role</Typography>
              <Select
                labelId="role-select-label"
                id="role-select"
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
                margin="dense"
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="warning"
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={handleAddUser}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
