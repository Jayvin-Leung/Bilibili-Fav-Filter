<script setup>
const props = defineProps({
  keyword: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div v-bind="$attrs" class="fav-list-main-empty">
    <div v-bind="$attrs" class="b-img fav-list-main-empty__img">
      <img
        src="//i1.hdslb.com/bfs/static/jinkela/long/images/load-data-nothing.svg"
        class="b-img__inner"
        alt="什么都没有"
        onload="bmgCmptOnload(this)"
        onerror="bmgCmptOnerror(this)"
      />
    </div>
    <p v-bind="$attrs" v-if="keyword">
      所有收藏夹都没有相关视频_(:зゝ∠)_<br v-bind="$attrs" />换个关键词试试吧
    </p>
    <p v-bind="$attrs" v-else>这里还什么都没有呢～</p>
  </div>
</template>

<style scoped></style>
