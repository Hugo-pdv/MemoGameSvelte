<script lang="ts">
  import Game from "./Game.svelte";
  import "../styles.css";
  import Modal from "./Modal.svelte";
  import { levels } from "./levels";
  import { confetti } from "@neoconfetti/svelte";
  import Found from "./Found.svelte";

  let found: string[] = [];

  let state: "waiting" | "playing" | "paused" | "gagné" | "perdu" = "waiting";

  let selectedLevel: string;

  function setSelectedLevel(level: string) {
    selectedLevel = level;
  }

  let game: Game;
</script>

<Game
  bind:this={game}
  on:play={() => {
    state = "playing";
  }}
  on:pause={() => {
    state = "paused";
  }}
  on:gagné={() => {
    state = "gagné";
  }}
  on:perdu={() => {
    state = "perdu";
  }}
/>
{#if state !== "playing"}
  <Modal>
    <header>
      <h1>M<span>emoj</span>ii</h1>
      <p>le jeu d'association d'Emoji</p>
    </header>

    {#if state === "gagné"}
      {#each levels.filter((level) => level.label === selectedLevel) as level}
        <p>! 🎉 tu as {state} en {level.label} 🎉 !</p>
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
      <p>pause du jeu</p>
    {:else if state === "waiting"}
      <p>choisit une difficulté:</p>
    {/if}

    <div class="buttons">
      {#if state === "paused"}
        <button on:click={() => game.resume()}>resume</button>
        <button on:click={() => (state = "waiting")}> quit </button>
      {:else if state}
        {#each levels as level}
          <button
            on:click={() => {
              setSelectedLevel(level.label);
              game.start(level);
              state = "playing";
            }}>{level.label}</button
          >
        {/each}
      {/if}
    </div>
  </Modal>
{/if}

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
