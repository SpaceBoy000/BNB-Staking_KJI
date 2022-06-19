import { Box, Typography } from "@material-ui/core";
// import "./cardheader.scss";

const CardHeader = ({ title, children }) => {
  return (
    <Box className={`card-header`}>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">{children}</Typography>
    </Box>
  );
};

export default CardHeader;
