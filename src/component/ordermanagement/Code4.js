import React from 'react';
import { Search, Bell, ChevronDown, Edit, MoreHorizontal, ChevronRight, ChevronLeft } from 'lucide-react';

const Sidebar = () => (
  <div className="w-64 bg-gray-100 h-screen p-4">
    <div className="flex items-center mb-8">
      <div className="w-8 h-8 bg-purple-600 text-white rounded flex items-center justify-center mr-2">S</div>
      <span className="text-xl font-bold">ShopZen</span>
    </div>
    {['Home', 'Orders', 'Drafts', 'Shipping labels', 'Abandoned checkouts', 'Products', 'Customers', 'Content', 'Finances', 'Analytics', 'Marketing', 'Discounts', 'Sales Channels', 'Online Store', 'Point of Sale', 'Shop', 'Apps', 'Add Apps'].map((item, index) => (
      <div key={index} className={`py-2 px-4 my-1 rounded ${item === 'Orders' ? 'bg-purple-100 text-purple-600' : ''} ${item === 'Discounts' ? 'flex justify-between items-center' : ''}`}>
        {item}
        {item === 'Discounts' && <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">New</span>}
      </div>
    ))}
  </div>
);

const Header = () => (
  <div className="flex justify-between items-center p-4 border-b">
    <div className="flex items-center bg-gray-100 rounded-md p-2 w-1/2">
      <Search className="text-gray-400 mr-2" size={20} />
      <input type="text" placeholder="Search or type command..." className="bg-transparent outline-none w-full" />
    </div>
    <div className="flex items-center">
      <button className="mr-4"><Bell size={20} /></button>
      <img src="/path-to-avatar.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
    </div>
  </div>
);

const OrderDetails = () => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">Order ID: 334902445</h2>
        <p className="text-sm text-gray-500">January 8, 2024 at 9:48 pm from Draft Orders</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">Payment pending</span>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">Unfulfilled</span>
        <button className="px-3 py-1 border rounded-md">Restock</button>
        <button className="px-3 py-1 border rounded-md flex items-center">
          <Edit size={16} className="mr-2" /> Edit
        </button>
        <button className="px-3 py-1 border rounded-md flex items-center">
          More actions <ChevronDown size={16} className="ml-2" />
        </button>
        <button className="px-2 py-1 border rounded-md"><ChevronLeft size={16} /></button>
        <button className="px-2 py-1 border rounded-md"><ChevronRight size={16} /></button>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Item</h3>
            <ChevronDown size={20} />
          </div>
          <p className="text-sm text-gray-600 mb-4">Use this personalized guide to get your store up and running.</p>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <img src="/path-to-macbook-image.jpg" alt="Macbook Air" className="w-16 h-16 object-cover rounded mr-4" />
              <div>
                <p className="font-semibold">Macbook Air</p>
                <p className="text-sm text-gray-600">Medium · Black</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">3 x $500.00</span>
              <span className="font-semibold">$1500.00</span>
              <button className="ml-4"><MoreHorizontal size={20} /></button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Effortlessly manage your orders with our intuitive Order List page.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button className="px-3 py-1 border rounded-md">Fulfill item</button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded-md">Create shipping label</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <ChevronDown size={20} />
          </div>
          <p className="text-sm text-gray-600 mb-4">Use this personalized guide to get your store up and running.</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>1 item</span>
              <span className="font-semibold">$1500</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>New customer</span>
              <span className="font-semibold">-$100</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free shipping (OD 5)</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span></span>
              <span>$1,499</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <span>Paid by customer</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Payment due when invoice is sent</span>
              <button className="text-purple-600">Edit</button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Review your order at a glance on the Order Summary page.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button className="px-3 py-1 border rounded-md">Send invoice</button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded-md">Collect payment</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Timeline</h3>
            <ChevronDown size={20} />
          </div>
          <p className="text-sm text-gray-600 mb-4">Use this personalized guide to get your store up and running.</p>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-orange-600">AJ</span>
            </div>
            <span>Alex Jander</span>
          </div>
          <input type="text" placeholder="Leave a comment..." className="w-full border rounded-md p-2 mt-4" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Notes</h3>
            <Edit size={16} />
          </div>
          <p className="text-sm">First customer and order!</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Customers</h3>
            <ChevronDown size={20} />
          </div>
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">AJ</div>
            <span>Alex Jander</span>
          </div>
          <p className="text-sm text-gray-600">1 Order</p>
          <p className="text-sm text-gray-600">Customer is tax-exempt</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <Edit size={16} />
          </div>
          <p className="text-sm">alexjander@gmail.com</p>
          <p className="text-sm text-gray-600">No phone number</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Shipping address</h3>
            <Edit size={16} />
          </div>
          <p className="text-sm">Alex Jander</p>
          <p className="text-sm">1226 University Drive</p>
          <p className="text-sm">Menlo Park CA 94025</p>
          <p className="text-sm">United States</p>
          <p className="text-sm">+16282679041</p>
          <button className="text-purple-600 text-sm mt-2">View Map</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Billing address</h3>
            <ChevronDown size={20} />
          </div>
          <p className="text-sm">Same as shipping address</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Conversion summary</h3>
            <ChevronDown size={20} />
          </div>
          <p className="text-sm text-gray-600">There aren't any conversion details available for this order.</p>
          <button className="text-purple-600 text-sm mt-2">Learn more</button>
        </div>
      </div>
    </div>
  </div>
);

const ShopZenApp = () => (
  <div className="flex bg-gray-50 min-h-screen">
    <Sidebar />
    <div className="flex-1 overflow-auto">
      <Header />
      <OrderDetails />
    </div>
  </div>
);

export default ShopZenApp;