import "./DiceMatrix.css";
export interface DiceMatchup {
  idA: string;
  idB: string;
  winChance: number;
  lossChance: number;
}

const DiceMatrix: React.FC<{
  diceIds: string[];
  diceMatchups: DiceMatchup[];
}> = ({ diceIds, diceMatchups }) => {
  const getMatchup = (idA: string, idB: string) => {
    const matchup = diceMatchups.find((m) => m.idA === idA && m.idB === idB);
    return matchup!;
  };
  return (
    <div className="dice-matrix">
      <table>
        <thead>
          <tr>
            <th></th>
            {diceIds.map((id) => (
              <th key={id}>{id}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {diceIds.map((idA) => (
            <tr key={idA}>
              <th>{idA}</th>
              {diceIds.map((idB) => {
                const matchup = getMatchup(idA, idB);
                let className = "";
                if (matchup.winChance == matchup.lossChance) {
                  className = "draw";
                } else if (matchup.winChance > matchup.lossChance) {
                  className = "win";
                } else {
                  className = "lose";
                }
                return (
                  <td key={idB} className={className}>
                    {(matchup.winChance * 100).toFixed(1)}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiceMatrix;
