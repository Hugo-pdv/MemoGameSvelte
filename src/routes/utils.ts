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
        const { data, error } = await supabase
          .from('leaderboard')
          .insert([{ username, score, level, timestamp: new Date() }]);
    
        if (error) {
          throw error;
        }
    
        console.log('Score sauvegardé avec succès !', data);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du score :', error);
      }
    }