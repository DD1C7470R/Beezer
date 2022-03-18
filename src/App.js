// import Streamer from './components/Streamer';

import Dice from "./components/Dice";
import React, {useEffect, useState} from "react";

function App() {
    const [tenzies, setTenzies] = useState(false);
    const [dice, setDice] = useState(allNewDice());

    useEffect(() => {
        const isAllHeld = dice.every(die => die.isHeld === true);
        const isAllSame = dice.every(die => dice[0].value === die.value);

        if (isAllHeld && isAllSame){
            setTenzies(true);
            alert('You won')
        }
    }, [dice])

    function generateNewDice() {
        const num = Math.ceil(Math.random() * 6)
        return {
            value:num,
            isHeld:false
        }
    }

    function allNewDice() {
            let newDice = [];
            for (let i=0; i < 10; i++) {
                newDice.push(generateNewDice())
            }
            return newDice;
    }

    function holdDice(id) {
        dice[id].isHeld = !dice[id].isHeld;
        setDice([...dice])
    }

    function rollDice() {
        if (!tenzies) {
            setDice(previousDice =>
            previousDice.map(die =>
                die.isHeld ? die : generateNewDice()
            )
        )  } else {
            setTenzies(false);
            setDice(allNewDice())
        }
    }

    // const diceFaces =
  return (
      <main className={'bg-mainColor w-90 h-90 flex flex-col justify-center items-center align-middle p-20'}>
          <h1 className={'text-2xl font-bold pb-2 px-2'}>Tenzies</h1>
          <p className={' pb- px-2'}>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <div className={'grid grid-cols-5 pl-16 pr-8 gap-4 mt-3.5'}>
              {dice.map((num, i) => <Dice key={i} value={num.value} isHeld={num.isHeld} holdDice={() => holdDice(i)}/>)}
              </div>
          <button className={'bg-blue-700 rounded-2xl w-40 text-white font-bold text-xl p-4 mt-7 hover:bg-violet-600 active:shadow focus:outline-none'} onClick={() => rollDice()}>{tenzies ? "New Game" : "Roll"}</button>
      </main>
  );
}

export default App;
