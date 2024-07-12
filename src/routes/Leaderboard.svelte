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
    {:else}
      <p>Aucun score enregistré pour ce niveau.</p>
    {/if}
  </div>
</div>

<style>
  .leaderboard {
    margin-top: 1em;
    color: var(--text-color);
    width: 100%;
    max-width: min(90vw, 600px);
  }

  .table-container {
    max-height: min(30vh, 300px);
    overflow-y: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: min(2.5vw, 1rem);
  }

  th, td {
    padding: 0.3em;
    border: 1px solid var(--accent);
    text-align: left;
  }

  th {
    background-color: var(--accent);
    color: var(--bg-color);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  @media (min-width: 1200px) {
    .leaderboard {
      max-width: 800px;
    }
    .table-container {
      max-height: 400px;
    }
    table {
      font-size: 1.2rem;
    }
  }
</style>