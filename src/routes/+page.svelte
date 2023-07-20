<script lang='ts'>
  import Game from "./Game.svelte";
  import '../styles.css';
  import Modal from "./Modal.svelte";
  import { levels } from "./levels";

  let state: 'waiting' | 'playing' | 'paused' | 'gagné' | 'perdu' = 'waiting';

  let game;
</script>

<Game />

{#if state !== 'playing'}
    <Modal>
      <header>
          <h1>M<span>emoj</span>i</h1>
          <p> le jeu d'association d'Emoji </p>
      </header>

      {#if state === 'gagné' || state ==='perdu'}
          <p>tu as {state} !</p>
      {:else if state === 'paused'}
          <p>pause du jeu</p>
      {:else if state === 'waiting'}
          <p>choisit une difficulté:</p>
      {/if}

      <div class="buttons">
          {#if state ==='paused'}
              <button>reprendre</button>
              <button>quitter</button>
          {:else}
              {#each levels as level}
              <button
                  on:click={() => {

                  }}
              >{level.label}</button>
              {/each}
          {/if}
      </div>
    </Modal>
{/if}

<style>
  h1 {
    font-size: 4em;;
  }

  h1 span {
    color: purple;
  }

  p {
    font-family: Grandstander;
  }
</style>