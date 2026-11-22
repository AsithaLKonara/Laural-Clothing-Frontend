'use client';

import { useState, useEffect } from 'react';
import { useOrders, useDispatchOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/Button';
import ShippingLabelModal from './components/ShippingLabelModal';
import TrackingSidePanel from './components/TrackingSidePanel';
import { X, Search } from 'lucide-react';

export default function ShippingDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: ordersData, isLoading } = useOrders({ search: debouncedSearchQuery });
  const orders = ordersData?.data || [];
  const dispatchOrder = useDispatchOrder();
  
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  // Modal State
  const [previewOrderIds, setPreviewOrderIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tracking Panel State
  const [isTrackingPanelOpen, setIsTrackingPanelOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<any>(null);

  const openTrackingPanel = (order: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTrackingOrder(order);
    setIsTrackingPanelOpen(true);
  };

  // Dispatch Weight Modal State
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchOrderId, setDispatchOrderId] = useState<string | null>(null);
  const [dispatchWeight, setDispatchWeight] = useState<number>(1.0);

  const openDispatchModal = (orderId: string) => {
    setDispatchOrderId(orderId);
    setDispatchWeight(1.0); // Reset to default base rate weight
    setDispatchModalOpen(true);
  };

  const handleConfirmDispatch = () => {
    if (dispatchOrderId) {
      dispatchOrder.mutate(
        { orderId: dispatchOrderId, weightKg: dispatchWeight },
        {
          onSuccess: () => {
            setDispatchModalOpen(false);
            setDispatchOrderId(null);
          },
          onError: (error: any) => {
            alert(error.response?.data?.error || error.message || "Failed to dispatch order.");
            setDispatchModalOpen(false);
            setDispatchOrderId(null);
          }
        }
      );
    }
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
        <h1 className="text-2xl font-semibold">Courier Shipments</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID, Phone, Tracking #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {selectedOrderIds.length > 0 && (
            <Button onClick={() => {
              setPreviewOrderIds(selectedOrderIds);
              setIsModalOpen(true);
            }}>
              Print Selected Labels ({selectedOrderIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#FF003A] text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-90">Success Rate (Today)</p>
          <p className="text-4xl font-bold">{(orders.filter((o:any) => o.status === 'DELIVERED').length / (orders.length || 1) * 100).toFixed(1)}%</p>
          <div className="mt-4 text-xs opacity-90">
            {orders.filter((o:any) => o.status === 'DELIVERED').length} delivered of {orders.length} in period
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-white/50" style={{ width: `${(orders.filter((o:any) => o.status === 'DELIVERED').length / (orders.length || 1) * 100)}%` }} />
          </div>
        </div>
        
        <div className="bg-[#FFF4E5] text-[#D84B16] rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2">Return Rate (Today)</p>
          <p className="text-4xl font-bold">{(orders.filter((o:any) => o.status === 'RETURNED').length / (orders.length || 1) * 100).toFixed(1)}%</p>
          <div className="mt-4 text-xs flex items-center gap-1 bg-[#FDE8D7] w-max px-2 py-1 rounded">
            <span>↺</span> {orders.filter((o:any) => o.status === 'RETURNED').length} Returned
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-blue-600">Dispatched</p>
            <p className="text-4xl font-bold text-blue-900">{orders.filter((o:any) => o.status === 'DISPATCHED' || o.trackingNumber).length}</p>
          </div>
          <div className="flex gap-2 mt-4 text-[10px] font-semibold text-blue-600">
            <span className="bg-blue-50 px-2 py-1 rounded">Picked Up: {orders.filter((o:any) => o.status === 'PICKED_UP').length}</span>
            <span className="bg-blue-50 px-2 py-1 rounded">In Transit: {orders.filter((o:any) => o.status === 'IN_TRANSIT').length}</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-stone-500">Total Shipments</p>
          <p className="text-4xl font-bold text-stone-900">{orders.length}</p>
          <div className="flex gap-2 mt-4 text-[10px] font-semibold">
            <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">✓ {orders.filter((o:any) => o.status === 'DELIVERED').length} Delivered</span>
            <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded">✕ {orders.filter((o:any) => o.status === 'CANCELLED').length} Cancelled</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Status Breakdown</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Pending Approval', status: 'PENDING', color: 'bg-orange-50 text-orange-700' },
            { label: 'Processing', status: 'PROCESSING', color: 'bg-gray-50 text-gray-700' },
            { label: 'Pending Pickup', status: 'DISPATCHED', color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Picked Up', status: 'PICKED_UP', color: 'bg-blue-50 text-blue-700' },
            { label: 'In Transit', status: 'IN_TRANSIT', color: 'bg-indigo-50 text-indigo-700' },
            { label: 'Out for Del.', status: 'OUT_FOR_DELIVERY', color: 'bg-purple-50 text-purple-700' },
            { label: 'Delivered', status: 'DELIVERED', color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Returned', status: 'RETURNED', color: 'bg-red-50 text-red-700' },
            { label: 'Cancelled', status: 'CANCELLED', color: 'bg-stone-100 text-stone-700' },
          ].map(stat => (
            <div key={stat.label} className={`flex items-center gap-3 p-3 rounded-xl border border-stone-100 ${stat.color}`}>
              <div className="text-lg font-bold">{orders.filter((o:any) => o.status === stat.status).length}</div>
              <div className="text-xs font-semibold leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
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
                  <tr 
                    key={order.id} 
                    className={`border-t cursor-pointer hover:bg-stone-50 transition-colors ${selectedOrderIds.includes(order.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => openTrackingPanel(order)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
                    <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      {!isDispatched ? (
                        <Button size="sm" onClick={() => openDispatchModal(order.id)} isLoading={dispatchOrder.isPending && dispatchOrderId === order.id}>
                          Dispatch & Create Label
                        </Button>
                      ) : (
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={(e) => openTrackingPanel(order, e)}
                            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                          >
                            Track
                          </button>
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
                        </div>
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

      {/* Dispatch Weight Modal */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <h3 className="font-bold text-lg text-stone-900">Enter Actual Package Weight</h3>
              <button onClick={() => setDispatchModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-stone-500 mb-4">
                Please enter the exact packed weight of this order (including the box). Fardar will use this to calculate your courier fee.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">Weight (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={dispatchWeight}
                  onChange={(e) => setDispatchWeight(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDispatchModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmDispatch} isLoading={dispatchOrder.isPending}>
                  Confirm Dispatch
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ShippingLabelModal 
        orderIds={previewOrderIds}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <TrackingSidePanel
        order={trackingOrder}
        isOpen={isTrackingPanelOpen}
        onClose={() => setIsTrackingPanelOpen(false)}
      />
    </div>
  );
}
