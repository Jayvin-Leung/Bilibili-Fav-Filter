<script setup>
import { ref } from 'vue';
import Order from './items/Order.vue';
import Channel from './items/Channel.vue';
import Search from './items/Search.vue';

const emits = defineEmits(['change']);
const orderRef = ref(null);
const channelRef = ref(null);
const searchRef = ref(null);

const handleChangeOrder = (order) => {
  emits('change', [{ key: 'order', value: order }]);
};
const handleChangeChannel = (tid) => {
  emits('change', [{ key: 'tid', value: tid }]);
};
const handleChangeSearch = (type, keyword) => {
  emits('change', [
    { key: 'type', value: type },
    { key: 'keyword', value: keyword },
  ]);
};

defineExpose({
  reset: () => {
    orderRef.value?.reset && orderRef.value?.reset();
    channelRef.value?.reset && channelRef.value?.reset();
    searchRef.value?.reset && searchRef.value?.reset();
  },
});
</script>

<template>
  <div v-bind="$attrs" class="fav-list-header-filter">
    <div v-bind="$attrs" class="fav-list-header-filter__left">
      <Order v-bind="$attrs" ref="orderRef" @change="handleChangeOrder" />
    </div>
    <div v-bind="$attrs" class="fav-list-header-filter__center">
      <Channel v-bind="$attrs" ref="channelRef" @change="handleChangeChannel" />
    </div>
    <div v-bind="$attrs" class="fav-list-header-filter__right">
      <Search v-bind="$attrs" ref="searchRef" @change="handleChangeSearch" />
    </div>
  </div>
  <!---->
</template>

<style scoped></style>
