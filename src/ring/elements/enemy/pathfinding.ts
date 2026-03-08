import { Enemy } from "./enemy.ts";
import type { Player } from "../player/player.ts";
import { Empty, ObjectId } from "../../ring";
import type { Stage } from "../../../common/stage.ts";
export type Pos = { row: number; col: number };
type Node = Pos & { parent: Node | null };
import { Hole } from "../hole/hole.ts";

export class Bfs {
  constructor(private stage: Stage) {}
  private isEmpty(r: number, c: number): boolean {
    return this.stage.getMapElement(r, c)?.Id === ObjectId.Empty;
  }

  public isHole(r: number, c: number): boolean {
    return this.stage.getMapElement(r, c) instanceof Hole;
  }

  private isSolid(r: number, c: number): boolean {
    return (
      this.stage.getMapElement(r, c)?.Id === ObjectId.Soil ||
      this.stage.getMapElement(r - 1, c)?.Id === ObjectId.Bar ||
      this.stage.getMapElement(r, c)?.Id === ObjectId.Ladder ||
      this.stage.getMapElement(r, c)?.Id === ObjectId.Hole
    );
  }
  private isLadder(r: number, c: number): boolean {
    return this.stage.getMapElement(r, c)?.Id === ObjectId.Ladder;
  }
  private isBar(r: number, c: number): boolean {
    return this.stage.getMapElement(r, c)?.Id === ObjectId.Bar;
  }
  public isEnemy(r: number, c: number): boolean {
    return this.stage.getRingElement(r, c) instanceof Enemy;
  }
  private forcedFallCondition(r: number, c: number) {
    const underbox = this.isEmpty(r + 1, c) || this.isBar(r + 1, c);
    const box = !this.isLadder(r, c) && !this.isBar(r, c) && !this.isHole(r, c);
    return underbox && box;
  }
  private HorizonMoveCondition(r: number, c: number) {
    return this.isEmpty(r, c) || this.isBar(r, c) || this.isLadder(r, c);
  }
  private dropBarCondition(r: number, c: number) {
    return this.isBar(r, c) && this.isEmpty(r + 1, c);
  }

  private getNeighbors(node: Pos): Pos[] {
    const r = node.row;
    const c = node.col;
    const neighbors: Pos[] = [];

    /* ========= FORCED FALL (not ladder, not bar) ========= */
    if (this.forcedFallCondition(r, c)) {
      neighbors.push({ row: r + 1, col: c });
      return neighbors;
    }

    /* ========= BAR MOVEMENT ========= */
    if (this.isBar(r, c)) {
      // left / right on bar
      if (this.HorizonMoveCondition(r, c - 1))
        neighbors.push({ row: r, col: c - 1 });
      if (this.HorizonMoveCondition(r, c + 1))
        neighbors.push({ row: r, col: c + 1 });

      // drop from bar
      if (this.dropBarCondition(r, c)) {
        neighbors.push({ row: r + 1, col: c });
      }

      return neighbors; // bar blocks other logic
    }

    /* ========= NORMAL GROUND / LADDER ========= */
    const grounded = this.isSolid(r + 1, c) || this.isLadder(r, c);
    if (grounded) {
      if (this.HorizonMoveCondition(r, c - 1))
        neighbors.push({ row: r, col: c - 1 });
      if (this.HorizonMoveCondition(r, c + 1))
        neighbors.push({ row: r, col: c + 1 });
    }

    /* ========= UP (ladder only) ========= */

    if (this.isLadder(r, c)) {
      neighbors.push({ row: r - 1, col: c });
    }
    if (this.isLadder(r + 1, c)) {
      neighbors.push({ row: r + 1, col: c });
    }
    if (this.isHole(r, c)) {
      neighbors.push({ row: r - 1, col: c });
    }

    return neighbors;
  }

  public findNextStepBFS(enemy: Enemy, player: Player): Pos | null {
    const start: Pos = { row: enemy.Row, col: enemy.Col };
    let goal: Pos = { row: player.Row, col: player.Col };

    for (
      let i = 0;
      this.stage.getMapElement(player.Row + i, player.Col) instanceof Empty;
      i++
    ) {
      goal = { row: player.Row + i, col: player.Col };
    }

    const queue: Node[] = [];
    const visited = Array.from({ length: this.stage.get_RingRow }, () =>
      Array(this.stage.get_RingCol).fill(false),
    );

    queue.push({ ...start, parent: null });
    visited[start.row][start.col] = true;

    let endNode: Node | null = null;

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.row === goal.row && current.col === goal.col) {
        endNode = current;

        break;
      }
      if (this.getNeighbors(current) === undefined) continue;
      const neighbors = this.getNeighbors(current);

      for (const n of neighbors) {
        if (!this.stage.checkBorders(n.row, n.col)) continue;
        if (visited[n.row][n.col]) continue;

        visited[n.row][n.col] = true;
        queue.push({
          row: n.row,
          col: n.col,
          parent: current,
        });
      }
    }

    if (!endNode) return null;

    /* ===== backtrack to first step ===== */
    let cur = endNode;
    while (cur.parent && cur.parent.parent) {
      cur = cur.parent;
    }
    if (
      this.isHole(enemy.Row + 1, enemy.Col) &&
      !this.isEnemy(enemy.Row + 1, enemy.Col)
    )
      return { row: enemy.Row + 1, col: enemy.Col };
    return { row: cur.row, col: cur.col };
  }
}
