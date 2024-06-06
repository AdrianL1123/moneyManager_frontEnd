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
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../utils/api_signup";
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

  //to open edit dialog
  const [openEditModal, setOpenEditModal] = useState(false);

  //states for edit
  const [editName, setEditName] = useState("");
  const [editNameID, setEditNameID] = useState("");

  const [editEmail, setEditEmail] = useState("");
  const [editEmailID, setEditEmailID] = useState("");

  const [editRole, setEditRole] = useState("");
  const [editRoleID, setEditRoleID] = useState("");

  const { data: users = [] } = useQuery({
    queryKey: ["users", token],
    queryFn: () => getUsers(token),
  });

  // add
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

  //edit
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      snackbar.showSuccess("User has been updated successfully.");
      queryClient.invalidateQueries(["users"]);
      setOpenEditModal(false);
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleEdit = () => {
    if (editName === "" || editEmail === "") {
      snackbar.showWarning("Please fill in the details.");
    } else {
      updateUserMutation.mutate({
        id: editNameID,
        name: editName,
        email: editEmail,
        role: editRole,
        token: token,
      });
    }
  };

  //delete
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      snackbar.showSuccess("User has been successfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error) => {
      snackbar.showError(error.response.data.message);
    },
  });

  const handleDeleteUser = (_id) => {
    const answer = window.confirm(
      "Are you sure you want to remove this category?"
    );
    if (answer) {
      deleteUserMutation.mutate({ token, _id });
    }
  };

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
                        <Button
                          sx={{ color: "#FEE12B" }}
                          onClick={() => {
                            setOpenEditModal(true);

                            setEditName(u.name);
                            setEditNameID(u._id);

                            setEditEmail(u.email);
                            setEditEmailID(u._id);

                            setEditRole(u.role);
                            setEditRoleID(u._id);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ color: "#FEE12B" }}
                          onClick={() => handleDeleteUser(u._id)}
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

      {/* add dialog */}
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
      {/* add dialog */}

      {/* //edit dialog */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Category"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "10px" }}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "10px" }}
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          <Select
            labelId="role-select-label"
            id="role-select"
            fullWidth
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            margin="dense"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setOpenEditModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => handleEdit()}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      {/* //edit dialog */}
    </>
  );
}
