import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import isAuth from "../lib/isAuth";

const ExploreJobs = (props) => {
  // Check if user is logged in
  const isLoggedIn = isAuth();

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

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
        <Typography variant="h2" align="center" gutterBottom>
          Explore Jobs
        </Typography>
        {/* Add your job listing content here */}
      </Grid>
    </Grid>
  );
};

export default ExploreJobs;
