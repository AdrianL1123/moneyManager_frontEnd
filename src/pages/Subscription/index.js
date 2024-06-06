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
import { getSubscriptions } from "../../utils/api_subscription";

export default function Subscription() {
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser = {} } = cookies;
  const { role, token } = currentUser;

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscription", token],
    queryFn: () => getSubscriptions(token),
  });

  return (
    <>
      <TopNav />
      <Container
        sx={{
          paddingTop: "20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography variant="h4">Subscriptions</Typography>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "20px",
            flexDirection: "column",
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
                  <TableCell sx={{ color: "white" }}>Total Amount</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                  <TableCell sx={{ color: "white" }}>Payment Date</TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptions.length > 0 ? (
                  subscriptions.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell>{s.user_id}</TableCell>
                      <TableCell>
                        <Typography
                          key={s._id}
                          variant="body1"
                          display={"flex"}
                        >
                          Money Manager Subscription
                        </Typography>
                      </TableCell>
                      <TableCell>${s.totalPrice}</TableCell>
                      <TableCell>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={s.status}
                          label="status"
                          disabled={s.status === "pending"}
                          // onChange={(e) => {
                          //   handleUpdateOrder(s, e.target.value);
                          // }}
                        >
                          <MenuItem value={"paid"}>Paid</MenuItem>
                          <MenuItem value={"pending"}>Pending</MenuItem>
                          <MenuItem value={"failed"}>Failed</MenuItem>
                          <MenuItem value={"completed"}>Completed</MenuItem>
                        </Select>
                      </TableCell>

                      <TableCell>{s.paid_at}</TableCell>
                      <TableCell align="right">
                        {s.status === "pending" && (
                          <Button
                            variant="outlined"
                            color="error"
                            //   onClick={() => {
                            //     handleRemoveOrder(order._id);
                            //   }}
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
        </Container>
      </Container>
      <BottomNav />
    </>
  );
}
