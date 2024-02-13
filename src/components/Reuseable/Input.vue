<script setup lang="ts">
    import { defineProps, PropType } from 'vue';
    interface InputProps {
        name: string;
        inputValue: string | number;
    }

    const props: InputProps = defineProps({
        name:{
            type: String as PropType<string>,
            required: true
        },
        inputValue:{
            type: [String] as PropType<string>,
            required:true
        }
    })
</script>

<template>
    <input
        v-model="props.inputValue"
        :name="props.name"
     />
</template>