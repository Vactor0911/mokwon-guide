import { Color, Stack, Typography, TypographyVariant } from "@mui/material";
import { theme } from "../theme";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface HighlightedTextProps {
  text: string;
  keyword: string;
  variant: TypographyVariant;
  baseColor: string | Color;
  className?: string;
}

const HighLightedText = (props: HighlightedTextProps) => {
  const { text, keyword, variant, baseColor, className } = props;

  // 키워드 기반 하이라이트 할 문자 인덱스 추출
  const [results, setResults] = useState<boolean[]>([]);

  useEffect(() => {
    let counter = 0;
    const newResults: boolean[] = [];

    for (let i = 0; i < text.length; i++) {
      const isMatched =
        text.charAt(i).trim().toLowerCase() ===
        keyword.charAt(counter).toLowerCase();
      newResults.push(isMatched);
      if (isMatched) {
        counter++;
      }
    }

    setResults(newResults);
  }, [keyword, text]);

  // container와 child 텍스트의 너비를 측정하기 위한 ref
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [childWidth, setChildWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // 텍스트 변경시 컨테이너 너비 업데이트
  useLayoutEffect(() => {
    if (childRef.current && containerRef.current) {
      setChildWidth(childRef.current.clientWidth);
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [text]);

  const overflow = childWidth > containerWidth;

  // 렌더링할 텍스트 요소
  const content = text.split("").map((char, index) => (
    <Typography
      key={`search-result-${text}-${index}`}
      variant={variant}
      sx={{
        color: results[index] ? theme.palette.primary.main : String(baseColor),
      }}
    >
      {char}
    </Typography>
  ));

  return (
    // 스크롤 루트 컨테이너
    <Stack
      ref={containerRef}
      direction="row"
      overflow="hidden"
      sx={{ position: "relative" }}
    >
      {/* 스크롤 대상 컨테이너 */}
      <Stack
        className={overflow ? className : ""}
        direction="row"
        sx={{
          display: "flex",
          width: overflow ? childWidth * 2 : "auto",
          ...(overflow && {
            "@keyframes movingAnimation": {
              from: { transform: "translateX(0px)" },
              to: { transform: `translateX(calc(-${childWidth}px - 32px))` },
            },
          }),
        }}
      >
        {/* 원본 텍스트 */}
        <Stack ref={childRef} direction="row" sx={{ flexShrink: 0 }}>
          {content}
        </Stack>

        {/* 오버플로우시 보여질 복제 텍스트 */}
        {overflow && (
          <Stack direction="row" ml="32px" sx={{ flexShrink: 0 }}>
            {content}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default HighLightedText;
