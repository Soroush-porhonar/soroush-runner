import $ from "jquery";
import "./gold.css";
import { addObject, removeObject } from "./../ring/ring.ts";
import { enemies, Enemy } from "./../enemy/enemy.ts";
import { player } from "./../player/player.ts";
import { getMapId } from "./../enemy/pathfinding.ts";

export class Gold {
  row: number;
  col: number;
  id: number;
  constructor(row: number, col: number, id: number) {
    this.row = row;
    this.col = col;
    this.id = id;
  }
}

export let golds: Gold[];
interface Carrier {
  goldId: number;
  enemyId: number;
}

export let goldCarriers: Carrier[];

export function goldInit(): void {
  golds = [];
  goldCarriers = [];
}

export function goldRepeat(): void {
  checkGold();
  claimGold();
}

export function drawGold(row: number, col: number, id: number): void {
  const OBJECT_ID = 6;
  const $gold = $("<img>")
    .attr("id", "gold" + id)
    .attr("src", "./src/element/gold/gold.png") // Set the source of the image
    .addClass("gold");
  const gold: Gold = new Gold(row, col, id);
  golds[id] = gold;
  const goldElement: HTMLDivElement = $gold.get(0) as HTMLDivElement;
  addObject(goldElement, row, col, OBJECT_ID);
}

export function resetGold(
  row: number,
  col: number,
  id: number,
  targetId: number,
) {
  const $gold = $("#gold" + id).remove();
  const goldElement: HTMLDivElement = $gold.get(0) as HTMLDivElement;
  removeObject(goldElement, row, col, targetId);
}

export function deleteGold(id: number): void {
  golds = golds.filter((gold: Gold) => gold.id !== id);
  goldCarriers = goldCarriers.filter((item: Carrier) => item.goldId !== id);
}

function claimGold(): void {
  const gold: Gold | undefined = golds.find(
    (g) => g.row === player.row && g.col === player.col,
  );
  if (gold) {
    resetGold(gold.row, gold.col, gold.id, getMapId(gold.row, gold.col));
    deleteGold(gold.id);
  }
}

function checkGold(): void {
  enemies.forEach((enemy): void => {
    golds.forEach((gold): void => {
      const paired: boolean = goldCarriers.some(
        (item) => item.goldId === gold.id && item.enemyId === enemy.id,
      );
      if (paired) {
        carryGold(enemy, gold);
      }

      const notPaired: boolean = goldCarriers.some(
        (item) => item.goldId === gold.id || item.enemyId === enemy.id,
      );
      if (enemy.row === gold.row && enemy.col === gold.col && !notPaired) {
        pickupGold(enemy, gold);
      }
    });
  });
}

function pickupGold(enemy: Enemy, gold: Gold): void {
  resetGold(gold.row, gold.col, gold.id, getMapId(gold.row, gold.col));
  golds[gold.id].row--;
  drawGold(golds[gold.id].row, golds[gold.id].col, gold.id);
  const carrier: Carrier = { goldId: gold.id, enemyId: enemy.id };
  goldCarriers.push(carrier);
}

function carryGold(enemy: Enemy, gold: Gold): void {
  resetGold(gold.row, gold.col, gold.id, getMapId(gold.row, gold.col));
  drawGold(enemy.row - 1, enemy.col, gold.id);
}
