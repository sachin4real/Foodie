import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EarningsChart from '../components/EarningsChart'; 
import PaymentsTable from '../components/PaymentsTable';
import StatCard from '../components/StatCard';
import { Grid, Box, Typography } from '@mui/material';

const Dashboard = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ riders: 0, restaurants: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, ridersRes, restaurantsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:8080/api/payments'),
          axios.get('http://localhost:8083/riders/all'),
          axios.get('http://localhost:8081/api/restaurants'),
          axios.get('http://localhost:8084/api/auth/customers'),
        ]);
        
        setPayments(paymentsRes.data);
        setStats({
          riders: ridersRes.data.length,
          restaurants: restaurantsRes.data.length,
          users: usersRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare earnings and expenses data for the chart
  const earnings = new Array(12).fill(0);
  const expenses = new Array(12).fill(0);

  payments.forEach((payment) => {
    const month = new Date(payment.paidAt).getMonth();
    earnings[month] += payment.amount;
    expenses[month] += payment.amount * 0.10;
  });

  // Calculate order payments summary
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const successfulPayments = payments.filter(payment => payment.paymentStatus === 'completed').length;
  const riderPayments = payments.filter(payment => payment.paymentStatus === 'completed')
    .reduce((sum, payment) => sum + payment.amount * 0.10, 0); // Rider payment (10%)

  return (
    <div className="p-6 ml-64 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">Foodie.lk Dashboard</Typography>
        <div className="flex items-center">
        <div className="text-2xl font-bold text-orange-500 mb-10 text-center">Foodie.lk</div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Riders" count={stats.riders} color="green" />
            <StatCard title="Total Restaurants" count={stats.restaurants} color="blue" />
            <StatCard title="Total Users" count={stats.users} color="red" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-semibold text-lg mb-4">Monthly Earnings and Rider Expenses</h4>
              <div className="w-full h-64">
                <EarningsChart earnings={earnings} expenses={expenses} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="font-semibold text-lg mb-4">Order Payments Summary</h4>
              <div className="space-y-4">
                <p><strong>Total Payments: </strong> Rs. {totalPayments}</p>
                <p><strong>Successful Payments: </strong> {successfulPayments}</p>
                <p><strong>Total Rider Payments (10%): </strong> Rs. {riderPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
            <h4 className="font-semibold text-lg mb-4">Order Payments</h4>
            <PaymentsTable payments={payments.filter((payment) => payment.paymentStatus !== 'failed')} isRider={false} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
            <h4 className="font-semibold text-lg mb-4">Rider Payments</h4>
            <PaymentsTable payments={payments.filter((payment) => payment.paymentStatus === 'failed')} isRider={true} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
