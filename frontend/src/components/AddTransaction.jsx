import { useState } from "react";
import { X } from "lucide-react";

function AddTransaction({ onClose, onAdd }) {
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount || !date) {
      alert("Please fill all required fields");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category,
      date,
      description,
      type,
    };

    onAdd(newTransaction);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="transaction-modal">
        
        <div className="modal-header">
          <div>
            <h2>Add Transaction</h2>
            <p>Record your income or expense</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="transaction-type">
            <button
              type="button"
              className={type === "income" ? "selected income-btn" : ""}
              onClick={() => setType("income")}
            >
              Income
            </button>

            <button
              type="button"
              className={type === "expense" ? "selected expense-btn" : ""}
              onClick={() => setType("expense")}
            >
              Expense
            </button>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              placeholder="e.g. Monthly Salary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Rent</option>
                <option>Transport</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Salary</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date *</label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              placeholder="Add a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn">
              Add Transaction
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddTransaction;