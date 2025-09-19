<template>
    <div>
        <el-card>
            <h2>Pharmacy Management</h2>
            <el-table :data="pharmacies" style="width: 100%" @row-click="onPharmacyClick">
                <el-table-column prop="id" label="ID" width="120" />
                <el-table-column prop="name" label="Name" />
            </el-table>
            <el-dialog v-model="dialogVisible" title="Pharmacy Details" width="600px">
                <div v-if="selectedPharmacy">
                    <h3>{{ selectedPharmacy.name }} ({{ selectedPharmacy.id }})</h3>
                    <el-table :data="selectedPharmacy.allocatedDrugs" style="width: 100%">
                        <el-table-column prop="drugName" label="Drug Name" />
                        <el-table-column prop="drugId" label="Drug ID" />
                        <el-table-column prop="limit" label="Allocated Limit" />
                    </el-table>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface AllocatedDrug {
    drugId: string;
    drugName: string;
    limit: number;
}

interface Pharmacy {
    id: string;
    name: string;
    allocatedDrugs: AllocatedDrug[];
}

const pharmacies = ref<Pharmacy[]>([]);

async function fetchPharmacies() {
    try {
        const res = await axios.get('/api/pharmacies');
        pharmacies.value = res.data;
    } catch (err) {
        // Optionally show error
    }
}

onMounted(fetchPharmacies);

const dialogVisible = ref(false);
const selectedPharmacy = ref<Pharmacy | null>(null);

function onPharmacyClick(row: Pharmacy) {
    selectedPharmacy.value = row;
    dialogVisible.value = true;
}
</script>

<style scoped>
.el-card {
    margin: 32px auto;
    max-width: 900px;
}
</style>
