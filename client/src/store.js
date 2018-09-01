import Vuex from 'vuex';
import Vue  from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
    state    : {
        movieSelected: null,
    },
    mutations: {
        selectMovie(state, movie) {
            state.movieSelected = movie
        },
    },
    getters  : {
        movieSelected: state => {
            return state.movieSelected
        },
    },
});
