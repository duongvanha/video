<template>
    <li :class="{selected: isRunningVideo}">
        <div :class="{bold: isFolder}"
             @click="toggle">
            {{ model.name }}
            <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <item class="item"
                  v-for="(m, index) in model.children"
                  :key="index"
                  :list="model.children"
                  :model="m">
            </item>
        </ul>
    </li>
</template>

<script>

    import store from '../store';

    export default {
        name    : 'item',
        props   : {
            model: Object,
            list : Array,
            path : ''
        },
        data() {
            return { open: false }
        },
        computed: {
            isFolder() {
                return this.model.children &&
                    this.model.children.length
            },
            isRunningVideo() {
                return store.getters.movieSelected === this.model
            },
        },
        methods : {
            toggle() {
                if (this.isFolder) {
                    this.open = !this.open
                } else {
                    store.commit('selectMovie', null)
                    this.$nextTick(() => {
                        store.commit('selectMovie', this.model)
                    })
                    store.commit('setListMovie', this.list)
                }
            },
        },
    }
</script>

<style scoped>

</style>
