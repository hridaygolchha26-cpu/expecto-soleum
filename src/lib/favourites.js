import {supabase} from '../../supabase';
export async function listFavourites(userId){const {data,error}=await supabase.from('favourite_shoes').select('shoe_id').eq('user_id',userId);if(error)throw error;return data??[];}
export async function toggleFavourite(userId,shoeId,wasFavourite){const q=wasFavourite?supabase.from('favourite_shoes').delete().eq('user_id',userId).eq('shoe_id',shoeId):supabase.from('favourite_shoes').insert({user_id:userId,shoe_id:shoeId});const {error}=await q;if(error)throw error;}
