import { writable, derived } from 'svelte/store';
import { updateOrder } from '../api';

export interface Order {
  id: number;
  items: {
    name: string;
    quantity: number;
  };
  status: "Pending" | "Received" | "Completed";
  isCompleted: boolean;
}

// Create the stores
export const ordersStore = writable<Order[]>([]);
export const hiddenOrderIds = writable<Set<number>>(new Set());

// Derived store that filters out hidden orders
export const visibleOrdersStore = derived(
  [ordersStore, hiddenOrderIds],
  ([$orders, $hiddenIds]: [Order[], Set<number>]) => $orders.filter((order: Order) => !$hiddenIds.has(order.id))
);

// Store actions
export const ordersActions = {
  // Initialize with SSR data
  initialize: (initialOrders: Order[]) => {
    ordersStore.set(initialOrders);
  },

  // Update order
  updateOrder: async (id: number, status: "Pending" | "Received" | "Completed") => {
    try {
      await updateOrder(id, status);
      // SSE will broadcast the update to all clients
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  },

  // Hide order (frontend only)
  hideOrder: async (id: number) => {
    try {
      await fetch(`/api/orders/${id}/hide`, { method: 'PATCH' });
    } catch (error) {
      console.error('Failed to hide order:', error);
      throw error;
    }
  },



  // Handle SSE updates
  handleOrderUpdate: (update: { type: string; order?: Order; orderId?: number }) => {
    ordersStore.update((orders: Order[]) => {
      switch (update.type) {
        case 'order_created':
          if (update.order) {
            return [...orders, {
              ...update.order,
              isCompleted: update.order.status === 'Completed'
            }];
          }
          return orders;
        case 'order_updated':
          if (update.order) {
            return orders.map((order: Order) => 
              order.id === update.order!.id ? {
                ...update.order!,
                isCompleted: update.order!.status === 'Completed'
              } : order
            );
          }
          return orders;
        case 'order_hidden':
          return orders.filter((order: Order) => order.id !== update.order!.id);
        case 'heartbeat':
        case 'connected':
          // Keep connection alive, no action needed
          return orders;
        default:
          return orders;
      }
    });
  }
};