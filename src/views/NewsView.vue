<template>
    <div class="home">
        <n-h1>Последние новости ТИУ</n-h1>
        
        <n-flex justify="end" style="padding: 0 100px 20px; max-height: 35px;">
            <n-button @click="sortCards('views')">
                <template #icon>
                    <n-icon :component="Eye" size="18" />
                </template>
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
            </n-button>
            <n-button @click="sortCards('likes')">
                <template #icon>
                    <n-icon :component="Heart" size="18" />
                </template>
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
            </n-button>
            <n-button @click="sortCards('likes')">
                <template #icon>
                    <n-icon :component="HeartDislike" size="18" />
                </template>
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
            </n-button>
            <n-button @click="sortCards('title')">
                <template #icon>
                    <n-icon :component="TitleRound" size="18" />
                </template>
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
            </n-button>
            <n-button @click="sortCards('date')">
                <template #icon>
                    <n-icon :component="DateRangeOutlined" size="18" />
                </template>
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
            </n-button>
            <n-input v-model:value="searchQuery" type="text" placeholder="Поиск по названию" :style="{ width: '250px' }" clearable>
                <template #suffix>
                    <n-icon :component="SearchOutlined" size="18" />
                </template>
            </n-input>
        </n-flex>

        <n-space justify="center" style="padding: 0 100px 20px;">
            <n-flex justify="space-between" style="gap: 20px;">
                <template v-if="!cards">
                    <n-empty description="Не удалось найти новости">
                        <template #extra>
                            <n-button size="large">
                                Попробовать снова
                            </n-button>
                        </template>
                    </n-empty>
                </template>
                <template v-else>
                    <TCard v-for="card in filteredAndSortedCards" :key="card.id" :data="card" />
                </template>
            </n-flex>
        </n-space>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { NH1, NSpace, NFlex, NButton, NInput, NIcon, NEmpty } from 'naive-ui';
import { DateRangeOutlined, TitleRound, SearchOutlined } from '@vicons/material';
import { Heart, Eye, HeartDislike } from '@vicons/ionicons5';

import axios from 'axios';

import TCard from '@/components/TCard.vue';

export default defineComponent({
    components: {
        NH1,
        NSpace,
        TCard,
        NFlex,
        NButton,
        NInput,
        NIcon,
        NEmpty
    },
    computed: {
        filteredAndSortedCards() {
            let filteredCards = this.cards;
            if (this.searchQuery) {
                const lowerCaseQuery = this.searchQuery.toLowerCase();
                filteredCards = filteredCards.filter(card => card.title.toLowerCase().includes(lowerCaseQuery));
            }
            if (this.sortKey) {
                filteredCards = filteredCards.slice().sort((a, b) => {
                    let comparison = 0;
                    if (a[this.sortKey] > b[this.sortKey]) comparison = 1;
                    if (a[this.sortKey] < b[this.sortKey]) comparison = -1;
                    return this.sortDirection === 'asc' ? comparison : -comparison;
                });
            }
            return filteredCards;
        }
    },
    methods: {
        async loadData() {
            const uri = 'http://localhost:5050';
            try {
                const response = await axios.get(`${uri}/news`);
                this.cards = response.data;
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        sortCards(key) {
            if (this.sortKey === key) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortDirection = 'asc';
                this.sortKey = key;
            }
        },
    },
    setup() {
        return {
            DateRangeOutlined,
            TitleRound,
            SearchOutlined,
            Heart,
            Eye,
            HeartDislike
        }
    },
    mounted() {
        this.loadData();
    },
    data() {
        return {
            sortKey: null,
            searchQuery: '',
            sortDirection: 'asc',
            cards: []
        }
    }
});
</script>