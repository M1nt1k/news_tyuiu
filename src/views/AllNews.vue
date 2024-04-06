<template>
    <div class="news">
        <n-h1>Новости ТИУ</n-h1>
        
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
                <TCard v-for="card in paginatedCards" :key="card.id" :data="card" />
            </template>
        </n-space>

        <n-flex justify="end" style="padding: 0 100px 20px;">
            <NPagination
                :page-count="totalPages"
                v-model:page="currentPage"
                @update:page="handlePageChange"
            />
        </n-flex>
    </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import {NH1, NSpace, NFlex, NButton, NInput, NIcon, NPagination, NEmpty } from 'naive-ui';
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
        NPagination,
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
        },
        totalPages() {
            return Math.ceil(this.filteredAndSortedCards.length / this.pageSize);
        },
        paginatedCards() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            return this.filteredAndSortedCards.slice(startIndex, startIndex + this.pageSize);
        }
    },
    methods: {
        async loadData() {
            const uri = 'http://localhost:5050';
            try {
                const response = await axios.get(`${uri}/allnews`);
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
        handlePageChange(page) {
            this.currentPage = page;
        }
    },
    mounted() {
        this.loadData();
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
    data() {
        return {
            sortKey: null,
            searchQuery: '',
            sortDirection: 'asc',
            page: ref(1),
            pageSize: 8,
            currentPage: 1,
            cards: []
        }
    }
});
</script>