import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dadosContatos: [],
    paginacao: {}
  },
  mutations: {
    atualiza (state, contatos) {
      state.paginacao = contatos
      state.dadosContatos = contatos.content
    }
  },
  actions: {
    atualizaDatatable ({ commit }, page = 0) {
      axios.get(
        `http://54.94.80.69:9000/api/contatos?page=${page}`,
        {
          auth: {
            username: 'admin',
            password: 'admin'
          }
        }
      ).then((response) => {
        commit('atualiza', response.data.dados)
      })
    }
  }
})
