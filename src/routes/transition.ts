import { crossfade } from 'svelte/transition'
import { cubicInOut } from 'svelte/easing'

export const[send, receive] = crossfade({
    duration: 400,
    easing: cubicInOut
});
