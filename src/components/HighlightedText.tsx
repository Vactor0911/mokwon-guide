import { keyframes, Stack, Typography, TypographyProps } from "@mui/material";
import { theme } from "../theme";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

interface HighlightedTextProps extends TypographyProps {
  text: string;
  keyword: string;
  className?: string;
}

const HighLightedText = (props: HighlightedTextProps) => {
  const { text, keyword, className, variant, color } = props;

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

  const overflowedWitdh = useMemo(
    () => childWidth - containerWidth,
    [childWidth, containerWidth]
  ); // 오버플로우된 너비

  const movingAnimation = useMemo(
    () =>
      keyframes({
        "0%": { transform: "translateX(0px)" },
        "50%": { transform: `translateX(-${overflowedWitdh}px)` },
        "100%": { transform: `translateX(-${overflowedWitdh}px)` },
      }),
    [overflowedWitdh]
  );

  const hasKeyword = useCallback(() => {
    // 키워드가 없다면
    if (!keyword) {
      return false;
    }

    // 텍스트 내에 키워드가 포함되어 있는지 확인
    const formattedText = text.toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, "");
    const formattedKeyword = keyword
      .toLowerCase()
      .replace(/[^a-zA-Z0-9가-힣]/g, "");
    return formattedText.includes(formattedKeyword);
  }, [keyword, text]);

  // 렌더링할 텍스트 요소
  const content = useMemo(() => {
    // 키워드가 없거나 키워드가 포함되지 않으면 원본 텍스트 그대로 반환
    if (!keyword || !hasKeyword()) {
      return text;
    }

    // 키워드에 맞게 텍스트 분할
    const splittedText: React.ReactNode[] = [];
    let keywordIndex = 0;
    let temp = "";
    let matchKeyword = true;
    const loweredText = text.toLowerCase();
    const loweredKeyword = keyword.toLowerCase();

    for (let i = 0; i < text.length; i++) {
      // 텍스트와 키워드 비교
      const isEqual = loweredText[i] === loweredKeyword[keywordIndex];

      if (isEqual === matchKeyword) {
        // 키워드 인덱스 증가
        if (matchKeyword) {
          keywordIndex++;
        }
      } else {
        // 일치하지 않는 경우
        if (temp) {
          splittedText.push(
            <span
              key={`highlighted-text-${splittedText.length}`}
              style={{
                color: matchKeyword ? theme.palette.primary.main : "inherit",
              }}
            >
              {temp}
            </span>
          );
          temp = "";
        }
        matchKeyword = !matchKeyword;

        if (isEqual) {
          keywordIndex++;
        }
      }

      temp += text[i];
    }

    // 마지막 남은 텍스트 처리
    if (temp) {
      splittedText.push(
        <span
          key={`highlighted-text-${splittedText.length}`}
          style={{
            color: matchKeyword ? theme.palette.primary.main : "inherit",
          }}
        >
          {temp}
        </span>
      );
    }

    return splittedText;
  }, [hasKeyword, keyword, text]);

  return (
    // 스크롤 루트 컨테이너
    <Stack ref={containerRef} direction="row" overflow="hidden">
      <Typography
        ref={childRef}
        className={className}
        whiteSpace="nowrap"
        variant={variant}
        color={color}
        sx={{
          "&.scroll-text-active": {
            animation: `${movingAnimation} ${
              overflowedWitdh / 50
            }s linear infinite`,
          },
        }}
      >
        {content}
      </Typography>
    </Stack>
  );
};

export default HighLightedText;
