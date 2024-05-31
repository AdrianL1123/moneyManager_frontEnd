import { Button, Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";

export default function ButtonInfo() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "20px",
      }}
    >
      <Button
        sx={{
          color: "black",
          padding: "10px",
          border: "2px solid",
          borderRadius: "10px",
          width: "700px",
          height: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#333333",
        }}
        onClick={() => {
          navigate("/");
        }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={1} container justifyContent="center">
            <InfoIcon sx={{ color: "#FEE12B" }} />
          </Grid>
          <Grid item xs={10} container alignItems="center">
            <Typography
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              info
            </Typography>
          </Grid>
        </Grid>
      </Button>
    </Box>
  );
}
