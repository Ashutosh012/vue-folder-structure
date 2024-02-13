<script setup lang="ts">
    import { defineProps, PropType } from 'vue';
    interface ButtonProps {
        label: String;
        onClick?: Function;
    }

    const props: ButtonProps = defineProps({
        label:{
            type: String as PropType<string>,
            required: true
        },
        onClick:{
            type: Function as PropType<() => void>,
            required:false
        }
    })

</script>

<template>
    <button type="button" @click="props.onClick">{{ props.label }}</button>
</template>