<template>
    <section class="layout-wrap">
        <util-list></util-list>
        <content-layout>
            <router-view/>
        </content-layout>
    </section>
</template>
<script>
import UtilList from '@/components/layout/UtilList'
import ContentLayout from '@/components/layout/ContentLayout'
export default {
    components:{ContentLayout,UtilList}

}
</script>
<style lang="scss" scoped>
.layout-wrap{
    display: flex;
    height: 100%;

}
</style>