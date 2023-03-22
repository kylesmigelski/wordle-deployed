import { createStore } from 'vuex';

export interface State {
    username: string;
    displayUsername: string;
    userID: string;
    solutionWord: string;
    gameOver: boolean;
}

export default createStore<State>({
    state: {
        username: '',
        displayUsername: '',
        userID: '',
        solutionWord: '',
        gameOver: false
    },
    mutations: {
        setUsername(state, payload: string) {
            state.username = payload;
        },
        setDisplayUsername(state, payload: string) {
            state.displayUsername = payload;
        },
        setUserID(state, payload: string) {
            state.userID = payload;
        },
        setSolutionWord(state, payload: string) {
            state.solutionWord = payload;
        },
        setGameOver(state, payload: boolean) {
            state.gameOver = payload;
        }
    },
    actions: {
        setUsername({ commit }, payload: string) {
            commit('setUsername', payload);
        },
        setDisplayUsername({ commit }, payload: string) {
            commit('setDisplayUsername', payload);
        },
        setUserID({ commit }, payload: string) {
            commit('setUserID', payload);
        },
        setSolutionWord({ commit }, payload: string) {
            commit('setSolutionWord', payload);
        },
        setGameOver({ commit }, payload: boolean) {
            commit('setGameOver', payload);
        }
    },
    getters: {
        getUsername(state) {
            return state.username;
        },
        getDisplayUsername(state) {
            return state.displayUsername;
        },
        getUserID(state) {
            return state.userID;
        },
        getSolutionWord(state) {
            return state.solutionWord;
        },
        getGameOver(state) {
            return state.gameOver;
        }
    },
});

