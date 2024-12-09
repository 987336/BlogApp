import { createStore } from 'vuex';

export default createStore({
  state: {
    userId: '', // Initialize userId state
    username: JSON.parse(localStorage.getItem('user')) // Initialize userId state
  },
  mutations: {
    // setUserId(state, userId) {
    //   state.userId = userId; // Store the userId
    // }
  },
  actions: {
    // setUserId({ commit }, userId) {
    //   commit('setUserId', userId);
    // }
  },
  getters: {
    userdetails(state) {
      return state.username;
    },
    // getUserId: (state) => state.userId
  }
});
