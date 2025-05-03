import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PaymentsTable = ({ payments, isRider }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{isRider ? 'Rider ID' : 'Order ID'}</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>{isRider ? 'Rider Payment (10%)' : 'Payment Status'}</TableCell>
          <TableCell>Paid At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{isRider ? payment.riderId : payment.id}</TableCell>
            <TableCell>{payment.amount}</TableCell>
            <TableCell>{isRider ? (payment.amount * 0.10).toFixed(2) : payment.paymentStatus}</TableCell>
            <TableCell>{new Date(payment.paidAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default PaymentsTable;
