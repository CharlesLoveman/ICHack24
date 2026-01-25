import { Button, Card, CardContent } from "@mui/material";
import { useGlobalData } from "../../hooks/useGlobalData";
import { useEffect, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import styled from "styled-components";
import { RightAlignedContainer } from "../layout/RightAlignedContainer";

const CommentaryContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function BattleCommentary({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState<number>(0);
  const { commentaryFinished, setCommentaryFinished } = useGlobalData();

  useEffect(() => {
    if (texts.length === 1) {
      setCommentaryFinished(true);
    }
  }, []);

  return (
    <>
      <Card variant="outlined">
        <CommentaryContainer>
          <CardContent>{texts[index]} </CardContent>
          {commentaryFinished === false ? (
            <>
              <RightAlignedContainer>
                <Button
                  onClick={() => {
                    if (index === texts.length - 1) {
                      setCommentaryFinished(true);
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
