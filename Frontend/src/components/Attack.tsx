import Button from "@mui/material/Button";
import { Attack as IAttack } from "../sharedTypes";

interface AttackProps {
  attack: IAttack;
  onAttack: (attack: IAttack) => void;
}

export default function Attack({ attack, onAttack }: AttackProps) {
  return (
    <div>
      <div>{attack.name}</div>
      <div>{attack.element}</div>
      <div>{attack.special ? "Special" : "Physical"}</div>
      <div>{"Power: " + attack.power}</div>
      <div>
        {" "}
        {Object.entries(attack.self_status_id ?? {}).map(
          ([key, value], index) => (
            <div key={index}>
              {key} : {value}
            </div>
          )
        )}
      </div>
      <Button onClick={() => onAttack(attack)}>Attack!</Button>
    </div>
  );
}
