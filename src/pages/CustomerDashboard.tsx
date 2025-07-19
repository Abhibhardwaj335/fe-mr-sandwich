import React, { useState, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Pagination,
  Stack,
  Chip,
  InputAdornment,
  IconButton,
  Collapse,
} from "@mui/material";
import { Search, FilterList, Clear, ExpandMore, ExpandLess } from "@mui/icons-material";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { LayoutDashboard, UserPlus, User, Users } from "lucide-react";
import { useNotify } from '../components/NotificationContext';
import apiClient from '../apiClient';

const countryCodes = [
  { code: "+91"}
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

const CustomerDashboard: React.FC = () => {
  const notify = useNotify();
  const [activeTab, setActiveTab] = useState(0);

  // Create Customer States
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [localPhone, setLocalPhone] = useState("");
  const [dob, setDob] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // View Single Customer States
  const [customerId, setCustomerId] = useState("");
  const [singleLoading, setSingleLoading] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);

  // View All Customers States
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [allLoading, setAllLoading] = useState(false);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'phone' | 'date' | 'id'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered and sorted customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = allCustomers.filter(customer => {
      const nameMatch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const phoneMatch = customer.phoneNumber?.includes(phoneFilter) || false;
      return nameMatch && phoneMatch;
    });

    // Sort customers
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'phone':
          aValue = a.phoneNumber || '';
          bValue = b.phoneNumber || '';
          break;
        case 'date':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        case 'id':
          aValue = a.customerId || '';
          bValue = b.customerId || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allCustomers, searchTerm, phoneFilter, sortBy, sortOrder]);

  // Paginated customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, phoneFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setPhoneFilter("");
    setCurrentPage(1);
  };

  const handleSort = (field: 'name' | 'phone' | 'date' | 'id') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Create Customer Function
  const saveCustomerData = async () => {
    const fullPhoneNumber = `${countryCode}${localPhone}`;
    if (!name || !localPhone) {
      notify("❌ Please fill all required fields.");
      return;
    }

    setCreateLoading(true);
    try {
      const response = await apiClient.post("/customer", { name, phoneNumber: fullPhoneNumber, dob });
      notify("✅ Customer data saved with customerId=" + response.data.customerId + "!");
      setName("");
      setLocalPhone("");
      setDob("");
    } catch (error) {
      console.error("❌ Error saving customer:", error);
      notify("Failed to save customer.");
    } finally {
      setCreateLoading(false);
    }
  };

  // View Single Customer Function
  const fetchSingleCustomer = async () => {
    if (!customerId) return notify("Enter a valid customer ID.");
    setSingleLoading(true);

    try {
      const res = await apiClient.get(
        `/dashboard/?id=${customerId}`
      );
      setCustomerData(res.data.customer);
      setRewards(res.data.rewards);
      setMessages(res.data.messages || []);
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      notify("Failed to fetch customer dashboard.");
    } finally {
      setSingleLoading(false);
    }
  };

  // View All Customers Function
  const fetchAllCustomers = async () => {
    setAllLoading(true);
    try {
      const res = await apiClient.get(`/customers`);
      setAllCustomers(res.data.customers || []);
      setCurrentPage(1); // Reset to first page after fetching
    } catch (err) {
      console.error("Error fetching customers:", err);
      notify("Failed to fetch customers list.");
    } finally {
      setAllLoading(false);
    }
  };

  const tabItems = [
    { label: 'Create Customer', icon: UserPlus },
    { label: 'View Customer', icon: User },
    { label: 'View All Customers', icon: Users }
  ];

  const getSortIcon = (field: 'name' | 'phone' | 'date' | 'id') => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <CenteredFormLayout title="Customer Management" icon={<LayoutDashboard />}>
      <Box sx={{ width: '100%' }}>
        {/* Custom responsive tab buttons */}
        <Box sx={{
          borderBottom: 1,
          borderColor: 'divider',
          mb: 3
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 },
            p: 1
          }}>
            {tabItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  variant={activeTab === index ? 'contained' : 'outlined'}
                  color="primary"
                  startIcon={<Icon size={18} />}
                  sx={{
                    flex: 1,
                    py: { xs: 1.5, sm: 1 },
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    minHeight: { xs: '48px', sm: '40px' },
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '& .MuiButton-startIcon': {
                      marginRight: { xs: 1, sm: 1.5 }
                    }
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {item.label}
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    {item.label.split(' ')[0]}
                  </Box>
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Create Customer Tab */}
        <TabPanel value={activeTab} index={0}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{
            display: "flex",
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 1 },
            mb: 2
          }}>
            <FormControl sx={{ flex: { xs: 1, sm: 1 } }}>
              <InputLabel id="country-code-label">Code</InputLabel>
              <Select
                labelId="country-code-label"
                value={countryCode}
                label="Code"
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryCodes.map((item) => (
                  <MenuItem key={item.code} value={item.code}>
                    {item.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={localPhone}
              onChange={(e) => setLocalPhone(e.target.value)}
              sx={{ flex: { xs: 1, sm: 2 } }}
            />
          </Box>

          <TextField
            fullWidth
            label="Date of Birth (Optional)"
            type="date"
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mb: 3,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Note: Your birthday will be used only for sending special offers and birthday wishes.
          </Typography>

          <Button
            onClick={saveCustomerData}
            variant="contained"
            color="success"
            fullWidth
            disabled={createLoading}
            sx={{
              py: { xs: 1.5, sm: 1.25 },
              fontSize: { xs: '1rem', sm: '1.125rem' }
            }}
          >
            {createLoading ? <CircularProgress size={24} /> : "Save Customer"}
          </Button>
        </TabPanel>

        {/* View Single Customer Tab */}
        <TabPanel value={activeTab} index={1}>
          <TextField
            label="Customer ID"
            fullWidth
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            onClick={fetchSingleCustomer}
            variant="contained"
            color="primary"
            disabled={singleLoading}
            fullWidth
            sx={{
              py: { xs: 1.5, sm: 1.25 },
              fontSize: { xs: '1rem', sm: '1.125rem' },
              mb: 2
            }}
          >
            {singleLoading ? <CircularProgress size={24} /> : "View Dashboard"}
          </Button>

          {customerData && (
            <Box sx={{ textAlign: "left" }}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Customer Info:</Typography>
                  <Typography sx={{ mb: 1 }}>Name: {customerData.name}</Typography>
                  <Typography sx={{ mb: 1 }}>Phone: {customerData.phoneNumber}</Typography>
                  <Typography>DOB: {customerData.dob}</Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Rewards</Typography>
                  {rewards.length === 0 ? (
                    <Typography>No rewards found.</Typography>
                  ) : (
                    rewards.map((r, i) => (
                      <Box key={i} sx={{
                        p: { xs: 1, sm: 1.5 },
                        borderBottom: "1px solid #ccc",
                        '&:last-child': { borderBottom: 'none' }
                      }}>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          🎁 {r.rewardType} - {r.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Date: {new Date(r.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>WhatsApp Messages</Typography>
                  {messages.length === 0 ? (
                    <Typography>No messages sent.</Typography>
                  ) : (
                    messages.map((msg, i) => (
                      <Box key={i} sx={{
                        p: { xs: 1, sm: 1.5 },
                        borderBottom: "1px dashed #ddd",
                        '&:last-child': { borderBottom: 'none' }
                      }}>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          📩 {msg.content}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Sent: {new Date(msg.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Coupon Usage History</Typography>
                  {coupons.length === 0 ? (
                    <Typography>No coupon usage found.</Typography>
                  ) : (
                    coupons.map((coupon, i) => (
                      <Box key={i} sx={{
                        p: { xs: 1, sm: 1.5 },
                        borderBottom: "1px dashed #ddd",
                        '&:last-child': { borderBottom: 'none' }
                      }}>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          🎁 Coupon Code: {coupon.couponCode}
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          Description: {coupon.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Used on: {new Date(coupon.dateUsed).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </TabPanel>

        {/* View All Customers Tab */}
        <TabPanel value={activeTab} index={2}>
          {allLoading && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
              mb: 2
            }}>
              <CircularProgress size={40} />
              <Typography sx={{ ml: 2 }}>Loading customers...</Typography>
            </Box>
          )}

          {!allLoading && allCustomers.length > 0 && (
            <>
              {/* Search and Filter Controls */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                      Search & Filter
                    </Typography>
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      startIcon={<FilterList />}
                      endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
                      size="small"
                    >
                      Filters
                    </Button>
                  </Box>

                  {/* Main Search */}
                  <TextField
                    fullWidth
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setSearchTerm("")} size="small">
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2 }}
                  />

                  {/* Advanced Filters */}
                  <Collapse in={showFilters}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2,
                      mb: 2
                    }}>
                      <TextField
                        label="Search by phone..."
                        placeholder="Enter phone number..."
                        value={phoneFilter}
                        onChange={(e) => setPhoneFilter(e.target.value)}
                        sx={{ flex: 1 }}
                      />
                      <FormControl sx={{ flex: 1, minWidth: 120 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          label="Sort By"
                        >
                          <MenuItem value="name">Name</MenuItem>
                          <MenuItem value="phone">Phone</MenuItem>
                          <MenuItem value="date">Date Created</MenuItem>
                          <MenuItem value="id">Customer ID</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Button
                        onClick={clearFilters}
                        startIcon={<Clear />}
                        size="small"
                        variant="outlined"
                      >
                        Clear Filters
                      </Button>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Per Page</InputLabel>
                        <Select
                          value={itemsPerPage}
                          onChange={(e) => setItemsPerPage(Number(e.target.value))}
                          label="Per Page"
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                        </Select>
                      </FormControl>
                      {(searchTerm || phoneFilter) && (
                        <Chip
                          label={`${filteredAndSortedCustomers.length} of ${allCustomers.length} customers`}
                          color="primary"
                          size="small"
                        />
                      )}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>

              {/* Results Summary */}
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedCustomers.length)} - {Math.min(currentPage * itemsPerPage, filteredAndSortedCustomers.length)} of {filteredAndSortedCustomers.length} customers
                </Typography>
                {totalPages > 1 && (
                  <Typography variant="body2" color="text.secondary">
                    Page {currentPage} of {totalPages}
                  </Typography>
                )}
              </Box>

              {/* Mobile Card View */}
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {paginatedCustomers.map((customer, index) => (
                  <Card key={customer.customerId || index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {customer.name}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                          <strong>ID:</strong> {customer.customerId}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Phone:</strong> {customer.phoneNumber}
                        </Typography>
                        <Typography variant="body2">
                          <strong>DOB:</strong> {customer.dob || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Created:</strong> {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Desktop Table View */}
              <TableContainer
                component={Paper}
                sx={{
                  display: { xs: 'none', md: 'block' },
                  overflowX: 'auto'
                }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="customers table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        onClick={() => handleSort('id')}
                        sx={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Customer ID {getSortIcon('id')}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort('name')}
                        sx={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Name {getSortIcon('name')}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort('phone')}
                        sx={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Phone Number {getSortIcon('phone')}
                      </TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell
                        onClick={() => handleSort('date')}
                        sx={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        Created Date {getSortIcon('date')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCustomers.map((customer, index) => (
                      <TableRow
                        key={customer.customerId || index}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {customer.customerId}
                        </TableCell>
                        <TableCell>
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: searchTerm && customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ? 'bold' : 'normal'
                            }}
                          >
                            {customer.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: phoneFilter && customer.phoneNumber?.includes(phoneFilter) ? 'bold' : 'normal'
                            }}
                          >
                            {customer.phoneNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{customer.dob || 'N/A'}</TableCell>
                        <TableCell>
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Stack spacing={2}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="primary"
                      size={window.innerWidth > 600 ? "medium" : "small"}
                      showFirstButton
                      showLastButton
                    />
                  </Stack>
                </Box>
              )}
            </>
          )}

          {!allLoading && filteredAndSortedCustomers.length === 0 && allCustomers.length > 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  No customers match your filters
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try adjusting your search criteria or clear the filters to see all customers.
                </Typography>
                <Button onClick={clearFilters} variant="outlined" startIcon={<Clear />}>
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {!allLoading && allCustomers.length === 0 && (
            <Card sx={{ mt: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  No customers found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  There are no customers in your database yet.
                </Typography>
                <Button
                  onClick={fetchAllCustomers}
                  variant="contained"
                  color="primary"
                >
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          )}
        </TabPanel>
      </Box>
    </CenteredFormLayout>
  );
};

export default CustomerDashboard;