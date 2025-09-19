<script lang="ts" setup>
import { ref } from 'vue';
import DrugManagement from './components/DrugManagement.vue';
import PharmacyManagement from './components/PharmacyManagement.vue';
import AuditLog from './components/AuditLog.vue';
import PrescriptionManagement from './components/PrescriptionManagement.vue';

const currentPage = ref('drugs');

const menuItems = [
    { key: 'drugs', label: 'Manage Drugs' },
    { key: 'pharmacies', label: 'Manage Pharmacies' },
    { key: 'prescriptions', label: 'Manage Prescriptions' },
    { key: 'audit', label: 'View Audit Logs' },
];

function getCurrentComponent() {
    switch (currentPage.value) {
        case 'drugs':
            return DrugManagement;
        case 'pharmacies':
            return PharmacyManagement;
        case 'prescriptions':
            return PrescriptionManagement;
        case 'audit':
            return AuditLog;
        default:
            return DrugManagement;
    }
}
</script>

<template>
    <el-header
        height="80px"
        style="
            background: #f5f7fa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
        "
    >
        Pharma Prescription Fulfillment System
    </el-header>
    <el-container style="min-height: 80vh">
        <el-aside width="220px" style="background: #fff; border-right: 1px solid #eee">
            <el-menu
                :default-active="currentPage"
                @select="(key) => (currentPage = key)"
                style="border: none"
            >
                <el-menu-item v-for="item in menuItems" :key="item.key" :index="item.key">
                    {{ item.label }}
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <component :is="getCurrentComponent()" />
        </el-main>
    </el-container>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
