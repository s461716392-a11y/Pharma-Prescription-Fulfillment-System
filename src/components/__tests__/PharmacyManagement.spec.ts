import { mount } from '@vue/test-utils';
import PharmacyManagement from '../PharmacyManagement.vue';

describe('PharmacyManagement.vue', () => {
  it('renders pharmacy list', async () => {
    const wrapper = mount(PharmacyManagement);
    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.text()).toMatch(/Chengdu Main Branch|Shanghai East Branch|Beijing North Branch|Guangzhou South Branch/);
  });

  it('shows allocated drugs in dialog when row is clicked', async () => {
    const wrapper = mount(PharmacyManagement);
    // Wait for pharmacies to load
    await new Promise((r) => setTimeout(r, 100));
    // Find the first row and trigger click
    const rows = wrapper.findAll('.el-table__row');
    expect(rows.length).toBeGreaterThan(0);
    if (rows[0]) {
      await rows[0].trigger('click');
      // Wait for dialog to open
      await wrapper.vm.$nextTick();
      // Check dialog content for allocated drugs
      expect(wrapper.html()).toMatch(/Allocated Limit|Drug Name|Drug ID/);
    } else {
      throw new Error('No table row found to click');
    }
  });
});
