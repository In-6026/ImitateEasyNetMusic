<script setup lang="ts">
import Banner from './Banner.vue'
import Leftside from './Leftside.vue';
import Rightside from './Rightside.vue';
</script>

<template>
    <Banner />
    <div class="container flex">
        <Leftside />
        <Rightside />
    </div>
</template>

<style scoped>
.container {
    width: 980px;
    height: auto;
    min-height: 700px;
    margin: 0 auto;
    background: url("../../../assets/img/wrap1.png") repeat-y 100% 100%;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
}
</style>