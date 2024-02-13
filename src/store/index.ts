import { defineStore } from 'pinia'
import axios from "axios"

export interface RootFolder {
    children: [];
    type: string
    value: string;
    _id: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const folderStore = defineStore("rootFolderStore", {
    state: () => ({
        rootFolders: [] as RootFolder[],
        isLoading: false,
        childFolders: [],
        deleteNodes:[]
    }),

    actions:{
        async addRootFolder(value: string){
            this.isLoading = true;
            try{
                const response = await axios.post(`${API_BASE_URL}initialize-root`, { value: value });
                this.rootFolders = response.data;
                return this.rootFolders;
            } catch(error){
                console.error(error);
            } finally{
                this.isLoading = false;
            }
        },
        async getAllRootFolders(){
            this.isLoading = true;
            try{
                const response = await axios.get(`${API_BASE_URL}`);
                this.rootFolders = response.data;
                return this.rootFolders;
            } catch(error){
                console.error(error)
            } finally{
                this.isLoading = false;
            }
        },
        async addChildFileFolder(childObject: { value: string, type: string, parent: string}){
            this.isLoading = true;
            try{
                const response = await axios.post(`${API_BASE_URL}`, {
                    value: childObject.value,
                    type: childObject.type,
                    parent: childObject.parent
                });
                this.childFolders = response.data
                return this.childFolders;
                
            } catch(error){
                console.error(error)
            } finally{
                this.isLoading = true
            }
        },
        async deleteFolders(id: number){
            this.isLoading = true;
            try{
                const response = await axios.delete(`${API_BASE_URL}${id}`);
                return response.data;
            } catch(error){
                console.error(error);
            } finally{
                this.isLoading = false;
            }
        }
    },

    getters:{
        allRootFolders(state){
            return state.rootFolders
        },
    },
})