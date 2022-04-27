<template>
    <div>
      <div class="md-layout">
        <div class="md-layout-item" id="calendar-section">
          <p class="calendar-title">From: </p>
          <md-datepicker v-model="initDate" md-immediately :md-disabled-dates="disabledToday">
            <label>Select initial date</label>
          </md-datepicker>
        </div>
        <div class="md-layout-item" id="calendar-section">
          <p class="calendar-title">to: </p>
          <md-datepicker v-model="endDate" md-immediately :md-disabled-dates="disabledDates">
            <label>Select end date</label>
          </md-datepicker>
        </div>
        <!-- <div class="md-layout-item">
          <md-field name="time">
            <label>Select time</label>
            <md-select v-model="selectedTimeReport" @md-selected="calculateDate()">
              <md-option value = 1 >A month ago</md-option>
              <md-option value = 3 >Three months ago</md-option>
              <md-option value = 6 >Six months ago</md-option>
              <md-option value = 12 >A year ago</md-option>
            </md-select>
          </md-field>
        </div> -->

        <div class="md-layout-item md-size-10">
          <md-button class="md-raised md-primary" id="button-edit" @click="getClosedReports()">Search</md-button>
        </div>
        <div class="md-layout-item md-size-10">
          <md-button class="md-raised md-primary" id="button-edit" @click="openDialogEdit()" :disabled="editableProblem">Edit</md-button>
        </div>
        <div class="md-layout-item md-size-15">
          <md-button class="md-raised md-primary" id="button-excel" :disabled="exportTable">
            <download-csv :data="exportExcel" name = "AndonReport.csv">
              Export to Excel
            </download-csv>
          </md-button>
        </div>

        <div class="md-layout-item">
          <md-button class="md-raised md-primary" id="button-worklog" :disabled="exportReport">
            <download-csv :data="exportWorklog" name = "WorklogReport.csv" :disabled="disabledExport">
              Export Worklog
            </download-csv>
          </md-button>
          
        </div>
      </div>
      <div class="md-layout">
        <md-table id="edit-table" v-model="reports" md-sort="name" md-sort-order="asc" md-card md-fixed-header @md-selected="onSelect">
          <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
            <md-table-cell md-label="ID" id="id-cell" md-sort-by="problemId" md-numeric>{{ item.problemId }}</md-table-cell>
            <md-table-cell md-label="Area" md-sort-by="areaName">{{ item.areaName }}</md-table-cell>
            <md-table-cell md-label="Grupo" md-sort-by="groupName">{{ item.groupName }}</md-table-cell>
            <md-table-cell md-label="Component PN" md-sort-by="componentPN">{{ item.componentPN }}</md-table-cell>
            <md-table-cell md-label="Where Used" md-sort-by="whereUsed">{{ item.whereUsed }}</md-table-cell>
            <md-table-cell md-label="Description problem" md-sort-by="problemDesc">{{ item.problemDesc }}</md-table-cell>
            <md-table-cell md-label="Code Desc" md-sort-by="codeDescription">{{ item.codeDescription }}</md-table-cell>
            <md-table-cell md-label="Submitted By" md-sort-by="submittedBy">{{ item.submittedBy }}</md-table-cell>
            <md-table-cell md-label="Attended By" md-sort-by="attendedBy">{{ item.attendedBy }}</md-table-cell>
            <md-table-cell md-label="total Time" md-sort-by="totalTime">{{item.totalTime}}</md-table-cell>
            <md-table-cell md-label="Solution Desc" md-sort-by="solutionDesc">{{ item.solutionDesc }}</md-table-cell>
            <md-table-cell md-label="Redefinition Problem" md-sort-by="redefinitionProblem">{{ item.redefinitionProblem }}</md-table-cell>
            <md-table-cell md-label="Level 1" md-sort-by="closedCode1">{{ item.details1 }}</md-table-cell>
            <md-table-cell md-label="Level 2" md-sort-by="closedCode2">{{ item.details2 }}</md-table-cell>
            <md-table-cell md-label="Level 3" md-sort-by="closedCode3">{{ item.details3 }}</md-table-cell>
            <md-table-cell md-label="Closed By" md-sort-by="closedBy">{{ item.closedBy }}</md-table-cell>
            <md-table-cell md-label="Closed date" md-sort-by="closedBy">{{ item.closedDate | moment("MMM/DD/YYYY, HH:mm:ss") }}</md-table-cell> <!--{{ [item.closedDate] | moment("DD/MMM/YYYY")}}  -->
            <md-table-cell md-label="Edited By" md-sort-by="editedBy">{{ item.editedBy }}</md-table-cell>
            <md-table-cell md-label="Edit Date" md-sort-by="editDate">{{ item.editDate }}</md-table-cell><!--{{ [item.editDate] | moment("DD/MMM/YYYY")}}  -->
          </md-table-row>
        </md-table>

        <md-empty-state
            v-show="showEmptyState"
            class="md-accent"
            md-icon="folder_open"
            md-label="No closed Andons found"
            md-description = "There are no Andons closed in that period of time" >
          </md-empty-state>
   
        <SupportSolution v-bind:selected="selected" ref="SupportSolution"/>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import SupportSolution from './Support-Solution'
import moment from 'moment'


export default {
  components: {
    SupportSolution
  },
  data: function () {
    return {
      initDate: null,
      endDate:null,
      initialDate: null,
      reports: [],
      editableProblem: true,
      selectedTimeReport: null,
      selected: {},
      showEmptyState: false,
      exportTable:true,
      exportExcel:[],
      exportReport: true,
      exportWorklog: [],
      worklog: [],
      disabledExport: false
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    onSelect (item) {
      this.selected = item
      console.log(this.selected)
      if (this.selected == null) {
        this.editableProblem = true
        this.exportReport = true
      } else {
        this.editableProblem = false
        this.exportReport = false
        this.getWorklog()
      }
    },
    openDialogEdit() {
      this.$refs.SupportSolution.openDialogEditSolution()
    },
    getClosedReports() {
      var time = moment().format("HH:mm:ss.SSS")
      var initDate = moment(this.initDate).format("YYYY-MM-DD")
      var toDate = moment(this.endDate).format("YYYY-MM-DD")
      var completeTime = moment(toDate + ' '+ time)
      var endDate = completeTime._i

      axios.get('/andon-api/api/getclosedreports?initDate=' + initDate + '&endDate=' + endDate)
      .then (Response => { console.log(Response.data)
          this.reports = Response.data;
          this.dateFormat()
          
      })
      .catch (error => {console.log(error) })
    },
    dateFormat() {
      if(this.reports.length > 0) {this.exportTable = false} else {this.exportTable = true}
      if (this.reports.length == 0) {this.showEmptyState = true} else {this.showEmptyState = false}
      for (let i = 0; i < this.reports.length; i++) {
        var year = moment(this.reports[i].editDate).format("YYYY")
        if (year == "9999") {
          this.reports[i].editDate = ""
        }
      }
      this.convertTime()
    },
    disabledDates(evt) {
      return +evt < +this.initDate
    },
    disabledToday(evt) {
      var today = new Date()
      return -evt < -today
    },
    convertTime() {
      for (let i = 0; i < this.reports.length; i++) {
        var totaltime = this.reports[i].totalTime.totalSeconds
        const sec = parseInt(totaltime, 10); // convert value to number if it's string
        let hours   = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}

        this.reports[i].totalTime = hours+':'+minutes+':'+seconds
        var timeattended = this.reports[i].timeElapseAttended.totalSeconds

        const secs = parseInt(timeattended, 10)
        hours   = Math.floor(secs / 3600)
        minutes = Math.floor((secs - (hours * 3600)) / 60)
        seconds = secs - (hours * 3600) - (minutes * 60)
        if (hours   < 10) {hours   = "0"+hours}
        if (minutes < 10) {minutes = "0"+minutes}
        if (seconds < 10) {seconds = "0"+seconds}

        this.reports[i].timeElapseAttended = hours+':'+minutes+':'+seconds
        console.log(this.reports[i])
      }
      this.createReport()
    },
    createReport() {
      this.exportExcel = this.reports.map(x => ({ 
        Report: x.problemId, 
        Plant: x.plantName, 
        SupportGroup: x.groupName, 
        Area: x.areaName,
        Description: x.problemDesc,
        WhereUsed: x.whereUsed,
        ComponentPN: x.componentPN,
        SubmittedBy: x.submittedBy,
        Open: x.openDate,
        AttendedBy: x.attendedBy,
        Code: x.identifierCode,
        CodeDescription: x.codeDescription,
        ClosedBy: x.closedBy,
        TotalTime: x.totalTime,
        TimeAttended: x.timeElapseAttended,
        Solution: x.solutionDesc,
        Level1: x.details1,
        Level2: x.details2,
        Level3: x.details3,
        Redefinition: x.redefinitionProblem,
        Closed: x.closedDate,
        EditedBy: x.editedBy,
        EditLastDate: x.editDate

        }))

      console.log(this.exportExcel)
    },
    getWorklog() {
      var problemId = this.selected.problemId
      axios.get('/andon-api/api/getworklog?problemId=' + problemId)
        .then (Response => { console.log(Response.data)
            this.worklog = Response.data;
            this.createFormatWorklog()
        })
        .catch (error => {console.log(error) })
    },
    createFormatWorklog() {
      for (let i = 0; i < this.worklog.length; i++) {
        var date = moment(this.worklog[i].dob).format("MM/DD/YYYY HH:mm:ss.SS")
        this.worklog[i].dob = date
        var totaltime = this.worklog[i].timeElapsed.totalSeconds
        const sec = parseInt(totaltime, 10); // convert value to number if it's string
        let hours   = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}

        this.worklog[i].timeElapsed = hours+':'+minutes+':'+seconds
      }
      this.exportWorklog = this.worklog.map(x => ({
        EventDescription: x.eventDesc,
        Notas: x.notes,
        CreatedBy: x.createdBy,
        DateCreated: x.dob,
        TimeElapsed: x.timeElapsed
      }))

      console.log(this.exportWorklog)
      
    }
  }
}
</script>

<style>
#calendar-section {
  display: flex;
  margin: 0 20px;
}
.calendar-title {
  margin: 0 10px;
  align-self: center;
  font-size: 15px;
}
#button-edit {
  margin: 15px 5px 0;
}
#button-excel {
  margin: 15px 5px 0;
  background-color: rgb(30, 111, 67);
}
#button-worklog {
  margin: 15px 5px 0;
}
#tab-open-reports {
  padding: 0 20px 0 30px;
}
#tab-edit-reports {
  padding: 0 16px 16px;
}
#id-cell .md-table-cell-container {
  padding: 5px 15px 5px 20px;
}
</style>