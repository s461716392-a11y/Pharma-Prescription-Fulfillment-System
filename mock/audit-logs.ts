import { MockMethod } from 'vite-plugin-mock';

const logs = [
    {
        prescriptionId: 'RX123',
        patientId: 'P001',
        pharmacyId: 'PH001',
        status: 'FAILED',
        drugsRequested: [
            { drugId: 'D001', dosage: 400 },
            { drugId: 'D002', dosage: 500 },
        ],
        drugsDispensed: [
            { drugId: 'D001', dosage: 0 },
            { drugId: 'D002', dosage: 0 },
        ],
        failureReasons: ['Drug expired', 'Over allocation'],
    },
    {
        prescriptionId: 'RX124',
        patientId: 'P002',
        pharmacyId: 'PH002',
        status: 'SUCCESS',
        drugsRequested: [{ drugId: 'D003', dosage: 100 }],
        drugsDispensed: [{ drugId: 'D003', dosage: 100 }],
        failureReasons: [],
    },
    {
        prescriptionId: 'RX125',
        patientId: 'P003',
        pharmacyId: 'PH001',
        status: 'FAILED',
        drugsRequested: [
            { drugId: 'D001', dosage: 250 },
            { drugId: 'D002', dosage: 80 },
        ],
        drugsDispensed: [
            { drugId: 'D001', dosage: 0 },
            { drugId: 'D002', dosage: 80 },
        ],
        failureReasons: ['Drug D001 exceeds pharmacy allocation'],
    },
    {
        prescriptionId: 'RX126',
        patientId: 'P004',
        pharmacyId: 'PH002',
        status: 'SUCCESS',
        drugsRequested: [
            { drugId: 'D003', dosage: 50 },
            { drugId: 'D001', dosage: 60 },
        ],
        drugsDispensed: [
            { drugId: 'D003', dosage: 50 },
            { drugId: 'D001', dosage: 60 },
        ],
        failureReasons: [],
    },
    {
        prescriptionId: 'RX127',
        patientId: 'P005',
        pharmacyId: 'PH003',
        status: 'FAILED',
        drugsRequested: [
            { drugId: 'D003', dosage: 90 },
            { drugId: 'D001', dosage: 130 },
        ],
        drugsDispensed: [
            { drugId: 'D003', dosage: 80 },
            { drugId: 'D001', dosage: 120 },
        ],
        failureReasons: ['Partial fulfillment due to stock limits'],
    },
];

export default [
    {
        url: '/api/audit-logs',
        method: 'get',
        response: ({ query }: { query: Record<string, string> }) => {
            // Filtering logic
            let result = logs;
            if (query.patientId) {
                result = result.filter((log) => log.patientId.includes(query.patientId));
            }
            if (query.pharmacyId) {
                result = result.filter((log) => log.pharmacyId.includes(query.pharmacyId));
            }
            if (query.status) {
                result = result.filter((log) => log.status === query.status);
            }
            return result;
        },
    },
] as MockMethod[];
