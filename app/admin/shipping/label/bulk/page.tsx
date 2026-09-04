import { serverFetch } from "@/lib/server-fetch";
import { notFound } from "next/navigation";
import PrintButton from "../[orderId]/PrintButton";
import { cookies, headers } from "next/headers";

export default async function BulkLabelPage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const resolvedParams = await searchParams;
  if (!resolvedParams.ids) {
    return notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('laural_access_token')?.value;

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const forwardedFor = headersList.get('x-forwarded-for') || '';

  const orderIds = resolvedParams.ids.split(',');

  // Fetch all orders concurrently
  const fetchPromises = orderIds.map(id => 
    serverFetch<any>(`/orders/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'User-Agent': userAgent,
        'X-Forwarded-For': forwardedFor
      },
      next: { revalidate: 0 },
    }).catch(() => null)
  );

  const responses = await Promise.all(fetchPromises);
  const orders = responses
    .filter(res => res && res.data && res.data.trackingNumber)
    .map(res => res.data);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 font-inter">
        <h1 className="text-2xl font-bold text-stone-800">No Labels Found</h1>
        <p className="text-stone-500 mt-2">None of the selected orders have tracking numbers or they do not exist.</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-200 min-h-screen py-8 flex flex-col items-center">
      {/* Print Button Header */}
      <div className="w-full max-w-[400px] flex justify-between items-center mb-6 print:hidden bg-white p-4 rounded shadow">
        <div>
          <h2 className="font-bold">Bulk Print</h2>
          <p className="text-sm text-gray-500">{orders.length} labels ready</p>
        </div>
        <PrintButton />
      </div>

      {/* Render all labels */}
      <div className="flex flex-col gap-8 print:block print:w-full print:bg-white print:m-0 print:p-0">
        {orders.map((order, index) => {
          const customerName = order.customer 
            ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`
            : order.shippingAddress?.firstName 
              ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
              : 'Guest';

          const customerPhone = order.customer?.phone || order.shippingAddress?.phone || 'N/A';
          const customerAddress = order.shippingAddress 
            ? `${order.shippingAddress.addressLine1} ${order.shippingAddress.addressLine2 || ''}`
            : 'No shipping address provided';
          const city = order.shippingAddress?.city || 'Unknown City';
          const codAmount = order.paymentMethod === 'COD' ? order.total : 0;

          return (
            <div 
              key={order.id} 
              className="w-[400px] border-2 border-black p-4 bg-white font-mono text-sm relative print:w-full print:h-screen print:border-none print:break-after-page mx-auto"
            >
              <div className="absolute top-4 right-4 font-bold text-lg">FARDAR</div>
              
              <div className="border-b-2 border-black pb-4 mb-4">
                <h1 className="text-xl font-bold mb-1">SHIPPING LABEL</h1>
                <p className="text-xs uppercase">Laural Clothing Ltd.</p>
              </div>

              <div className="mb-4">
                <h2 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Deliver To:</h2>
                <p className="font-bold text-lg">{customerName}</p>
                <p>{customerAddress}</p>
                <p>{city}</p>
                <p className="mt-1 font-bold">Tel: {customerPhone}</p>
              </div>

              <div className="border-t-2 border-black pt-4 mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-gray-500">Order Ref:</p>
                  <p className="font-bold">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Date:</p>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs uppercase text-gray-500">Tracking Number:</p>
                  <p className="font-bold text-lg">{order.trackingNumber}</p>
                </div>
              </div>

              <div className="border-2 border-black p-3 flex items-center justify-between">
                <p className="font-bold uppercase tracking-wider">
                  {codAmount > 0 ? 'CASH ON DELIVERY' : 'PREPAID'}
                </p>
                <p className="font-bold text-xl">
                  {codAmount > 0 ? `Rs. ${codAmount.toFixed(2)}` : 'PAID'}
                </p>
              </div>
              
              <div className="mt-6 text-center text-xs text-gray-500 italic">
                Please do not fold on barcode area. ({index + 1} of {orders.length})
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
