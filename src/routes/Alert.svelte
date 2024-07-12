<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let message: string;
  export let type: 'success' | 'error' = 'success';

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }
</script>

<div class="alert-overlay" transition:fade={{ duration: 200 }}>
  <div class="alert {type}">
    <p>{message}</p>
    <button on:click={close}>OK</button>
  </div>
</div>

<style>
  .alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .alert {
    background-color: var(--bg-color);
    color: var(--text-color);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 80%;
  }

  .success {
    border-top: 4px solid var(--accent);
  }

  .error {
    border-top: 4px solid #f44336;
  }

  p {
    margin-bottom: 15px;
    font-size: 1.1em;
  }

  button {
    background-color: var(--accent);
    border: none;
    color: var(--bg-color);
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
  }

  .error button {
    background-color: #f44336;
  }
</style>