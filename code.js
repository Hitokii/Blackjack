var DECK_id = null;
var current_score = 0;
var bot_score = 0;

// get_deck() returns a promise that resolves to the deck id
async function get_deck() {
  if (DECK_id) {
    return DECK_id;
  }
  const response = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  );
  const data = await response.json();
  DECK_id = data.deck_id;
  return DECK_id;
}

// get_card(number) returns a promise that resolves to the card
async function get_card(number) {
  const deck_id = await get_deck();
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${number}`
  );
  const data = await response.json();
  for (let i = 0; i < data.cards.length; i++) {
    console.log(data.cards[i].value);
  }
}

// get card image with number parameter and add it to the page
async function get_card_image(number) {
  const deck_id = await get_deck();
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${number}`
  );
  const data = await response.json();
  for (let i = 0; i < data.cards.length; i++) {
    if (data.cards[i].value === "JACK") data.cards[i].value = 10;
    if (data.cards[i].value === "QUEEN") data.cards[i].value = 10;
    if (data.cards[i].value === "KING") data.cards[i].value = 10;
    if (data.cards[i].value === "ACE") data.cards[i].value = 11;
    current_score = current_score + parseInt(data.cards[i].value);
    const card_image = data.cards[i].image;
    const img = document.createElement("img");
    img.src = card_image;
    document.body.appendChild(img);
  }
  change_h1();
  await check_result();
}

// change h1 text to "blackjack, your score is : current_score"
async function change_h1() {
  const h1 = document.querySelector("h1");
  h1.innerText = `Blackjack, your score is : ${current_score}`;
}

// check_result() checks if the player has won or lost change title to "you won" or "you lost"
async function check_result() {
  if (current_score > 21) {
    const h1 = document.querySelector("h1");
    h1.innerText = `You lost, you got ${current_score}`;
    remove_buttons();
    reload();
  }
  if (current_score === 21) {
    const h1 = document.querySelector("h1");
    h1.innerText = `You won, you got blackjack`;
    remove_buttons();
    reload();
  }
}

// bot() is the bot that plays against the player
async function bot() {
  while (bot_score < 17) {
    const deck_id = await get_deck();
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`
    );
    const data = await response.json();
    if (data.cards[0].value === "JACK") data.cards[0].value = 10;
    if (data.cards[0].value === "QUEEN") data.cards[0].value = 10;
    if (data.cards[0].value === "KING") data.cards[0].value = 10;
    if (data.cards[0].value === "ACE") data.cards[0].value = 11;
    bot_score = bot_score + parseInt(data.cards[0].value);
    // show the bot card on the page before breaking one line only
    const card_image = data.cards[0].image;
    const img = document.createElement("img");
    img.src = card_image;
    document.body.appendChild(img);
  }
  if (bot_score > 21) {
    const h1 = document.querySelector("h1");
    h1.innerText = `You won, the bot got ${bot_score}`;
    remove_buttons();
    reload();
  }
  if (bot_score > current_score && bot_score < 21) {
    const h1 = document.querySelector("h1");
    h1.innerText = `You lost, the bot got ${bot_score}`;
    remove_buttons();
    reload();
  }
  if (bot_score < current_score) {
    const h1 = document.querySelector("h1");
    h1.innerText = `You won, the bot got ${bot_score}`;
    remove_buttons();
    reload();
  }
  if (bot_score === current_score) {
    const h1 = document.querySelector("h1");
    h1.innerText = `You tied, the bot got ${bot_score}`;
    remove_buttons();
    reload();
  }
}

// stop function that add a horizontal divider an h2 "the bot :" and start bot()
async function stop() {
  const hr = document.createElement("hr");
  const h2 = document.createElement("h2");
  h2.innerText = "The bot :";
  document.body.appendChild(hr);
  document.body.appendChild(h2);
  await bot();
}

async function reload() {
  setTimeout(function () {
    location.reload();
  }, 2000);
}

// remove every input type button in html
async function remove_buttons() {
  const buttons = document.querySelectorAll("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.display = "none";
  }
}

async function main() {
  await get_deck();
  get_card_image(2);
}
main();
