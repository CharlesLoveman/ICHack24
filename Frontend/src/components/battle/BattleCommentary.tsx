import { Card, CardContent } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { RightAlignedContainer } from "../layout/RightAlignedContainer";
import { DownArrowButton } from "../button/DownArrowButton";

const CommentaryContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

/* Performs an action when you click the arrow on the _final_ text (not penultimate!) */
export default function BattleCommentary({
  texts,
  onCommentaryEnd,
  hideArrowOnLast = true,
}: {
  texts: string[];
  onCommentaryEnd?: () => void;
  hideArrowOnLast?: boolean;
}) {
  const [index, setIndex] = useState<number>(0);

  return (
    <>
      <Card variant="outlined">
        <CommentaryContainer>
          <CardContent>{texts[index]}</CardContent>
          {!(hideArrowOnLast && index === texts.length - 1) ? (
            <>
              <RightAlignedContainer>
                <DownArrowButton
                  buttonProps={{
                    onClick: () => {
                      if (index === texts.length - 1) {
                        onCommentaryEnd?.();
                      } else {
                        setIndex((index) => index + 1);
                      }
                    },
                  }}
                ></DownArrowButton>
              </RightAlignedContainer>
            </>
          ) : (
            <></>
          )}
        </CommentaryContainer>
      </Card>
    </>
  );
}
