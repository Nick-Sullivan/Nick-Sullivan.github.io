import { useEffect, useState } from "react";
import "./DiceInput.css";

export interface Dice {
  id: string;
  raw: string;
  values: number[];
}

const getId = (index: number) => {
  return String.fromCharCode(65 + index);
};
const getValue = (str: string) => {
  return str
    .replace(/\s+/g, ",") // white space can be seperator
    .replace(/[^0-9,]/g, "") // remove non-numeric
    .split(",")
    .filter((s) => s.trim() !== "")
    .map(Number);
};

const DiceInput: React.FC<{
  initialValues: number[][];
  isEditable: boolean;
  onDiceChange: (value: Dice[]) => void;
}> = ({ initialValues, isEditable, onDiceChange }) => {
  const [dice, setDice] = useState<Dice[]>(
    initialValues.map((values, index) => ({
      id: getId(index),
      raw: values.join(" "),
      values: values,
    }))
  );

  const addDice = () => {
    setDice([...dice, { id: getId(dice.length), raw: "", values: [] }]);
  };

  const removeDice = () => {
    setDice(dice.slice(0, -1));
  };

  const onTextChange = (index: number, value: string) => {
    const newDice = [...dice];
    newDice[index] = {
      id: getId(index),
      raw: value,
      values: getValue(value),
    };
    setDice(newDice);
  };

  useEffect(() => {
    onDiceChange(dice);
  }, [dice]);

  return (
    <div className="dice-inputs">
      {isEditable && (
        <div className="dice-buttons">
          <button onClick={addDice}>Add Dice</button>
          <button onClick={removeDice}>Remove Dice</button>
        </div>
      )}

      {dice.map((dice, index) => (
        <div className="dice-row" key={dice.id}>
          <label>{dice.id}</label>
          <input
            key={index}
            type="text"
            value={dice.raw}
            disabled={!isEditable}
            onChange={(e) => onTextChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default DiceInput;
