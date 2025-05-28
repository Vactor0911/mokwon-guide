import { useCallback, useEffect, useState } from "react";
import { FacilityInterface } from "../utils/search";
import { Box, ClickAwayListener, Skeleton } from "@mui/material";
import { useAtom } from "jotai";
import { selectedFacilityAtom } from "../states";

interface BuildingLayoutImageProps {
  imageUrl: string;
  facilities: FacilityInterface[];
  facilityButtonsRef: React.RefObject<Record<string, SVGPolygonElement | null>>;
  facilityItemsRef: React.RefObject<Record<string, HTMLTableRowElement | null>>;
}

/**
 * 건물 배치도 이미지의 크기를 가져오는 훅
 * @param imageUrl 건물 배치도 이미지 URL
 * @returns 이미지의 크기 또는 null
 */
const useImageSize = (imageUrl: string) => {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    const handleLoad = () => {
      setSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.onload = handleLoad;
    }
  }, [imageUrl]);

  return size;
};

const BuildingLayoutViewer = (props: BuildingLayoutImageProps) => {
  const { imageUrl, facilities, facilityButtonsRef, facilityItemsRef } = props;

  const size = useImageSize(imageUrl); // 건물 배치도 이미지 크기
  const [selectedFacility, setSelectedFacility] = useAtom(selectedFacilityAtom);

  // 강제 리렌더링을 위한 state
  const [forceUpdate, setForceUpdate] = useState(0);

  // selectedFacility 변경 시 강제 리렌더링
  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [selectedFacility]);

  // 시설 버튼 클릭
  const handleFacilityButtonClick = useCallback(
    (facility: FacilityInterface) => {
      setSelectedFacility(facility);

      const facilityItem = facilityItemsRef.current[facility.id];
      facilityItem?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [facilityItemsRef, setSelectedFacility]
  );

  // 다른 곳 클릭시 선택된 시설 초기화
  const handleClickAway = useCallback(() => {
    setSelectedFacility(null);
  }, [setSelectedFacility]);

  // 이미지 크기가 아직 로드되지 않았을 때 로딩 스켈레톤 표시
  if (!size) {
    return <Skeleton variant="rectangular" width="100%" height="300px" />;
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box width="100%" position="relative">
        <svg
          viewBox={`0 0 ${size.width} ${size.height}`}
          style={{ width: "100%", display: "block", maxHeight: "70vh" }}
          preserveAspectRatio="xMidYMid meet"
          key={forceUpdate} // 강제 리렌더링 키 추가
        >
          {/* 건물 배치도 이미지 */}
          <image href={imageUrl} width={size.width} height={size.height} />

          {/* 시설 버튼 */}
          {facilities.map((facility) => {
            // path 데이터가 없는 경우 렌더링하지 않음
            if (!facility.path || facility.path.length === 0) return null;

            return (
              <polygon
                key={facility.id}
                width={size.width}
                height={size.height}
                points={facility.path.join()}
                fill="transparent"
                stroke={selectedFacility?.id === facility.id ? "red" : "none"}
                strokeWidth="3"
                onClick={() => handleFacilityButtonClick(facility)}
                ref={(elem: SVGPolygonElement | null) => {
                  facilityButtonsRef.current[facility.id] = elem;
                }}
                css={{
                  pointerEvents: "all",
                  cursor: "pointer",
                  "&:hover": {
                    stroke: "red",
                  },
                }}
              />
            );
          })}
        </svg>
      </Box>
    </ClickAwayListener>
  );
};

export default BuildingLayoutViewer;
