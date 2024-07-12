import { supabase } from '../supabase';

export function shuffle<T>(array: T[]) {
      let i = array.length;

      while (i--) {
            const j = Math.floor(Math.random() * i + 1);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
      }

      return array;
}

export function get_twemoji_url(emoji: string) {
      const code = [...emoji]
            .map((char) => char.codePointAt(0)!.toString(16))
            .join("-");
      return `/twemoji/${code}.svg`;
}

export async function saveScore(username: string, score: number, level: string) {
  try {
    const lowerCaseUsername = username.toLowerCase();

    const { data: existingUser, error: fetchError } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('username', lowerCaseUsername)
      .eq('level', level)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingUser) {
      if (score < existingUser.score) {
        const { data, error } = await supabase
          .from('leaderboard')
          .update({ score, timestamp: new Date() })
          .eq('username', lowerCaseUsername)
          .eq('level', level);

        if (error) throw error;
        console.log('Score amélioré et mis à jour !');
        return true;
      } else {
        console.log('Le nouveau score n\'est pas meilleur. Pas de mise à jour.');
        return false;
      }
    } else {
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([{ username: lowerCaseUsername, score, level, timestamp: new Date() }]);

      if (error) throw error;
      console.log('Nouveau score enregistré !');
      return true;
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du score :', error);
    throw error;
  }
}