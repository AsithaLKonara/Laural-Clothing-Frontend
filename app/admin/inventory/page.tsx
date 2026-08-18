'use client';

import { useState } from 'react';
import { useBranches, useInventory, useTransfers, useAdjustStock, useCreateTransfer, useUpdateTransferStatus } from '@/hooks/useInventory';
import { Button } from '@/components/ui/Button';

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'TRANSFERS' | 'BRANCHES'>('STOCK');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  const { data: branchesData, isLoading: branchesLoading } = useBranches();
  const { data: inventoryData, isLoading: invLoading } = useInventory(selectedBranchId || undefined);
  const { data: transfersData, isLoading: transfersLoading } = useTransfers();

  const adjustStockMutation = useAdjustStock();
  const updateTransferStatus = useUpdateTransferStatus();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Inventory Dashboard</h1>
        {activeTab === 'STOCK' && (
          <select 
            value={selectedBranchId} 
            onChange={e => setSelectedBranchId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Branches</option>
            {branchesData?.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex gap-4 mb-6 border-b pb-2">
        <button className={`pb-2 ${activeTab === 'STOCK' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`} onClick={() => setActiveTab('STOCK')}>Stock Levels</button>
        <button className={`pb-2 ${activeTab === 'TRANSFERS' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`} onClick={() => setActiveTab('TRANSFERS')}>Stock Transfers</button>
        <button className={`pb-2 ${activeTab === 'BRANCHES' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`} onClick={() => setActiveTab('BRANCHES')}>Branches</button>
      </div>

      {activeTab === 'STOCK' && (
        <div className="bg-white rounded shadow overflow-hidden">
          {invLoading ? (
            <div className="p-4">Loading inventory...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4">Variant</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData?.data?.map((item: any) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.productName}</div>
                    </td>
                    <td className="p-4">{item.branchName}</td>
                    <td className="p-4 font-medium">{item.quantity}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${item.isOutOfStock ? 'bg-red-100 text-red-700' : item.isLowStock ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {item.stockStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        const qty = prompt(`Adjust stock for ${item.name}? Enter quantity change (+ to add, - to deduct):`);
                        if (qty && !isNaN(Number(qty))) {
                          adjustStockMutation.mutate({
                            variantId: item.variantId,
                            branchId: item.branchId,
                            type: Number(qty) >= 0 ? 'RECEIVE' : 'DEDUCT',
                            quantity: Math.abs(Number(qty)),
                            reason: 'Manual adjustment'
                          });
                        }
                      }}>Adjust</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'TRANSFERS' && (
        <div className="bg-white rounded shadow overflow-hidden">
           {transfersLoading ? (
            <div className="p-4">Loading transfers...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Variant</th>
                  <th className="p-4">From → To</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transfersData?.data?.map((t: any) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-4">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{t.variant.name}</td>
                    <td className="p-4">{t.fromBranch.name} → {t.toBranch.name}</td>
                    <td className="p-4">{t.quantity}</td>
                    <td className="p-4">{t.status}</td>
                    <td className="p-4 text-right">
                      {t.status === 'PENDING' && (
                        <Button size="sm" onClick={() => updateTransferStatus.mutate({ id: t.id, status: 'DISPATCHED' })}>Dispatch</Button>
                      )}
                      {t.status === 'DISPATCHED' && (
                        <Button size="sm" onClick={() => updateTransferStatus.mutate({ id: t.id, status: 'RECEIVED' })}>Receive</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'BRANCHES' && (
        <div className="bg-white rounded shadow overflow-hidden p-4">
          <h2 className="font-semibold mb-4">Active Branches</h2>
          <ul className="space-y-2">
            {branchesData?.map((b: any) => (
              <li key={b.id} className="p-3 border rounded flex justify-between">
                <div>
                  <div className="font-medium">{b.name} ({b.code})</div>
                  <div className="text-sm text-gray-500">{b.type}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
