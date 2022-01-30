import { makeStyles } from "@material-ui/core/styles";
import { AppBar } from "@material-ui/core";
// import IconButton from '@material-ui/core/IconButton';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Toolbar } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
    logo: {
        maxWidth: 160,
      },
      appbar:{
          background:'none',
      }
}));
export default function LandingHeader(){
    const classes = useStyles();
    return <div>
       <AppBar color="inherit" className = {classes.appbar} elevation = {0}>
    <Toolbar>
        <img src="FrontEnd/src/logo.png" alt="logo" className={classes.logo} />
      </Toolbar>
</AppBar>
        
    </div>
}