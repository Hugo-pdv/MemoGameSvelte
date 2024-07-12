<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '../supabase';

  export let selectedLevel: string;

	interface LeaderboardEntry {
    username: string;
    score: number;
    level: string;
    timestamp: string;
  }

  let leaderboard: LeaderboardEntry[] = [];


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
    fetchLeaderboard();
  });
</script>

<div class="leaderboard">
  <h3>Meilleurs scores pour le niveau {selectedLevel}</h3>
  <table>
    <thead>
      <tr>
        <th>Rang</th>
        <th>Nom</th>
        <th>Score en secondes</th>
        <th>Niveau</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {#each leaderboard as score, index}
        <tr>
          <td>{index + 1}</td>
          <td>{score.username}</td>
          <td>{score.score / 1000}</td>
          <td>{score.level}</td>
          <td>{new Date(score.timestamp).toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .leaderboard {
    margin-top: 2em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 0.5em;
    border: 1px solid var(--accent);
    text-align: left;
  }

  th {
    background-color: var(--accent);
    color: var(--bg-color);
  }
</style>