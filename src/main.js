import "./styles.css";

document.documentElement.dataset.hubRevision = "2026-07-29-billiards-champion";

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
    slug: "billiards-champion",
    title: "Billiards Champion",
    description: "Read every bank, control your spin, and own a fully visible 8-ball table in solo practice, versus CPU, or multiplayer rooms.",
    url: "/games/billiards-champion/index.html",
    status: "New",
    accent: "billiards",
    image: "/billiards-champion-cover.png",
    imageLoading: "eager"
  },
  {
    slug: "last-man",
    title: "LAST MAN",
    description: "Enter an enchanted card realm, outplay fair CPU rivals, call your final card, and become the LAST MAN standing on desktop or mobile.",
    url: "https://last-man.fantomzone.app",
    status: "Remastered",
    accent: "lastman",
    image: "/last-man-cover.jpg",
    imageLoading: "eager"
  },
  {
    slug: "golf-masters",
    title: "Golf Masters",
    description: "Read the green, bank around shifting obstacles, and master more than 1,500 puzzle-first golf courses on desktop or mobile.",
    url: "https://golf-masters.fantomzone.app",
    status: "New",
    accent: "golf",
    image: "/golf-masters-cover-20260729.png",
    imageLoading: "eager"
  },
  {
    slug: "gambl-blackjack",
    title: "Gambl BlackJack",
    description: "Read the table, build your hand, and own the night at a responsive six-deck blackjack table with full casino actions and sound.",
    url: "https://gambl-blackjack.unknownfigure.chatgpt.site",
    status: "New",
    accent: "blackjack",
    image: "/gambl-blackjack-og.png"
  },
  {
    slug: "wheel-of-goods",
    title: "Wheel of Goods",
    description: "Spin the rainbow wheel, call letters to reveal the puzzle, and solve the phrase before your rivals.",
    url: "https://wheel-of-goods.unknownfigure.chatgpt.site",
    status: "New",
    accent: "wheel",
    image: "/wheel-of-goods-cover-20260727.png",
    imageLoading: "eager"
  },
  {
    slug: "family-war",
    title: "Family War",
    description: "Call the survey answers, dodge three strikes, and challenge another family on the same screen or from a private online lobby.",
    url: "https://family-war.fantomzone.app",
    status: "New",
    accent: "family",
    image: "https://family-war.fantomzone.app/family-war-og.png"
  },
  {
    slug: "gambl-roulette",
    title: "Gambl Roulette",
    description: "Take your seat at a premium European roulette table with live dealer prompts, casino sound, and touch-first betting.",
    url: "https://gambl-roulette.fantomzone.app",
    status: "New",
    accent: "roulette",
    image: "https://gambl-roulette.fantomzone.app/og.png"
  },
  {
    slug: "gambl-poker",
    title: "Gambl Poker",
    description: "Read the table and own the pot in a premium Texas Hold'em game with CPU rivals, casino sound, a guided tutorial, and a fully visible mobile table.",
    url: "https://gambl-poker.unknownfigure.chatgpt.site",
    status: "New",
    accent: "roulette",
    image: "/gambl-poker-cover.png"
  },
  {
    slug: "ultimate-pong",
    title: "Ultimate PONG!!",
    description: "Arcade paddle action with a loud neon pulse.",
    url: "https://ultimate-pong.fantomzone.app",
    status: "Live",
    accent: "cyan"
  },
  {
    slug: "grannies-solitaire",
    title: "Grannie's Solitare",
    description: "A clean, focused Klondike card table.",
    url: "https://grannies.fantomzone.app",
    status: "Live",
    accent: "green"
  },
  {
    slug: "crosswords",
    title: "CrossWords",
    description: "A relaxed swipe word-search with themed boards, hints, and no timer.",
    url: "https://crosswords.fantomzone.app",
    status: "Live",
    accent: "gold"
  },
  {
    slug: "meow-clicker",
    title: "Meow Clicker",
    description: "Tap through ten cat worlds, unlock new skins, and purr your way to cosmic prestige.",
    url: "https://meow-clicker.fantomzone.app",
    status: "New",
    accent: "meow",
    image: "/meow-clicker-cat.png"
  },
  {
    slug: "fill-the-hole",
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
  "Billiards Champion": "OWN THE TABLE",
  "Golf Masters": "READ THE GREEN",
  "Gambl BlackJack": "READ THE TABLE",
  "Wheel of Goods": "SPIN • ANSWER • WIN",
  "Family War": "OWN THE BOARD",
  "Gambl Roulette": "PLACE YOUR BETS",
  "Gambl Poker": "OWN THE POT",
  "Ultimate PONG!!": "PONG",
  "Grannie's Solitare": "A K Q",
  CrossWords: "WORD",
  "Meow Clicker": "MEOW",
  "LAST MAN": "ENTER THE REALM",
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
              <article class="game-card ${game.accent}" data-game="${game.slug}">
                <div class="game-art" aria-hidden="true">
                  <span>${artLabels[game.title]}</span>
                  ${
                    game.image
                      ? `<img src="${game.image}" alt="" loading="${game.imageLoading ?? "lazy"}" decoding="async"${game.imageLoading === "eager" ? ' fetchpriority="high"' : ""} />`
                      : ""
                  }
                </div>
                <div class="game-copy">
                  <div class="game-meta">
                    <span>${game.status}</span>
                  </div>
                  <h3>${game.title}</h3>
                  <p>${game.description}</p>
                </div>
                <a class="play-link" href="${game.url}" aria-label="Play ${game.title}">Play</a>
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
