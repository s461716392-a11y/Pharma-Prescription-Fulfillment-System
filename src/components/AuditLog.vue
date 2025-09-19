<template>
    <div>
        <el-card>
            <h2>Audit Logs</h2>
            <el-form :inline="true" :model="filters" class="filter-form">
                <el-form-item label="Patient ID">
                    <el-input v-model="filters.patientId" placeholder="Patient ID" />
                </el-form-item>
                <el-form-item label="Pharmacy ID">
                    <el-input v-model="filters.pharmacyId" placeholder="Pharmacy ID" />
                </el-form-item>
                <el-form-item label="Status">
                    <el-select v-model="filters.status" placeholder="Status">
                        <el-option label="All" value="" />
                        <el-option label="SUCCESS" value="SUCCESS" />
                        <el-option label="FAILED" value="FAILED" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="applyFilter">Filter</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="filteredLogs" style="width: 100%" @row-click="onLogClick">
                <el-table-column prop="prescriptionId" label="Prescription ID" />
                <el-table-column prop="patientId" label="Patient ID" />
                <el-table-column prop="pharmacyId" label="Pharmacy ID" />
                <el-table-column prop="status" label="Status" />
            </el-table>
            <el-dialog v-model="dialogVisible" title="Log Details" width="700px">
                <div v-if="selectedLog">
                    <h3>Prescription {{ selectedLog.prescriptionId }}</h3>
                    <p>Patient: {{ selectedLog.patientId }}</p>
                    <p>Pharmacy: {{ selectedLog.pharmacyId }}</p>
                    <el-table :data="selectedLog.drugsRequested" style="width: 100%">
                        <el-table-column prop="drugId" label="Requested Drug ID" />
                        <el-table-column prop="dosage" label="Dosage" />
                    </el-table>
                    <el-table :data="selectedLog.drugsDispensed" style="width: 100%">
                        <el-table-column prop="drugId" label="Dispensed Drug ID" />
                        <el-table-column prop="dosage" label="Dosage" />
                    </el-table>
                    <el-alert
                        v-if="selectedLog.failureReasons.length"
                        type="error"
                        :title="selectedLog.failureReasons.join(', ')"
                        show-icon
                    />
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface LogDrug {
    drugId: string;
    dosage: number;
}

interface AuditLog {
    prescriptionId: string;
    patientId: string;
    pharmacyId: string;
    status: string;
    drugsRequested: LogDrug[];
    drugsDispensed: LogDrug[];
    failureReasons: string[];
}

const logs = ref<AuditLog[]>([]);

const filters = ref({
    patientId: '',
    pharmacyId: '',
    status: '',
});

const filteredLogs = ref<AuditLog[]>([]);

const dialogVisible = ref(false);
const selectedLog = ref<AuditLog | null>(null);

async function fetchLogs(params = {}) {
    try {
        const res = await axios.get('/api/audit-logs', { params });
        filteredLogs.value = res.data;
        logs.value = res.data;
    } catch (err) {
        // Optionally show error
    }
}

function applyFilter() {
    fetchLogs(filters.value);
}

onMounted(() => {
    fetchLogs();
});

function onLogClick(row: AuditLog) {
    selectedLog.value = row;
    dialogVisible.value = true;
}
</script>

<style scoped>
.el-card {
    margin: 32px auto;
    max-width: 900px;
}
.filter-form {
    margin-bottom: 16px;
}
</style>
