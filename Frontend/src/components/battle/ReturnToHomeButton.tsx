import { LinkButton } from "../button/LinkButton";
import { FooterContainer } from "../layout/FooterContainer";

export function ReturnToHomeButton() {
  return (
    <FooterContainer>
      <LinkButton
        linkProps={{ to: `../home` }}
        buttonProps={{ color: "info", $noMaxWidth: true }}
      >
        Return to home
      </LinkButton>
    </FooterContainer>
  );
}
