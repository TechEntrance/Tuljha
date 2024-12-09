import React from 'react';
import { MenuItem } from '../data/menuItems';

interface MenuItemSelectorProps {
  item: MenuItem;
  selected: boolean;
  quantity: number;
  onSelect: (selected: boolean) => void;
  onQuantityChange: (quantity: number) => void;
}

function MenuItemSelector({ item, selected, quantity, onSelect, onQuantityChange }: MenuItemSelectorProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.rate}</p>
        </div>
      </div>
      {selected && (
        <div className="flex items-center space-x-2">
          <label className="sr-only">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 text-sm border rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            = ₹{(item.rate * quantity).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

export default MenuItemSelector;