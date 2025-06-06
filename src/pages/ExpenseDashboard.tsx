import { useState, useEffect } from 'react';
import { Plus, Receipt, Calendar, DollarSign, Edit, Trash2, TrendingUp, ShoppingCart, BarChart3 } from 'lucide-react';
import CenteredFormLayout from "../components/CenteredFormLayout";
import axios from "axios";
import {
  Box
} from "@mui/material";
const RESTAURANT_ID = 'MR_SANDWICH';

interface Expense {
  PK: string;
  SK: string;
  recordType: string;
  restaurantId: string;
  category: string;
  description?: string;
  amount: number;
  date: string;
  paymentMethod: string;
  vendor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  id?: string;
}

interface Sale {
  PK: string;
  SK: string;
  recordType: string;
  restaurantId: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  paymentMethod: string;
  customerName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  id?: string;
}

interface ExpenseFormData {
  category: string;
  description: string;
  amount: string;
  date: string;
  paymentMethod: string;
  vendor: string;
  notes: string;
}

interface SaleFormData {
  itemName: string;
  category: string;
  quantity: string;
  unitPrice: string;
  date: string;
  paymentMethod: string;
  customerName: string;
  notes: string;
}

interface FinancialStats {
  totalExpenses: number;
  totalSales: number;
  netProfit: number;
  expenseCount: number;
  saleCount: number;
  averageDaily: {
    expenses: number;
    sales: number;
    profit: number;
  };
  topExpenseCategory: { category: string; amount: number };
  topSaleCategory: { category: string; amount: number };
}

const FinancialTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'sales'>('overview');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [expenseFormData, setExpenseFormData] = useState<ExpenseFormData>({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    vendor: '',
    notes: ''
  });

  const [saleFormData, setSaleFormData] = useState<SaleFormData>({
    itemName: '',
    category: '',
    quantity: '',
    unitPrice: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    customerName: '',
    notes: ''
  });

  // Categories
  const expenseCategories = [
    'Vegetables', 'Meat & Seafood', 'Dairy Products', 'Groceries', 'Spices & Condiments',
    'Beverages', 'Kitchen Equipment', 'Cleaning Supplies', 'Rent', 'Electricity',
    'Gas', 'Water', 'Internet', 'Employee Salary', 'Transportation', 'Marketing',
    'Maintenance', 'Insurance', 'License & Permits', 'Other'
  ];

  const saleCategories = [
    'Sandwiches', 'Burgers', 'Wraps', 'Salads', 'Beverages', 'Sides',
    'Desserts', 'Combo Meals', 'Breakfast Items', 'Special Items'
  ];

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedMonth, viewMode]);

  const handleApiError = (error: any) => {
    console.error('API Error:', error);
    const errorMessage = error.message || 'An unexpected error occurred';
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchExpenses(), fetchSales()]);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        restaurantId: RESTAURANT_ID,
      });

      if (viewMode === 'daily') {
        queryParams.append('date', selectedDate);
      } else {
        // For monthly view - you can choose one of these approaches based on your API
        //queryParams.append('month', selectedMonth);

        // Alternative: If your API expects date range instead
         const startDate = `${selectedMonth}-01`;
         const endDate = new Date(new Date(selectedMonth).getFullYear(), new Date(selectedMonth).getMonth() + 1, 0)
           .toISOString().split('T')[0];
         queryParams.append('startDate', startDate);
         queryParams.append('endDate', endDate);
      }

      const response = await axios.get(`${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/expense?${queryParams}`);

      const data = response.data;

      const expensesWithId = (data.expenses as Expense[]).map((expense) => ({
        ...expense,
        id: expense.SK.split('#')[2],
      }));

      setExpenses(expensesWithId);
    } catch (error) {
      handleApiError(error);
      // Fallback to empty array on error
      setExpenses([]);
    } finally {
      setLoading(false);
    }
};

  const fetchSales = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        restaurantId: RESTAURANT_ID // Make sure RESTAURANT_ID is defined in your component
      });

      if (viewMode === 'daily') {
        queryParams.append('date', selectedDate);
      } else {
        // For monthly view - you can choose one of these approaches based on your API
        //queryParams.append('month', selectedMonth);

        // Alternative: If your API expects date range instead
         const startDate = `${selectedMonth}-01`;
         const endDate = new Date(new Date(selectedMonth).getFullYear(), new Date(selectedMonth).getMonth() + 1, 0)
           .toISOString().split('T')[0];
         queryParams.append('startDate', startDate);
         queryParams.append('endDate', endDate);
      }

      // Make API call
      const response = await axios.get(`${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/sale?${queryParams.toString()}`);

      const result = await response.data;

      // Extract sales data from the response
      const salesData = result.sales || [];

      const transformedSales = (salesData as Sale[]).map((sale) => ({
        ...sale,
        id: sale.SK.split('#')[2],
      }));

      setSales(transformedSales);

      console.log('Sales fetched successfully:', {
        salesCount: transformedSales.length,
        summary: result.summary
      });

    } catch (error) {
      console.error('Error fetching sales:', error);
      handleApiError(error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };


  const getFinancialStats = (): FinancialStats => {
    const currentExpenses = viewMode === 'daily'
      ? expenses.filter(exp => exp.date === selectedDate)
      : expenses.filter(exp => exp.date.startsWith(selectedMonth));

    const currentSales = viewMode === 'daily'
      ? sales.filter(sale => sale.date === selectedDate)
      : sales.filter(sale => sale.date.startsWith(selectedMonth));

    const totalExpenses = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalSales = currentSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const netProfit = totalSales - totalExpenses;

    // Category totals
    const expenseCategoryTotals = currentExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const saleCategoryTotals = currentSales.reduce((acc, sale) => {
      acc[sale.category] = (acc[sale.category] || 0) + sale.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const topExpenseCategory = Object.entries(expenseCategoryTotals).reduce(
      (max, [category, amount]) => amount > max.amount ? { category, amount } : max,
      { category: '', amount: 0 }
    );

    const topSaleCategory = Object.entries(saleCategoryTotals).reduce(
      (max, [category, amount]) => amount > max.amount ? { category, amount } : max,
      { category: '', amount: 0 }
    );

    // Calculate daily averages for monthly view
    const uniqueDays = viewMode === 'monthly' ?
      new Set([...currentExpenses.map(e => e.date), ...currentSales.map(s => s.date)]).size :
      1;

    return {
      totalExpenses,
      totalSales,
      netProfit,
      expenseCount: currentExpenses.length,
      saleCount: currentSales.length,
      averageDaily: {
        expenses: totalExpenses / uniqueDays,
        sales: totalSales / uniqueDays,
        profit: netProfit / uniqueDays
      },
      topExpenseCategory,
      topSaleCategory
    };
  };

  const handleExpenseSubmit = async () => {
    if (!expenseFormData.category || !expenseFormData.amount || !expenseFormData.date) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(expenseFormData.amount)) || parseFloat(expenseFormData.amount) <= 0) {
      setError('Amount must be a valid positive number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingExpense) {
        const updateData = {
          restaurantId: RESTAURANT_ID,
          expenseId: editingExpense.id,
          originalDate: editingExpense.date,
          category: expenseFormData.category,
          description: expenseFormData.description,
          amount: parseFloat(expenseFormData.amount),
          date: expenseFormData.date,
          paymentMethod: expenseFormData.paymentMethod,
          vendor: expenseFormData.vendor,
          notes: expenseFormData.notes
        };
        const response = await axios.put(`${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/expense`, updateData);
        const result = response.data;
        console.log('Expense updated:', result);
      } else {
        const createData = {
          restaurantId: RESTAURANT_ID,
          category: expenseFormData.category,
          description: expenseFormData.description,
          amount: parseFloat(expenseFormData.amount),
          date: expenseFormData.date,
          paymentMethod: expenseFormData.paymentMethod,
          vendor: expenseFormData.vendor,
          notes: expenseFormData.notes
        };

        const response = await axios.post(`${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/expense`,
          createData);

        const result = response.data;
        console.log('Expense created:', result);
      }

      // Reset form and refresh data
      setExpenseFormData({
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        vendor: '',
        notes: ''
      });
      setShowExpenseForm(false);
      setEditingExpense(null);
      fetchData();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaleSubmit = async () => {
    // Validation
    if (!saleFormData.itemName || !saleFormData.category || !saleFormData.quantity || !saleFormData.unitPrice || !saleFormData.date) {
      setError('Please fill in all required fields');
      return;
    }

    const quantity = parseFloat(saleFormData.quantity);
    const unitPrice = parseFloat(saleFormData.unitPrice);

    if (isNaN(quantity) || quantity <= 0 || isNaN(unitPrice) || unitPrice <= 0) {
      setError('Quantity and unit price must be valid positive numbers');
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(saleFormData.date)) {
      setError('Date must be in YYYY-MM-DD format');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const salePayload = {
        restaurantId: 'MR_SANDWICH', // Replace with your actual restaurant ID or get it from context/props
        itemName: saleFormData.itemName,
        category: saleFormData.category,
        quantity: quantity,
        unitPrice: unitPrice,
        date: saleFormData.date,
        paymentMethod: saleFormData.paymentMethod,
        customerName: saleFormData.customerName || '',
        notes: saleFormData.notes || ''
      };

      // If editing existing sale, use PUT method
      if (editingSale) {
        const updatePayload = {
          ...salePayload,
          saleId: editingSale.id,
          originalDate: editingSale.date
        };

        const response = await axios.put(`${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/sale`, updatePayload);

        const result = response.data;
        console.log('Sale updated successfully:', result);
      } else {
        // Create new sale
        const response = await axios.post(`${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/sale`, salePayload);

        const result = response.data;
        console.log('Sale created successfully:', result);
      }

      // Reset form after successful submission
      setSaleFormData({
        itemName: '',
        category: '',
        quantity: '',
        unitPrice: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        customerName: '',
        notes: ''
      });

      setShowSaleForm(false);
      setEditingSale(null);
      fetchData();
    } catch (error) {
      console.error('Error submitting sale:', error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = getFinancialStats();

  return (
    <CenteredFormLayout title="Restaurant Expense Tracker" icon={<Receipt className="w-8 h-8 text-indigo-600"/>}>
    <Box className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Error Message */}
      {error && (
        <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </Box>
      )}

      {/* Navigation Tabs */}
      <Box className="bg-white rounded-2xl shadow-xl p-2 mb-6">
        <Box className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'expenses', label: 'Expenses', icon: Receipt },
            { id: 'sales', label: 'Sales', icon: ShoppingCart }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors flex-1 justify-center ${
                activeTab === id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </Box>
      </Box>

      {/* View Mode and Date Controls */}
      <Box className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'daily'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly View
            </button>
          </Box>
          <Box className="flex items-center space-x-4">
            {activeTab === 'expenses' && (
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                disabled={loading}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            )}
            {activeTab === 'sales' && (
              <button
                onClick={() => setShowSaleForm(!showSaleForm)}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Sale</span>
              </button>
            )}
          </Box>
        </Box>

        <Box className="flex items-center space-x-4">
          {viewMode === 'daily' ? (
            <>
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </>
          ) : (
            <>
              <label className="text-sm font-medium text-gray-700">Month:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </>
          )}
        </Box>
      </Box>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Box className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <p className="text-green-100">Total Sales</p>
                  <p className="text-3xl font-bold">₹{stats.totalSales.toFixed(2)}</p>
                </Box>
                <ShoppingCart className="w-8 h-8 text-green-200" />
              </Box>
            </Box>

            <Box className="bg-gradient-to-r from-red-400 to-red-600 rounded-xl p-6 text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <p className="text-red-100">Total Expenses</p>
                  <p className="text-3xl font-bold">₹{stats.totalExpenses.toFixed(2)}</p>
                </Box>
                <Receipt className="w-8 h-8 text-red-200" />
              </Box>
            </Box>

            <Box className={`bg-gradient-to-r ${stats.netProfit >= 0 ? 'from-blue-400 to-blue-600' : 'from-orange-400 to-orange-600'} rounded-xl p-6 text-white`}>
              <Box className="flex items-center justify-between">
                <Box>
                  <p className={`${stats.netProfit >= 0 ? 'text-blue-100' : 'text-orange-100'}`}>
                    Net {stats.netProfit >= 0 ? 'Profit' : 'Loss'}
                  </p>
                  <p className="text-3xl font-bold">₹{Math.abs(stats.netProfit).toFixed(2)}</p>
                </Box>
                <TrendingUp className={`w-8 h-8 ${stats.netProfit >= 0 ? 'text-blue-200' : 'text-orange-200'}`} />
              </Box>
            </Box>

            <Box className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-6 text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <p className="text-purple-100">Total Transactions</p>
                  <p className="text-3xl font-bold">{stats.expenseCount + stats.saleCount}</p>
                </Box>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </Box>
            </Box>
          </Box>

          {/* Additional Stats for Monthly View */}
          {viewMode === 'monthly' && (
            <Box className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Insights</h3>
              <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Box className="bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-xl p-4 text-white">
                  <Box className="flex items-center justify-between">
                    <Box>
                      <p className="text-indigo-100">Avg Daily Sales</p>
                      <p className="text-xl font-bold">₹{stats.averageDaily.sales.toFixed(2)}</p>
                    </Box>
                    <Calendar className="w-6 h-6 text-indigo-200" />
                  </Box>
                </Box>

                <Box className="bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl p-4 text-white">
                  <Box className="flex items-center justify-between">
                    <Box>
                      <p className="text-pink-100">Avg Daily Expenses</p>
                      <p className="text-xl font-bold">₹{stats.averageDaily.expenses.toFixed(2)}</p>
                    </Box>
                    <Calendar className="w-6 h-6 text-pink-200" />
                  </Box>
                </Box>

                <Box className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-xl p-4 text-white">
                  <Box className="flex items-center justify-between">
                    <Box>
                      <p className="text-teal-100">Avg Daily Profit</p>
                      <p className="text-xl font-bold">₹{stats.averageDaily.profit.toFixed(2)}</p>
                    </Box>
                    <TrendingUp className="w-6 h-6 text-teal-200" />
                  </Box>
                </Box>
              </Box>

              {/* Top Categories */}
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Box className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Top Expense Category</h4>
                  <p className="text-lg font-bold text-red-600">{stats.topExpenseCategory.category || 'N/A'}</p>
                  <p className="text-xl font-bold">₹{stats.topExpenseCategory.amount.toFixed(2)}</p>
                </Box>
                <Box className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Top Sales Category</h4>
                  <p className="text-lg font-bold text-green-600">{stats.topSaleCategory.category || 'N/A'}</p>
                  <p className="text-xl font-bold">₹{stats.topSaleCategory.amount.toFixed(2)}</p>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <>
          {/* Expense Form */}
          {showExpenseForm && (
            <Box className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={expenseFormData.category}
                    onChange={(e) => setExpenseFormData(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseFormData.amount}
                    onChange={(e) => setExpenseFormData(prev => ({...prev, amount: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={expenseFormData.date}
                    onChange={(e) => setExpenseFormData(prev => ({...prev, date: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={expenseFormData.paymentMethod}
                    onChange={(e) => setExpenseFormData(prev => ({...prev, paymentMethod: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor/Supplier</label>
                  <input
                    type="text"
                    value={expenseFormData.vendor}
                    onChange={(e) => setExpenseFormData(prev => ({...prev, vendor: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Vendor name"
                  />
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={expenseFormData.description}
                    onChange={(e) => setExpenseFormData(prev => ({...prev, description: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description"
                  />
                </Box>

                <Box className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={expenseFormData.notes}
                    onChange={(e) => setExpenseFormData(prev => ({...prev, notes: e.target.value}))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Additional notes..."
                  />
                </Box>

                <Box className="md:col-span-2 flex space-x-4">
                  <button
                    onClick={handleExpenseSubmit}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingExpense ? 'Update Expense' : 'Save Expense')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExpenseForm(false);
                      setEditingExpense(null);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </Box>
              </Box>
            </Box>
          )}

          {/* Expenses List */}
          <Box className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Expenses</h2>
            {expenses.length === 0 ? (
              <Box className="text-center py-12">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No expenses recorded</p>
              </Box>
            ) : (
              <Box className="space-y-4">
                {expenses.map((expense) => (
                  <Box key={expense.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <Box className="flex items-center justify-between">
                      <Box className="flex-1">
                        <Box className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            {expense.category}
                          </span>
                          <span className="text-2xl font-bold text-gray-800">₹{expense.amount.toFixed(2)}</span>
                        </Box>
                        {expense.description && <p className="text-gray-700 mb-1">{expense.description}</p>}
                        <Box className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {expense.date}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {expense.paymentMethod}
                              </span>
                              {expense.vendor && (
                                <span>Vendor: {expense.vendor}</span>
                              )}
                            </Box>
                            {expense.notes && (
                              <p className="text-gray-600 text-sm mt-2 italic">{expense.notes}</p>
                            )}
                          </Box>
                          <Box className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingExpense(expense);
                                setExpenseFormData({
                                  category: expense.category,
                                  description: expense.description || '',
                                  amount: expense.amount.toString(),
                                  date: expense.date,
                                  paymentMethod: expense.paymentMethod,
                                  vendor: expense.vendor || '',
                                  notes: expense.notes || ''
                                });
                                setShowExpenseForm(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this expense?')) {
                                  // Handle delete - replace with actual API call
                                  console.log('Delete expense:', expense.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}

          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <>
              {/* Sale Form */}
              {showSaleForm && (
                <Box className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {editingSale ? 'Edit Sale' : 'Add New Sale'}
                  </h2>

                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Box>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                      <input
                        type="text"
                        value={saleFormData.itemName}
                        onChange={(e) => setSaleFormData(prev => ({...prev, itemName: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Item name"
                        required
                      />
                    </Box>

                    <Box>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value={saleFormData.category}
                        onChange={(e) => setSaleFormData(prev => ({...prev, category: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        {saleCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </Box>

                    <Box>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        value={saleFormData.quantity}
                        onChange={(e) => setSaleFormData(prev => ({...prev, quantity: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="1"
                        required
                      />
                    </Box>

                    <Box>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={saleFormData.unitPrice}
                        onChange={(e) => setSaleFormData(prev => ({...prev, unitPrice: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0.00"
                        required
                      />
                    </Box>

                    <Box>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        value={saleFormData.date}
                        onChange={(e) => setSaleFormData(prev => ({...prev, date: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </Box>

                    <Box>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                      <select
                        value={saleFormData.paymentMethod}
                        onChange={(e) => setSaleFormData(prev => ({...prev, paymentMethod: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </Box>

                    <Box>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                      <input
                        type="text"
                        value={saleFormData.customerName}
                        onChange={(e) => setSaleFormData(prev => ({...prev, customerName: e.target.value}))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Customer name (optional)"
                      />
                    </Box>

                    <Box>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                      <Box className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-semibold">
                        ₹{(parseFloat(saleFormData.quantity || '0') * parseFloat(saleFormData.unitPrice || '0')).toFixed(2)}
                      </Box>
                    </Box>

                    <Box className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={saleFormData.notes}
                        onChange={(e) => setSaleFormData(prev => ({...prev, notes: e.target.value}))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Additional notes..."
                      />
                    </Box>

                    <Box className="md:col-span-2 flex space-x-4">
                      <button
                        onClick={handleSaleSubmit}
                        disabled={loading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : (editingSale ? 'Update Sale' : 'Save Sale')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSaleForm(false);
                          setEditingSale(null);
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Sales List */}
              <Box className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales</h2>
                {sales.length === 0 ? (
                  <Box className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No sales recorded</p>
                  </Box>
                ) : (
                  <Box className="space-y-4">
                    {sales.map((sale) => (
                      <Box key={sale.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <Box className="flex items-center justify-between">
                          <Box className="flex-1">
                            <Box className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{sale.itemName}</h3>
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                {sale.category}
                              </span>
                              <span className="text-2xl font-bold text-gray-800">₹{sale.totalAmount.toFixed(2)}</span>
                            </Box>
                            <Box className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span>Qty: {sale.quantity}</span>
                              <span>Unit Price: ₹{sale.unitPrice.toFixed(2)}</span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {sale.date}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {sale.paymentMethod}
                              </span>
                            </Box>
                            {sale.customerName && (
                              <p className="text-gray-600 text-sm">Customer: {sale.customerName}</p>
                            )}
                            {sale.notes && (
                              <p className="text-gray-600 text-sm mt-2 italic">{sale.notes}</p>
                            )}
                          </Box>
                          <Box className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingSale(sale);
                                setSaleFormData({
                                  itemName: sale.itemName,
                                  category: sale.category,
                                  quantity: sale.quantity.toString(),
                                  unitPrice: sale.unitPrice.toString(),
                                  date: sale.date,
                                  paymentMethod: sale.paymentMethod,
                                  customerName: sale.customerName || '',
                                  notes: sale.notes || ''
                                });
                                setShowSaleForm(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this sale?')) {
                                  // Handle delete - replace with actual API call
                                  console.log('Delete sale:', sale.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}

          {/* Loading Overlay */}
          {loading && (
            <Box className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Box className="bg-white rounded-lg p-6 flex items-center space-x-3">
                <Box className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></Box>
                <span className="text-gray-700">Loading...</span>
              </Box>
            </Box>
          )}
        </Box>
        </CenteredFormLayout>
      );
    };

export default FinancialTracker;