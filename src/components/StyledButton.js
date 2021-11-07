import React, {useState} from 'react';
import Button from '@mui/material/Button';

const StyledButton = (props) => {
    return (
        <Button onClick={props.func} type={props.type} sx={{color: 'black', backgroundColor: 'white', textTransform: "none", ':hover': {bgcolor: 'gray'}}}>{props.title}</Button>
    )
};

export default StyledButton