import Button from "@mui/material/Button";
import { Attack as IAttack } from "../sharedTypes";
import { Typography } from "@mui/material";

interface AttackProps {
  attack: IAttack;
  onAttack: (attack: IAttack) => void;
  isChosen: boolean;
  disabled: boolean;
}

export default function Attack({
  attack,
  onAttack,
  isChosen,
  disabled,
}: AttackProps) {
  return (
    <Button
      variant="contained"
      color={isChosen ? "secondary" : "primary"}
      onClick={() => onAttack(attack)}
      disabled={!isChosen && disabled}
    >
      <div>
        <Typography variant="h6">{attack.name}</Typography>
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
      </div>
    </Button>
  );
}
