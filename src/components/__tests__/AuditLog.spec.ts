import { mount } from '@vue/test-utils';
import AuditLog from '../AuditLog.vue';

describe('AuditLog.vue', () => {
  it('renders audit log list', async () => {
    const wrapper = mount(AuditLog);
    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.text()).toMatch(/RX123|RX124|RX125|RX126|RX127/);
  });

  it('filters logs by patient ID', async () => {
    const wrapper = mount(AuditLog);
    await new Promise((r) => setTimeout(r, 100));
    // Simulate input for patient ID
    const input = wrapper.find('input[placeholder="Patient ID"]');
    await input.setValue('P001');
    // Click filter button
    const filterBtn = wrapper.find('button');
    await filterBtn.trigger('click');
    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.text()).toContain('P001');
  });

  it('shows log details in dialog', async () => {
    const wrapper = mount(AuditLog, {
      data() {
        return {
          filteredLogs: [{ prescriptionId: 'RX999', patientId: 'P999', pharmacyId: 'PH001', status: 'FAILED', drugsRequested: [], drugsDispensed: [], failureReasons: ['Test reason'] }]
        };
      }
    });
    await new Promise((r) => setTimeout(r, 100));
    // Simulate row click
    const rows = wrapper.findAll('.el-table__row');
    expect(rows.length).toBeGreaterThan(0);
    if (rows[0]) {
      await rows[0].trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('Test reason');
    } else {
      throw new Error('No table row found to click');
    }
  });
});
