<script lang="ts">
  import { onMount } from "svelte";
  import Countdown from "./Countdown.svelte";
import Found from "./Found.svelte";
import Grid from "./Grid.svelte";
  import { levels } from "./levels";
  import type { Level } from "./levels";
  import { shuffle } from "./utils";

  const level = levels[0];

  let size: number = level.size;
  let grid: string[] = create_grid(level);
  let found: string[] = [];
  let remaining: number = level.duration;
  let duration: number = level.duration;
  let playing: boolean = false;

  function create_grid(level: Level) {
    const copy = level.emojis.slice();
    const pairs: string[] = [];

    for (let i=0; i < level.size ** 2 / 2; i += 1) {
        const index = Math.floor(Math.random() * copy.length);
        const emoji = copy[index];

        copy.splice(index, 1);
        pairs.push(emoji);


    }

    pairs.push(...pairs);

    return shuffle(pairs);
  }

  function countdown() {
    const start = Date.now();
    let remaining_at_start = remaining;

    function loop() {
        if (playing) return;
        requestAnimationFrame(loop);

        remaining = remaining_at_start - (Date.now() - start);

        if (remaining <= 0) {
             //TODO  the game has been lost
            playing = false;
        }
    }

    loop();
  }

  onMount(countdown);
</script>
<div class="game">
    <div class="info">
        <Countdown {remaining} duration={level.duration} />
    </div>

    <div class="grid-container">
        <Grid 
            {grid} on:found={(e) => {
                found= [...found, e.detail.emoji];
            }}
            {found}
        />
    </div>

    <div class="info">
        <Found {found} />
    </div>

</div>

<style>
    .game {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: min(1vmin, 0.5rem)
    }

    .info {
        width: 80em;
        height: 10em;
    }

    .grid-container {
        width: 80em;
        height: 80em;

    }
</style>