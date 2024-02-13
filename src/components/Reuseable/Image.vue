<script setup lang="ts">
    import { defineProps, PropType } from 'vue';
    interface ImageProps {
        imageUrl: string;
        altText: string;
    }

    const props: ImageProps = defineProps({
        imageUrl:{
            type: String as PropType<string>,
            required: true
        },
        altText:{
            type: String as PropType<string>,
            required:true
        }
    })

</script>

<template>
    <img :src="props.imageUrl" :alt="props.altText" />
</template>