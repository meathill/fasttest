import axios from 'axios';
import { createStore } from 'vuex';

export const GET_DATA = 'getData';
export const SET_CASES = 'setCases';
export const SET_LANG = 'setLang';

const state = {
  cases: null,
  lang: null,
  baseLang: null,
};
const mutations = {
  [SET_CASES](state, cases) {
    state.cases = cases.map(({title, link}) => ({title, link}));
  },
  [SET_LANG](state, {lang, baseLang}) {
    state.lang = lang;
    if (baseLang) {
      state.baseLang = baseLang;
    }
  },
};
const actions = {
  async [GET_DATA]({commit}) {
    const response = await axios.get('/data');
    const {cases, lang, baseLang} = response.data;
    commit(SET_CASES, cases);
    commit(SET_LANG, {lang, baseLang});
  },
};

const store = createStore({
  state,
  mutations,
  actions,
});

export default store;
