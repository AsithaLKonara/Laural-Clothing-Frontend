'use client';

import { useState } from 'react';
import { useCreateShipment } from '@/hooks/useShipping';
import { Button } from '@/components/ui/Button';
import axios from 'axios';

// A mock useOrders hook just for this page so we don't have to build the whole order service
import { useQuery } from '@tanstack/react-query';
const usePendingOrders = () => {
  return useQuery({
    queryKey: ['pending-orders'],
    queryFn: async () => {
      // In a real app this would call /api/orders?status=PROCESSING
      return [
        { id: 'ORD-1001', customerName: 'John Doe', phone: '0712345678', address: '123 Main St', city: 'Colombo', total: 4500, shippingStatus: 'PENDING' },
        { id: 'ORD-1002', customerName: 'Jane Smith', phone: '0776543210', address: '45 Kandy Rd', city: 'Kandy', total: 8500, shippingStatus: 'PENDING' },
      ];
    }
  });
}

export default function ShippingDashboard() {
  const { data: orders, isLoading } = usePendingOrders();
  const createShipment = useCreateShipment();
  const [trackingData, setTrackingData] = useState<Record<string, any>>({});
  const [shippedOrders, setShippedOrders] = useState<Record<string, any>>({});

  const handleCreateShipment = (order: any) => {
    createShipment.mutate(
      {
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.phone,
        customerAddress: order.address,
        city: order.city,
      },
      {
        onSuccess: (res) => {
          setShippedOrders(prev => ({ ...prev, [order.id]: res }));
        }
      }
    );
  };

  const handleTrack = async (trackingNumber: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/inventory/shipping/${trackingNumber}`);
      setTrackingData(prev => ({ ...prev, [trackingNumber]: res.data }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Fardar Shipping Dashboard</h1>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4">Loading orders...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">City</th>
                <th className="p-4">Courier Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order: any) => {
                const shipment = shippedOrders[order.id];
                const trackInfo = shipment ? trackingData[shipment.trackingNumber] : null;

                return (
                  <tr key={order.id} className="border-t">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.phone}</div>
                    </td>
                    <td className="p-4">{order.city}</td>
                    <td className="p-4">
                      {shipment ? (
                        <div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{trackInfo?.status || 'SHIPPED'}</span>
                          <div className="text-xs mt-1 text-gray-500">{shipment.trackingNumber}</div>
                        </div>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">PENDING DISPATCH</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {!shipment ? (
                        <Button size="sm" onClick={() => handleCreateShipment(order)} isLoading={createShipment.isPending}>
                          Create Label
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleTrack(shipment.trackingNumber)}>Track</Button>
                          <a href={shipment.labelUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline inline-block ml-2">View Label</a>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
