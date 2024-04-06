<template>
    <n-card>
        <template #cover>
            <img :src="cardData.imageSrc">
        </template>

        <template #header>
            <n-ellipsis style="max-width: 300px" line-clamp="2">
                {{ cardData.title }}
            </n-ellipsis>
        </template>

        <template #default>
            <n-ellipsis style="max-width: 300px" line-clamp="3">
                {{ cardData.summary }}
            </n-ellipsis>
        </template>
        
        <template #footer>
            <n-flex justify="space-between">
                <n-flex align="center" style="gap: 0 5px;">
                    <n-icon :component="Eye" size="18" :depth="3" />
                    {{ cardData.views }}
                </n-flex>
                <n-flex align="center" style="gap: 0 5px;">
                    <n-icon :component="TimeOutline" size="18" :depth="3" />
                    {{ dateParse }}
                </n-flex>
            </n-flex>
        </template>

        <template #action>
            <n-flex justify="center" >
                <n-button quaternary class="relative-btn" @click="showModal = true">
                    <template #icon>
                        <n-icon :component="StatsChart" size="18" :depth="3" />
                    </template>
                </n-button>

                <n-flex justify="space-between" align="center">
                    <n-button quaternary :style="{ color: buttonColor }" class="relative-btn" @click="likeCard">
                        <template #icon>
                            <n-icon :color="buttonColor" :component="Heart" size="18" :depth="3" />
                        </template>
                    </n-button>
                    
                    {{ getRating }}

                    <n-button quaternary :style="{ color: buttonColorDis }" class="relative-btn">
                        <template #icon>
                            <n-icon :component="HeartDislike" size="18" :depth="3" />
                        </template>
                    </n-button>
                </n-flex>
                
                <a :href="cardData.link" target="_blank" @click="viewCard">
                    <n-button quaternary class="relative-btn">Читать</n-button>
                </a>
            </n-flex>
        </template>
    </n-card>

    <n-modal v-model:show="showModal">
        <n-card
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
            style="width: 600px; position: absolute; left: calc(50% - 300px); top: 200px; max-height: 400px;"
        >
            <template #header>
                <p>Название: {{ cardData.title }}</p>
            </template>
            <p>Описание: {{ cardData.summary }}</p>
            <p>Просмотры: {{ cardData.views }}</p>
            <p>Нравится: {{ cardData.likes }}</p>
            <p>Не нравится: {{ cardData.dislikes }}</p>
            <template #footer>
                <n-button @click="showModal = false">Закрыть</n-button>
            </template>
        </n-card>
    </n-modal>
</template>

<script>
import { defineComponent, ref } from "vue";
import {NCard, NButton, NFlex, NIcon, NEllipsis, NModal } from 'naive-ui'
import { Eye, TimeOutline, Heart, HeartDislike, StatsChart } from '@vicons/ionicons5'
import dateFormat from "dateformat";

import axios from 'axios';

export default defineComponent({
    components: {
        NCard,
        NButton,
        NFlex,
        NIcon,
        NEllipsis,
        NModal
    },
    props: ['data'],
    computed: {
        dateParse() {
            const date = new Date(this.data.date);
            return dateFormat(date, "dd.mm.yyyy");
        },
        getRating(){
            return this.cardData.likes - this.cardData.dislikes
        }
    },
    methods: {
        async likeCard() {
            const uri = 'http://localhost:5050';
            try {
                let newData = this.data

                // if (this.liked === false) {
                //     newData.likes += 1;
                //     this.liked = true;
                //     this.disliked = false;
                //     this.buttonColor = 'red';
                // }
                // else if (this.disliked === true) {
                //     newData.likes -= 1;
                //     newData.dislikes += 1;
                //     this.liked = false;
                //     this.disliked = true;
                //     this.buttonColor = 'red';
                // } else {
                //     newData.likes -= 1;
                //     this.liked = false;
                //     this.disliked = false;
                //     this.buttonColor = 'gray';
                // }

                if (!this.liked) {
                    if (this.dislikes) {
                        newData.dislikes -= 1;
                        this.buttonColorDis = 'gray'
                    }
                    newData.likes += 1;
                    this.liked = true;
                    this.buttonColor = 'red'
                }

                if (!this.dislikes) {
                    if (this.liked) {
                        newData.dislikes -= 1;
                        this.buttonColor = 'gray'
                    }
                    newData.dislikes += 1;
                    this.dislikes = true;
                    this.buttonColorDis = 'blue'
                }

                if (this.liked && this.disliked) {
                    newData.dislikes -= 1;
                    newData.likes -= 1;
                    this.buttonColor = 'gray';
                    this.buttonColorDis = 'gray';
                }


                const response = await axios.post(`${uri}/updateNews`, newData);
                this.cardData = response.data;
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        async viewCard() {
            const uri = 'http://localhost:5050';
            try {
                let newData = this.data
                newData.views += 1;
                const response = await axios.post(`${uri}/updateNews`, newData);
                this.cardData = response.data;
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }
    },
    setup() {
        return {
            Eye,
            TimeOutline,
            Heart,
            HeartDislike,
            StatsChart
        };
    },
    mounted() {
        this.cardData = this.data;
    },
    data() {
        return {
            cardData: {},
            liked: false,
            buttonColor: 'gray',
            buttonColorDis: 'gray',
            showModal: ref(false),
        }
    }
});
</script>

<style scoped>
.n-card {
    width: 350px;
    height: 100%;
    margin: 0 5px;
}

.n-card__action {
    padding: 5px 8px;
}

.relative-btn {
    margin: 0 5px;
}

a {
    text-decoration: none;
    color: inherit;
}

img {
    object-fit: cover;
    height: 200px;
}
</style>