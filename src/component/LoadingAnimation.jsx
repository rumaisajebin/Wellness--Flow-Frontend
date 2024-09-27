import * as React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function LoadingAnimation() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", 
        minWidth: "100vw",
        backgroundColor: "background.default",
        backdropFilter: "blur(5px)", 
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="secondary" size={50} /> 
        <CircularProgress color="success" size={50} /> 
        <CircularProgress color="inherit" size={50} /> 
      </Stack>
    </Box>
  );
}
