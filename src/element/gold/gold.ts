import $ from "jquery";
import "./gold.css";
import { addObject, removeObject, getRingState } from "./../ring/ring.ts";
import { enemies} from "./../enemy/enemy.ts";
import { player} from "./../player/player.ts";

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

export let golds = [];
export let goldsBehindId = [];
export let goldCarriers = [];


export function goldInit(){
    checkGold();
    claimGold();
    }

export function drawGold(row: number, col: number, id: number) {
  const OBJECT_ID = 6;
  const $gold = $("<img>")
    .attr("id", "gold" + id)
    .attr("src", "./src/element/gold/gold.png") // Set the source of the image
    .addClass("gold");
  const gold: Gold = new Gold(row, col, id);
  golds[id] = gold;
  goldsBehindId[id] = getRingState(row, col);
  addObject($gold, row, col, OBJECT_ID);
}

export function resetGold(
  row: number,
  col: number,
  id: number,
  targetId: number
) {
  const $gold = $("#gold" + id).remove();
  removeObject($gold, row, col, targetId);
}

export function deleteGold(id) {
  golds = golds.filter((gold) => gold.id !== id);
  goldCarriers = goldCarriers.filter((item) => item.goldId !== id);
}

function claimGold() {
  golds.forEach((gold, index) => {
    if (gold.row === player.row && gold.col === player.col) {
      resetGold(gold.row, gold.col, gold.id, goldsBehindId[gold.id]);
      deleteGold(gold.id);
    }
  });
}

function checkGold() {
  enemies.forEach((enemy, eId) => {
    golds.forEach((gold, gId) => {
        const paired = goldCarriers.some(item => item.goldId === gold.id && item.enemyId === enemy.id);
        if (paired){carryGold(enemy, gold);};

        const notPaired = goldCarriers.some(item => item.goldId === gold.id || item.enemyId === enemy.id);
        if (enemy.row === gold.row && enemy.col === gold.col && !notPaired){
            pickupGold(enemy, gold);
            };
        });
  });
}

function pickupGold(enemy,gold){
    resetGold(gold.row, gold.col, gold.id, 4);
    golds[gold.id].row --;
    drawGold(golds[gold.id].row, golds[gold.id].col, gold.id)
    const carrier = {goldId:gold.id, enemyId:enemy.id}
    goldCarriers.push(carrier);

    }

function carryGold(enemy, gold){
    resetGold(gold.row, gold.col, gold.id, goldsBehindId[gold.id]);
    golds[gold.id].row = enemy.row -1;
    golds[gold.id].col = enemy.col;
    drawGold(golds[gold.id].row, golds[gold.id].col, gold.id)
    }