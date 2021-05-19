<template lang="pug">
.test-cases.container
  h1 Test Cases
  table.table.table-bordered
    thead
      tr
        th Title
        th Link
        th
    tbody
      tr(v-for="(item, index) in testCases")
        td {{item.title}}
        td
          a(
            :href="item.link",
            target="_blank",
          ) {{item.link}}
        td
          button.btn.btn-sm.btn-danger(
            type="button",
            @click="doRemove(index)",
          )
            i.bi.bi-trash
</template>

<script>
import {
  computed,
  ref,
} from 'vue';
import {useStore} from 'vuex';

export default {
  setup() {
    function doRemove(index) {
      if (!confirm('Are you sure to delete this case?')) {
        return;
      }

      testCases.value.splice(index, 1);
    }

    const store = useStore();

    const testCases = computed(() => {
      return store.state.cases;
    });

    return {
      testCases,

      doRemove,
    };
  },
};
</script>
