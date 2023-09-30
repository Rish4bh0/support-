// TicketSummaryBox.js
import React from 'react';
import './TicketSummaryBox.css'; // Import the CSS file for styling

const TicketSummaryBox = ({ title, count }) => {
  return (
    <div className="summary-box">
      <h3>{title}</h3>
      <p>Total: {count}</p>
    </div>
  );
};

export default TicketSummaryBox;
