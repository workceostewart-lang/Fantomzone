(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),document.documentElement.dataset.hubRevision=`2026-08-04-bowling-controls`,window.location.hostname.endsWith(`fantomzone.app`)&&(`serviceWorker`in navigator&&navigator.serviceWorker.getRegistrations().then(e=>Promise.all(e.map(e=>e.unregister()))).catch(()=>void 0),`caches`in window&&caches.keys().then(e=>Promise.all(e.map(e=>caches.delete(e)))).catch(()=>void 0));var e=[{slug:`sport-bowling`,title:`Sport Bowling`,description:`Pass, play, and cheer through family-friendly ten-pin bowling with skill-based swipes, official scoring, TV Mode, and gyroscope phone controllers.`,url:`https://bowling.fantomzone.app`,status:`New`,accent:`bowling`},{slug:`billiards-champion`,title:`Billiards Champion`,description:`Learn every shot in a five-step guided tutorial, then control your spin and own a fully visible 8-ball table solo, versus CPU, or online.`,url:`/games/billiards-champion/index.html`,status:`New`,accent:`billiards`,image:`/billiards-champion-cover.png`,imageLoading:`eager`},{slug:`last-man`,title:`LAST MAN`,description:`Enter an enchanted card realm, outplay fair CPU rivals, call your final card, and become the LAST MAN standing on desktop or mobile.`,url:`https://last-man.fantomzone.app`,status:`Remastered`,accent:`lastman`,image:`/last-man-cover.jpg`,imageLoading:`eager`},{slug:`golf-masters`,title:`Golf Masters`,description:`Read the green, bank around shifting obstacles, and master more than 1,500 puzzle-first golf courses on desktop or mobile.`,url:`https://golf-masters.fantomzone.app`,status:`New`,accent:`golf`,image:`/golf-masters-cover-20260729.png`,imageLoading:`eager`},{slug:`gambl-blackjack`,title:`Gambl BlackJack`,description:`Read the table, build your hand, and own the night at a responsive six-deck blackjack table with full casino actions and sound.`,url:`https://gambl-blackjack.unknownfigure.chatgpt.site`,status:`New`,accent:`blackjack`,image:`/gambl-blackjack-og.png`},{slug:`wheel-of-goods`,title:`Wheel of Goods`,description:`Spin the rainbow wheel, call letters to reveal the puzzle, and solve the phrase before your rivals.`,url:`https://wheel-of-goods.unknownfigure.chatgpt.site`,status:`New`,accent:`wheel`,image:`/wheel-of-goods-cover-20260727.png`,imageLoading:`eager`},{slug:`family-war`,title:`Family War`,description:`Call the survey answers, dodge three strikes, and challenge another family on the same screen or from a private online lobby.`,url:`https://family-war.fantomzone.app`,status:`New`,accent:`family`,image:`https://family-war.fantomzone.app/family-war-og.png`},{slug:`gambl-roulette`,title:`Gambl Roulette`,description:`Take your seat at a premium European roulette table with live dealer prompts, casino sound, and touch-first betting.`,url:`https://gambl-roulette.fantomzone.app`,status:`New`,accent:`roulette`,image:`https://gambl-roulette.fantomzone.app/og.png`},{slug:`gambl-poker`,title:`Gambl Poker`,description:`Read the table and own the pot in a premium Texas Hold'em game with CPU rivals, casino sound, a guided tutorial, and a fully visible mobile table.`,url:`https://gambl-poker.unknownfigure.chatgpt.site`,status:`New`,accent:`roulette`,image:`/gambl-poker-cover.png`},{slug:`ultimate-pong`,title:`Ultimate PONG!!`,description:`Arcade paddle action with a loud neon pulse.`,url:`https://ultimate-pong.fantomzone.app`,status:`Live`,accent:`cyan`},{slug:`grannies-solitaire`,title:`Grannie's Solitare`,description:`A clean, focused Klondike card table.`,url:`https://grannies.fantomzone.app/?v=20260816-medium`,status:`Live`,accent:`green`},{slug:`crosswords`,title:`CrossWords`,description:`A relaxed swipe word-search with themed boards, hints, and no timer.`,url:`https://crosswords.fantomzone.app`,status:`Live`,accent:`gold`},{slug:`meow-clicker`,title:`Meow Clicker`,description:`Tap through ten cat worlds, unlock new skins, and purr your way to cosmic prestige.`,url:`https://meow-clicker.fantomzone.app`,status:`New`,accent:`meow`,image:`/meow-clicker-cat.png`},{slug:`fill-the-hole`,title:`Fill the Hole`,description:`A block puzzle where every piece has a place to fit.`,url:`https://block-puzzle-fill-the-hole-attempt-dos.workceostewart.workers.dev/`,status:`Live`,accent:`coral`}],t=[`More browser games in development`],n={"Sport Bowling":`PASS • PLAY • CHEER`,"Billiards Champion":`OWN THE TABLE`,"Golf Masters":`READ THE GREEN`,"Gambl BlackJack":`READ THE TABLE`,"Wheel of Goods":`SPIN • ANSWER • WIN`,"Family War":`OWN THE BOARD`,"Gambl Roulette":`PLACE YOUR BETS`,"Gambl Poker":`OWN THE POT`,"Ultimate PONG!!":`PONG`,"Grannie's Solitare":`A K Q`,CrossWords:`WORD`,"Meow Clicker":`MEOW`,"LAST MAN":`ENTER THE REALM`,"Fill the Hole":`BLOCKS`};document.querySelector(`#app`).innerHTML=`
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
        ${e.map(e=>`
              <article class="game-card ${e.accent}" data-game="${e.slug}">
                <div class="game-art" aria-hidden="true">
                  <span>${n[e.title]}</span>
                  ${e.image?`<img src="${e.image}" alt="" loading="${e.imageLoading??`lazy`}" decoding="async"${e.imageLoading===`eager`?` fetchpriority="high"`:``} />`:``}
                </div>
                <div class="game-copy">
                  <div class="game-meta">
                    <span>${e.status}</span>
                  </div>
                  <h3>${e.title}</h3>
                  <p>${e.description}</p>
                </div>
                <a class="play-link" href="${e.url}" aria-label="Play ${e.title}">Play</a>
              </article>
            `).join(``)}
      </div>
    </section>

    <section class="upcoming" id="coming-soon" aria-labelledby="upcoming-title">
      <div>
        <p class="section-label">Next</p>
        <h2 id="upcoming-title">Coming Soon</h2>
      </div>
      <div class="upcoming-list">
        ${t.map(e=>`<p>${e}</p>`).join(``)}
      </div>
    </section>
  </main>
`;
