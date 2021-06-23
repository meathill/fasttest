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

        li.nav-item
          a.nav-link(
            href="https://afasttest.com",
            target="_blank",
          )
            i.bi.bi-speedometer.me-2
            | Homepage

    .ms-auto.d-flex
      .alert.mb-0.me-2.py-1.px-3(
        v-if="message",
        :class="status ? 'alert-success' : 'alert-danger'",
      ) {{message}}
      .alert.alert-info.mb-0.me-2.py-1.px-3.animated.flash.infinite.slower(
        v-if="currentStatus",
      ) {{currentStatus}}
      button.btn.btn-primary(
        type="button",
        :disabled="isLoading || isPublishing",
        @click="doPublish",
      )
        span.spinner-border.spinner-border-sm.me-2(v-if="isPublishing")
        i.bi.bi-check-all.me-2(v-else)
        | Publish

router-view
</template>

<script>
import {
  ref,
  onBeforeMount,
} from 'vue';
import { useStore } from 'vuex';
import { GET_DATA } from './store';
import { publish } from '@/service';

export default {
  setup() {
    async function doPublish() {
      if (isLoading.value) {
        return;
      }
      isPublishing.value = true;
      message.value = status.value = null;
      try {
        const { cases, lang } = store.state;
        let offset = 0;
        await publish({ cases, lang }, ({ target: xhr }) => {
          const { responseText } = xhr;
          const chunk = responseText.substring(offset);
          offset = responseText.length;
          currentStatus.value = chunk;
        });
        status.value = true;
        currentStatus.value = '';
        message.value = 'Published successfully.';
      } catch (e) {
        message.value = 'Failed to publish. ' + e.message;
      }
      isPublishing.value = false;
    }

    const isLoading = ref(true);
    const isPublishing = ref(false);
    const status = ref(false);
    const currentStatus = ref('');
    const message = ref('');
    const store = useStore();

    onBeforeMount(async() => {
      await store.dispatch(GET_DATA);
      isLoading.value = false;
    });

    return {
      isLoading,
      isPublishing,
      status,
      message,
      currentStatus,

      doPublish,
    };
  },
};
</script>
