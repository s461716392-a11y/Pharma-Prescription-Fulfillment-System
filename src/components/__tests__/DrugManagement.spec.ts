import { mount } from '@vue/test-utils';
import DrugManagement from '../DrugManagement.vue';

describe('DrugManagement.vue', () => {
  it('renders drug list', async () => {
    const wrapper = mount(DrugManagement);
    // Wait for API fetch
    await new Promise((r) => setTimeout(r, 100));
    expect(wrapper.text()).toMatch(/Ibuprofen|Paracetamol/);
  });

  it('shows expired drugs', async () => {
    const wrapper = mount(DrugManagement);
    await wrapper.setData({ drugs: [{ id: 'D003', name: 'ExpiredDrug', manufacturer: 'Test', batch: 'B202401', expiry: '2020-01-01', stock: 10, limit: 10 }] });
    await wrapper.vm.$forceUpdate();
    expect(wrapper.html()).toContain('(Expired)');
  });

  it('validates form before adding drug', async () => {
    const wrapper = mount(DrugManagement);
    await wrapper.find('button').trigger('click');
    expect(wrapper.text()).toContain('Please fix validation errors');
  });
});
