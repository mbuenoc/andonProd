<template>
    <div>
      <md-tabs class="md-transparent" id="tabs">
        <md-tab id="tab-open-reports" style="position:uset" md-label="Open Reports">
          <div class="md-layout">
            <div class="md-layout-item" id="group-dropdown">
              <md-field>
                <label for="support-group">Group</label>
                <md-select v-model="selectedGroup" @md-selected="getOpenReports()" multiple>
                  <md-option :value = 0>All groups</md-option>
                  <md-option v-for="group in groups" :key="group.groupId" :value="group.groupId" :disabled="disabledGroups">{{group.groupName}}</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item">
              <md-button class="md-raised md-primary" id="solve-button" @click="openDialog()" :disabled="problemAttend">Solve</md-button>
            </div>
            
          </div>
          <div class="md-layout" id="problems-table">
            <md-table v-model="reports" md-card id="principal-table" @md-selected="onSelect($event,item.attendedBy)">
              <md-table-row slot="md-table-row" slot-scope="{item}" id="row-style" md-selectable="single">
                <md-table-cell id="attend-checkbox" md-label="Attend"><md-checkbox v-model="item.check" id="style" @change="attendedBy(item.problemId, item.attendedBy)"></md-checkbox></md-table-cell>
                <md-table-cell md-label="#Report" md-sort-by="id">{{item.problemId}}</md-table-cell>
                <md-table-cell md-label="Time">{{ item.time }}</md-table-cell>
                <md-table-cell md-label="Group" md-sort-by="groupName">{{item.groupName}}</md-table-cell>
                <md-table-cell md-label="Code" md-sort-by="identifierCode">{{item.identifierCode}}</md-table-cell>
                <md-table-cell id="desc-cell" md-label="Problem Description" md-sort-by="problemDesc">{{item.problemDesc}}</md-table-cell>
                <md-table-cell md-label="Part Number" md-sort-by="partNumber">{{item.componentPN}}</md-table-cell>
                <md-table-cell md-label="Where Used" md-sort-by="whereUsed">{{item.whereUsed}}</md-table-cell>
                <md-table-cell md-label="Area" md-sort-by="areaName">{{item.areaName}}</md-table-cell>
                <md-table-cell md-label="Reported By" md-sort-by="ReportedBy">{{item.submittedBy}}</md-table-cell>
                <md-table-cell md-label="Location" md-sort-by="location">{{item.location}}</md-table-cell>
                <md-table-cell md-label="Attended By" md-sort-by="attendedBy"  >{{item.attendedBy}}</md-table-cell>
                <!--<md-table-cell id="button-cell"><md-button @click="showDetails(item.problemId)"><md-icon>more_horiz</md-icon></md-button></md-table-cell>-->
                <md-table-cell id="button-cell"><md-button @click="showDetails(item.problemId)"><v-icon>...</v-icon></md-button></md-table-cell>
                
              </md-table-row>
            </md-table>

            <md-empty-state
                v-show="showEmptyState"
                class="md-accent"
                md-icon="done"
                md-label="YAY! No Andons created"
                md-description = "There are no Andons created for these Support Groups" >
              </md-empty-state>

          </div>
        </md-tab>
        <!-- ////////// EDIT REPORTS TAB //////////// -->
        <md-tab id="tab-edit-reports" md-label="Edit Closed Reports">
          <SupportEdit />
         
        </md-tab>
        
      </md-tabs>

      <!-- ///// DIALOG FOR CLOSE A PROBLEM ///// -->
        <SupportSolution v-bind:selected="selected" ref="SupportSolution"/>
        
        
      <!-- ///// DIALOG FOR PROBLEM DETAILD ///// -->
      <md-dialog :md-active.sync="dialogDetails" id="dialog">
        <md-tabs id="tab-general-info" md-dynamic-height class="md-primary">
          <!-- /// TAB GENERAL INFORMATION PROBLEM ////-->
          <md-tab md-label="General Info">
            <md-table>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">ID</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.problemId}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Area</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.areaName}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Group</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.groupName}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Code</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.identifierCode}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Component PN</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.componentPN}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Where used</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.whereUsed}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">SAP </md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.sapTransaction}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Description</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.problemDesc}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Reported by</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.submittedBy}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Created date</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{ problem.openDate }}</md-table-cell> <!--{{ [problem.openDate ] | moment("MM/DD/YYYY, HH:mm:ss") }}  -->
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Why?</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.why1}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Why?</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.why2}}</md-table-cell>
              </md-table-row>
              <md-table-row>
                <md-table-cell id="dialog-table-cell-title">Why?</md-table-cell>
                <md-table-cell id="dialog-table-cell">{{problem.why3}}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-tab>

          <!-- /// TAB WORKLOG PROBLEM ////-->
          <md-tab id="tab-worklog" md-label="WorkLog" v-on:click.once="getWorkLog()">
            <div class="md-layout">
              <div class="md-layout-item md-size-20">
                <md-button class="md-primary" @click="showRegistry = true">Add Registry</md-button>
              </div>
              <div class="md-layout-item">
                <md-button class="md-primary">Print</md-button>
              </div>
            </div>
            <!-- //NEW REGISTRY INPUT ///-->
            <div class="md-layout" v-if="showRegistry === true">
              <div class="md-layout-item">
                <md-field id="field-registy" :class="newRegistryRequired">
                  <label>Description</label>
                  <md-input v-model="newRegistryDescription" required></md-input>
                  <span class="md-error">This field is required</span>
                </md-field>
              </div>
              <div class="md-layout-item" id="new-registry-buttons">
                <md-button @click="addRegistry()" class="md-raised md-primary">Add</md-button>
                <md-button @click="closeRegistry()">Cancel</md-button>
              </div>
            </div>
            
            <md-table v-model="worklog" md-card id="table-worklog" md-fixed-header >
              <md-table-row slot="md-table-row" slot-scope="{item}">
                <md-table-cell md-label="Description">{{item.notes}} </md-table-cell>
                <md-table-cell md-label="State"> {{item.eventDesc}}</md-table-cell>
                <md-table-cell md-label="Creator"> {{item.createdBy}}</md-table-cell>
                <md-table-cell md-label="Date">{{item.dob | moment("MMM/DD/YYYY, HH:mm:ss") }}</md-table-cell> <!--{{item.dob | moment("MMM/DD/YYYY, HH:mm:ss") }}  -->
                <md-table-cell md-label="Elapsed time ">{{item.timeElapsed.hours}}:{{item.timeElapsed.minutes}}:{{item.timeElapsed.seconds}}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-tab>

          <!-- /// TAB TRANSFER PROBLEM ////-->
          <md-tab id="tab-transfer" md-label="Transfer">
            <form novalidate @submit.prevent="validateTransfer">
              <div>
                <p id="transfer-title">Transfer problem to other Support Group</p>
              </div>
              <div class="transfer-container">
                <md-field :class="getValidationClass('transferGroup')">
                  <label for="group">Group</label>
                  <md-select name="group" id="group" v-model="form.transferGroup" @md-selected="getCodes()">
                      <md-option v-for="group in groups" :key="group.groupId" :value="group.groupId"> {{group.groupName}} </md-option>
                  </md-select>
                  <span class="md-error">The Group is required</span>
                </md-field>
            
                <md-field :class="getValidationClass('transferCode')">
                  <label for="code">Code</label>
                  <md-select name="code" id="code" v-model="form.transferCode">
                      <md-option v-for="code in codes" :key="code.codeId" :value="code.codeId"> {{code.identifierCode}} - {{code.codeDescription}} </md-option>
                  </md-select>
                  <span class="md-error">The Code is required</span>
                </md-field>
              
                <md-field :class="getValidationClass('transferMotive')">
                  <label for="motive">Transfer Motive</label>
                  <md-input id="motive" name="motive" v-model="form.transferMotive" maxlength="50"></md-input>
                  <span class="md-error" v-if="!$v.form.transferMotive.required">Transfer motive is required</span>
                  <span class="md-error" v-else-if="!$v.form.transferMotive.maxLength">Invalid motive Number</span>
                  <span class="md-error" v-else-if="!$v.form.transferMotive.minLength">Invalid motive Number</span>
                </md-field>
              </div>
              <md-button class="md-raised md-primary" id="transfer-button" type="submit">Transfer</md-button>
            </form>

          </md-tab>
        </md-tabs>

        <md-dialog-actions>
          <md-button class="md-primary" @click="dialogDetails = false">Close</md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import {validationMixin} from 'vuelidate'
import {
  required,
  maxLength,
  minLength
} from 'vuelidate/lib/validators'
import SupportSolution from './Support-Solution'
import SupportEdit from './Support-EditReport'
var PId
var path_test = '/andon-api/'
export default {
  mixins: [validationMixin],
  components: {
    SupportSolution,
    SupportEdit
  },
  data: function () {
    return {
      selectedGroup: [],
      selected:[],
      codes: [],
      reports: [],
      problem: {},
      worklog:[],
      ms: [],
      checkAttended: false,
      dialogDetails: false,
      showDialogSolve: false,
      problemAttend: true,
      disabledGroups: false,
      showEmptyState: false,
      form: {
        transferGroup:null,
        transferCode:null,
        transferMotive:null
      },
      sending: false,
      newRegistryDescription: '',
      showRegistry: false,
      countingTime: '',
      fieldRequired: false,
      time: []
    }
  },
  validations: {
    form: {
      transferGroup: {
        required
      },
      transferCode: {
        required
      },
      transferMotive: {
        required,
        maxLength: maxLength(50),
        minLength: minLength(5)
      }
    }
  },
  async created () {
    setInterval(this.countingtime, 1000)
    this.groupOptions()
  },
  computed: {
    ...mapState(['groups', 'user', 'allGroups']),
    newRegistryRequired() {
      return {
        'md-invalid': this.fieldRequired
      }
    }
  },
  methods: {
    ...mapActions(['setGroups']),

    onSelect(items,attendedBy) {
      console.log(items)
      this.selected = items
      if (this.selected == null) {
        this.problemAttend = true
      } else {
        var value = this.selected.check
        if (value == true) {
          this.problemAttend = false
          value.attendedBy = attendedBy
        } else {
          this.problemAttend = true     
          value.attendedBy == attendedBy     
        }
        
      }
    },
    openDialog() {
      this.$refs.SupportSolution.openDialogSolution(PId)
    },
    groupOptions() {
      var set = this.groups.map(a => a.groupId)
      console.log(this.allGroups)
      if (set.length === this.allGroups.length) {
        this.selectedGroup = [0]
        this.disabledGroups = true
      } else {
        this.selectedGroup = this.allGroups
      }
      this.getOpenReports()
    },
    getCodes() {
      var group = this.form.transferGroup
      var groupFiltered = this.groups.filter(function (x) { return x.groupId == group })
      var gtypeId = groupFiltered[0].gtypeId
      axios.get(path_test+'api/getcodes?gtypeId=' + gtypeId)
      .then (Response => { console.log(Response.data)
        this.codes = Response.data; })
      .catch (error => {console.log(error) })
    },
    attendedBy(id, attendedBy) { 
      axios.get(path_test+'api/attend?problemId=' + id + '&userId='+ this.user.userId + '&attendedBy=' + attendedBy ) //api/attend?problemdId= &attendedBy= 
      .then (Response => {
        var result = Response.data[0].attendedBy
        if(result != 'not defined') {
          this.problemAttend = false
        } else {
          this.problemAttend = true
        }
        this.getOpenReports()
      })
      .catch (error => {console.log(error) })
      PId = id
    },
    getOpenReports() {
      if(this.selectedGroup.includes(0)) {
        var allgrupos = this.groups.map(x => x.groupId)
        this.setGroups(allgrupos)
        this.disabledGroups = true
      } else {
        this.disabledGroups = false
        this.setGroups(this.selectedGroup)
      }
      var groupId = this.allGroups
      axios.post(path_test+'api/getopenreport/bygroup', groupId)
        .then (Response => { console.log(Response.data)
          this.reports = Response.data;
          if (this.reports.length != 0) {
            this.showEmptyState = false
            this.check()
            this.getTime()
          } else {
            this.showEmptyState = true
          }
        })
        .catch (error => {console.log(error) })
    },
    closeRegistry() {
      this.showRegistry = false,
      this.newRegistryDescription = ''
      this.fieldRequired = false
    },
    check() {
      let problems = this.reports
      problems.forEach(element => {
        element.check = null
        element.time = null
      });
      for (let i = 0; i < problems.length; i++) {
        if (problems[i].attendedBy == 'no defined' || problems[i].attendedBy == 'not defined') {
          problems[i].check = false
        } else {
          problems[i].check = true
        }
      }
      
    },
    countingtime() {
      if(this.reports == '') {
        console.log(' ')
      } else {
        for(let i = 0; i < this.reports.length; i++) {
          this.ms[i] = this.ms[i] + 1000
          var d = moment.duration(this.ms[i])
          var s = Math.floor(d.asHours()) + moment.utc(this.ms[i]).format(":mm:ss")
          this.reports[i].time = s
          this.$set(this.reports, this.reports[i].time , s)
        }
      }
    },
    getTime() {
      let problems = this.reports
      for (let i = 0; i < problems.length; i++) {
        var startTime = moment(problems[i].openDate).format("DD/MM/YYYY HH:mm:ss")
        var end = moment().format("DD/MM/YYYY HH:mm:ss")
        var ms = moment(end, "DD/MM/YYYY HH:mm:ss").diff(moment(startTime, "DD/MM/YYYY HH:mm:ss"))
        var d = moment.duration(ms)
        var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss")
        this.ms[i] = ms
        problems[i].time = s
      }
    },
    showDetails(problemId) {
      this.dialogDetails = true
      console.log(problemId)
      function isId(report) {
        return report.problemId == problemId
      }
      this.problem = this.reports.find(isId)
    },
    showProblem(problemId)
    {
      console.log(problemId)
    },
    getWorkLog() {
      var problemId = this.problem.problemId
      axios.get(path_test+'api/getworklog?problemId=' + problemId)
        .then (Response => { console.log(Response.data)
            this.worklog = Response.data;
        })
        .catch (error => {console.log(error) })
    },
    addRegistry() {
      if(this.newRegistryDescription == '') {
        this.fieldRequired = true
      } else {
        this.fieldRequired = false
        var problemId = this.problem.problemId
        var notes = this.newRegistryDescription
        var dob = moment().format('YYYY-MM-DD kk:mm:ss.SSS')
        var submittedBy = this.user.userId

        let data = {problemId: problemId, notes:notes, dob:dob, submittedBy:submittedBy}
        console.log(data)
        axios.post(path_test+'api/sendregistry', data)
          .then(Response => {
              console.log(Response)
              this.getWorkLog()
          })
            .catch(error => {
              console.log(error.Response)
          })
      }
    },
    validateTransfer () {
      this.$v.$touch()
        if (!this.$v.$invalid) {
            this.makeTransfer()
        }
    },
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid':field.$invalid && field.$dirty
        }
      }
    },
    makeTransfer() {
      this.sending = true

      var problemId = this.problem.problemId
      var groupId = this.form.transferGroup
      var codeId = this.form.transferCode
      var transfReason = this.form.transferMotive
      var transferedBy = this.user.userId

      let transferProblem = {
        problemId:problemId,
        groupId:groupId,
        codeId:codeId,
        transfReason:transfReason,
        transferedBy:transferedBy
      }
      console.log(transferProblem)

      axios.post(path_test+'api/transferProblem', transferProblem)
        .then(Response => {
          console.log(Response)
          this.$toastr.s('The Andon #'+problemId+ 'has been transfer succesfully', 'Success!')
          this.dialogDetails = false
          this.clearFormTransfer()
          this.getOpenReports()
        })
        .catch(error => {
          console.log(error.Response)
          this.$toastr.e('Something happend', 'Oops')
          this.dialogDetails = false
          this.clearFormTransfer()
        })
    },
    clearFormTransfer() {
      this.form.transferGroup = null,
      this.form.transferCode = null,
      this.form.transferMotive = null
    },
    
  }
}
</script>

<style>
.md-transparent .md-tabs-navigation {
    position: unset;
}
#tabs {
  margin: 15px 0 0 0;
}
#tab-open-reports {
  padding: 0 16px;
}
.md-tabs-container {
  transform: translate3d(0,0,0);
  transition: 0ms;
}
#dialog-table-cell-title {
  height: auto;
  font-weight: bold;
}
#dialog-table-cell {
  height: auto;
}
#group-dropdown .md-field{
  width: 50%;
  margin: 2px 0 1px 0;
}

#solve-button {
  float: right;
  margin: 20px 5px 5px;
}
#principal-table .md-table {
  margin: 1px;
  display: block;
}
#dialog .md-dialog-container {
  width: 50%;
}
#row-style {
  padding: 0;
}
#style .md-table-cell-container {
  margin: 6px 10px 6px 15px;
}
#transfer-title {
  font: 400 18px oswald;
}
.transfer-container {
  margin: 0 40px;
}
#transfer-button {
  margin: 5px 5px 5px 20px;
}
#button-cell .md-table-cell-container{
  padding: 0;
}
#attend-checkbox .md-table-cell-container{
  padding: 5px 20px 5px 20px;
  width: fit-content;
  margin: auto;
}
#attend-checkbox .md-table-cell-container .md-checkbox{
  margin: 5px 0;
}
.md-table-head-label  {
  padding-right: 20px;
  padding-left: 20px;
}
#desc-cell .md-table-cell-container{
  padding: 5px 20px 5px 20px;
}
#problems-table {
  display: block;
}
#new-registry-buttons {
  display: contents;
}
#field-registy {
  margin-bottom: 1em;
}
#table-worklok {
  height: 600px;
}
#tab-worklog {
  padding: 10px 15px;
}
/*#table-worklog {
  width: 80%;
}*/
</style>
