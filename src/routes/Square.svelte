<script lang="ts">
      import { get_twemoji_url } from "./utils";
      import { send } from "./transition";

      export let value: string;
      export let selected: boolean;
      export let found: boolean;
      export let group: "a" | "b";
</script>

<div class="square" class:flipped={selected || found}>
      <button on:click disabled={selected || found} />

      <div class="background" />

      {#if !found}
            <img
                  alt={value}
                  src={get_twemoji_url(value)}
                  out:send={{ key: `${value}:${group}` }}
            />
      {/if}
</div>

<style>
      .square {
            display: flex;
            justify-content: center;
            align-items: center;
            transform-style: preserve-3d;
            transition: transform 0.4s;
      }

      .flipped {
            transform: rotateY(180deg);
      }

      button {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            background: #eee;
            border: 0;
            border-radius: 1em;
            font-size: inherit;
      }

      .background {
            position: absolute;
            background: white;
            border: 0.5em solid var(--accent);
            transform: rotateY(180deg);
            backface-visibility: hidden;
            width: 100%;
            height: 100%;
            border-radius: 1em;
      }

      img {
            width: 6em;
            height: 6em;
            pointer-events: none;
            transform: rotateY(180deg);
            backface-visibility: hidden;
      }
</style>
