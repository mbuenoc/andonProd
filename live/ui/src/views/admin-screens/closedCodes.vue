<template>
    <div>
      <v-app>
        <v-card>
          <v-card-title class="blue darken-1" id="card-title">
              <span class="h4" id="title-card">Closed Codes</span>
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
              :items="codesData"
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
                            <v-col cols="20" sm="10" md="6" >
                              <v-text-field
                                v-model="editedItem.details"
                                :error-messages="closedCodeErrors"
                                label="Code Description"
                                required
                                @input="$v.editedItem.details.$touch()"
                                @blur="$v.editedItem.details.$touch()"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="20" sm="10" md="1" >
                              <v-select
                                label="Level"
                                :items="levelCode"
                                v-model="editedItem.levelCode"
                                :error-messages="levelCodeErrors"
                                required
                                @change="getClosedCodebyLevel()"
                                @input="$v.editedItem.levelCode.$touch()"
                                @blur="$v.editedItem.levelCode.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="20" sm="10" md="5" >
                              <v-select
                                label="Code Parent"
                                :items="codesParent"
                                :disabled="disabled"
                                item-text="details"
                                item-value="closedcodeId"
                                v-model="editedItem.parentId"
                                :error-messages="codeParentErrors"
                                required
                                @input="$v.editedItem.parentId.$touch()"
                                @blur="$v.editedItem.parentId.$touch()"
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
//import { mapState, mapActions } from 'vuex'

export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      details: {required},
      levelCode: {required},
      parentId: {required}
    }
  },
  data: function () {
    return {
        codes:[],
        levelCode: [1,2,3],
        items: [
            { title: 'Add New Code', key: 'add_code'}
        ],
        codesParent: [],
        dialog: false,
        editId: 0,
        search: '',
        dialogDelete: false,
        codesData: [],
        disabled: false,
        editedIndex: -1,
        editedItem: {
            details: '',
            levelCode: null,
            parentId: null
        },
        defaultItem: {
            details: '',
            levelCode: null,
            parentId: null
        },
        headers: [
            { text: 'Closed Code Description', value: 'details'},
            { text: 'Level', value: 'levelCode', align: 'center'},
            { text: 'Parent Code', value: 'parentName', align: 'center'},
            { text: 'Actions', value: 'actions', sortable: false, align: 'center'}
        ]
    }
  },
  created() {
    this.getTabClosedCodes()
    },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    closedCodeErrors() {
      const errors = []
      if (!this.$v.editedItem.details.$dirty) return errors
      !this.$v.editedItem.details.required && errors.push('Description is required')
        return errors
    },
    levelCodeErrors() {
      const errors = []
      if (!this.$v.editedItem.levelCode.$dirty) return errors
      !this.$v.editedItem.levelCode.required && errors.push('Level is required')
        return errors
    },
    codeParentErrors() {
      const errors = []
      if (!this.$v.editedItem.parentId.$dirty) return errors
      !this.$v.editedItem.parentId.required && errors.push('Parent Code is required')
        return errors
    }

  },
  methods: {
    getTabClosedCodes() {
        axios.get('/andon-api/api/closedcodes/list')
        .then (Response => { 
          console.log(Response.data)
          this.codes = Response.data;
          this.format()
        })
        .catch (error => {console.log(error) })
    },
    format() {
      this.codesData = this.codes
      this.codesData.forEach(element => {
        element.parentName = null
      })
      for(let i = 0; i < this.codesData.length; i++) {
        if(this.codesData[i].parentId === 0) {
          this.codesData[i].parentName = ''
        } else {
          var code = this.codes.find(x => x.closedcodeId === this.codesData[i].parentId)
          this.codesData[i].parentName = code.details
        }
      }
      console.log(this.codesData)
    },
    getClosedCodebyLevel() {
      var levelCode = this.editedItem.levelCode
      if (levelCode === 1) {
        this.disabled = true
        this.editedItem.parentId = 0
      } else {
        this.disabled = false
        levelCode = levelCode - 1
        axios.get('/andon-api/api/closedcodes/level?levelCode=' + levelCode)
          .then (Response => { console.log(Response.data)
              this.codesParent = Response.data; })
          .catch (error => {console.log(error) })
      }
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
        this.getClosedCodebyLevel()
        this.dialog = true
        this.editId = item.closedcodeId
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
      var closedcodeId = this.editId  
      var details = this.editedItem.details
      var levelCode = this.editedItem.levelCode
      var parentId = this.editedItem.parentId

      let closedcodeData = {closedcodeId:closedcodeId, details:details, levelCode:levelCode, parentId:parentId}
      console.log(closedcodeData)

      axios.post('/andon-api/api/saveClosedCode', closedcodeData)
        .then (Response => { console.log(Response.data)
          if (this.editId == 0 ) {this.$toastr.s('Closed Code '+ details + ' added', 'Success!')
          } else {this.$toastr.s('Closed Code '+details+' edited', 'Success!')}
          this.getTabClosedCodes()
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