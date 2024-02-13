<script setup lang="ts">
    import { ref, defineProps,computed, defineEmits, toRef } from 'vue';
    import RecursiveComponent from '../components/TreeStructure.vue'
    import { folderStore } from '../store/index';
    import ImageComponent from './Reuseable/Image.vue'

    const fileFolder = folderStore();

    const emits = defineEmits(['delete-folder', 'child-file-folder']);

    const inputValue = ref('');
    const itemProps = defineProps({
        item: Object,
        isRoot:{
            type: Boolean,
            required: true
        },
    });

    const itemChildren = ref(toRef(itemProps, 'item')?.value?.children ?? []);

    const formType = {
        file: false,
        folder: false
    }

    const showAddOne = ref(true);

    const data = ref({ ...formType });
    const initialDataRef = computed(() => ({ ...formType }));

    const isInvalid = computed(() => inputValue.value === '');

    const validationMessgae = "Input field is required.";
    //const updatedFolderStructure = ref();

    const addChildFileOrFolder = async () => {
        if (isInvalid.value) {
            return;
        }
        const childFileOrFolder = {
            type: formType.file ? 'file' : 'folder',
            value: inputValue.value,
            parent: itemProps.item?.children ? itemProps.item?._id : itemProps.item?.parent,
            children: [],
            _id: Date.now()
        }

        await fileFolder.addChildFileFolder(childFileOrFolder)
        itemChildren.value.push(childFileOrFolder)
        //itemProps?.item?.children.push(childFileOrFolder);
        visibleFileOrFolder.value = false
        openForm.value = false
        inputValue.value = "";
        if(formType.file){
            showAddOne.value = false
        }
        Object.assign(data, initialDataRef.value);
    }

    const deleteFileFolder = (id:string) => {
        emits('delete-folder', id);
    }

    const hoverButton = ref(false);
    const visibleFileOrFolder = ref(false);
    const openForm = ref(false);
</script>

<template>
    <ul class="list-none p-0 ps-6">
        <li 
            class="list-none relative mt-5" 
            :class="itemProps.isRoot ? 'root-list' : 'child-list'"
        >
            <div class="flex items-center">
                <span 
                    class="mt-4"
                    @mouseover="hoverButton = true"
                >
                    <img
                        v-if="itemProps?.item?.type === 'folder'"
                        src="../assets/folder.svg"
                        class="h-8 w-5 mr-1 inline-flex"
                        />
                    <img
                        v-if="itemProps?.item?.type === 'file'"
                        src="../assets/file.svg"
                        class="h-8 w-5 mr-1 inline-flex"
                        />
                    {{ itemProps.item?.value }}
                    <span 
                        class="mt-4 ml-2" 
                        v-if="hoverButton && itemProps?.item?.type === 'folder'"
                        @mouseout="hoverButton =  false"    
                    >
                        <button 
                            type="button" 
                            @click="visibleFileOrFolder = true"
                        >
                            <img 
                                src="../assets/folder-plus.svg" 
                                class="h-8 w-5 mr-1 inline-flex" />
                        </button>
                        <!-- {{ itemProps.item }} -->
                        <button 
                            type="button" 
                            @click="deleteFileFolder(itemProps.item?._id)"
                        >
                            <img 
                                src="../assets/folder-minus.svg" 
                                class="h-8 w-5 inline-flex" />
                        </button>
                    </span>
                </span>
            </div>

            <RecursiveComponent
                :isRoot="false"
                v-for="(data,index) in itemChildren"
                :key="data._id"
                :item="data"
                :index="index"
                @delete-folder="deleteFileFolder"
                @child-file-folder="addChildFileOrFolder"
            />

            <ul 
                class="list-none p-0" 
                v-if="visibleFileOrFolder"
            >
                <li 
                    class="list-none relative mt-5 inline-flex mr-3"
                >
                    <button 
                        type="button" 
                        class="border border-solid border-black rounded p-2 relative"
                        @click="(openForm = true), (formType.file = true), (visibleFileOrFolder = false)"
                    >
                        File 1
                    </button>
                </li>

                <li 
                    class="list-none relative mt-5 inline-flex mr-2"
                >
                    <button 
                        type="button" 
                        class="border border-solid border-black rounded p-2 relative"
                        @click="(openForm = true), (formType.folder = true), (visibleFileOrFolder = false)"
                    >
                        Folder 1
                    </button>
                </li>
            </ul>

            <div 
            class="p-2.5 flex flex-wrap border border-solid border-black form-box" 
            v-if="openForm">
                <ImageComponent
                    imageUrl="/src/assets/folder-open-regular.svg"
                    class="h-7 w-4 mr-4"
                    altText="Folder"
                />
                <form v-if="openForm">
                    <input 
                        v-model="inputValue"
                        class="border border-solid border-black rounded cursor-auto bg-white w-36 h-5 folder-input" />
                    <button 
                        type="button" 
                        @click="addChildFileOrFolder"
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
        </li>
    </ul>
</template>