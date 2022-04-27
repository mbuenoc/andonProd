import Vue from 'vue'
import Vuex from 'vuex'

import { repoService } from '../repo'
import { GET_PLANTS } from './mutation-types'
import { GET_GROUPS } from './mutation-types'
import { GET_AREAS } from './mutation-types'
import { GET_USEROLE } from './mutation-types'
import { GET_GROUPTYPES } from './mutation-types'
import { GET_LIGHTCOLORS } from './mutation-types'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: [],
        plants: [],
        groups: [],
        groupTypes:[],
        areas: [],
        lightcolors: [],
        allGroups:[]
    },
    mutations: {
        [GET_PLANTS](state, plants) {
            state.plants = plants
        },
        [GET_GROUPS](state, groups) {
            state.groups = groups
        },
        [GET_AREAS](state, areas) {
            state.areas = areas
        },
        [GET_USEROLE](state, user) {
            state.user = user
        },
        [GET_GROUPTYPES](state, groupTypes) {
            state.groupTypes = groupTypes
        },
        [GET_LIGHTCOLORS](state, lightcolors) {
            state.lightcolors = lightcolors
        },
        "SET_ALLGROUPS"(state, allGroups) {
            state.allGroups = allGroups
        }
    },
    actions: {
        async getPlants({ commit }) {
            const plants = await repoService.getPlants()
            commit(GET_PLANTS, plants)
        },
        async getGroups({ commit }) {
            const groups = await repoService.getGroups()
            const allGroups = groups.map(a => a.groupId)
            commit(GET_GROUPS, groups)
            commit('SET_ALLGROUPS', allGroups)
        },
        async getAreas({ commit }) {
            const areas = await repoService.getAreas()
            commit(GET_AREAS, areas)
        },
        async getUserRole({ commit }) {
            const user = await repoService.getUserRole()
            commit(GET_USEROLE, user)
        },
        async getGroupTypes({ commit }) {
            const groupTypes = await repoService.getGroupTypes()
            commit(GET_GROUPTYPES, groupTypes)
        },
        async getLightColors({ commit }) {
            const lightcolors = await repoService.getLightColors()
            commit(GET_LIGHTCOLORS, lightcolors)
        },
        async setGroups({ commit }, set) {
            commit('SET_ALLGROUPS', set)
        }
    },
    modules: {

    }
})