<template>
  <div class="card">
    <div class="card-title">
      <slot name="title"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  padding: 1.5em;
  border: 1px solid #e4e4e4;
  border-radius: 1em;
  margin: 1em 1em 1em 1em;
}

.card-title {
  position: absolute;
  top: -0.75em;
  left: 1.5em;
  background-color: white;
  padding: 0 0.5em;
}
</style>
