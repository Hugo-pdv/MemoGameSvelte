<script lang="ts">
      import Square from "./Square.svelte";
      import { createEventDispatcher } from "svelte";
    
      export let grid: string[];
      export let found: string[];
    
      const dispatch = createEventDispatcher();
    
      let a: number;
      let b: number;
      let reset_timeout: number;
    
      // Ajoutez les références aux fichiers audio
      let flipSound: HTMLAudioElement | null = null;
      let matchSound: HTMLAudioElement | null = null;
      let noMatchSound: HTMLAudioElement | null = null;
    
      let isMuted = false;
    
      if (typeof window !== 'undefined') {
        flipSound = new Audio('/sounds/flipSound.wav');
        matchSound = new Audio('/sounds/matchSound.wav');
        noMatchSound = new Audio('/sounds/noMatchSound.wav');
      }
    
      function toggleMute() {
        isMuted = !isMuted;
      }
    </script>
    

    <div class="grid">
      {#each grid as square, i}
        <Square
          on:click={() => {
            if (!isMuted && flipSound) flipSound.play(); // Jouer le son de flip
            if (a > -1 && b > -1) {
              clearTimeout(reset_timeout);
              a = i;
              b = -1;
            } else if (a > -1) {
              b = i;
    
              if (grid[a] === grid[b]) {
                // correct — remove from grid
                found = [...found, grid[a]];
                dispatch("found", { emoji: grid[a] });
                if (!isMuted && matchSound) matchSound.play(); // Jouer le son de match
              } else {
                // incorrect — reset after timeout
                reset_timeout = setTimeout(() => {
                  a = b = -1;
                  if (!isMuted && noMatchSound) noMatchSound.play(); // Jouer le son de no match
                }, 1000);
              }
            } else {
              a = i;
            }
          }}
          value={square}
          selected={a === i || b === i}
          found={found.includes(square)}
          group={i === grid.indexOf(square) ? "a" : "b"}
        />
      {/each}
    </div>

    <div class="mute-button">
      <button on:click={toggleMute}>
        {#if isMuted}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16">
            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16">
            <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
            <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
          </svg>
        {/if}
      </button>
    </div>
    
    <style>
      .grid {
        display: grid;
        grid-template-columns: repeat(var(--size), 1fr);
        grid-template-rows: repeat(var(--size), 1fr);
        grid-gap: 0.5em;
        height: 100%;
        perspective: 100vw;
        position: relative;
      }
    
.mute-button {
    position: absolute;
    bottom: -3em;
    right: 0;
    z-index: 10;
  }

  .mute-button button {
    padding: 0.5em;
    font-size: 1em;
    border: none;
    border-radius: 50%;
    background-color: var(--accent);
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    left: 7em;
  }

  .mute-button button:hover {
    background-color: darken(var(--accent), 10%);
  }

  .mute-button svg {
    width: 5em;
    height: 5em;
  }
  </style>