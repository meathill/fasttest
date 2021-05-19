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

      button.btn.btn-primary.ms-auto(
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

export default {
  setup() {
    async function doPublish() {
      isPublishing.value = true;

      isPublishing.value = false;
    }

    const isPublishing = ref(false);
    const store = useStore();

    onBeforeMount(() => {
      store.dispatch(GET_DATA);
    });

    return {
      isPublishing,

      doPublish,
    };
  },
};
</script>
