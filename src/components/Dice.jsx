import React from 'react';

function Dice(props) {
    return (
        <div className={`w-20 h-20 shadow flex justify-center items-center rounded-3xl cursor-pointer ${props.isHeld ? 'bg-emerald-400 text-white' : 'bg-white'} font-bold`} onClick={props.holdDice}>
            <h2 className={'text-2xl'}>{props.value}</h2>
        </div>
    );
}

export default Dice;