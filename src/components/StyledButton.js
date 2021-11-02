import React, {useState} from 'react';

const StyledButton = (props) => {
    const [isActive, setActive] = useState(false)


    return (
        <img onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)} className={props.className ? props.className : null} width={props.size} height={props.size} src={isActive ? props.activeImg : props.restingImg} /*onClick={props.function()}*/ />
    )
};

export default StyledButton