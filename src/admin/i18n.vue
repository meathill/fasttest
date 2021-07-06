<template lang="pug">
.i18n.container
  h1 Internationility

  .row.align-items-start
    form.col-lg-6.col-sm-12(
      v-for="(langItem, index) in list",
      @submit.prevent="doSave(index)",
    )
      table.table.table-bordered(v-if="langItem.isEditing")
        tbody
          tr
            th.w-50 Language
            td
              input.form-control(
                v-model="langItem.language",
                required,
              )
          tr
            th Path
            td
              input.form-control(
                v-model="langItem.path",
                required,
              )
        tbody.border-t-2
          tr(v-for="(value, key) in langItem.items")
            th
              label(:for="'t-' + index + '-f-' + key") {{key}}
            td
              input.form-control(
                :id="'t-' + index + '-f-' + key",
                v-model="langItem.items[key]",
              )
        tbody.border-t-2
          tr
            th
              label(:for="'t-' + index + '-intro'") Introduction
            td
              textarea.form-control(
                :id="'t-' + index + '-intro'",
                rows="5",
                v-model="langItem.intro",
              )
        tbody.border-t-2
          tr
            td(colspan="2")
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

      table.table.table-bordered(v-else)
        tbody
          tr
            th.w-50 Language
            td {{langItem.language}}
          tr
            th Path
            td {{langItem.path}}
        tbody.border-t-2
          tr(v-for="(value, key) in langItem.items")
            th {{key}}
            td {{value}}
        tbody.border-t-2
          tr
            th Introduction
            td.pre-wrap {{langItem.intro}}
        tbody.border-t-2
          tr
            td(colspan="2")
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

    button.btn.btn-primary.col-2(
      type="button",
      @click="doAdd",
    )
      i.bi.bi-plus-lg.me-2
      | Add new Language
</template>

<script>
import {
  reactive,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import clone from 'lodash/clone';
import map from 'lodash/map';
import { SET_LANG } from './store';

export default {
  setup() {
    async function doAdd() {
      list.push({
        isEditing: true,
        isNew: true,
        language: 'new language',
        items: clone(baseLang),
      });
    }
    async function doEdit(index) {
      list[index].isEditing = true;
      const { items } = list[index];
      list[index].backup = clone(items);
    }
    function doSave(index) {
      list[index].isNew = false;
      list[index].isEditing = false;
      const lang = list.reduce((memo, item) => {
        if (item.isNew) {
          return memo;
        }
        let {
          isEditing,
          backup,
          items,
          language,
          path,
          intro,
        } = item;
        items = isEditing && backup ? backup : items;
        memo[language] = {
          __path: path,
          __intro: intro,
          ...items,
        };
        return memo;
      }, {});
      store.commit(SET_LANG, { lang });
    }
    function doCancel(index) {
      if (list[index].changed && !confirm('This language has been changed, are you sure to cancel?')) {
        return;
      }

      if (list[index].isNew) {
        return list.splice(index, 1);
      }
      const { backup } = list[index];
      list[index].items = backup;
      list[index].isEditing = false;
    }
    function doRemove(index) {
      if (!confirm('Are you sure to delete this case?')) {
        return;
      }

      list.splice(index, 1);
    }
    function onChange(index) {
      list[index].changed = true;
    }

    function langToLocalLang(lang) {
      return map(lang, (items, language) => {
        const {
          __path,
          __intro,
          ...rest
        } = items;
        items = rest;
        return {
          language,
          path: __path,
          items: Object.assign({}, baseLang, items),
          isEditing: false,
          intro: __intro,
        };
      });
    }
    function toObject(array, target = {}) {
      for (const key of array) {
        target[key] = '';
      }
      return target;
    }

    const store = useStore();
    const baseLang = store.state.baseLang ? toObject(store.state.baseLang) : {};
    const list = reactive(store.state.lang ? langToLocalLang(store.state.lang) : []);

    watch(store.state, ({ lang, baseLang: langKeys }) => {
      if (list.length > 0) {
        return;
      }
      if (langKeys) {
        toObject(langKeys, baseLang);
      }
      list.push(...langToLocalLang(lang));
    });

    return {
      list,

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
