import { ref, createApp, h } from 'vue';
import Popover from './Popover.vue';

let app = null;
const openRef = ref(false);
const targetRef = ref(null);
const itemsRef = ref([]);
const $cancelRef = ref(null);

const render = () => {
  if (app) return;
  app = createApp({
    render: () => {
      return h(Popover, {
        open: openRef.value,
        'onUpdate:open': (newValue) => (openRef.value = newValue),
        target: targetRef.value,
        items: itemsRef.value,
        onCancel: () => {
          $cancelRef.value && $cancelRef.value();
        },
      });
    },
  });
  app.mount(
    (() => {
      const div = document.createElement('div');
      document.body.append(div);
      return div;
    })()
  );
};

export default {
  open: ({ target, items, $cancel }) => {
    render();
    if (targetRef.value && targetRef.value !== target) {
      $cancelRef.value && $cancelRef.value();
    }
    openRef.value = true;
    targetRef.value = target;
    itemsRef.value = items;
    $cancelRef.value = $cancel;
  },
};
