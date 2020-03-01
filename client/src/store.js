import Vuex from 'vuex';
import Vue  from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
    state    : {
        movieSelected: null,
        listMovie: null,
    },
    mutations: {
        selectMovie(state, movie) {
            state.movieSelected = movie
        },
        setListMovie(state, listMovie) {
            state.listMovie = listMovie
        },
    },
    getters  : {
        movieSelected: state => {
            return state.movieSelected
        },
        listMovie: state => {
            return state.listMovie
        },
    },
});
