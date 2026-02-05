import { FooterContainer } from "../layout/FooterContainer";
import { LongButton } from "../layout/LongButton";

export function FightButton({
  isChoosingMove,
  setIsChoosingMove,
  disabled,
}: {
  isChoosingMove: boolean;
  setIsChoosingMove: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}) {
  const switchView = () => {
    setIsChoosingMove((isChoosingMove: boolean) => !isChoosingMove);
  };

  return (
    <FooterContainer>
      <LongButton
        disabled={disabled}
        onClick={switchView}
        $noMaxWidth={true}
        color={"warning"}
      >
        {!isChoosingMove ? "Fight" : "Back"}
      </LongButton>
    </FooterContainer>
  );
}
