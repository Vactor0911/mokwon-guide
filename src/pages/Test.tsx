import { Box, Stack } from "@mui/material";
import Map from "/images/map.png";
import Nodes from "../assets/nodes.json";

const Test = () => {
  return (
    <Stack alignItems="center">
      <Box position="relative">
        <Box
          component="img"
          src={Map}
          position="absolute"
          left={0}
          top={0}
          width="2160px"
          height="3840px"
        />

        <Box
          position="absolute"
          left={0}
          top={0}
          width="2160px"
          height="3840px"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            console.log(
              `Clicked position: lat=${(3840 - Math.round(y)) * 0.25}, lng=${Math.round(x) * 0.25}`
            );
          }}
          sx={{
            cursor: "crosshair",
            zIndex: 20,
          }}
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2160 3840"
          width="2160px"
          height="3840px"
          css={{
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* 선 */}
          {Nodes.map((node) => [
            ...node.neighbors.map((neighbor) => {
              const neighborNode = Nodes.find((n) => n.id === neighbor.id);
              if (!neighborNode) return null;
              return (
                <>
                  <line
                    key={`line-${node.id}-${neighborNode.id}`}
                    x1={node.position[1] * 4}
                    y1={Math.abs(3840 - node.position[0] * 4)}
                    x2={neighborNode.position[1] * 4}
                    y2={Math.abs(3840 - neighborNode.position[0] * 4)}
                    stroke={
                      neighborNode.neighbors.find((n) => n.id === node.id)
                        ? "aqua"
                        : "red"
                    }
                    strokeWidth="1"
                  />

                  <text
                    key={`label-${neighborNode.id}`}
                    x={
                      (neighborNode.position[1] * 4 + node.position[1] * 4) *
                      0.5
                    }
                    y={
                      (Math.abs(3840 - neighborNode.position[0] * 4) +
                        Math.abs(3840 - node.position[0] * 4)) *
                      0.5
                    }
                    fontSize="10"
                    textAnchor="middle"
                    fill="magenta"
                  >
                    {neighbor.distance}
                  </text>
                </>
              );
            }),
          ])}

          {/* 노드 */}
          {Nodes.map((node) => [
            <text
              key={`label-${node.id}`}
              x={node.position[1] * 4 - 5}
              y={Math.abs(3840 - node.position[0] * 4 - 5)}
              fontSize="12"
              textAnchor="middle"
              fill={node.id >= 900 ? "yellow" : "orange"}
            >
              {node.id}
            </text>,

            <circle
              key={`node-${node.id}`}
              cx={node.position[1] * 4}
              cy={Math.abs(3840 - node.position[0] * 4)}
              r="5"
              fill="aqua"
              css={{
                "&:hover": {
                  fill: "blue",
                },
              }}
              onClick={() => {
                console.log(`Node ${node.id} => ${node.neighbors.join(", ")}`);
              }}
            />,
          ])}
        </svg>
      </Box>
    </Stack>
  );
};

export default Test;
