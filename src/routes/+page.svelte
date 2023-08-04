<script lang="ts">
      import Game from "./Game.svelte";
      import "../styles.css";
      import Modal from "./Modal.svelte";
      import { levels } from "./levels";
      import { confetti } from "@neoconfetti/svelte";

      let state: "waiting" | "playing" | "paused" | "gagné" | "perdu" =
            "waiting";

      let selectedLevel: string;

      function setSelectedLevel(level: string) {
            selectedLevel = level;
      }

      let game: Game;
      let gameDuration: number;
</script>

<svelte:head>
      <title>Memojii</title>
      <meta name="description" content="le jeu d'association d'Emoji" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="memojii.vercel.app" />
      <meta property="twitter:url" content="https://memojii.vercel.app" />
      <meta name="twitter:title" content="Memojii" />
      <meta name="twitter:description" content="le jeu d'association d'Emoji" />
      <meta name="twitter:image" content="https://memojii.vercel.app/og.png" />
</svelte:head>
<main>
      <Game
            bind:this={game}
            on:play={() => {
                  state = "playing";
            }}
            on:pause={() => {
                  state = "paused";
            }}
            on:gagné={(event) => {
                  state = "gagné";
                  gameDuration = event.detail.duration;
            }}
            on:perdu={() => {
                  state = "perdu";
            }}
      />

      {#if state !== "playing"}
            <Modal>
                  <header>
                        <h1>M<span>emoji</span>i</h1>
                        <p>le jeu d'association d'Emoji</p>
                  </header>

                  {#if state === "gagné"}
                        {#each levels.filter((level) => level.label === selectedLevel) as level}
                              <p>
                                    🎉 Tu as {state} en {level.label} en {gameDuration /
                                          1000}
                                    secondes 🎉
                              </p>
                              <p>Choisissez une autre difficulté ! :</p>
                        {/each}
                        <div
                              class="confetti"
                              use:confetti={{
                                    stageWidth: innerWidth,
                                    stageHeight: innerHeight,
                              }}
                        />
                  {:else if state === "perdu"}
                        {#each levels.filter((level) => level.label === selectedLevel) as level}
                              <p>.. 😥 tu as {state} en {level.label} 😥 ..</p>
                        {/each}
                  {:else if state === "paused"}
                        <p>pause du jeu :</p>
                  {:else if state === "waiting"}
                        <p>choisit une difficulté :</p>
                  {/if}
                  <div class="buttons">
                        {#if state === "paused"}
                              <button on:click={() => game.resume()}>
                                    Reprendre
                              </button>
                              <button on:click={() => (state = "waiting")}>
                                    Quitter
                              </button>
                        {:else}
                              {#each levels as level}
                                    <button
                                          on:click={() => {
                                                setSelectedLevel(level.label);
                                                game.start(level);
                                                state = "playing";
                                          }}
                                    >
                                          {level.label}
                                    </button>
                              {/each}
                        {/if}
                  </div>
            </Modal>
      {/if}
</main>

<style>
      header {
            font-size: min(5vw, 2rem);
            font-family: Grandstander;
      }
      h1 {
            font-size: 4em;
      }

      h1 span {
            color: var(--accent);
      }

      p {
            font-family: Grandstander;
            text-align: center;
      }

      .buttons {
            display: flex;
            justify-content: center;
            gap: 0.5em;
      }

      button {
            background: var(--accent);
            color: black;
            font-size: inherit;
            font-family: Grandstander;
            border: none;
            padding: 1em;
            border-radius: 0.5em;
      }
      .confetti {
            position: fixed;
            width: 100%;
            height: 100%;
            left: 50%;
            top: 30%;
            pointer-events: none;
      }
</style>
