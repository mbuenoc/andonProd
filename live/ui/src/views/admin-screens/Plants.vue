<template>
    <div>
      <v-app>
        <v-card>
          <v-card-title class="blue darken-1" id="card-title">
              <span class="h4" id="title-card">Plantas</span>
              <v-spacer></v-spacer>
              <v-text-field
                  class="field-search"
                  dark
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  ></v-text-field>
              <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                      <v-btn dark icon v-bind="attrs" v-on="on">
                          <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                  </template>
                  <v-list>
                      <v-list-item v-for="(item, i) in items" :key="i" @click="menuSelected(item)" >
                          <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                  </v-list>
                  
              </v-menu>
          </v-card-title>
          <v-data-table
              :headers="headers"
              :items="plants"
              class="elevation-1"
              :search="search"
              >
              <template v-slot:top>
                
                  <v-dialog v-model="dialog" max-width="1000px">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>
          
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="20" sm="10" md="8" >
                              <v-text-field
                                v-model="editedItem.plantName"
                                :error-messages="plantErrors"
                                label="Plant Name"
                                required
                                @input="$v.editedItem.plantName.$touch()"
                                @blur="$v.editedItem.plantName.$touch()"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
          
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close()" >
                          Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="submit()">
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text >Cancel</v-btn>
                        <v-btn color="blue darken-1" text >OK</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

              </template>

              <template v-slot:[`item.actions`]="{ item }" >
                <v-icon small class="mr-2" @click="editItem( item )">
                  mdi-pencil
                </v-icon>
                <!-- <v-icon small @click="deleteItem(item)">
                  mdi-delete
                </v-icon> -->
              </template>
            </v-data-table>
          </v-card>
        </v-app>
    </div>
</template>

<script>
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapState, mapActions } from 'vuex'

export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      plantName: {required}
    }
  },
  data: function () {
    return {
        dialog: false,
        editId: 0,
        dialogDelete: false,
        editedIndex: -1,
        search: '',
        items: [
            { title: 'Add New Plant', key: 'add_plant'}
        ],
        editedItem: {
            plantName: ''
        },
        defaultItem: {
            plantName: ''
        },
        headers: [
            { text: 'Plant', value: 'plantName'},
            { text: 'Actions', value: 'actions', sortable: false, align: 'center'}
        ]
    }
  },
  created() {

    },
  computed: {
    ...mapState(['plants']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    plantErrors() {
      const errors = []
      if (!this.$v.editedItem.plantName.$dirty) return errors
      !this.$v.editedItem.plantName.required && errors.push('Plant is required')
        return errors
    }

  },
  methods: {
      ...mapActions(["getPlants"]),
    editItem (item) {
        console.log(item)
        this.editedIndex = this.plants.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.editId = item.plantId
    },
    menuSelected(item) {
      console.log(item.key)
      switch (item.key) {
        case 'add_plant':
          this.dialog = true
          break
      }
    },
    deleteItem(item) {
        this.editedIndex = this.plants.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
    },
    close () {
        this.dialog = false
        this.$v.$reset()
        this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
        })
    },
    submit() {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        this.save()
      }
    },
    save() {
      var plantId = this.editId  
      var plantName = this.editedItem.plantName

      let plantData = {plantId:plantId, plantName:plantName}

      axios.post('/andon-api/api/savePlant', plantData)
        .then (Response => { console.log(Response.data)
          if (this.editId == 0 ) {this.$toastr.s('Plant '+ plantName + ' added', 'Success!')
          } else {this.$toastr.s('Plant '+plantName+' edited', 'Success!')}
          this.getPlants()
          this.editId = 0
        })
        .catch (error => {console.log(error) })
      
      this.close()
    }
  }
}
</script>

<style>

</style>