import { useState, useEffect } from 'react';
import { Plus, Receipt, Calendar, DollarSign, Edit, Trash2, TrendingUp } from 'lucide-react';
import CenteredFormLayout from "../components/CenteredFormLayout";
import { Box } from "@mui/material";
import axios from "axios";
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
  // For frontend display purposes
  id?: string;
}

interface FormData {
  category: string;
  description: string;
  amount: string;
  date: string;
  paymentMethod: string;
  vendor: string;
  notes: string;
}

interface ExpenseListResponse {
  expenses: Expense[];
  summary: {
    totalAmount: number;
    expenseCount: number;
    dateRange?: { startDate: string; endDate: string } | null;
    specificDate?: string | null;
    category?: string | null;
  };
}

interface MonthlyStats {
  totalAmount: number;
  expenseCount: number;
  categoryTotals: Record<string, number>;
  dailyTotals: Record<string, number>;
  averageDaily: number;
  highestDay: { date: string; amount: number };
  topCategory: { category: string; amount: number };
}

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    vendor: '',
    notes: ''
  });

  // Common expense categories for restaurants
  const commonCategories = [
    'Vegetables', 'Meat & Seafood', 'Dairy Products', 'Groceries', 'Spices & Condiments',
    'Beverages', 'Kitchen Equipment', 'Cleaning Supplies', 'Rent', 'Electricity',
    'Gas', 'Water', 'Internet', 'Employee Salary', 'Transportation', 'Marketing',
    'Maintenance', 'Insurance', 'License & Permits', 'Other'
  ];

  // Load expenses on component mount and when selected date/month or view mode changes
  useEffect(() => {
    fetchExpenses();
  }, [selectedDate, selectedMonth, viewMode]);

  // Calculate total whenever expenses change
  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpense(total);
  }, [expenses]);

  const handleApiError = (error: any) => {
    console.error('API Error:', error);
    const errorMessage = error.message || 'An unexpected error occurred';
    setError(errorMessage);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
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

      const data: ExpenseListResponse = response.data;

      // Add id field for frontend compatibility
      const expensesWithId = data.expenses.map(expense => ({
        ...expense,
        id: expense.SK.split('#')[2] // Extract expense ID from SK
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

  const getMonthlyStats = (): MonthlyStats | null => {
    if (viewMode === 'daily') return null;

    const monthlyExpenses = expenses.filter(exp => exp.date.startsWith(selectedMonth));
    const totalAmount = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Group by category
    const categoryTotals = monthlyExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    // Group by date for daily breakdown
    const dailyTotals = monthlyExpenses.reduce((acc, exp) => {
      acc[exp.date] = (acc[exp.date] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    // Find highest spending day
    const highestDay = Object.entries(dailyTotals).reduce(
      (max, [date, amount]) => amount > max.amount ? { date, amount } : max,
      { date: '', amount: 0 }
    );

    // Find top spending category
    const topCategory = Object.entries(categoryTotals).reduce(
      (max, [category, amount]) => amount > max.amount ? { category, amount } : max,
      { category: '', amount: 0 }
    );

    return {
      totalAmount,
      expenseCount: monthlyExpenses.length,
      categoryTotals,
      dailyTotals,
      averageDaily: Object.keys(dailyTotals).length > 0 ? totalAmount / Object.keys(dailyTotals).length : 0,
      highestDay,
      topCategory
    };
  };

  const handleSubmit = async () => {
  console.log("formData.amount" + formData.amount);
          console.log("formData.amount" + parseFloat(formData.amount));
    if (!formData.category || !formData.amount || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      setError('Amount must be a valid positive number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingExpense) {
        // Update existing expense

        const updateData = {
          restaurantId: RESTAURANT_ID,
          expenseId: editingExpense.id,
          originalDate: editingExpense.date,
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: formData.date,
          paymentMethod: formData.paymentMethod,
          vendor: formData.vendor,
          notes: formData.notes
        };

        const response = await axios.put(`${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/expense`, updateData);

        const result = response.data;
        console.log('Expense updated:', result);
      } else {
        // Create new expense
        const createData = {
          restaurantId: RESTAURANT_ID,
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: formData.date,
          paymentMethod: formData.paymentMethod,
          vendor: formData.vendor,
          notes: formData.notes
        };

        const response = await axios.post(`${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/expense`,
          createData);

        const result = response.data;
        console.log('Expense created:', result);
      }

      // Reset form and refresh data
      setFormData({
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        vendor: '',
        notes: ''
      });
      setShowForm(false);
      setEditingExpense(null);

      // Refresh expenses list
      fetchExpenses();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      category: expense.category,
      description: expense.description || '',
      amount: expense.amount.toString(),
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      vendor: expense.vendor || '',
      notes: expense.notes || ''
    });
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (expense: Expense) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({
          restaurantId: RESTAURANT_ID,
          expenseId: expense.id || '',
          date: expense.date
        });

        const response = await axios.delete(`${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/expense?${queryParams}`);

        const result = response.data;
        console.log('Expense deleted:', result);

        // Refresh expenses list
        fetchExpenses();
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getExpensesByDate = (date: string) => {
    return expenses.filter(exp => exp.date === date);
  };

  const getTotalByDate = (date: string) => {
    return getExpensesByDate(date).reduce((sum, exp) => sum + exp.amount, 0);
  };

  const todayExpenses = getExpensesByDate(selectedDate);
  const todayTotal = getTotalByDate(selectedDate);
  const monthlyStats = getMonthlyStats();
  const displayExpenses = viewMode === 'daily' ? todayExpenses : expenses;

  return (
  <CenteredFormLayout title="Restaurant Expense Tracker" icon={<Receipt className="w-8 h-8 text-indigo-600"/>}>
        <Box className="max-w-6xl mx-auto">
          {/* Error Message */}
          {error && (
            <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </Box>
          )}

          {/* Header */}
          <Box className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <Box className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowForm(!showForm)}
                disabled={loading}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                <span>Add Expense</span>
              </button>
            </Box>

            {/* Summary Cards */}
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Box className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-4 text-white">
                <Box className="flex items-center justify-between">
                  <Box>
                    <p className="text-green-100">
                      {viewMode === 'daily' ? 'Total Expenses' : 'Monthly Total'}
                    </p>
                    <p className="text-2xl font-bold">
                      ₹{(viewMode === 'daily' ? totalExpense : monthlyStats?.totalAmount || 0).toFixed(2)}
                    </p>
                  </Box>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </Box>
              </Box>

              <Box className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-4 text-white">
                <Box className="flex items-center justify-between">
                  <Box>
                    <p className="text-blue-100">
                      {viewMode === 'daily' ? "Today's Expenses" : 'Average Daily'}
                    </p>
                    <p className="text-2xl font-bold">
                      ₹{(viewMode === 'daily' ? todayTotal : monthlyStats?.averageDaily || 0).toFixed(2)}
                    </p>
                  </Box>
                  {viewMode === 'daily' ? (
                    <Calendar className="w-8 h-8 text-blue-200" />
                  ) : (
                    <TrendingUp className="w-8 h-8 text-blue-200" />
                  )}
                </Box>
              </Box>

              <Box className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-4 text-white">
                <Box className="flex items-center justify-between">
                  <Box>
                    <p className="text-purple-100">Total Entries</p>
                    <p className="text-2xl font-bold">
                      {viewMode === 'daily' ? expenses.length : monthlyStats?.expenseCount || 0}
                    </p>
                  </Box>
                  <Receipt className="w-8 h-8 text-purple-200" />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Monthly Summary - only show in monthly view */}
          {viewMode === 'monthly' && monthlyStats && (
            <Box className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Summary</h3>

              {/* Additional monthly stats */}
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Box className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl p-4 text-white">
                  <Box className="flex items-center justify-between">
                    <Box>
                      <p className="text-orange-100">Highest Spending Day</p>
                      <p className="text-lg font-bold">
                        {monthlyStats.highestDay.date ?
                          new Date(monthlyStats.highestDay.date).toLocaleDateString() : 'N/A'}
                      </p>
                      <p className="text-xl font-bold">₹{monthlyStats.highestDay.amount.toFixed(2)}</p>
                    </Box>
                    <Calendar className="w-8 h-8 text-orange-200" />
                  </Box>
                </Box>

                <Box className="bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl p-4 text-white">
                  <Box className="flex items-center justify-between">
                    <Box>
                      <p className="text-pink-100">Top Category</p>
                      <p className="text-lg font-bold">{monthlyStats.topCategory.category || 'N/A'}</p>
                      <p className="text-xl font-bold">₹{monthlyStats.topCategory.amount.toFixed(2)}</p>
                    </Box>
                    <Receipt className="w-8 h-8 text-pink-200" />
                  </Box>
                </Box>
              </Box>

              {/* Category breakdown */}
              {Object.keys(monthlyStats.categoryTotals).length > 0 && (
                <Box className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Expenses by Category</h4>
                  <Box className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(monthlyStats.categoryTotals)
                      .sort(([,a], [,b]) => b - a)
                      .map(([category, amount]) => (
                      <Box key={category} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 truncate">{category}</p>
                        <p className="text-lg font-bold text-gray-800">₹{amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {((amount / monthlyStats.totalAmount) * 100).toFixed(1)}%
                        </p>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Expense Form */}
          {showForm && (
            <Box className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {commonCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({...prev, amount: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({...prev, paymentMethod: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor/Supplier
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData(prev => ({...prev, vendor: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Vendor name"
                  />
                </Box>

                <Box>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description"
                  />
                </Box>

                <Box className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Additional notes..."
                  />
                </Box>

                <Box className="md:col-span-2 flex space-x-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingExpense ? 'Update Expense' : 'Save Expense')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingExpense(null);
                      setFormData({
                        category: '',
                        description: '',
                        amount: '',
                        date: new Date().toISOString().split('T')[0],
                        paymentMethod: 'cash',
                        vendor: '',
                        notes: ''
                      });
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </Box>
              </Box>
            </Box>
          )}

          {/* View Mode Toggle and Date/Month Filter */}
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
            </Box>

            <Box className="flex items-center space-x-4">
              {viewMode === 'daily' ? (
                <>
                  <label className="text-sm font-medium text-gray-700">View expenses for:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Box className="text-sm text-gray-600">
                    Total for {selectedDate}: <span className="font-bold text-indigo-600">₹{todayTotal.toFixed(2)}</span>
                  </Box>
                </>
              ) : (
                <>
                  <label className="text-sm font-medium text-gray-700">View expenses for month:</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Box className="text-sm text-gray-600">
                    Monthly total: <span className="font-bold text-indigo-600">₹{monthlyStats?.totalAmount.toFixed(2) || '0.00'}</span>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          {/* Expense List */}
          <Box className="bg-white rounded-2xl shadow-xl p-6">
            <Box className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {viewMode === 'daily'
                  ? `Expenses for ${selectedDate}`
                  : `Expenses for ${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                }
              </h2>
              <Box className="text-sm text-gray-600">
                {displayExpenses.length} {displayExpenses.length === 1 ? 'entry' : 'entries'}
              </Box>
            </Box>

            {loading ? (
              <Box className="text-center py-8">
                <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></Box>
                <p className="mt-4 text-gray-600">Loading expenses...</p>
              </Box>
            ) : displayExpenses.length === 0 ? (
              <Box className="text-center py-12">
                <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No expenses recorded for this {viewMode === 'daily' ? 'date' : 'month'}
                </p>
                <p className="text-gray-400">Click "Add Expense" to get started</p>
              </Box>
            ) : (
              <Box className="space-y-4">
                {displayExpenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => (
                  <Box key={expense.id || expense.SK} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <Box className="flex items-center justify-between">
                      <Box className="flex-1">
                        <Box className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                            {expense.category}
                          </span>
                          <span className="text-2xl font-bold text-gray-800">₹{expense.amount.toFixed(2)}</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm capitalize">
                            {expense.paymentMethod}
                          </span>
                        </Box>

                        {expense.description && (
                          <p className="text-gray-700 mb-1">{expense.description}</p>
                        )}

                        <Box className="flex items-center space-x-4 text-sm text-gray-500">
                          {expense.vendor && (
                            <span>Vendor: {expense.vendor}</span>
                          )}
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </Box>

                        {expense.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">{expense.notes}</p>
                        )}
                      </Box>

                    <Box className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(expense)}
                        disabled={loading}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit expense"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete expense"
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
      </Box>
    </CenteredFormLayout>
  );
};

export default ExpenseTracker;