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
    import queryString from 'query-string';


    require('plyr');


    export default {
        name        : 'app',
        components  : {item},
        data() {
            return {
                treeData: {},
                subPath : queryString.parse(location.search).sub || '-subtitle-en.srt'
            }
        },
        computed    : {
            linkMovie() {
                this.$nextTick(function () {
                    // eslint-disable-next-line
                    this.$refs.player.player.language = 'en';
                    // eslint-disable-next-line
                    this.$refs.player.player.toggleCaptions(true);
                });
                return `http://localhost:3000/file?path=${this.movieSelected.path}`
            },
            movieSelected() {
                this.$nextTick(function () {
                    if (this.$refs.player) {
                        this.$refs.player.player.restart();
                    }
                });
                return store.getters.movieSelected
            },
            sub() {
                const path = store.state.movieSelected.path.match(/(.*)\..*$/)[1] + this.subPath;
                return `http://localhost:3000/file?path=${path}`
            },
        },
        beforeCreate () {
            fetch('http://localhost:3000/api').then(response => response.json()).then(response => this.treeData = response);
        },
        mounted() {
            
        }
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
