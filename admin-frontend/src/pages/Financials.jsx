import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EarningsChart from '../components/EarningsChart';
import PaymentsTable from '../components/PaymentsTable';

const Finance = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/payments');
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const earnings = new Array(12).fill(0);
  const expenses = new Array(12).fill(0);

  payments.forEach((payment) => {
    const month = new Date(payment.paidAt).getMonth();
    earnings[month] += payment.amount;
    expenses[month] += payment.amount * 0.10;
  });

  return (
    <div className="p-6 ml-64 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Financial Overview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <EarningsChart earnings={earnings} expenses={expenses} />
          <PaymentsTable payments={payments.filter((payment) => payment.paymentStatus !== 'failed')} isRider={false} />
          <PaymentsTable payments={payments.filter((payment) => payment.paymentStatus === 'failed')} isRider={true} />
        </>
      )}
    </div>
  );
};

export default Finance;
