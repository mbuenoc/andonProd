<template>
    <div>
      <v-app>
        <v-card>
          <v-card-title class="blue darken-1" id="card-title">
              <span class="h4" id="title-card">Support Group</span>
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
              :items="groups"
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
                        <form>
                          <v-row>
                            <v-col cols="20" sm="1" md="5" >
                              <v-text-field
                                v-model="editedItem.groupName"
                                :error-messages="groupErrors"
                                label="Support Group"
                                required
                                @input="$v.editedItem.groupName.$touch()"
                                @blur="$v.editedItem.groupName.$touch()"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="20" sm="10" md="3" >
                              <v-select
                                label="Plant"
                                :items="plants"
                                item-text="plantName"
                                item-value="plantId"
                                v-model="editedItem.plantId"
                                :error-messages="plantErrors"
                                required
                                @input="$v.editedItem.plantId.$touch()"
                                @blur="$v.editedItem.plantId.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="20" sm="10" md="2" >
                              <v-select
                                label="Group Type"
                                :items="groupTypes"
                                item-text="gtypeName"
                                item-value="gtypeId"
                                v-model="editedItem.gtypeId"
                                :error-messages="groupTypesErrors"
                                required
                                @input="$v.editedItem.gtypeId.$touch()"
                                @blur="$v.editedItem.gtypeId.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="20" sm="10" md="2" >
                              <v-select
                                label="Light color"
                                :items="lightcolors"
                                item-text="color"
                                item-value="color_id"
                                v-model="editedItem.color_id"
                                :error-messages="lightErrors"
                                required
                                @input="$v.editedItem.color_id.$touch()"
                                @blur="$v.editedItem.color_id.$touch()"
                              >
                              </v-select>
                            </v-col>
                          </v-row>
                        </form>
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
                      <v-btn color="blue darken-1" text>Cancel</v-btn>
                      <v-btn color="blue darken-1" text>OK</v-btn>
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
import { mapState, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      groupName: {required},
      plantId: {required},
      gtypeId: {required},
      color_id: {required}
    },
  },
  data: function () {
    return {
        items: [
            { title: 'Add New Group', key: 'add_group'}
        ],
        dialog: false,
        editId: 0,
        dialogDelete: false,
        editedIndex: -1,
        editedItem: {
            groupName: '',
            plantId: null,
            gtypeId: null,
            color_id: null
        },
        search: '',
        defaultItem: {
            groupName: '',
            plantId: null,
            gtypeId: null,
            color_id: null
        },
        headers: [
            { text: 'Support Group', value: 'groupName'},
            { text: 'Plant', value: 'plantName', align: 'center'},
            { text: 'Group Type', value: 'gtypeName', align: 'center'},
            { text: 'Color Light', value: 'color', align: 'center'},
            { text: 'Actions', value: 'actions', sortable: false, align: 'center'}
        ]
    }
  },
  created () {

  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    ...mapState(['plants', 'groupTypes', 'lightcolors', 'groups']),
    groupErrors() {
      const errors = []
      if (!this.$v.editedItem.groupName.$dirty) return errors
      !this.$v.editedItem.groupName.required && errors.push('Group name is required')
        return errors
    },
    plantErrors() {
      const errors = []
      if (!this.$v.editedItem.plantId.$dirty) return errors
      !this.$v.editedItem.plantId.required && errors.push('Plant is required')
        return errors
    },
    groupTypesErrors() {
      const errors = []
      if (!this.$v.editedItem.gtypeId.$dirty) return errors
      !this.$v.editedItem.gtypeId.required && errors.push('Group Type is required')
        return errors
    },
    lightErrors() {
      const errors = []
      if (!this.$v.editedItem.color_id.$dirty) return errors
      !this.$v.editedItem.color_id.required && errors.push('Light color is required')
        return errors
    }
  },
  methods: {
    ...mapActions(['getGroups']),
    menuSelected(item) {
      console.log(item.key)
      switch (item.key) {
        case 'add_group':
          this.dialog = true
          break
      }
    },
    editItem (item) { //dialog donde se editan los datos
        console.log(item)
        this.editedIndex = this.groups.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.editId = item.groupId
    },
    deleteItem(item) { // abre el dialog de confirmacion de eliminar
        this.editedIndex = this.groups.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
    },
    deleteItemConfirm() { // borrar elemento aqui iria el endpoint para eliminar o ocultar el elemento
      this.groups.splice(this.editedIndex, 1)
      this.closeDelete()
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
      if (!this.$v.$invalid) {
        this.save()
      }
      //console.log()
    },
    save() { //endpoint donde guarda nuevo o editado elemento (aqui creo que no es necesario el if)
      var groupId = this.editId
      var groupName = this.editedItem.groupName
      var plantId = this.editedItem.plantId
      var gtypeId = this.editedItem.gtypeId
      var color_id = this.editedItem.color_id

      let groupData = {groupId:groupId, groupName:groupName, plantId:plantId, gtypeId:gtypeId, color_id:color_id}
        console.log(groupData)
        
      axios.post('/andon-api/api/saveSupportGroup', groupData)
        .then (Response => { console.log(Response.data)
          if (this.editId == 0 ) {this.$toastr.s('Support Group '+groupName + ' added', 'Success!')
          } else {this.$toastr.s('Support Group '+groupName+' edited', 'Success!')}
          this.getTabGroups()
          this.editId = 0
        })
        .catch (error => {console.log(error) })
      
      this.close()
    }

  }
}
</script>

<style>
.theme--light.v-data-table {
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
}
#card-title {
  padding: 10px !important;
}
.field-search {
  padding: 0  !important;
  margin: 0  !important;
}
</style>