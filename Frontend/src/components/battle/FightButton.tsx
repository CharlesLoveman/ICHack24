import { FooterContainer } from "../layout/FooterContainer";
import { LongButton } from "../LongButton";

export function FightButton({
  isChoosingMove,
  setIsChoosingMove,
}: {
  isChoosingMove: boolean;
  setIsChoosingMove: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const switchView = () => {
    setIsChoosingMove((isChoosingMove: boolean) => !isChoosingMove);
  };

  return (
    <FooterContainer>
      <LongButton onClick={switchView} noMaxWidth={true} color={"warning"}>
        {!isChoosingMove ? "Fight" : "Back"}
      </LongButton>
    </FooterContainer>
  );
}
