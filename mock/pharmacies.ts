import { MockMethod } from 'vite-plugin-mock';

const pharmacies = [
    {
        id: 'PH001',
        name: 'Chengdu Main Branch',
        allocatedDrugs: [
            { drugId: 'D001', drugName: 'Ibuprofen', limit: 200 },
            { drugId: 'D002', drugName: 'Paracetamol', limit: 100 },
        ],
    },
    {
        id: 'PH002',
        name: 'Shanghai East Branch',
        allocatedDrugs: [{ drugId: 'D003', drugName: 'Aspirin', limit: 150 }],
    },
    {
        id: 'PH003',
        name: 'Beijing North Branch',
        allocatedDrugs: [
            { drugId: 'D001', drugName: 'Ibuprofen', limit: 120 },
            { drugId: 'D003', drugName: 'Aspirin', limit: 80 },
        ],
    },
    {
        id: 'PH004',
        name: 'Guangzhou South Branch',
        allocatedDrugs: [
            { drugId: 'D002', drugName: 'Paracetamol', limit: 90 },
            { drugId: 'D004', drugName: 'Amoxicillin', limit: 60 },
        ],
    },
];

export default [
    {
        url: '/api/pharmacies',
        method: 'get',
        response: () => pharmacies,
    },
    {
        url: /\/api\/pharmacies\/(.*)/,
        method: 'get',
        response: ({ query }: { query: string[] }) => {
            const id = query[0];
            return pharmacies.find((p) => p.id === id);
        },
    },
] as MockMethod[];
