<template>
    <div>
        <el-card>
            <h2>Prescription Dashboard</h2>
            <el-table :data="prescriptions" style="width: 100%" @row-click="onPrescriptionClick">
                <el-table-column prop="id" label="ID" width="120" />
                <el-table-column prop="patientId" label="Patient ID" />
                <el-table-column prop="status" label="Status" />
            </el-table>
            <el-dialog v-model="dialogVisible" title="Prescription Details" width="700px">
                <div v-if="selectedPrescription">
                    <h3>Prescription {{ selectedPrescription.id }}</h3>
                    <p>Patient: {{ selectedPrescription.patientId }}</p>
                    <p>Pharmacy: {{ selectedPrescription.pharmacyId }}</p>
                    <el-table :data="selectedPrescription.drugs" style="width: 100%">
                        <el-table-column prop="drugId" label="Drug ID" />
                        <el-table-column prop="dosage" label="Dosage" />
                        <el-table-column label="Expiry">
                            <template #default="scope">
                                <span
                                    :style="
                                        isDrugExpired(scope.row.drugId)
                                            ? 'color: red; font-weight: bold;'
                                            : ''
                                    "
                                >
                                    {{ getDrugExpiry(scope.row.drugId) }}
                                    <span v-if="isDrugExpired(scope.row.drugId)">(Expired)</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="Allocation">
                            <template #default="scope">
                                <span
                                    :style="
                                        isOverAllocated(scope.row)
                                            ? 'color: orange; font-weight: bold;'
                                            : ''
                                    "
                                >
                                    {{ getDrugAllocation(scope.row) }}
                                    <span v-if="isOverAllocated(scope.row)">(Over limit)</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-alert
                        v-if="errorMessages.length"
                        type="error"
                        :title="errorMessages.join(', ')"
                        show-icon
                    />
                    <el-button
                        type="primary"
                        @click="fulfillPrescription"
                        :disabled="errorMessages.length"
                        >Fulfill</el-button
                    >
                    <el-alert
                        v-if="success"
                        type="success"
                        title="Prescription fulfilled!"
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

interface Drug {
    id: string;
    name: string;
    manufacturer: string;
    batch: string;
    expiry: string;
    stock: number;
    limit: number;
}

interface PrescriptionDrug {
    drugId: string;
    dosage: number;
}

interface Prescription {
    id: string;
    patientId: string;
    pharmacyId: string;
    drugs: PrescriptionDrug[];
    status: string;
}

const drugs = ref<Drug[]>([]);

const pharmacyAllocations = {
    PH001: {
        D001: 200,
        D002: 100,
    },
};

const prescriptions = ref<Prescription[]>([]);
async function fetchData() {
    try {
        const drugsRes = await axios.get('/api/drugs');
        drugs.value = drugsRes.data;
        const prescriptionsRes = await axios.get('/api/prescriptions');
        prescriptions.value = prescriptionsRes.data;
    } catch (err) {
        // Optionally show error
    }
}

onMounted(fetchData);

const dialogVisible = ref(false);
const selectedPrescription = ref<Prescription | null>(null);
const errorMessages = ref<string[]>([]);
const success = ref(false);

function getDrugExpiry(drugId: string) {
    const drug = drugs.value.find((d) => d.id === drugId);
    return drug ? drug.expiry : '';
}

function isDrugExpired(drugId: string) {
    const drug = drugs.value.find((d) => d.id === drugId);
    return drug ? new Date(drug.expiry) < new Date() : false;
}

function getDrugAllocation(drug: PrescriptionDrug) {
    const allocation = pharmacyAllocations['PH001'][drug.drugId];
    return allocation || 0;
}

function isOverAllocated(drug: PrescriptionDrug) {
    const allocation = pharmacyAllocations['PH001'][drug.drugId];
    return drug.dosage > allocation;
}

function validatePrescription(prescription: Prescription) {
    const errors: string[] = [];
    prescription.drugs.forEach((drug) => {
        if (isDrugExpired(drug.drugId)) {
            errors.push(`Drug ${drug.drugId} is expired`);
        }
        if (isOverAllocated(drug)) {
            errors.push(`Drug ${drug.drugId} exceeds pharmacy allocation`);
        }
    });
    return errors;
}

function onPrescriptionClick(row: Prescription) {
    selectedPrescription.value = row;
    errorMessages.value = validatePrescription(row);
    dialogVisible.value = true;
    success.value = false;
}

async function fulfillPrescription() {
    if (!selectedPrescription.value) return;
    if (errorMessages.value.length) {
        // Block fulfillment if there are errors
        return;
    }
    try {
        const res = await axios.post(`/api/prescriptions/${selectedPrescription.value.id}/fulfill`);
        if (res.data.success) {
            selectedPrescription.value.status = 'FULFILLED';
            success.value = true;
            setTimeout(() => (success.value = false), 2000);
            dialogVisible.value = false;
            await fetchData(); // Refresh list
        } else {
            errorMessages.value = res.data.errors || ['Unknown error'];
        }
    } catch (err) {
        errorMessages.value = ['Failed to fulfill prescription'];
    }
}
</script>

<style scoped>
.el-card {
    margin: 32px auto;
    max-width: 900px;
}
</style>
