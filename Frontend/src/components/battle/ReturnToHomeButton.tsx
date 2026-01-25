import { FooterContainer } from "../layout/FooterContainer";
import { LinkButton } from "../LinkButton";

export function ReturnToHomeButton() {
  return (
    <FooterContainer>
      <LinkButton
        linkProps={{ to: `../MainScreen` }}
        buttonProps={{ color: "info", noMaxWidth: true }}
      >
        Return to home
      </LinkButton>
    </FooterContainer>
  );
}
