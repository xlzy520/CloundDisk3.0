<template>
  <div class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'AppMain',
  };
</script>

<style lang="scss">
.app-main {
  position: relative;
  flex-grow: 1;
  display: flex;
}
</style>
