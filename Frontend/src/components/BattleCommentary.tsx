import { Button, Card, CardContent } from "@mui/material";
import { useGlobalData } from "../hooks/useGlobalData";
import { useEffect, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { RightAlignedContainer } from "./PokemonMoveDisplay";

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
        Battle Summary
        <div style={{ display: "flex", flexDirection: "row" }}>
          <CardContent>{texts[index]} </CardContent>
          {commentaryFinished === false ? (
            <div
              style={{
                float: "right",
                right: "0",
                marginLeft: "auto",
              }}
            >
              <RightAlignedContainer
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
              </RightAlignedContainer>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Card>
    </>
  );
}
