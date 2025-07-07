<script lang="ts">
  import { flip } from "svelte/animate";
  import { send, receive } from "./transition.js";

  let { orders, handleUpdateOrder, handleHideOrder = null } = $props();
</script>

{#if orders.length > 0}
  <div class="orders-list">
    {#each orders as order (order.id)}
      <div
        class="order-card"
        style:background-color={order.status === "Pending"
          ? "#605d66"
          : order.status === "Received"
            ? "#e676bb"
            : "#278f5e"}
        in:receive={{ key: order.id }}
        out:send={{ key: order.id }}
        animate:flip={{ duration: 200 }}
      >
        {#if handleHideOrder}
          <button
            class="hide-btn"
            onclick={() => handleHideOrder(order.id)}
            title="Hide order from view"
          >
            ✕
          </button>
        {/if}
        <h3>Order ID: {order.id}</h3>
        <h3>Status: {order.status}</h3>
        <h3>Items:</h3>
        <li>
          {order.items.name} x {order.items.quantity}
        </li>
        {#if order.status === "Received"}
          <button onclick={() => handleUpdateOrder(order.id, "Completed")}
            >Complete Order</button
          >
        {:else}
          <button onclick={() => handleUpdateOrder(order.id, "Received")}
            >Process Order</button
          >
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <p>No orders available.</p>
{/if}
