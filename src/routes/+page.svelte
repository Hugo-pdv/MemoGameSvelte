<script lang="ts">
  import Game from "./Game.svelte";
  import "../styles.css";
  import { saveScore } from "./utils";
  import Modal from "./Modal.svelte";
  import { levels } from "./levels";
  import { confetti } from "@neoconfetti/svelte";
  import { supabase } from '../supabase';
  import Leaderboard from "./Leaderboard.svelte";
  import Alert from "./Alert.svelte"; // Import the Alert component

  let state: "waiting" | "playing" | "paused" | "gagné" | "perdu" = "waiting";
  let selectedLevel: string;
  let game: Game;
  let gameDuration: number;
  let darkMode: boolean = false;
  let showAlert = false;
  let alertMessage = "";
  let alertType: 'success' | 'error' = 'success';

  if (typeof window !== "undefined") {
    darkMode = localStorage.getItem("darkMode") === "true";
  }

  $: {
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", darkMode.toString());
      if (darkMode) {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
      } else {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
      }
    }
  }

  let username = "";
  let leaderboard = [];
  let showLeaderboard = false;

  function setSelectedLevel(level: string) {
    selectedLevel = level;
    console.log("Niveau sélectionné :", selectedLevel);
  }

  async function fetchLeaderboard() {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Erreur lors de la récupération du leaderboard :', error);
      return;
    }

    leaderboard = data;
  }

  function toggleLeaderboard() {
    showLeaderboard = !showLeaderboard;
    if (showLeaderboard) {
      fetchLeaderboard();
    }
  }

  async function handleSaveScore() {
  if (username && selectedLevel) {
    try {
      const saved = await saveScore(username.toLowerCase(), gameDuration, selectedLevel);
      if (saved === true) {
        alertMessage = "Score sauvegardé avec succès !";
        alertType = 'success';
        await fetchLeaderboard();
        showLeaderboard = true;
      } else if (saved === false) {
        alertMessage = "Le nouveau score n'est pas meilleur. Pas de mise à jour !";
        alertType = 'error';
      }
      showAlert = true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du score :", error);
      alertMessage = "Erreur lors de la sauvegarde du score. Veuillez réessayer.";
      alertType = 'error';
      showAlert = true;
    }
  } else {
    alertMessage = "Veuillez entrer un nom d'utilisateur et sélectionner un niveau.";
    alertType = 'error';
    showAlert = true;
  }
}
  function closeAlert() {
    showAlert = false;
  }

  async function handleGameEnd(event: CustomEvent<{ duration: number }>) {
    state = "gagné";
    gameDuration = event.detail.duration;
    showLeaderboard = true;
    username = ""; // Réinitialiser le nom d'utilisateur
    await fetchLeaderboard(); // Mettre à jour le leaderboard
  }
</script>

<svelte:head>
  <title>Memojii</title>
  <meta name="description" content="le jeu d'association d'Emoji" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="memojii.vercel.app" />
  <meta property="twitter:url" content="https://memojii.vercel.app" />
  <meta name="twitter:title" content="Memojii" />
  <meta name="twitter:description" content="le jeu d'association d'Emoji" />
  <meta name="twitter:image" content="https://memojii.vercel.app/og.png" />
</svelte:head>
<main>
  <Game
    bind:this={game}
    on:play={() => {
      state = "playing";
    }}
    on:pause={() => {
      state = "paused";
    }}
    on:gagné={(event) => {
      state = "gagné";
      gameDuration = event.detail.duration;
    }}
    on:perdu={() => {
      state = "perdu";
    }}
  />

  {#if showAlert}
    <Alert message={alertMessage} type={alertType} on:close={closeAlert} />
  {/if}

  {#if state !== "playing"}
  <Modal>
      <header>
        <h1 class="page-title">M<span>emoji</span>i</h1>
        <p class="page-paragraph">
          le jeu d'association d'Emoji
        </p>
        <button
          class="button-darkmode"
          on:click={() => (darkMode = !darkMode)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ><title>theme-light-dark</title><path
              d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z"
            /></svg
          >
        </button>
      </header>

      {#if state === "gagné"}
        {#each levels.filter((level) => level.label === selectedLevel) as level}
          <p class="page-paragraph">
            🎉 Tu as {state} en {level.label} en {gameDuration / 1000} secondes 🎉
          </p>
          <p class="page-paragraph">Voici le classement :</p>
          <Leaderboard selectedLevel={selectedLevel} {leaderboard} />
          <p class="page-paragraph">
            Entrez votre nom pour sauvegarder votre score :
          </p>
          <div class="save-score-container">
            <input bind:value={username} placeholder="Entrez votre nom" />
            <button on:click={handleSaveScore}>Sauvegarder le score</button>
          </div>
          <p class="page-paragraph">Choisissez une autre difficulté :</p>
        {/each}
        <div
          class="confetti"
          use:confetti={{
            stageWidth: innerWidth,
            stageHeight: innerHeight,
          }}
        />
      {:else if state === "perdu"}
        {#each levels.filter((level) => level.label === selectedLevel) as level}
          <p class="page-paragraph">
            .. 😥 tu as {state} en {level.label} 😥 ..
          </p>
        {/each}
      {:else if state === "paused"}
        <p class="page-paragraph">pause du jeu :</p>
      {:else if state === "waiting"}
        <p class="page-paragraph">choisit une difficulté :</p>
      {/if}
      <div class="buttons">
        {#if state === "paused"}
          <button on:click={() => game.resume()}>
            Reprendre
          </button>
          <button on:click={() => (state = "waiting")}>
            Quitter
          </button>
        {:else}
          {#each levels as level}
            <button
              on:click={() => {
                setSelectedLevel(level.label);
                game.start(level);
                state = "playing";
              }}
            >
              {level.label}
            </button>
          {/each}
        {/if}
      </div>
    </Modal>
  {/if}
</main>

<style>
  header {
    font-size: min(5vw, 2rem);
    font-family: Grandstander;
    text-align: center;
  }
  h1 {
    font-size: 4em;
    text-align: center;
    margin-bottom: 0.5em;
  }

  h1 span {
    color: var(--accent);
  }

  p {
    font-family: Grandstander;
    text-align: center;
    margin-bottom: 1em;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 0.5em;
    flex-wrap: wrap;
    margin-bottom: 1em;
  }

  button {
    background: var(--accent);
    color: black;
    font-size: inherit;
    font-family: Grandstander;
    border: none;
    padding: 0.5em 1em;
    border-radius: 0.5em;
    cursor: pointer;
  }
  .confetti {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 50%;
    top: 30%;
    pointer-events: none;
  }

  .button-darkmode {
  width: min(2em, 10vw);
  height: min(2em, 10vw);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1em;
  padding: 0.2em;
}

  svg {
    width: 80%;
    height: 80%;
  }

input {
  margin: 0 auto 1em;
  padding: 0.5em;
  font-size: 1em;
  width: 100%;
  max-width: 300px;
  display: block;
}

.save-score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

  @media (max-width: 600px) {
    header {
      font-size: 1rem;
    }
    h1 {
      font-size: 2.5em;
    }
    .buttons {
      flex-direction: column;
      align-items: center;
    }
    button {
      font-size: 0.9em;
      padding: 0.5em;
      width: 100%;
      max-width: 200px;
    }
  }
</style>