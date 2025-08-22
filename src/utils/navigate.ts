// ---------- 타입 정의 ----------
export interface Neighbor {
  id: number;
  distance?: number;
}

export interface Node {
  id: number;
  position: number[]; // [x, y]
  neighbors: Neighbor[];
}

export interface NodeMap {
  [id: number]: Node;
}

export interface PathResult {
  positions: number[][]; // 출발 좌표 + 경유 노드 positions
  distance: number; // 총 거리
}

// ---------- 유틸 ----------
const hypot2D = (ax: number, ay: number, bx: number, by: number): number => {
  const dx = ax - bx,
    dy = ay - by;
  return Math.hypot(dx, dy);
};

const indexNodes = (nodes: Node[]): NodeMap => {
  const map: NodeMap = {};
  for (const n of nodes) map[n.id] = n;
  return map;
};

/** 출발 좌표와 가장 가까운 노드 */
export function findNearestNode(
  nodes: Node[],
  startXY: [number, number]
): { node: Node | null; dist: number } {
  let best: Node | null = null;
  let bestD = Infinity;
  for (const n of nodes) {
    const d = hypot2D(startXY[0], startXY[1], n.position[0], n.position[1]);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  return { node: best, dist: bestD };
}

/** 엣지 비용: distance 있으면 사용, 없으면 좌표 거리 */
const edgeCost = (a: Node, b: Node, nbEntry: Neighbor): number =>
  typeof nbEntry.distance === "number"
    ? nbEntry.distance
    : hypot2D(a.position[0], a.position[1], b.position[0], b.position[1]);

/** A* 휴리스틱: 좌표 직선거리 */
const heuristic = (a: Node, goal: Node): number =>
  hypot2D(a.position[0], a.position[1], goal.position[0], goal.position[1]);

// ---------- 우선순위 큐 ----------
class PriorityQueue<T> {
  private h: { item: T; pri: number }[] = [];

  push(item: T, pri: number) {
    const a = this.h;
    a.push({ item, pri });
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].pri <= a[i].pri) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }

  pop(): T | null {
    const a = this.h;
    if (!a.length) return null;
    const top = a[0];
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      this._down(0);
    }
    return top.item;
  }

  private _down(i: number) {
    const a = this.h,
      n = a.length;
    while (true) {
      let s = i;
      const l = i * 2 + 1;
      const r = l + 1;

      if (l < n && a[l].pri < a[s].pri) s = l;
      if (r < n && a[r].pri < a[s].pri) s = r;
      if (s === i) break;
      [a[i], a[s]] = [a[s], a[i]];
      i = s;
    }
  }

  size(): number {
    return this.h.length;
  }
}

// ---------- A* ----------
/**
 * A* 알고리즘
 * @returns path와 distance 또는 null
 */
export function aStar(
  nodes: Node[],
  startId: number,
  goalId: number
): { path: Node[]; distance: number } | null {
  const map = indexNodes(nodes);
  const start = map[startId],
    goal = map[goalId];
  if (!start || !goal) return null;

  const open = new PriorityQueue<number>();
  const g = new Map<number, number>();
  const f = new Map<number, number>();
  const prev = new Map<number, number | null>();
  const closed = new Set<number>();

  for (const n of nodes) {
    g.set(n.id, Infinity);
    f.set(n.id, Infinity);
    prev.set(n.id, null);
  }

  g.set(start.id, 0);
  f.set(start.id, heuristic(start, goal));
  open.push(start.id, f.get(start.id)!);

  while (open.size()) {
    const curId = open.pop();
    if (curId == null) break;
    if (closed.has(curId)) continue;
    closed.add(curId);

    if (curId === goal.id) {
      // 경로 복원
      const pathIds: number[] = [];
      let k: number | null = curId;
      while (k != null) {
        pathIds.push(k);
        k = prev.get(k) ?? null;
      }
      pathIds.reverse();
      const path = pathIds.map((id) => map[id]);
      return { path, distance: g.get(goal.id)! };
    }

    const cur = map[curId];
    for (const nb of cur.neighbors || []) {
      const to = map[nb.id];
      if (!to) continue;

      const currentG = g.get(curId)!; // 항상 값이 있음
      const cand = currentG + edgeCost(cur, to, nb);

      if (cand < g.get(to.id)!) {
        g.set(to.id, cand);
        prev.set(to.id, curId);
        const pri = cand + heuristic(to, goal);
        f.set(to.id, pri);
        open.push(to.id, pri);
      }
    }
  }
  return null;
}

// ---------- 최종 함수 ----------
/**
 * 출발 좌표에서 최근접 노드를 경유하여 목표 노드까지 최단 경로
 * @returns PathResult | null
 */
export function findShortestPath(
  startXY: [number, number],
  goalId: number,
  nodes: Node[]
): PathResult | null {
  const { node: nearest, dist: snapDist } = findNearestNode(nodes, startXY);
  if (!nearest) return null;

  const res = aStar(nodes, nearest.id, goalId);
  if (!res) return null;

  const positions: number[][] = [startXY, ...res.path.map((n) => n.position)];
  const distance = snapDist + res.distance;

  return { positions, distance };
}
