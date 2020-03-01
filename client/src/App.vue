<template>
    <div style="display: flex">
        <ul id="demo">
            <item class="item" :model="treeData"/>
        </ul>
        <div style="flex-grow: 1;padding-left: 20px" v-if="movieSelected">
            <vue-plyr ref="player">
                <video @ended="endVideo" :captions="{ active: true, language: 'en' }">
                    <source :src="linkMovie" type="video/mp4" :key="linkMovie">
                    <track kind="captions" label="English" srclang="en" :src="sub" default>
                </video>
            </vue-plyr>
        </div>
    </div>
</template>

<script>

    import item from './components/item';
    import store from './store';
    import queryString from 'query-string';


    require('plyr');


    export default {
        name: 'app',
        components: {item},
        data() {
            return {
                treeData: {},
                subPath: queryString.parse(location.search).sub || '-subtitle-en.srt'
            }
        },
        computed: {
            linkMovie() {
                return `http://localhost:3000/file?path=${encodeURIComponent(this.movieSelected.path)}`
            },
            movieSelected() {
                return store.getters.movieSelected
            },
            source() {
                return {
                    type: 'video',
                    sources: [
                        {
                            src: this.linkMovie,
                            type: 'video/mp4',
                        }
                    ],
                    tracks: [
                        {
                            kind: 'captions',
                            label: 'English',
                            srclang: 'en',
                            src: this.sub,
                            default: true,
                        }
                    ],
                }
            },
            listMovie() {
                return store.getters.listMovie
            },
            sub() {
                const path = this.movieSelected.path.match(/(.*)\..*$/)[1] + this.subPath;
                return `http://localhost:3000/file?path=${encodeURIComponent(path)}`
            },
        },
        beforeCreate() {
            fetch('http://localhost:3000/api').then(response => response.json()).then(response => this.treeData = response);
        },
        methods: {
            endVideo() {
                if (!this.listMovie) return

                const ix = this.listMovie.findIndex((m) => m === this.movieSelected)
                if (ix === -1) return

                if (this.listMovie[ix + 1]) {
                    store.commit('selectMovie', null)
                    this.$nextTick(() => {
                        store.commit('selectMovie', this.listMovie[ix + 1])
                    })
                }
            },

            reset() {
                this.$nextTick(() => {
                    this.$refs.player.player.language = 'en';
                    this.$refs.player.player.toggleCaptions(true);
                    this.$refs.player.player.play();
                    this.$refs.player.player.airplay();
                })
            }
        },
        watch: {
            movieSelected(val) {
                if (!val) return
                if (!this.$refs.player) {
                    return setTimeout(() => this.reset(), 500)
                }
                this.reset()
            }
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

    .selected {
        color: #12de12
    }
</style>
