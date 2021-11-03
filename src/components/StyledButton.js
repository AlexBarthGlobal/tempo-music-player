import React, {useState} from 'react';


// func, restingImg, activeImg, className, size, isDisabled (bool), disabledImg
//                                   *                                   *
const StyledButton = (props) => {
    const [isActive, setActive] = useState(false)


    return (
        <img onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)} className={props.className ? props.className : null} width={props.size} height={props.size} src={props.isDisabled ? props.disabledImg : isActive ? props.activeImg : props.restingImg} /*onClick={props.function()}*/ />
    )
};

export default StyledButton