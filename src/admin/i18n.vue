<template lang="pug">
.i18n.container
  h1 Internationility

  .row.align-items-start
    form.col-lg-6.col-sm-12(
      v-for="(langItem, index) in list",
      @submit.prevent="doSave(index)",
    )
      table.table.table-bordered
        tbody(v-if="langItem.isEditing")
          tr
            th Language
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
          tr(v-for="(value, key) in langItem.items")
            th {{key}}
            td
              input.form-control(
                v-model="langItem.items[key]",
              )
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

        tbody(v-else)
          tr
            th Language
            td {{langItem.language}}
          tr
            th Path
            td {{langItem.path}}
          tr(v-for="(value, key) in langItem.items")
            th {{key}}
            td {{value}}
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
        } = item;
        items = isEditing && backup ? backup : items;
        memo[language] = {
          __path: path,
          ...items,
        };
        return memo;
      }, {});
      store.commit(SET_LANG, { lang });
    }
    function doCancel(index) {
      if (list[index].changed && !confirm('This row has been changed, are you sure to cancel?')) {
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
          ...rest
        } = items;
        items = rest;
        return {
          language,
          path: __path,
          items: Object.assign({}, baseLang, items),
          isEditing: false,
        };
      });
    }

    const store = useStore();
    const list = reactive(store.state.lang ? langToLocalLang(store.state.lang) : []);
    const baseLang = {};

    watch(store.state, ({ lang, baseLang: langKeys }) => {
      if (list.length > 0) {
        return;
      }
      if (langKeys) {
        for (const key of langKeys) {
          baseLang[key] = '';
        }
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
