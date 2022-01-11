import React from 'react';
import Button from '@mui/material/Button';

const StyledButton = (props) => {
    return (
        <Button onClick={props.func} type={props.type} sx={{color: 'black', backgroundColor: 'white', width: `${props.width ? props.width : null}`, textTransform: "none", ':hover': {bgcolor: 'gray'}}} disabled={props.disabled}>{props.title}</Button>
    )
};

export default StyledButton