<template>
    <li>
        <div :class="{bold: isFolder}"
             @click="toggle">
            {{ model.name }}
            <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <item class="item"
                  v-for="(model, index) in model.children"
                  :key="index"
                  :model="model">
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
            path : '',
        },
        data    : function () {
            return {
                open: false,
                store,
            }
        },
        computed: {
            isFolder: function () {
                return this.model.children &&
                    this.model.children.length
            },
        },
        methods : {
            toggle: function () {
                if (this.isFolder) {
                    this.open = !this.open
                } else {
                    store.commit('selectMovie', null);
                    setTimeout(() => {
                        store.commit('selectMovie', this.model)
                    }, 0)
                }
            },
        },
    }
</script>

<style scoped>

</style>
