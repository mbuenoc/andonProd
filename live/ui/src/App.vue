<template>
  <div id="app" data-app>
    <HeaderMenu/>
    <router-view/>
  </div>
</template>

<script>
import HeaderMenu from '@/components/HeaderMenu.vue'

export default {
  name: 'App',
  components: {
    HeaderMenu
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Oswald&display=swap');
</style>
<style src="./Style.scss" lang="scss"/>
