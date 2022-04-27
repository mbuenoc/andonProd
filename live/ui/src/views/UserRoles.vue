<template>
    <div>
      <v-app>
        <v-card>
          <v-card-title class="blue darken-1" id="card-title">
              <span class="h4" id="title-card">User Roles</span>
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
              :items="useroles"
              class="elevation-1"
              :search="search"
              >
              <template v-slot:top>
                
                  <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>
          
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="20" sm="10" md="6" >
                              <v-text-field
                                v-model="editedItem.userId"
                                :error-messages="userIdErrors"
                                label="User"
                                required
                                @input="$v.editedItem.userId.$touch()"
                                @blur="$v.editedItem.userId.$touch()"
                              ></v-text-field>
                            </v-col>
                            <!-- <v-col cols="20" sm="10" md="6" >
                              <v-text-field
                                v-model="editedItem.userName"
                                :error-messages="userNameErrors"
                                label="Name"
                                required
                                @input="$v.editedItem.userName.$touch()"
                                @blur="$v.editedItem.userName.$touch()"
                              ></v-text-field>
                            </v-col> -->
                            <v-col cols="20" sm="10" md="6" >
                              <v-select
                                label="Role"
                                :items="roles"
                                item-text="roleDescription"
                                item-value="roleId"
                                v-model="editedItem.roleId"
                                :error-messages="roleErrors"
                                required
                                @input="$v.editedItem.roleId.$touch()"
                                @blur="$v.editedItem.roleId.$touch()"
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
var path_test = '/andon-api/'
export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      userId: {required},
      //userName: {required},
      roleId: {required}
    }
  },
  data: function () {
    return {
        useroles:[],
        items: [
            { title: 'Add New User Role', key: 'add_group'}
        ],
        search:'',
        roles:[],
        dialog: false,
        editId: 0,
        dialogDelete: false,
        editedIndex: -1,
        editedItem: {
            userId: '',
            //userName: '',
            roleId: null
        },
        defaultItem: {
            userId: '',
            //userName: '',
            roleId: null
        },
        headers: [
            { text: 'User', value: 'userId'},
            //{ text: 'Name', value: 'userName'},
            //{ text: 'Role', value: 'roleDescription', align: 'center'},
            { text: 'Actions', value: 'actions', sortable: false, align: 'center'}
        ]
    }
  },
  created() {
    //this.getTabGroups()
    this.getTabUser()
    this.getRoles()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    userIdErrors() {
      const errors = []
      if (!this.$v.editedItem.userId.$dirty) return errors
      !this.$v.editedItem.userId.required && errors.push('User is required')
        return errors
    },
    /*userNameErrors() {
      const errors = []
      if (!this.$v.editedItem.userName.$dirty) return errors
      !this.$v.editedItem.userName.required && errors.push('Name is required')
        return errors
    },*/
    roleErrors() {
      const errors = []
      if (!this.$v.editedItem.roleId.$dirty) return errors
      !this.$v.editedItem.roleId.required && errors.push('Role is required')
        return errors
    }

  },
  methods: {
    getTabUser() {
        axios.get(path_test+'api/user/filterbyRole')
        .then (Response => { console.log(Response.data)
            this.useroles = Response.data; })
        .catch (error => {console.log(error) })
    },
    getRoles() {
        axios.get(path_test+'api/roles')
        .then (Response => { console.log(Response.data)
            this.roles = Response.data; })
        .catch (error => {console.log(error) })
    },
    menuSelected(item) {
        console.log(item.key)
        switch (item.key) {
            case 'add_group':
                this.dialog = true
                break
        }
    },

    editItem (item) {
        console.log(item)
        this.editedIndex = this.useroles.indexOf(item.roleId)
        //console.log("TEST:"+item.roleId)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        this.editId = item.userId
    },
    deleteItem(item) {
        this.editedIndex = this.useroles.indexOf(item)
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
    roleDesc(roleId) {
      var roleDes = ""
      if (roleId ==1)
        roleDes = 'admin'
        if (roleId ==2)
        roleDes = 'support'
        if (roleId ==3)
        roleDes = 'operator'
      return roleDes;
    },
    save() {
      var userId = this.editId  
      //var userName = this.editedItem.userName
      var roleId = this.editedItem.roleId

      let areaData = {userId:userId, roleId:roleId}
      console.log(areaData)
      var role = this.roleDesc(roleId)
      axios.post(path_test+'api/user/add', areaData)
        .then (Response => { console.log(Response.data)
          if (this.editId == 0 ) {this.$toastr.s('User '+ userId + ' added', 'Success!')
          } else {this.$toastr.s('User '+userId+' edited '+ role, 'Success!')}
          //this.getTabCodes()
          this.editId = " "
        })
        .catch (error => {console.log(error) })
      
      this.close()
    }
    
  }
}
</script>

<style>

</style>