import "./styles.css";

const games = [
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
    url: "https://grannies-solitare.fantomzone.app",
    status: "Live",
    accent: "green"
  }
];

const upcoming = [
  "New cabinet opening soon",
  "More browser games in development"
];

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
                  <span>${game.title === "Ultimate PONG!!" ? "PONG" : "A K Q"}</span>
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
