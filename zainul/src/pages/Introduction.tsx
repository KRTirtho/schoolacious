import React from "react";
import { Box, Grid, Typography, Button } from "@material-ui/core";
import bgImg from "/assets/introduction-bg.jpg";

export default function Introduction() {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      className="bg-top h-screen relative"
      style={{
        backgroundPosition: "top",
        height: '100vh',
        position: 'relative',
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <Box position="absolute" top="0" right="0" margin={2}>
        <Button>
          Sign up
        </Button>
      </Box>
      <Typography variant="h1">VESchool</Typography>
      <Box maxWidth="50%">
        <Typography variant="h5" align="center">
          A destination where all the reading sound📔 of small learners🧒 & day
          to day learning👩‍🏫 takes place bringing up all the thing a student👩‍🎓
          used to do before Quarantine & Pandemic🦠
        </Typography>
      </Box>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        style={{ maxWidth: "18em" }}
        wrap="nowrap"
        direction="row"
      >
        <Button>
          Get Started
        </Button>
        <Button color="default">Learn More</Button>
      </Grid>
    </Grid>
  );
}
