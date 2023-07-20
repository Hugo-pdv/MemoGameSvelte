<script lang="ts">
  import { receive } from "./transition";
  import { get_twemoji_url } from "./utils";

    export let found: string[];

</script>


<div class="found">
    {#each found as emoji (emoji)}
        <div class="pair">
            <img in:receive={{ key: `${emoji}:a` }} alt={emoji} src={get_twemoji_url(emoji)}/>
            <img in:receive={{ key: `${emoji}:b` }} alt={emoji} src={get_twemoji_url(emoji)}/>
        </div>
    {/each}
</div>

<style>
    .found {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5em;
        height: 100%;
        filter: drop-shadow(0.2em 0.2em 0.5em rgba(0, 0, 0, 0.2));
    }

    .pair {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 4em;
        height: 4em;
        background: white;
        padding: 1em;
        border-radius: 50%;
    }

    img {
        position: absolute;
        width: 2em;
        height: 2em;
    }
</style>