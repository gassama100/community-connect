import { Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export const Welcome = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2" align="center" gutterBottom>Welcome to Community-Connect Job Portal</Typography>
        <Typography variant="body1" align="center" paragraph>
          Are you ready to find your next opportunity?
        </Typography>
        {/* Replace Button with Link */}
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Typography variant="button" color="primary">Explore Jobs</Typography>
        </Link>
      </Grid>
    </Grid>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
