import { MockMethod } from 'vite-plugin-mock';

const prescriptions = [
    {
        id: 'RX123',
        patientId: 'P001',
        pharmacyId: 'PH001',
        drugs: [
            { drugId: 'D001', dosage: 40 },
            { drugId: 'D002', dosage: 50 },
        ],
        status: 'PENDING',
    },
    {
        id: 'RX124',
        patientId: 'P002',
        pharmacyId: 'PH002',
        drugs: [{ drugId: 'D003', dosage: 100 }],
        status: 'PENDING',
    },
    {
        id: 'RX125',
        patientId: 'P003',
        pharmacyId: 'PH001',
        drugs: [
            { drugId: 'D001', dosage: 250 },
            { drugId: 'D002', dosage: 80 },
        ],
        status: 'PENDING',
    },
    {
        id: 'RX126',
        patientId: 'P004',
        pharmacyId: 'PH002',
        drugs: [
            { drugId: 'D003', dosage: 50 },
            { drugId: 'D001', dosage: 60 },
        ],
        status: 'PENDING',
    },
];

export default [
    {
        url: '/api/prescriptions',
        method: 'get',
        response: () => prescriptions,
    },
    {
        url: /\/api\/prescriptions\/(.*)/,
        method: 'get',
        response: ({ query }: { query: string[] }) => {
            const id = query[0];
            return prescriptions.find((p) => p.id === id);
        },
    },
    {
        url: /\/api\/prescriptions\/(.*)\/fulfill/,
        method: 'post',
        response: ({ query }: { query: string[] }) => {
            const id = query[0];
            const prescription = prescriptions.find((p) => p.id === id);
            if (!prescription) return { success: false, errors: ['Prescription not found'] };
            // Mock validation logic
            const errors: string[] = [];
            prescription.drugs.forEach((drug) => {
                if (drug.drugId === 'D002') errors.push('Drug D002 is expired');
                if (drug.drugId === 'D001' && drug.dosage > 200)
                    errors.push('Drug D001 exceeds pharmacy allocation');
            });
            if (errors.length) return { success: false, errors };
            prescription.status = 'FULFILLED';
            return { success: true };
        },
    },
] as MockMethod[];
