import {
  Button,
  Container,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCookies } from "react-cookie";
import BottomNav from "../../components/bottomNav";
import TopNav from "../../components/topNav";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  deleteSubscription,
  getSubscriptions,
} from "../../utils/api_subscription";
import useCustomSnackbar from "../../components/useCustomSnackbar";
import { useNavigate } from "react-router-dom";

export default function Subscription() {
  const navigate = useNavigate();
  const snackbar = useCustomSnackbar();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscription", token],
    queryFn: () => getSubscriptions(token),
  });
  // delete
  const deleteSubscriptionMutation = useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      // display success message
      snackbar.showSuccess("Subscription have been deleted");
      queryClient.invalidateQueries({
        queryKey: ["subscription"],
      });
    },
    onError: (error) => {
      // display error message
      snackbar.showError(error.response.data.message);
    },
  });

  const handleRemoveSubscription = (_id) => {
    const answer = window.confirm(
      "Are you sure you want to remove this subscription?"
    );
    if (answer) {
      deleteSubscriptionMutation.mutate({ _id: _id, token: token });
    }
  };

  return (
    <>
      {currentUser.role !== "admin" ? (
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
            Page not found
          </Typography>
          <Button
            color="warning"
            onClick={() => {
              navigate("/profile");
            }}
          >
            Return back to profile
          </Button>
        </Container>
      ) : (
        <>
          {" "}
          <TopNav />
          <Container
            sx={{
              paddingTop: "20px",
              textAlign: "center",
              color: "white",
            }}
          >
            <Typography variant="h4" sx={{ color: "white" }}>
              Subscriptions
            </Typography>
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "20px",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "auto",
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <TableContainer
                  sx={{ maxWidth: "900px", width: "100%" }}
                  align="center"
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" sx={{ color: "white" }}>
                          User Id
                        </TableCell>
                        <TableCell align="left" sx={{ color: "white" }}>
                          Total Amount
                        </TableCell>
                        <TableCell align="left" sx={{ color: "white" }}>
                          Status
                        </TableCell>
                        <TableCell align="left" sx={{ color: "white" }}>
                          Payment Date
                        </TableCell>
                        <TableCell align="right" sx={{ color: "white" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subscriptions.length > 0 ? (
                        subscriptions.map((s) => (
                          <TableRow key={s._id}>
                            <TableCell sx={{ color: "white" }}>
                              {s.user_id}
                            </TableCell>
                            <TableCell sx={{ color: "white" }}>
                              ${s.totalPrice}
                            </TableCell>
                            <TableCell sx={{ color: "white" }}>
                              {s.status === "paid" ? (
                                <Typography color={"primary"}>Paid</Typography>
                              ) : (
                                <Typography color={"error"}>Pending</Typography>
                              )}
                            </TableCell>
                            {s.paid_at ? (
                              <TableCell sx={{ color: "white" }}>
                                {s.paid_at}
                              </TableCell>
                            ) : (
                              <TableCell sx={{ color: "white" }}>
                                Not paid Yet
                              </TableCell>
                            )}

                            <TableCell align="right" sx={{ color: "white" }}>
                              {s.status === "pending" && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => {
                                    handleRemoveSubscription(s._id);
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            align="center"
                            sx={{ color: "white" }}
                          >
                            No Subscription added yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Container>
          </Container>
          <BottomNav />
        </>
      )}
    </>
  );
}
