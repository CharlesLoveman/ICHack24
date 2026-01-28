import { Button, ButtonProps } from "@mui/material";
import { IconBaseProps } from "react-icons";
import { TiArrowSortedDown } from "react-icons/ti";

export interface DownArrowProps {
  buttonProps?: ButtonProps;
  iconProps?: IconBaseProps;
}

export function DownArrowButton({ buttonProps, iconProps }: DownArrowProps) {
  return (
    <Button
      variant="text"
      style={{ margin: 0, padding: 0, color: "black" }}
      {...buttonProps}
    >
      <TiArrowSortedDown size={50} {...iconProps} />
    </Button>
  );
}
