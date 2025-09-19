import { MockMethod } from 'vite-plugin-mock';

const drugs = [
    {
        id: 'D001',
        name: 'Ibuprofen',
        manufacturer: 'ACME Pharma',
        batch: 'B202403',
        expiry: '2026-01-01',
        stock: 150,
        limit: 200,
    },
    {
        id: 'D002',
        name: 'Paracetamol',
        manufacturer: 'ACME Pharma',
        batch: 'B202404',
        expiry: '2024-01-01',
        stock: 50,
        limit: 100,
    },
    {
        id: 'D003',
        name: 'Aspirin',
        manufacturer: 'HealthCorp',
        batch: 'B202405',
        expiry: '2025-12-31',
        stock: 80,
        limit: 150,
    },
    {
        id: 'D004',
        name: 'Amoxicillin',
        manufacturer: 'BioMed',
        batch: 'B202406',
        expiry: '2027-06-15',
        stock: 60,
        limit: 60,
    },
    {
        id: 'D005',
        name: 'Cetirizine',
        manufacturer: 'AllergyFree',
        batch: 'B202407',
        expiry: '2025-03-20',
        stock: 40,
        limit: 80,
    },
];

export default [
    {
        url: '/api/drugs',
        method: 'get',
        response: () => drugs,
    },
    {
        url: '/api/drugs',
        method: 'post',
        response: ({ body }: { body: (typeof drugs)[number] }) => {
            drugs.push(body);
            return { success: true };
        },
    },
] as MockMethod[];
