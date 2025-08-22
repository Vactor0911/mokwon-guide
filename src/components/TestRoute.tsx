import { useSetAtom } from "jotai";
import nodes from "../assets/nodes.json";
import { findShortestPath } from "../utils/navigate";
import { pathAtom } from "../states";
import { useEffect } from "react";

const TestRoute = () => {
  const setPath = useSetAtom(pathAtom);

  const startXY: [number, number] = [1050, 2942];
  const goalId = 95;

  useEffect(() => {
    const result = findShortestPath(startXY, goalId, nodes);
    console.log(result);

    if (result) {
      console.log("총 거리:", result.distance.toFixed(2));
      console.log("경로 좌표들:", result.positions);

      const newPath = {
        path: result.positions,
        distance: result.distance,
      };
      setPath(newPath);
    } else {
      console.log("경로를 찾을 수 없습니다.");
    }
  }, []);

  return <></>;
};

export default TestRoute;
