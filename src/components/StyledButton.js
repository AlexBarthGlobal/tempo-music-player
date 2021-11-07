import React, {useState} from 'react';
import Button from '@mui/material/Button';

const StyledButton = (props) => {
    return (
        <Button onClick={props.func} sx={{color: 'black', backgroundColor: 'white', textTransform: "none", ':hover': {bgcolor: 'gray'}}}>{props.title}</Button>
    )
};

export default StyledButton