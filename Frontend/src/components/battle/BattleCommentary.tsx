import { Button, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import styled from "styled-components";
import { RightAlignedContainer } from "../layout/RightAlignedContainer";

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
                <Button
                  onClick={() => {
                    console.log(index);
                    if (index === texts.length - 1) {
                      onCommentaryEnd?.();
                    } else {
                      setIndex((index) => index + 1);
                    }
                  }}
                  variant="text"
                  style={{ margin: 0, padding: 0, color: "black" }}
                >
                  <TiArrowSortedDown size={50} />
                </Button>
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
