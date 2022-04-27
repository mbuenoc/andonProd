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
              :items="escalationLevels"
              class="elevation-1"
              :search="search"
              >
              <template v-slot:top>
                
                  <v-dialog v-model="dialog" max-width="1400px">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>
          
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="20" sm="10" md="3" >
                              <v-select
                                label="Support Group"
                                :items="groups"
                                item-text="groupName"
                                item-value="groupId"
                                v-model="editedItem.groupId"
                                :error-messages="groupErrors"
                                required
                                @input="$v.editedItem.groupId.$touch()"
                                @blur="$v.editedItem.groupId.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="20" sm="10" md="3" >
                              <v-select
                                label="Area"
                                :items="areas"
                                item-text="areaName"
                                item-value="areaId"
                                v-model="editedItem.areaId"
                                :error-messages="areaErrors"
                                required
                                @input="$v.editedItem.areaId.$touch()"
                                @blur="$v.editedItem.areaId.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="20" sm="10" md="3" >
                              <v-select
                                label="User"
                                :items="users"
                                item-text="userId"
                                item-value="userId"
                                v-model="editedItem.userId"
                                :error-messages="userErrors"
                                required
                                @input="$v.editedItem.userId.$touch()"
                                @blur="$v.editedItem.userId.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="20" sm="10" md="1" >
                              <v-select
                                label="Level"
                                :items="levels"
                                v-model="editedItem.level"
                                :error-messages="levelErrors"
                                required
                                @input="$v.editedItem.level.$touch()"
                                @blur="$v.editedItem.level.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="20" sm="10" md="1" >
                              <v-select
                                label="Time"
                                :items="times"
                                v-model="editedItem.time"
                                :error-messages="timeErrors"
                                required
                                @input="$v.editedItem.time.$touch()"
                                @blur="$v.editedItem.time.$touch()"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="20" sm="10" md="1" >
                              <v-select
                                label="Color"
                                :items="colors"
                                v-model="editedItem.color"
                                :error-messages="colorErrors"
                                required
                                @input="$v.editedItem.color.$touch()"
                                @blur="$v.editedItem.color.$touch()"
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
      groupId: {required},
      areaId: {required},
      userId: {required},
      time: {required},
      level: {required},
      color: {required}
    }
  },
  data: function () {
    return {
        escalationLevels:[],
        dialog: false,
        editId: 0,
        items: [
            { title: 'Add New Level', key: 'add_level'}
        ],
        search: '',
        dialogDelete: false,
        editedIndex: -1,
        editedItem: {
            groupId: null,
            areaId: null,
            userId: null,
            time:null,
            level:null,
            color:null
        },
        defaultItem: {
            groupId: null,
            areaId: null,
            userId: null,
            time:null,
            level:null,
            color:null
        },
        times: ['0', '15', '30', '60'],
        colors: ['White', 'Yellow', 'Orange', 'Red'],
        levels: ['1', '2', '3', '4'],
        headers: [
            { text: 'Support Group', value: 'groupName'},
            { text: 'Area', value: 'areaName', align: 'center'},
            { text: 'User', value: 'userId', align: 'center'},
            { text: 'Level', value: 'levelEscalate', align: 'center'},
            { text: 'Time', value: 'timeToEscale', align: 'center'},
            { text: 'Color', value: 'colorName', align: 'center'},
            { text: 'Actions', value: 'actions', sortable: false, align: 'center'}
        ],
        users:[]
    }
  },
  created() {
    this.getTabGroups()
    this.getUsers()
  },
  computed: {
    ...mapState(['areas','groups']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    groupErrors() {
      const errors = []
      if (!this.$v.editedItem.groupId.$dirty) return errors
      !this.$v.editedItem.groupId.required && errors.push('Group is required')
        return errors
    },
    areaErrors() {
      const errors = []
      if (!this.$v.editedItem.areaId.$dirty) return errors
      !this.$v.editedItem.areaId.required && errors.push('Area is required')
        return errors
    },
    userErrors() {
      const errors = []
      if (!this.$v.editedItem.userId.$dirty) return errors
      !this.$v.editedItem.userId.required && errors.push('User is required')
        return errors
    },
    timeErrors() {
      const errors = []
      if (!this.$v.editedItem.time.$dirty) return errors
      !this.$v.editedItem.time.required && errors.push('Time is required')
        return errors
    },
    levelErrors() {
      const errors = []
      if (!this.$v.editedItem.level.$dirty) return errors
      !this.$v.editedItem.level.required && errors.push('Level is required')
        return errors
    },
    colorErrors() {
      const errors = []
      if (!this.$v.editedItem.color.$dirty) return errors
      !this.$v.editedItem.color.required && errors.push('Color is required')
        return errors
    }

  },
  methods: {
    getTabGroups() {
        axios.get('/andon-api/api/escalationlevels')
        .then (Response => { console.log(Response.data)
            this.escalationLevels = Response.data; })
        .catch (error => {console.log(error) })
    },
    getUsers() {
      axios.get('/andon-api/api/user/filterbyRole')
        .then (Response => { console.log(Response.data)
            this.users = Response.data; })
        .catch (error => {console.log(error) })
    },
    menuSelected(item) {
        console.log(item.key)
        switch (item.key) {
            case 'add_level':
                this.dialog = true
                break
        }
    },
    editItem (item) {
        console.log(item)
        this.editedIndex = this.escalationLevels.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.editId = item.escalateId
    },
    deleteItem(item) {
        this.editedIndex = this.escalationLevels.indexOf(item)
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
      var escalateId = this.editId
      var groupId = this.editedItem.groupId
      var areaId = this.editedItem.areaId
      var userId = this.editedItem.userId
      var timeToEscale = this.editedItem.time
      var levelEscalate = this.editedItem.level
      var colorName = this.editedItem.color

      let groupData = {groupId, escalateId, areaId, userId, timeToEscale, levelEscalate, colorName}
      console.log(groupData)

      axios.post('/andon-api/api/escalationlevel/save', groupData)
        .then (Response => { console.log(Response.data)
          if (this.editId == 0 ) {this.$toastr.s('Escalation Level added', 'Success!')
          } else {this.$toastr.s('Escalation Level edited', 'Success!')}
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
.v-application--wrap {
  min-height: 0%;
}
</style>