import { FooterContainer } from "../layout/FooterContainer";
import { LinkButton } from "../layout/LinkButton";

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
