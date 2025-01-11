import { useState } from "react";
import DiceInput, { type Dice } from "../DiceInput/DiceInput";
import DiceMatrix, { type DiceMatchup } from "../DiceMatrix/DiceMatrix";
import "./ProbabilityCalculator.css";

const binomialCoefficient = (rounds: number, round: number): number => {
  let coeff = 1;
  for (let x = 0; x < round; x++) {
    coeff *= (rounds - x) / (x + 1);
  }
  return coeff;
};

const matchupAfterMultipleRounds = (
  matchup: DiceMatchup,
  rounds: number
): DiceMatchup => {
  if (rounds === 1) return matchup;
  const majorityThreshold = Math.floor(rounds / 2) + 1;
  const winChance = matchup.winChance;
  const lossChance = matchup.lossChance;
  const drawChance = 1 - winChance - lossChance;

  let probWinningMajority = 0;
  let probLosingMajority = 0;
  for (let round = majorityThreshold; round <= rounds; round++) {
    for (let draws = 0; draws <= rounds - round; draws++) {
      const losses = rounds - round - draws;
      probWinningMajority +=
        binomialCoefficient(rounds, round) *
        binomialCoefficient(rounds - round, draws) *
        Math.pow(winChance, round) *
        Math.pow(drawChance, draws) *
        Math.pow(lossChance, losses);
    }
  }

  for (let losses = majorityThreshold; losses <= rounds; losses++) {
    for (let draws = 0; draws <= rounds - losses; draws++) {
      const round = rounds - losses - draws;
      probLosingMajority +=
        binomialCoefficient(rounds, losses) *
        binomialCoefficient(rounds - losses, draws) *
        Math.pow(lossChance, losses) *
        Math.pow(drawChance, draws) *
        Math.pow(winChance, round);
    }
  }
  return {
    idA: matchup.idA,
    idB: matchup.idB,
    winChance: probWinningMajority,
    lossChance: probLosingMajority,
  };
};

const calculateWinPercentages = (
  dice: Dice[],
  rounds: number
): DiceMatchup[] => {
  const results: DiceMatchup[] = [];
  for (let i = 0; i < dice.length; i++) {
    for (let j = 0; j < dice.length; j++) {
      const matchup = calculateDiceMatchup(dice[i], dice[j]);
      const matchupAfterNRounds = matchupAfterMultipleRounds(matchup, rounds);
      results.push(matchupAfterNRounds);
    }
  }
  return results;
};

const calculateDiceMatchup = (diceA: Dice, diceB: Dice): DiceMatchup => {
  let wins = 0;
  let losses = 0;
  let total = 0;
  for (const d1 of diceA.values) {
    for (const d2 of diceB.values) {
      if (d1 > d2) wins++;
      if (d2 > d1) losses++;
      total++;
    }
  }
  return {
    idA: diceA.id,
    idB: diceB.id,
    winChance: wins / total,
    lossChance: losses / total,
  };
};

const ProbabilityCalculator: React.FC<{
  initialValues: number[][];
  isEditable: boolean;
  rounds: number;
}> = ({ initialValues, isEditable, rounds }) => {
  const [diceIds, setDiceIds] = useState<string[]>([]);
  const [diceMatchups, setDiceMatchups] = useState<DiceMatchup[]>([]);

  const onDiceChange = (dice: Dice[]) => {
    const winPercentages = calculateWinPercentages(dice, rounds);
    setDiceIds(dice.map((d) => d.id));
    setDiceMatchups(winPercentages);
  };

  return (
    <div className="probability-calculator">
      {/* <h3>Win Probability</h3> */}
      <div className="input-and-output">
        <DiceInput
          initialValues={initialValues}
          isEditable={isEditable}
          onDiceChange={onDiceChange}
        />
        <DiceMatrix diceIds={diceIds} diceMatchups={diceMatchups} />
      </div>
    </div>
  );
};

export default ProbabilityCalculator;
