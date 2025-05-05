import { ref, createApp, h } from 'vue';
import Message from './Message.vue';

let app = null;
let timerId = null;
const openRef = ref(false);
const textRef = ref('');

const render = () => {
  if (app) return;
  app = createApp({
    render: () => {
      return h(Message, {
        open: openRef.value,
        text: textRef.value,
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
  info: ({ text }) => {
    render();
    openRef.value = true;
    textRef.value = text;
    timerId && clearTimeout(timerId);
    timerId = setTimeout(() => {
      openRef.value = false;
    }, 3000);
  },
};
