<script setup>
const selected = defineModel('selected');
const props = defineProps({
  favs: {
    type: Array,
    required: true,
    default: [],
  },
});

const handleSelect = (id, event) => {
  event.preventDefault();
  event.stopPropagation();
  selected.value = id;
};
</script>

<template>
  <div class="modify-fav-wrapper">
    <div class="modify-fav-list">
      <div class="vui_radio-group">
        <label
          role="radio"
          v-for="fav in favs"
          :class="{
            vui_radio: true,
            'modify-fav-item': true,
            'vui_radio--checked': selected === fav.id,
          }"
          @click="(event) => handleSelect(fav.id, event)"
        >
          <span class="vui_radio--input">
            <input type="radio" class="vui_radio--input-original" :value="fav.id" />
            <span class="vui_radio--input-box"></span>
          </span>
          <span class="vui_radio--label">
            <div class="modify-fav-item__content">
              <div class="modify-fav-item__info">
                <i
                  class="vui_icon sic-fsp-folder_locked_line"
                  style="font-variation-settings: 'strk' 1.5; font-size: 20px"
                ></i>
                <div class="modify-fav-item__title">{{ fav.title }}</div>
              </div>
              <div class="modify-fav-item__count">{{ fav.media_count }}</div>
            </div>
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
