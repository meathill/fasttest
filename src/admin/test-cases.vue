<template lang="pug">
.test-cases.container
  h1 Test Cases
  table.table.table-bordered
    thead
      tr
        th Title
        th Link
        th
    tbody(ref="tbody")
      template(v-for="(item, index) in testCases")
        tr(
          @change="onChange(index)",
        )
          template(v-if="item.isEditing")
            td
              input.form-control(
                v-model="item.title",
                title="Title",
                placeholder="Title",
                @keyup.enter="doSave(index)",
              )
            td
              input.form-control(
                v-model="item.link",
                type="url",
                title="Link",
                placeholder="Link",
                @keyup.enter="doSave(index)",
              )
            td
              .btn-group-sm
                button.btn.btn-primary(
                  type="button",
                  @click="doSave(index)",
                )
                  i.bi.bi-check

                button.btn.btn-outline-secondary.ms-2(
                  type="button",
                  @click="doCancel(index)",
                )
                  i.bi.bi-x

          template(v-else)
            td {{item.title}}
            td
              a(
                :href="item.link",
                target="_blank",
              ) {{item.link}}
            td
              .btn-group-sm
                button.btn.btn-info(
                  type="button",
                  @click="doEdit(index)",
                )
                  i.bi.bi-pencil-square

                button.btn.btn-danger.ms-3(
                  type="button",
                  @click="doRemove(index)",
                )
                  i.bi.bi-trash

    tbody
      tr
        td(colspan="3")
          button.btn.btn-primary(
            type="button",
            @click="doAdd",
          )
            i.bi.bi-plus-lg.me-2
            | Add new case
</template>

<script>
import {
  reactive,
  ref,
  watch,
  nextTick,
  onMounted,
} from 'vue';
import {useStore} from 'vuex';
import {SET_CASES} from './store';

export default {
  setup() {
    async function doAdd() {
      testCases.push({
        title: '',
        link: '',
        isEditing: true,
        isNew: true,
      });
      await nextTick();
      inputs[inputs.length - 2].focus();
    }
    async function doEdit(index) {
      testCases[index].isEditing = true;
      const {title, link} = testCases[index];
      testCases[index].backup = {
        title,
        link,
      };
      await nextTick();
      inputs[index * 2].select();
      inputs[index * 2].focus();
    }
    function doSave(index) {
      testCases[index].isNew = false;
      let cases = testCases.filter(item => {
        return !item.isNew;
      });
      cases = cases.map(item => {
        const {isEditing, backup} = item;
        return isEditing && backup ? backup : item;
      });
      store.commit(SET_CASES, cases);
      testCases[index].isEditing = false;
    }
    function doCancel(index) {
      if (testCases[index].changed && !confirm('This row has been changed, are you sure to cancel?')) {
        return;
      }

      if (testCases[index].isNew) {
        return testCases.splice(index, 1);
      }
      const {backup: {title, link}} = testCases[index];
      testCases[index] = {
        isEditing: false,
        title,
        link,
      };
    }
    function doRemove(index) {
      if (!confirm('Are you sure to delete this case?')) {
        return;
      }

      testCases.splice(index, 1);
    }
    function onChange(index) {
      testCases[index].changed = true;
    }

    const store = useStore();
    const testCases = reactive(store.state.cases ? [...store.state.cases] : []);
    const tbody = ref(null);
    let inputs;

    watch(store.state, ({cases}) => {
      if (testCases.length > 0) {
        return;
      }
      testCases.push(...(cases || []).map(item => {
        return {
          isEditing: false,
          ...item,
        };
      }));
    });

    onMounted(() => {
      inputs = tbody.value.getElementsByTagName('input');
    });
    return {
      testCases,
      tbody,

      doAdd,
      doEdit,
      doSave,
      doCancel,
      doRemove,
      onChange,
    };
  },
};
</script>
