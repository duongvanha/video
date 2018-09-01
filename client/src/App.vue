<template>
    <div style="display: flex">
        <ul id="demo" ref="player">
            <item class="item" :model="treeData"/>
        </ul>
        <div style="flex-grow: 1;padding-left: 20px" v-if="movieSelected">
            <vue-plyr ref="player">
                <video :autoplay="true" :captions="{ active: true, language: 'en' }">
                    <source :src="linkMovie" type="video/mp4">
                    <track kind="captions" label="English" srclang="en"
                           :src="sub" default>
                </video>
            </vue-plyr>
        </div>
    </div>
</template>

<script>

    import item  from './components/item';
    import store from './store';

    require('plyr');


    export default {
        name        : 'app',
        components  : {item},
        data() {
            return {treeData: {}}
        },
        computed    : {
            linkMovie    : function () {
                this.$nextTick(function () {
                    this.$refs.player.player.language = 'en';
                    this.$refs.player.player.toggleCaptions(true);
                });
                return `http://localhost:3000/file?path=${this.movieSelected.path}`
            },
            movieSelected: function () {
                this.$nextTick(function () {
                    if (this.$refs.player) {
                        console.log(this.$refs.player.player.restart());
                    }
                });
                return store.getters.movieSelected
            },
            sub          : function () {
                const path = store.state.movieSelected.path.match(/(.*)\..*$/)[1] + '-en.srt';
                return `http://localhost:3000/file?path=${path}`
            },
        },
        beforeCreate: function () {
            fetch('http://localhost:3000/api').then(response => response.json()).then(response => this.treeData = response);
        },
    }

</script>

<style>
    body {
        font-family: Menlo, Consolas, monospace;
        color: #444;
    }

    .item {
        cursor: pointer;
    }

    .bold {
        font-weight: bold;
    }

    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }
</style>
