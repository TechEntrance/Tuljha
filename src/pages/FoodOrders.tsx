import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { db } from '../db';
import { menuItems } from '../data/menuItems';
import MenuItemSelector from '../components/MenuItemSelector';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  itemId: string;
  quantity: number;
  rate: number;
}

interface OrderFormState {
  selectedItems: Record<string, boolean>;
  quantities: Record<string, number>;
}

function FoodOrders() {
  const { user } = useAuth();
  const [organizationId, setOrganizationId] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState<OrderFormState>({
    selectedItems: {},
    quantities: {}
  });

  // Fetch organizations for the current user
  const organizations = useLiveQuery(
    () => db.organizations.where('userId').equals(user?.id || 0).toArray(),
    [user?.id]
  );

  // Fetch orders for the selected organization
  const orders = useLiveQuery(
    () => organizationId 
      ? db.foodOrders
          .where('organizationId')
          .equals(Number(organizationId))
          .reverse()
          .toArray()
      : null,
    [organizationId]
  );

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleItemSelect = (itemId: string, selected: boolean) => {
    setFormState(prev => ({
      ...prev,
      selectedItems: { ...prev.selectedItems, [itemId]: selected },
      quantities: {
        ...prev.quantities,
        [itemId]: selected ? (prev.quantities[itemId] || 1) : 0
      }
    }));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setFormState(prev => ({
      ...prev,
      quantities: { ...prev.quantities, [itemId]: quantity }
    }));
  };

  const resetForm = () => {
    setFormState({
      selectedItems: {},
      quantities: {}
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !user?.id) {
      toast.error('Please select an organization');
      return;
    }

    const orderItems: OrderItem[] = Object.entries(formState.selectedItems)
      .filter(([_, selected]) => selected)
      .map(([itemId]) => ({
        itemId,
        quantity: formState.quantities[itemId] || 0,
        rate: menuItems.find(item => item.id === itemId)?.rate || 0
      }));

    if (orderItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    const totalAmount = calculateTotal(orderItems);

    try {
      if (editingId) {
        await db.foodOrders.update(editingId, {
          organizationId: Number(organizationId),
          items: orderItems,
          totalAmount,
          orderDate: new Date(),
          userId: user.id
        });
        toast.success('Order updated successfully');
        setEditingId(null);
      } else {
        await db.foodOrders.add({
          organizationId: Number(organizationId),
          items: orderItems,
          totalAmount,
          orderDate: new Date(),
          userId: user.id
        });
        toast.success('Order added successfully');
      }
      resetForm();
    } catch (error) {
      console.error('Order save error:', error);
      toast.error('Failed to save order');
    }
  };

  const handleEdit = (order: any) => {
    setEditingId(order.id);
    const selectedItems: Record<string, boolean> = {};
    const quantities: Record<string, number> = {};
    
    order.items.forEach((item: OrderItem) => {
      selectedItems[item.itemId] = true;
      quantities[item.itemId] = item.quantity;
    });

    setFormState({
      selectedItems,
      quantities
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await db.foodOrders.delete(id);
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete order');
    }
  };

  const calculateOrderTotal = () => {
    return Object.entries(formState.selectedItems)
      .filter(([_, selected]) => selected)
      .reduce((sum, [itemId]) => {
        const item = menuItems.find(i => i.id === itemId);
        return sum + ((item?.rate || 0) * (formState.quantities[itemId] || 0));
      }, 0);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Food Orders</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {editingId ? 'Edit Order' : 'New Food Order'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization</label>
            <select
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="">Select Organization</option>
              {organizations?.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Menu Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <MenuItemSelector
                  key={item.id}
                  item={item}
                  selected={formState.selectedItems[item.id] || false}
                  quantity={formState.quantities[item.id] || 0}
                  onSelect={(selected) => handleItemSelect(item.id, selected)}
                  onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-800 dark:text-white">
              Total: ₹{calculateOrderTotal()}
            </div>
            <div className="flex space-x-4">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-primary">
                {editingId ? (
                  <><Save className="h-4 w-4 mr-2" />Update Order</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" />Add Order</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {organizationId && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Orders List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {orders?.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {order.items.map((item: OrderItem) => {
                        const menuItem = menuItems.find(m => m.id === item.itemId);
                        return menuItem ? (
                          <div key={item.itemId}>
                            {menuItem.name}: {item.quantity} × ₹{item.rate} = ₹{item.quantity * item.rate}
                          </div>
                        ) : null;
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => order.id && handleDelete(order.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodOrders;