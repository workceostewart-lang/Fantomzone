import "./styles.css";

const clearLegacyGameCache = () => {
  if (!window.location.hostname.endsWith("fantomzone.app")) return;

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => undefined);
  }

  if ("caches" in window) {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .catch(() => undefined);
  }
};

clearLegacyGameCache();

const games = [
  {
    title: "Gambl BlackJack",
    description: "Read the table, build your hand, and own the night at a responsive six-deck blackjack table with full casino actions and sound.",
    url: "https://gambl-blackjack.unknownfigure.chatgpt.site",
    status: "New",
    accent: "blackjack",
    image: "/gambl-blackjack-og.png"
  },
  {
    title: "Wheel of Goods",
    description: "Spin the rainbow wheel, name the top survey answers, and build a game-night fortune.",
    url: "https://wheel-of-goods.fantomzone.app",
    status: "New",
    accent: "wheel",
    image: "https://wheel-of-goods.fantomzone.app/og.png"
  },
  {
    title: "Family War",
    description: "Call the survey answers, dodge three strikes, and challenge another family on the same screen or from a private online lobby.",
    url: "https://family-war.fantomzone.app",
    status: "New",
    accent: "family",
    image: "https://family-war.fantomzone.app/family-war-og.png"
  },
  {
    title: "Gambl Roulette",
    description: "Take your seat at a premium European roulette table with live dealer prompts, casino sound, and touch-first betting.",
    url: "https://gambl-roulette.fantomzone.app",
    status: "New",
    accent: "roulette",
    image: "https://gambl-roulette.fantomzone.app/og.png"
  },
  {
    title: "Gambl Poker",
    description: "Read the table and own the pot in a premium Texas Hold'em game with CPU rivals, casino sound, a guided tutorial, and a fully visible mobile table.",
    url: "https://gambl-poker.fantomzone.app",
    status: "New",
    accent: "roulette",
    image: "https://gambl-poker.fantomzone.app/og.png"
  },
  {
    title: "Ultimate PONG!!",
    description: "Arcade paddle action with a loud neon pulse.",
    url: "https://ultimate-pong.fantomzone.app",
    status: "Live",
    accent: "cyan"
  },
  {
    title: "Grannie's Solitare",
    description: "A clean, focused Klondike card table.",
    url: "https://grannies.fantomzone.app",
    status: "Live",
    accent: "green"
  },
  {
    title: "CrossWords",
    description: "A relaxed swipe word-search with themed boards, hints, and no timer.",
    url: "https://crosswords.fantomzone.app",
    status: "Live",
    accent: "gold"
  },
  {
    title: "Meow Clicker",
    description: "Tap through ten cat worlds, unlock new skins, and purr your way to cosmic prestige.",
    url: "https://meow-clicker.fantomzone.app",
    status: "New",
    accent: "meow",
    image: "/meow-clicker-cat.png"
  },
  {
    title: "LAST MAN",
    description: "Race to empty your hand against strategic CPU rivals in a fast, colorful card showdown.",
    url: "https://last-man.fantomzone.app",
    status: "New",
    accent: "coral"
  },
  {
    title: "Fill the Hole",
    description: "A block puzzle where every piece has a place to fit.",
    url: "https://block-puzzle-fill-the-hole-attempt-dos.workceostewart.workers.dev/",
    status: "Live",
    accent: "coral"
  }
];

const upcoming = [
  "More browser games in development"
];

const artLabels = {
  "Gambl BlackJack": "READ THE TABLE",
  "Wheel of Goods": "SPIN • ANSWER • WIN",
  "Family War": "OWN THE BOARD",
  "Gambl Roulette": "PLACE YOUR BETS",
  "Gambl Poker": "OWN THE POT",
  "Ultimate PONG!!": "PONG",
  "Grannie's Solitare": "A K Q",
  CrossWords: "WORD",
  "Meow Clicker": "MEOW",
  "LAST MAN": "LAST",
  "Fill the Hole": "BLOCKS"
};

document.querySelector("#app").innerHTML = `
  <main class="shell">
    <header class="masthead" aria-label="Fantom Zone">
      <a class="brand" href="/" aria-label="Fantom Zone home">
        <span class="brand-mark" aria-hidden="true">FZ</span>
        <span>Fantom Zone</span>
      </a>
      <nav class="nav" aria-label="Primary navigation">
        <a href="#games">Games</a>
        <a href="#coming-soon">Coming Soon</a>
      </nav>
    </header>

    <section class="intro" aria-labelledby="page-title">
      <p class="kicker">Browser games, built for quick jumps in and out.</p>
      <h1 id="page-title">Pick a game and drop in.</h1>
      <p class="lede">
        Fantom Zone is the launch pad for small, polished games that run right in your browser.
      </p>
    </section>

    <section class="games-section" id="games" aria-labelledby="games-title">
      <div class="section-heading">
        <p class="section-label">Now Playing</p>
        <h2 id="games-title">Games</h2>
      </div>
      <div class="game-grid">
        ${games
          .map(
            (game) => `
              <article class="game-card ${game.accent}">
                <div class="game-art" aria-hidden="true">
                  <span>${artLabels[game.title]}</span>
                  ${game.image ? `<img src="${game.image}" alt="" loading="lazy" decoding="async" />` : ""}
                </div>
                <div class="game-copy">
                  <div class="game-meta">
                    <span>${game.status}</span>
                  </div>
                  <h3>${game.title}</h3>
                  <p>${game.description}</p>
                </div>
                <a class="play-link" href="${game.url}">Play</a>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="upcoming" id="coming-soon" aria-labelledby="upcoming-title">
      <div>
        <p class="section-label">Next</p>
        <h2 id="upcoming-title">Coming Soon</h2>
      </div>
      <div class="upcoming-list">
        ${upcoming.map((item) => `<p>${item}</p>`).join("")}
      </div>
    </section>
  </main>
`;
