<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import TreeStructure from './TreeStructure.vue';
    import { folderStore } from '../store/index';
    import ButtonComponent from './Reuseable/Button.vue'
    import ImageComponent from './Reuseable/Image.vue'

    const rootFolderStore = folderStore();

    const inputValue = ref('');
    const isInvalid = computed(() => inputValue.value === '');
    const validationMessgae = "Input field is required.";
    const folderData = ref<RootFolder[]>([]);
    const isVisiable = ref(false)

    const validateInput = async () => {
        if (isInvalid.value) {
            return;
        }
        
        const rootObj = {
            children : [],
            type: "Folder",
            value: inputValue.value,
            _id: Date.now()
        };
        
        await rootFolderStore.addRootFolder(rootObj.value);
        folderData.value = rootFolderStore.rootFolders;
        isVisiable.value = false;
        inputValue.value = "";
    }

    const deleteFileFolderHandler = async(id:number) => {
        const deleteFolders = await rootFolderStore.deleteFolders(id);
        folderData.value = deleteFolders;
    }

    // const updateFolderStructure = (updatedStructure) => {
    //     console.log("Line no 42", updatedStructure)
    //     folderData.value = updatedStructure;
    // };

    onMounted(async () => {
        await rootFolderStore.getAllRootFolders();
        folderData.value = rootFolderStore.$state.rootFolders;
    });

    interface RootFolder {
        children: Child[];
        type: string,
        value: string,
        _id: number
    }

    interface Child {
        parent: string;
        children: [];
        type: 'file' | 'folder';
        value: string;
        _id: number;
    }
</script>

<template>
    <div>
        <h1 
            class="bg-black text-white text-center p-2.5 uppercase text-2xl mb-2">
            Folder Structure
        </h1>

        <ButtonComponent 
            @click="isVisiable=true"
            class="bg-black text-white p-2.5 rounded" 
            label="Add Folder to Root" />

        <TreeStructure
            :isRoot="true"
            v-for="(data,index) in folderData"
            :key="index"
            :item="data"
            @delete-folder="deleteFileFolderHandler"
        />

        <div 
            class="p-2.5 flex flex-wrap border border-solid border-black form-box" 
            v-if="isVisiable">

            <ImageComponent
                imageUrl="/src/assets/folder-open-regular.svg"
                class="h-7 w-4 mr-4"
                altText="Folder"
            />

            <form>
                <input 
                    v-model="inputValue" 
                    class="border border-solid border-black rounded cursor-auto bg-white w-36 h-5 folder-input" />
                <button 
                    type="button" 
                    @click="validateInput" 
                    class="mr-2 ml-2 bg-black text-white rounded add-btn">
                    ✔
                </button>

                <button 
                    type="button" 
                    class="bg-white border border-solid border-black rounded font-bold w-6 h-6">
                    x
                </button>
                <p 
                    v-if="isInvalid" 
                    class="text-red-500">
                    {{ validationMessgae }}
                </p>
            </form>
        </div>
    </div>
</template>