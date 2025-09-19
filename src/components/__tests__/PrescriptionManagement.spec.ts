import { mount } from '@vue/test-utils';
import PrescriptionManagement from '../PrescriptionManagement.vue';

describe('PrescriptionManagement.vue', () => {
  it('renders prescription list', async () => {
    const wrapper = mount(PrescriptionManagement);
    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.text()).toMatch(/RX123|RX124/);
  });

  it('shows error for over-allocated drug', async () => {
    const wrapper = mount(PrescriptionManagement, {
      data() {
        return {
          prescriptions: [{ id: 'RX999', patientId: 'P999', pharmacyId: 'PH001', drugs: [{ drugId: 'D001', dosage: 999 }], status: 'PENDING' }]
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
      expect(wrapper.text()).toContain('exceeds pharmacy allocation');
    } else {
      throw new Error('No table row found to click');
    }
  });

  it('blocks fulfillment if errors', async () => {
    const wrapper = mount(PrescriptionManagement, {
      data() {
        return {
          prescriptions: [{ id: 'RX999', patientId: 'P999', pharmacyId: 'PH001', drugs: [{ drugId: 'D001', dosage: 999 }], status: 'PENDING' }]
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
      // Try to click fulfill button
      const fulfillBtn = wrapper.find('button');
      expect(fulfillBtn.attributes('disabled')).toBeDefined();
      expect(wrapper.text()).toContain('exceeds pharmacy allocation');
    } else {
      throw new Error('No table row found to click');
    }
  });
});
