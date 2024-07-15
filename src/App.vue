<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <button type="button" class="btn btn-primary">Primary</button>

  <router-view />
</template>

<style lang="scss">
@import "./assets/all";
</style>
