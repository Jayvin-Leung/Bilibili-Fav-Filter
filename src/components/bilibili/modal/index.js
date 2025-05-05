import { ref, shallowRef, createApp, h } from 'vue';
import Modal from './Modal.vue';

let app = null;
const openRef = ref(false);
const wrapClassNameRef = ref('');
const titleRef = ref('');
const templateRef = shallowRef(null);
const templatePropsRef = ref(null);
const $okRef = ref(null);
const $cancelRef = ref(null);
const $closeRef = ref(null);

const render = () => {
  if (app) return;
  app = createApp({
    render: () => {
      return h(
        Modal,
        {
          open: openRef.value,
          'onUpdate:open': (newValue) => (openRef.value = newValue),
          wrapClassName: wrapClassNameRef.value,
          title: titleRef.value,
          okText: $okRef.value && '确定',
          onOk: () => {
            $okRef.value && $okRef.value();
          },
          cancelText: $cancelRef.value && '取消',
          onCancel: () => {
            $cancelRef.value && $cancelRef.value();
          },
          onClose: () => {
            $closeRef.value && $closeRef.value();
          },
        },
        () => templateRef.value && h(templateRef.value, { ...templatePropsRef.value })
      );
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
  open: ({ wrapClassName, title, template, templateProps, $ok, $cancel, $close }) => {
    render();
    openRef.value = true;
    wrapClassNameRef.value = wrapClassName;
    titleRef.value = title;
    templateRef.value = template;
    templatePropsRef.value = templateProps;
    $okRef.value = $ok;
    $cancelRef.value = $cancel;
    $closeRef.value = $close;

    return () => {
      openRef.value = false;
      $closeRef.value && $closeRef.value();
    };
  },
};
