<template>
  <n-modal-provider>
    <n-loading-bar-provider>
        <nav>
            <router-link to="/">Последние новости</router-link> |
            <router-link to="/allnews">Все новости</router-link>
        </nav>
        <router-view/>
    </n-loading-bar-provider>
  </n-modal-provider>
</template>

<style lang="scss">
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script setup>
import { NLoadingBarProvider, NModalProvider } from 'naive-ui'
</script>
