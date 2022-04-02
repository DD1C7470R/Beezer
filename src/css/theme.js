import {createTheme} from "@mui/material/styles";
// import {teal, purple} from "@mui/material/colors";

const darkTheme =createTheme  ( theme =>  ({
    palette: {
        mode: 'dark'
    },
}));


export default darkTheme;

// primary: teal,
// secondary: purple