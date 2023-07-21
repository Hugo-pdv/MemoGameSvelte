<div class="modal-background">
  <div class="modal">
    <slot />
  </div>
</div>

<style>
  .modal-background {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: grid;
    place-items: center;
    backdrop-filter: blur(10px);
    z-index: 999;
    transition: all 0.2s;
  }
</style>
