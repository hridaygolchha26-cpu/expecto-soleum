import { supabase } from '../../supabase';

export async function createDemoOrder(userId, order) {
  if (!userId) throw new Error('Sign in to save demo orders to your account.');
  const items = (order.items || []).map((item) => ({
    id: item.id,
    brand: item.brand,
    name: item.name,
    image: item.image,
    price: Number(item.price) || 0,
    selectedSize: item.selectedSize,
    quantity: Number(item.quantity) || 1
  }));
  const { data, error } = await supabase
    .from('demo_orders')
    .insert({
      user_id: userId,
      order_id: order.orderId,
      items,
      estimated_total: Number(order.total) || 0
    })
    .select('id,order_id,items,estimated_total,currency,order_status,payment_status,created_at')
    .single();
  if (error) throw error;
  return data;
}

export async function listDemoOrders(userId) {
  const { data, error } = await supabase
    .from('demo_orders')
    .select('id,order_id,items,estimated_total,currency,order_status,payment_status,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
