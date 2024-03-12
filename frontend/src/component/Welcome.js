import { Grid, Typography, Button } from "@material-ui/core";

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
        <Button variant="contained" color="primary" size="large" href="/jobs">
          Explore Jobs
        </Button>
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
