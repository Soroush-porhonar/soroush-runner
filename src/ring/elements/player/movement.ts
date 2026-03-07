/*export const heldKeys = {};

function fakeEvent(code: number): JQuery.Event {
  return { which: code };
}

export function repeatTouchInput() {
  for (const code in heldKeys) {
    if (heldKeys[code]) {
      body_keydown(fakeEvent(Number(code)));
    }
  }
}

$(document).ready(function () {
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (!isMobile) return;

  const $root = $("#app").length ? $("#app") : $("body");
  const $controls = $("<div>", { id: "mobile-controls" });

  const btn = (label: string, keyCode: number) =>
    $("<button>", { text: label, "data-keycode": keyCode });

  const $dpad = $("<div>", { class: "dpad" }).append(
    $('<div class="row center">').append(btn("▲", 38)),
    $('<div class="row">').append(
      btn("◀", 37),
      $('<div class="spacer">'),
      btn("▶", 39),
    ),
    $('<div class="row center">').append(btn("▼", 40)),
  );

  const $actions = $("<div>", { class: "actions" })
    .append(btn("Q", 81))
    .append(btn("E", 69));

  $controls.append($dpad, $actions);
  $root.append($controls);

  $controls.find("button").on("touchstart", function (e) {
    e.preventDefault();
    const code = Number($(this).data("keycode"));
    heldKeys[code] = true;
    $(this).addClass("pressed");
    body_keydown(fakeEvent(code));
  });

  $controls.find("button").on("touchend touchcancel", function (e) {
    e.preventDefault();
    const code = Number($(this).data("keycode"));
    heldKeys[code] = false;
    $(this).removeClass("pressed");
    body_keyup(fakeEvent(code));
  });

  repeatTouchInput();
});
*/
