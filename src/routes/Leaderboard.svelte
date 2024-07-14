<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../supabase';

  export let selectedLevel: string;
  export let leaderboard: LeaderboardEntry[] = [];

  interface LeaderboardEntry {
    username: string;
    score: number;
    level: string;
    timestamp: string;
  }

  $: filteredLeaderboard = leaderboard.filter(entry => entry.level === selectedLevel);

  async function fetchLeaderboard() {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('level', selectedLevel)
      .order('score', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Erreur lors de la récupération du leaderboard :', error);
      return;
    }

    leaderboard = data;
    console.log("Leaderboard récupéré pour le niveau :", selectedLevel, leaderboard);
  }

  onMount(() => {
    if (leaderboard.length === 0) {
      fetchLeaderboard();
    }
  });
</script>

<div class="leaderboard">
  <h3>Meilleurs scores pour le niveau {selectedLevel}</h3>
  <div class="table-container">
    {#if filteredLeaderboard.length > 0}
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Nom</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredLeaderboard as score, index}
              <tr>
                <td>{index + 1}</td>
                <td>{score.username}</td>
                <td>{score.score / 1000}s</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <p>Aucun score enregistré pour ce niveau.</p>
    {/if}
  </div>
</div>
<style>
  .leaderboard {
    margin-top: 0.5em; /* Reduced margin */
    color: var(--text-color);
    width: 100%;
    max-width: min(90vw, 500px); /* Reduced max-width */
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h3 {
    text-align: center;
    margin-bottom: 0.3em; /* Reduced margin */
    font-size: min(3vw, 1.2rem); /* Reduced font size */
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  .table-wrapper {
    display: grid;
    grid-template-rows: repeat(3, auto);
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: min(2.5vw, 0.9rem); /* Reduced font size */
  }

  th, td {
    padding: 0.2em; /* Reduced padding */
    border: 1px solid var(--accent);
    text-align: center;
  }

  th {
    background-color: var(--accent);
    color: var(--bg-color);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tbody {
    display: block;
    max-height: 5em; /* Adjusted height */
    overflow-y: auto;
  }

  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  @media (max-width: 600px) {
    .leaderboard {
      max-width: 100%;
      padding: 0 5px; /* Reduced padding */
    }
    
    h3 {
      font-size: 0.9rem; /* Reduced font size */
    }

    table {
      font-size: 0.7rem; /* Reduced font size */
    }

    th, td {
      padding: 0.1em; /* Reduced padding */
    }
  }

  @media (min-width: 1200px) {
    .leaderboard {
      max-width: 700px; /* Reduced max-width */
    }
    table {
      font-size: 1rem; /* Reduced font size */
    }
  }
</style>