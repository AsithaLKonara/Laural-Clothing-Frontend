'use client';

import { useState } from 'react';
import { useOrders, useDispatchOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/Button';
import ShippingLabelModal from './components/ShippingLabelModal';

export default function ShippingDashboard() {
  const { data: ordersData, isLoading } = useOrders();
  const orders = ordersData?.data || [];
  const dispatchOrder = useDispatchOrder();
  
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  // Modal State
  const [previewOrderIds, setPreviewOrderIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateShipment = (orderId: string) => {
    dispatchOrder.mutate(orderId);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Select all dispatched/tracked orders
      const dispatchableIds = orders
        .filter((o: any) => o.status === 'DISPATCHED' || !!o.trackingNumber)
        .map((o: any) => o.id);
      setSelectedOrderIds(dispatchableIds);
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(prev => [...prev, orderId]);
    } else {
      setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Fardar Shipping Dashboard</h1>
        {selectedOrderIds.length > 0 && (
          <Button onClick={() => {
            setPreviewOrderIds(selectedOrderIds);
            setIsModalOpen(true);
          }}>
            Print Selected Labels ({selectedOrderIds.length})
          </Button>
        )}
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4">Loading orders...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Courier Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order: any) => {
                const isDispatched = order.status === 'DISPATCHED' || !!order.trackingNumber;

                return (
                  <tr key={order.id} className={`border-t ${selectedOrderIds.includes(order.id) ? 'bg-blue-50' : ''}`}>
                    <td className="p-4">
                      {isDispatched && (
                        <input 
                          type="checkbox" 
                          checked={selectedOrderIds.includes(order.id)}
                          onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      )}
                    </td>
                    <td className="p-4 font-medium">{order.orderNumber}</td>
                    <td className="p-4">
                      <div>
                        {order.customer 
                          ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}` 
                          : order.shippingAddress?.firstName 
                            ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                            : 'Guest'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customer?.phone || order.shippingAddress?.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">Rs. {order.total.toFixed(2)}</td>
                    <td className="p-4">
                      {isDispatched ? (
                        <div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs uppercase">{order.status}</span>
                          <div className="text-xs mt-1 text-gray-500">{order.trackingNumber}</div>
                        </div>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs uppercase">{order.status}</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {!isDispatched ? (
                        <Button size="sm" onClick={() => handleCreateShipment(order.id)} isLoading={dispatchOrder.isPending}>
                          Dispatch & Create Label
                        </Button>
                      ) : (
                        <>
                          {order.trackingNumber && (
                            <button 
                              onClick={() => {
                                setPreviewOrderIds([order.id]);
                                setIsModalOpen(true);
                              }}
                              className="text-sm text-blue-600 hover:underline inline-block font-medium"
                            >
                              View Label
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {orders?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      <ShippingLabelModal 
        orderIds={previewOrderIds}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
