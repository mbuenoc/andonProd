<template>
    <div>
      <v-app>
        <v-card>
          <v-card-title class="blue darken-1" id="card-title">
              <span class="h4">Codes</span>
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
              :items="codes"
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
                            <v-col cols="20" sm="10" md="2" >
                              <v-text-field
                                v-model="editedItem.identifierCode"
                                :error-messages="coErrors"
                                label="Code"
                                required
                                @input="$v.editedItem.identifierCode.$touch()"
                                @blur="$v.editedItem.identifierCode.$touch()"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="20" sm="10" md="6" >
                              <v-text-field
                                v-model="editedItem.codeDescription"
                                :error-messages="codeErrors"
                                label="Code Description"
                                required
                                @input="$v.editedItem.codeDescription.$touch()"
                                @blur="$v.editedItem.codeDescription.$touch()"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="20" sm="10" md="3" >
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
import { mapState } from 'vuex'

export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      identifierCode: {required},
      codeDescription: {required},
      gtypeId: {required}
    }
  },
  data: function () {
    return {
        codes: [],
        dialog: false,
        editId: 0,
        dialogDelete: false,
        editedIndex: -1,
        search:'',
        editedItem: {
            identifierCode:'',
            codeDescription: '',
            gtypeId: null
        },
        defaultItem: {
            identifierCode: '',
            codeDescription: '',
            gtypeId: null
        },
        items: [
            { title: 'Add New Code', key: 'add_code'}
        ],
        headers: [
            { text: 'Code', value: 'identifierCode', align: 'center'},
            { text: 'Code Description', value: 'codeDescription'},
            { text: 'GroupType', value: 'gtypeName', align: 'center'},
            { text: 'Actions', value: 'actions', sortable: false, align: 'center'}
        ]
    }
  },
  created () {
      this.getTabCodes()
  },
  computed: {
    ...mapState(['groupTypes']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    coErrors() {
      const errors = []
      if (!this.$v.editedItem.identifierCode.$dirty) return errors
      !this.$v.editedItem.identifierCode.required && errors.push('Code is required')
        return errors
    },
    codeErrors() {
      const errors = []
      if (!this.$v.editedItem.codeDescription.$dirty) return errors
      !this.$v.editedItem.codeDescription.required && errors.push('Code description is required')
        return errors
    },
    groupTypesErrors() {
      const errors = []
      if (!this.$v.editedItem.gtypeId.$dirty) return errors
      !this.$v.editedItem.gtypeId.required && errors.push('Group Type is required')
        return errors
    }

  },
  methods: {
    getTabCodes() {
      axios.get('/andon-api/api/codes')
      .then (Response => { console.log(Response.data)
            this.codes = Response.data; })
        .catch (error => {console.log(error) })
    },
    menuSelected(item) {
        console.log(item.key)
        switch (item.key) {
            case 'add_code':
                this.dialog = true
                break
        }
    },
    editItem (item) {
        console.log(item)
        this.editedIndex = this.codes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.editId = item.codeId
    },
    deleteItem(item) {
        this.editedIndex = this.codes.indexOf(item)
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
      var codeId = this.editId
      var codeDescription = this.editedItem.codeDescription
      var gtypeId = this.editedItem.gtypeId
      var identifierCode = this.editedItem.identifierCode

      let codeData = {codeId:codeId, codeDescription:codeDescription, gtypeId:gtypeId, identifierCode:identifierCode}
      console.log(codeData)

      axios.post('/andon-api/api/saveCode', codeData)
        .then (Response => { console.log(Response.data)
          if (this.editId == 0 ) {this.$toastr.s('Code '+ codeDescription + ' added', 'Success!')
          } else {this.$toastr.s('Code '+codeDescription+' edited', 'Success!')}
          this.getTabCodes()
          this.editId = 0
        })
        .catch (error => {console.log(error) })
      
      this.close()
    }
  }
}
</script>

<style>
#card-title {
    padding: 10px !important;
}
.field-search {
    padding: 0  !important;
    margin: 0  !important;
    
}
</style>