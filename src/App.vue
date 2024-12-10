<template>
  <router-view></router-view>
</template>

<script setup lang="ts">

const  updateTheme = () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.style.color = 'white'; // 深色模式
  } else {
    document.body.style.color = 'black'; // 浅色模式
  }
}
window.addEventListener('wheel', function(event:any){
  console.log(event,'event')
  if (event.ctrlKey === true || event.metaKey) {
    event.preventDefault();
  }
},{ passive: false});


window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
</script>

<style scoped>
@media (prefers-color-scheme: dark) {
  body {
    color: white; /* 深色模式下的字体颜色 */
  }
}
/* 浅色模式 */
@media (prefers-color-scheme: light) {
  body {color: #000; }
}
body{
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
