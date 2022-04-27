import * as axios from 'axios'

var path = process.env.NODE_ENV === 'production' ? '/andon-api/' : '/';

const getUserRole = async function () {
    try {
        const response = await axios.get(path +'api/access/user')
        return response.data
    } catch (error) {
        console.log(error)
        return []
    }
}
const getPlants = async function () {
    try {
        const response = await axios.get( path +'api/plants')
        return response.data
    } catch (error) {
        console.log(error)
        return []
    }
}
const getGroups = async function () {
    try {
        const response = await axios.get( path +'api/groups')
        return response.data
    } catch (error) {
        console.log(error)
        return []
    }
}
const getGroupTypes = async function () {
    try {
        const response = await axios.get( path +'api/grouptypes')
        return response.data
    } catch (error) {
        console.log(error)
        return []
    }
}
const getAreas = async function () {
    try {
        const response = await axios.get( path +'api/area')
        return response.data
    } catch (error) {
        console.log(error)
        return []
    }
}
const getLightColors = async function () {
    try {
        const response = await axios.get( path +'api/lightColors')
        return response.data
    } catch (error) {
        console.log(error)
        return []
    }
}

export const repoService = {
    getUserRole,
    getPlants,
    getGroups,
    getGroupTypes,
    getAreas,
    getLightColors
    
}