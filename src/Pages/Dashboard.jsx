import React from 'react';

const Dashboard = () => {
  const { user } = JSON.parse(localStorage.getItem("auth"));

  return (
    <div>
      <h2 className="text-xl font-semibold">
        Welcome, {user.role.toUpperCase()}
      </h2>
    </div>
  );
};

export default Dashboard;
