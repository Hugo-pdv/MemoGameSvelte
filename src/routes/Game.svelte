<script lang="ts">
      import { createEventDispatcher, onMount } from "svelte";
      import Countdown from "./Countdown.svelte";
      import Found from "./Found.svelte";
      import Grid from "./Grid.svelte";

      import type { Level } from "./levels";
      import { shuffle } from "./utils";

      const dispatch = createEventDispatcher();

      let size: number;
      let grid: string[] = [];
      let found: string[] = [];
      let remaining = 0;
      let duration = 0;
      let playing: boolean = false;

      export function start(level: Level) {
            size = level.size;
            remaining = duration = level.duration;

            const sliced = level.emojis.slice();
            const pairs: string[] = [];

            // pick a set of emojis at random
            for (let i = 0; i < (size * size) / 2; i += 1) {
                  const index = Math.floor(Math.random() * sliced.length);
                  const emoji = sliced[index];
                  sliced.splice(index, 1);
                  pairs.push(emoji);
            }

            // repeat the set
            grid = shuffle([...pairs, ...pairs]);
            found = [];

            resume();
      }

      export function resume() {
            playing = true;
            countdown();

            dispatch("play");
      }

      function countdown() {
            if (!playing) {
                  return; // Stop the countdown if the game is not playing
            }
            const start = Date.now();
            let remaining_at_start = remaining;

            function loop() {
                  if (!playing) return;
                  requestAnimationFrame(loop);

                  remaining = remaining_at_start - (Date.now() - start);

                  if (remaining <= 0) {
                        dispatch("perdu");
                        playing = false;
                  }
            }

            loop();
      }
</script>

<div class="game" style="--size: {size}">
      <div class="info">
            {#if playing}
                  <Countdown
                        {remaining}
                        {duration}
                        on:click={() => {
                              playing = false;
                              dispatch("pause");
                        }}
                  />
            {/if}
      </div>

      <div class="grid-container">
            {#key grid}
                  <Grid
                        {grid}
                        {found}
                        on:found={(e) => {
                              found = [...found, e.detail.emoji];

                              if (found.length === (size * size) / 2) {
                                    playing = false;
                                    setTimeout(() => {
                                          playing = false;
                                          dispatch("gagné");
                                    }, 1000);
                              }
                        }}
                  />
            {/key}
      </div>

      <div class="info-found">
            <Found {found} />
      </div>
</div>

<style>
      .game {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            height: 100vh;
            overflow-y: hidden;
            font-size: min(1vmin, 0.5rem);
      }

      .info {
            width: 80em;
            height: 10em;
            margin-top: auto;
      }
      .info-found {
            width: 80em;
            height: 10em;
            margin-bottom: auto;
      }

      .grid-container {
            width: 80em;
            height: 80em;
      }
</style>
