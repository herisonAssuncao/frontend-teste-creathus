<template>
  <div>
    <b-modal id="addNewContato" title="Cadastrar Contato">
      <b-form>
        <b-form-group
          id="input-group-2"
          label="Name:"
          label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="contato.nome"
            type="text"
            required
            placeholder="Nome">
          </b-form-input>
          <span v-if="submitted && $v.contato.nome.$error" class="errorMsg">Por favor informe o Nome</span>
        </b-form-group>
        <b-form-group
          id="input-group-3"
          label="Email:"
          label-for="input-3">
          <b-form-input
            id="input-3"
            v-model="contato.email"
            type="email"
            required
            placeholder="Email">
          </b-form-input>
          <div v-if="submitted && $v.contato.email.$error" class="errorMsg">
            <span v-if="!$v.contato.email.required">Por favor informe o Email</span>
            <span v-if="$v.contato.email && !$v.contato.email.email">Informe um email válido</span>
          </div>
        </b-form-group>
        <b-form-group
          id="input-group-4"
          label="Contato:"
          label-for="input-4">
          <b-form-input
            id="input-4"
            v-model="contato.telefone"
            type="text"
            required
            placeholder="Telefone">
          </b-form-input>
          <span v-if="submitted && $v.contato.telefone.$error" class="errorMsg">
            <span v-if="!$v.contato.telefone.required">Por favor informe o Telefone</span>
            <span v-if="!$v.contato.telefone.minLength">Permitido no mínimo 10 caracteres</span>
            <span v-if="!$v.contato.telefone.maxLength">Permitido no máximo 12 caracteres</span>
          </span>
        </b-form-group>
        <b-form-group
          id="input-group-2"
          label="Sexo:"
          label-for="input-2">
          <b-form-select v-model="contato.sexo" :options="options"></b-form-select>
           <span v-if="submitted && $v.contato.sexo.$error" class="errorMsg">Por favor inform o Sexo</span>
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer>
        <div class="w-100">
          <b-button
            variant="danger"
            size="sm"
            class="float-right m-l-10"
            @click="submitForm">
            Salvar
          </b-button>
          <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="resetForm">
            Cancelar
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { BModal, BForm } from 'bootstrap-vue'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  data () {
    return {
      options: [
        { value: 'M', text: 'Masculino' },
        { value: 'F', text: 'Feminino' }
      ],
      contato: {
        id: '',
        nome: '',
        email: '',
        contact: '',
        sexo: ''
      },
      submitted: false
    }
  },
  validations: {
    contato: {
      nome: { required },
      email: { required, email },
      telefone: { required, minLength: minLength(10), maxLength: maxLength(12) },
      sexo: { required, minLength: minLength(1), maxLength: maxLength(1) }
    }
  },
  mounted () {
    this.$root.$on('edit-contato', (data) => {
      this.contato = data
      this.contato.isEdit = true
      this.submitted = false
    })
    this.$root.$on('add-contato', (data) => {
      this.contato = {}
      this.contato.isEdit = false
      this.submitted = false
    })
  },
  components: {
    'b-modal': BModal,
    'b-form': BForm
  },
  methods: {
    async atualizaContato (contato) {
      try {
        await axios.put(
          `http://54.94.80.69:9000/api/contatos/${contato.id}`,
          {
            nome: contato.nome,
            email: contato.email,
            telefone: contato.telefone,
            sexo: contato.sexo
          }
        )
        console.log('atualizou')
      } catch (error) {
        alert(error)
      }
    },
    async salvaContato (contato) {
      try {
        await axios.post(
          'http://54.94.80.69:9000/api/contatos',
          {
            nome: contato.nome,
            email: contato.email,
            telefone: contato.telefone,
            sexo: contato.sexo
          }
        )
      } catch (error) {
        alert(error)
      }
    },
    submitForm () {
      this.submitted = true
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }

      console.log('this.contato')
      console.log(this.contato)
      if (this.contato.isEdit) {
        this.atualizaContato(this.contato)
      } else {
        this.salvaContato(this.contato)
      }
      this.$bvModal.hide('addNewContato')
      this.$store.dispatch('atualizaDatatable') // dispatch store action
    },
    resetForm () {
      this.contato = {}
      this.contato.isEdit = false
      this.submitted = false
    }
  }
}
</script>

<style>

</style>
