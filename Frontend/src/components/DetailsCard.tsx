import { Card, CardProps } from "@mui/material";
import { lightGrey } from "../utils/colors";

export function DetailsCard(props: CardProps) {
  return (
    <Card elevation={0} style={{ backgroundColor: lightGrey }} {...props}>
      {props.children}
    </Card>
  );
}
