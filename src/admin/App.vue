<template lang="pug">
nav.navbar.navbar-expand-lg.navbar-light.bg-light.mb-3
  .container
    a.navbar-brand(href="/") FastTest Admin

    .collapse.navbar-collapse
      ul.navbar-nav.me-auto.mb-2.mb-lg-0
        li.nav-item
          router-link.nav-link(
            :to="{name: 'cases'}",
          ) Test Cases
        li.nav-item
          router-link.nav-link(
            :to="{name: 'i18n'}",
          ) i18n

    .ms-auto.d-flex
      .alert.mb-0.me-3.py-1.px-3(
        v-if="message",
        :class="status ? 'alert-success' : 'alert-danger'",
      ) {{message}}
      button.btn.btn-primary(
        type="button",
        :disabled="isPublishing",
        @click="doPublish",
      )
        span.spinner-border.spinner-border-sm.me-2(v-if="isPublishing")
        | Publish

router-view
</template>

<script>
import {
  ref,
  onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';
import {GET_DATA} from './store';
import {publish} from "@/service";

export default {
  setup() {
    async function doPublish() {
      isPublishing.value = true;
      message.value = status.value = null;
      try {
        const {cases, lang} = store.state;
        await publish({cases, lang});
        status.value = true;
        message.value = 'Published successfully.';
      } catch (e) {
        message.value = 'Failed to publish. ' + e.message;
      }
      isPublishing.value = false;
    }

    const isPublishing = ref(false);
    const status = ref(false);
    const message = ref('');
    const store = useStore();

    onBeforeMount(() => {
      store.dispatch(GET_DATA);
    });

    return {
      isPublishing,
      status,
      message,

      doPublish,
    };
  },
};
</script>
