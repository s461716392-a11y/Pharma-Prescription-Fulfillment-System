<template>
    <div>
        <el-card>
            <h2>Drug Management</h2>
            <el-table :data="drugs" style="width: 100%">
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="name" label="Name" />
                <el-table-column prop="limit" label="Limit" />
                <el-table-column prop="manufacturer" label="Manufacturer" />
                <el-table-column prop="batch" label="Batch" />
                <el-table-column prop="expiry" label="Expiry">
                    <template #default="scope">
                        <span
                            v-if="scope && scope.row && scope.row.expiry"
                            :style="
                                isExpired(scope.row.expiry) ? 'color: red; font-weight: bold;' : ''
                            "
                        >
                            {{ formatDate(scope.row.expiry) }}
                            <span v-if="isExpired(scope.row.expiry)">(Expired)</span>
                        </span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column prop="stock" label="Stock" />
            </el-table>
            <el-divider />
            <h3>Add Drug</h3>
            <el-form :model="form" :rules="rules" ref="drugForm" label-width="120px">
                <el-form-item label="ID" prop="id">
                    <el-input v-model="form.id" />
                </el-form-item>
                <el-form-item label="Name" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="Limit" prop="limit">
                    <el-input-number v-model="form.limit" :min="1" />
                </el-form-item>
                <el-form-item label="Manufacturer" prop="manufacturer">
                    <el-input v-model="form.manufacturer" />
                </el-form-item>
                <el-form-item label="Batch" prop="batch">
                    <el-input v-model="form.batch" />
                </el-form-item>
                <el-form-item label="Expiry" prop="expiry">
                    <el-date-picker v-model="form.expiry" type="date" placeholder="Pick a date" />
                </el-form-item>
                <el-form-item label="Stock" prop="stock">
                    <el-input-number v-model="form.stock" :min="0" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">Add Drug</el-button>
                </el-form-item>
            </el-form>
            <el-alert v-if="success" type="success" title="Drug added successfully!" show-icon />
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

interface Drug {
    id: string;
    name: string;
    manufacturer: string;
    batch: string;
    expiry: Date | string;
    stock: number;
    limit: number;
}

import { onMounted } from 'vue';
import axios from 'axios';

const drugs = ref<Drug[]>([]);

async function fetchDrugs() {
    try {
        const res = await axios.get('/api/drugs');
        drugs.value = res.data;
    } catch (err) {
        ElMessage.error('Failed to fetch drugs');
    }
}

onMounted(fetchDrugs);

const form = ref<Drug>({
    id: '',
    name: '',
    manufacturer: '',
    batch: '',
    expiry: '',
    stock: 0,
    limit: 1,
});

const rules = {
    id: [{ required: true, message: 'ID is required', trigger: 'blur' }],
    name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
    manufacturer: [{ required: true, message: 'Manufacturer is required', trigger: 'blur' }],
    batch: [{ required: true, message: 'Batch is required', trigger: 'blur' }],
    expiry: [{ required: true, message: 'Expiry date is required', trigger: 'change' }],
    stock: [{ required: true, type: 'number', message: 'Stock is required', trigger: 'blur' }],
    limit: [{ required: true, type: 'number', message: 'Limit is required', trigger: 'blur' }],
};

const drugForm = ref();
const success = ref(false);

function isExpired(date: Date | string) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d < new Date();
}

function formatDate(date: Date | string) {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

async function onSubmit() {
    drugForm.value.validate(async (valid: boolean) => {
        if (valid) {
            try {
                await axios.post('/api/drugs', form.value);
                await fetchDrugs();
                success.value = true;
                setTimeout(() => (success.value = false), 2000);
                Object.assign(form.value, {
                    id: '',
                    name: '',
                    manufacturer: '',
                    batch: '',
                    expiry: new Date(),
                    stock: 0,
                    limit: 1,
                });
            } catch (err) {
                ElMessage.error('Failed to add drug');
            }
        } else {
            ElMessage.error('Please fix validation errors');
        }
    });
}
</script>

<style scoped>
.el-card {
    margin: 32px auto;
    max-width: 900px;
}
</style>
