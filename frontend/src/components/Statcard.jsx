import { ArrowDownToLine, ArrowUpFromLine, Wallet } from "lucide-react";

function StatCard({ title, amount, type }) {
  const icons = {
    balance: <Wallet size={24} />,
    income: <ArrowDownToLine size={24} />,
    expense: <ArrowUpFromLine size={24} />,
  };

  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-card-top">
        <span>{title}</span>
        <div className="stat-icon">
          {icons[type]}
        </div>
      </div>

      <h2>{amount}</h2>

      <p>This month</p>
    </div>
  );
}

export default StatCard;