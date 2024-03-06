import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Modal,
  Paper,
  Slider,
  TextField,
  Typography,
  MenuItem
} from "@material-ui/core";
import axios from 'axios'

import Rating from "@material-ui/lab/Rating";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexDirection: 'row',
    padding: theme.spacing(3),
  },
  jobCard: {
    marginBottom: theme.spacing(2),
    borderRadius:20,
  },
  jobCardTitle:{
    fontWeight:'900',
    marginBottom:10
    // textAlign:'center'

  },
  applyButton: {
    marginLeft: "auto",
    marginTop:20,
  },
  modalPaper: {
    padding: theme.spacing(3),
    outline: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: "50%",
    alignItems: "center",
  },
}));

const JobTile = ({ job }) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    console.log(job._id);
    console.log(sop);
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  

  const deadline = new Date(job.deadline).toLocaleDateString();

  return (
    <Grid item xs={12} sm={4} >
    <Card className={classes.jobCard}>
      <CardContent>
        <Typography variant="h5" className={classes.jobCardTitle} >{job.title}</Typography>
        <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
        <Typography variant="body1">Role: {job.jobType}</Typography>
        <Typography variant="body1">Salary: GMB; {job.salary} per month</Typography>
        <Typography variant="body1">
          Duration: {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
        </Typography>
        <Typography variant="body1">Posted By: {job.recruiter.name}</Typography>
        <Typography variant="body1">Application Deadline: {deadline}</Typography>
        <div>
          {job.skillsets.map((skill, index) => (
            <Typography variant="body2" component="span" key={index}>
              {skill}
            </Typography>
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.applyButton}
          onClick={() => setOpen(true)}
          disabled={userType() === "recruiter"}
        >
          Apply
        </Button>
        <Modal open={open} onClose={handleClose}>
          <Paper className={classes.modalPaper}>
            <TextField
              label="Write SOP (up to 250 words)"
              multiline
              rows={8}
              fullWidth
              variant="outlined"
              value={sop}
              onChange={(e) => setSop(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              style={{ marginTop: "16px" }}
            >
              Submit
            </Button>
          </Paper>
        </Modal>
      </CardContent>
    </Card>
  </Grid>



  );
};



const Home = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] != 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] != 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };
  const FilterPopup = ({ open, searchOptions, setSearchOptions, handleClose, getData }) => {
    const classes = useStyles();
  
    const handleJobTypeChange = (event) => {
      setSearchOptions({
        ...searchOptions,
        jobType: {
          ...searchOptions.jobType,
          [event.target.name]: event.target.checked,
        },
      });
    };
  
    const handleSalaryChange = (event, newValue) => {
      setSearchOptions({
        ...searchOptions,
        salary: newValue,
      });
    };
  
    const handleDurationChange = (event) => {
      setSearchOptions({
        ...searchOptions,
        duration: event.target.value,
      });
    };
  
    const handleSortChange = (event, fieldName) => {
      const sortType = event.target.checked ? "desc" : "asc";
      setSearchOptions({
        ...searchOptions,
        sort: {
          ...searchOptions.sort,
          [fieldName]: {
            status: event.target.checked,
            desc: sortType === "desc",
          },
        },
      });
    };
  
    return (
      <Modal open={open} onClose={handleClose}>
        <Paper className={classes.modalPaper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Filter Options</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="primary" name="fullTime" checked={searchOptions.jobType.fullTime} onChange={handleJobTypeChange} />}
                label="Full Time"
              />
              <FormControlLabel
                control={<Checkbox color="primary" name="partTime" checked={searchOptions.jobType.partTime} onChange={handleJobTypeChange} />}
                label="Part Time"
              />
              <FormControlLabel
                control={<Checkbox color="primary" name="wfh" checked={searchOptions.jobType.wfh} onChange={handleJobTypeChange} />}
                label="Work From Home"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Salary Range</Typography>
              <Slider
                value={searchOptions.salary}
                onChange={handleSalaryChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Duration"
                value={searchOptions.duration}
                onChange={handleDurationChange}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Sort by</Typography>
              <FormControlLabel
                control={<Checkbox color="primary" checked={searchOptions.sort.salary.status} onChange={(event) => handleSortChange(event, 'salary')} />}
                label="Salary"
              />
              <FormControlLabel
                control={<Checkbox color="primary" checked={searchOptions.sort.duration.status} onChange={(event) => handleSortChange(event, 'duration')} />}
                label="Duration"
              />
              <FormControlLabel
                control={<Checkbox color="primary" checked={searchOptions.sort.rating.status} onChange={(event) => handleSortChange(event, 'rating')} />}
                label="Rating"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={getData}>Apply</Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    );
  };
  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h2">Jobs</Typography>
          </Grid>
          <Grid item xs>
            <TextField
              label="Search Jobs"
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getData()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ width: "500px" }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => setFilterOpen(true)}>
              <FilterListIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs
          direction="row"
          alignItems="stretch"
          spacing={4}
        >
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return <JobTile job={job} />;
            })
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No jobs found
            </Typography>
          )}
        </Grid>
        {/* <Grid item>
          <Pagination count={10} color="primary" />
        </Grid> */}
      </Grid>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </>
  );
};

export default Home;
