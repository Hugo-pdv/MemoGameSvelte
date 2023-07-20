<script lang='ts'>
  import Game from "./Game.svelte";
  import '../styles.css';
  import Modal from "./Modal.svelte";
  import { levels } from "./levels";
  import { confetti } from '@neoconfetti/svelte';

  let state: 'waiting' | 'playing' | 'paused' | 'gagné' | 'perdu' = 'waiting';

  let game: Game;
</script>

  <Game 
    bind:this={game} 
    on:play={() => {
        state = 'playing';
    }}
    on:pause={() => {
        state = 'paused';
    }}
    on:gagné={() => {
      state = 'gagné';
    }}
     on:perdu={() => {
      state = 'perdu';
    }}
  />
  {#if state !== 'playing'}
      <Modal>
        <header>
            <h1>M<span>emoj</span>i</h1>
            <p> le jeu d'association d'Emoji </p>
        </header>

        {#if state === 'gagné'}
            <p>! 🎉 tu as {state} 🎉 !</p>
            <div class='confetti' use:confetti={{
                stageWidth : innerWidth,
                stageHeight: innerHeight
            }} />
        {:else if state ==='perdu'}
            <p>.. 😥 tu as {state} 😥 ..</p>
        {:else if state === 'paused'}
            <p>pause du jeu</p>
        {:else if state === 'waiting'}
            <p>choisit une difficulté:</p>
        {/if}

        

        <div class="buttons">
          {#if state === 'paused'}
            <button on:click={() => game.resume()}>resume</button>
            <button on:click={() => (state = 'waiting')}> quit </button>
				  {:else}
                {#each levels as level}
                <button
                    on:click={() => {
                      game.start(level);
                      state= 'playing';
                    }}
                >{level.label}</button>
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
    font-size: 4em;;
  }

  h1 span {
    color: var(--accent);
  }

  p {
    font-family: Grandstander;
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