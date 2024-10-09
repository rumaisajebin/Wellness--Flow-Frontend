import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const videoStyles = {
  video: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    margin: "10px 0",
  },
};

const Video = ({ classes, id, isLocalUser, user_full_name }) => {
  return (
    <div>
      <video
        id={id}
        className={classes.video}
        autoPlay
        playsInline
        muted={isLocalUser} // Mute the local user video
      />
      {!isLocalUser && <p>{user_full_name}</p>}
    </div>
  );
};

Video.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  isLocalUser: PropTypes.bool,
  user_full_name: PropTypes.string,
};

Video.defaultProps = {
  isLocalUser: false,
  user_full_name: "",
};

export default withStyles(videoStyles)(Video);
