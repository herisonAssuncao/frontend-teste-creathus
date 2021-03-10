<template>
  <div class="home">
    <h3 class="heading">Agenda de Contatos</h3>
    <div style="float:right;margin:10px;">
      <b-button size="sm" @click="addContato">Cadastrar Contato</b-button>
    </div>
  <div class="table-responsive">
    <table class="table table-striped table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Nome</th>
      <th scope="col">Email</th>
      <th scope="col">Telefone</th>
      <th scope="col">Sexo</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(contato, index) in listaContatos" :key="index">
      <td>{{contato.id}}</td>
      <td>{{contato.nome}}</td>
      <td>{{contato.email}}</td>
      <td>{{contato.telefone}}</td>
      <td>{{contato.sexo}}</td>
      <td><b-button size="sm" class="mr-1" @click="editContato(contato)">
          Editar
        </b-button>
        <b-button size="sm" @click="deleteContato(contato)">
          Excluir
        </b-button></td>
    </tr>
  </tbody>
</table>
 </div>
    <b-col sm="3" md="3" class="my-1 float-right">
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
       >
      </b-pagination>
    </b-col>
    <AddContato />
  </div>
</template>

<script>
import AddContato from './AddContato.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    AddContato
  },
  data () {
    return {
      fields: [
        {
          key: 'id', label: 'ID', sortable: true, sortDirection: 'desc'
        },
        {
          key: 'nome', label: 'Name', sortable: true, class: 'text-left'
        },
        {
          key: 'email', label: 'Email', sortable: true
        },
        {
          key: 'telefone', label: 'Telefone', sortable: true
        },
        {
          key: 'sexo', label: 'Sexo', sortable: true
        },
        {
          key: 'action', label: 'Actions'
        }
      ],
      contatos: [],
      currentPage: 1,
      totalRows: 0,
      perPage: 3,
      pageOptions: [2, 5, 10, 15]
    }
  },
  computed: {
    listaContatos () {
      return this.$store.state.dadosContatos
    },
    paginacao () {
      return this.$store.state.paginacao
    }
  },
  watch: {
    paginacao (val) {
      this.perPage = val.pageable.pageSize
      this.totalRows = val.totalElements
    },
    listaContatos: {
      deep: true,
      handler: function (list) {
        // eslint-disable-next-line no-self-assign
        this.totalRows = this.totalRows
      }
    },
    currentPage (val) {
      this.getContatos((val - 1))
    }
  },
  created () {
    this.carregaListaContato()
    this.getContatos()
  },
  methods: {
    getContatos (page = 0) {
      this.$store.dispatch('atualizaDatatable', page)
    },
    carregaListaContato () {
      // eslint-disable-next-line no-self-assign
      this.totalRows = this.totalRows
    },
    async removeContato (id) {
      try {
        await axios.delete(`http://54.94.80.69:9000/api/contatos/${id}`)
      } catch (error) {
        alert(error)
      }
    },
    addContato () {
      this.$root.$emit('add-contato', {})
      this.$bvModal.show('addNewContato')
    },
    editContato (contato) {
      this.$root.$emit('edit-contato', contato)
      this.$bvModal.show('addNewContato')
    },
    deleteContato (contato) {
      this.$bvModal.msgBoxConfirm('Por favor, confirme que você deseja excluir o contato.', {
        title: 'Por favor confirme',
        size: 'mm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'SIM',
        cancelTitle: 'NAO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then((value) => {
          if (value) {
            this.removeContato(contato.id)
            this.$store.dispatch('atualizaDatatable')
          }
        })
        .catch((erro) => {
          console.log('erro', RangeError)
        })
    }
  }
}
</script>
