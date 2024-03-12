import { Grid, Typography, Button, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(6),
    minHeight: "100vh",
    background: "linear-gradient(135deg, #2980b9, #2c3e50)", // Gradient background
    color: "#fff", // White text color
    textAlign: "center", // Center-align text
  },
  title: {
    marginBottom: theme.spacing(4),
    fontWeight: "bold", // Bold title
  },
  subtitle: {
    marginBottom: theme.spacing(6),
    fontSize: "1.2rem", // Larger font size for subtitle
  },
  exploreButton: {
    textDecoration: "none",
    fontWeight: "bold",
    padding: theme.spacing(2, 6),
    borderRadius: "999px",
    background: theme.palette.primary.main,
    color: "#fff",
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      background: theme.palette.primary.dark,
    },
  },
}));

export const Welcome = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.container}
    >
      <Grid item>
        <Typography variant="h2" align="center" className={classes.title}>
          Welcome to Community-Connect Job Portal
        </Typography>
        <Typography variant="body1" align="center" className={classes.subtitle} paragraph>
          Explore thousands of job opportunities from leading companies.
        </Typography>
        <Link to="/login" className={classes.exploreButton}>
          Explore Jobs
        </Link>
      </Grid>
    </Grid>
  );
};
