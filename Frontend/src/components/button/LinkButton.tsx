import React from "react";
import { Link, LinkProps } from "react-router-dom";
import styled from "styled-components";
import { LongButton, LongButtonProps } from "./LongButton";

interface LinkButtonProps {
  linkProps: LinkProps;
  buttonProps?: LongButtonProps;
  children: React.ReactNode;
}

const LinkButtonContainer = styled.div``;

export function LinkButton(props: LinkButtonProps) {
  return (
    <LinkButtonContainer>
      <Link style={{ textDecoration: "none" }} {...props.linkProps}>
        <LongButton {...props.buttonProps}>{props.children}</LongButton>
      </Link>
    </LinkButtonContainer>
  );
}
