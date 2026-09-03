import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/Statcard";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


/* =========================
   CHART COLORS
========================= */

const categoryColors = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#ea580c",
  "#65a30d",
];


const API_URL = "http://localhost:5000/api/transactions";
const BUDGET_API_URL = "http://localhost:5000/api/budgets";


/* =========================
   DASHBOARD
========================= */

function Dashboard({ onLogout }) {

  /* =========================
     TRANSACTIONS
  ========================= */

  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("fintrack_token");


  /* =========================
     GET TRANSACTIONS
  ========================= */

  useEffect(() => {

    const fetchTransactions = async () => {

      try {

        const response = await fetch(
          API_URL,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Failed to load transactions"
          );
          return;
        }

        const transactionList =
          Array.isArray(data)
            ? data
            : data.transactions || [];

        const formattedTransactions =
          transactionList.map(
            (transaction) => ({
              id: transaction._id || transaction.id,
              title: transaction.title,
              category: transaction.category,
              amount: Number(transaction.amount),
              type: transaction.type,
              date: transaction.date,
              description:
                transaction.description || "",
            })
          );

        setTransactions(
          formattedTransactions
        );

      } catch (error) {

        console.error(
          "Fetch Transactions Error:",
          error
        );

        alert(
          "Unable to load transactions. Please make sure backend is running."
        );

      }
    };

    if (token) {
      fetchTransactions();
    }

  }, [token]);


  /* =========================
     BUDGETS
  ========================= */

  const [budgets, setBudgets] = useState([]);

  /* =========================
     GET BUDGETS
  ========================= */

  useEffect(() => {

    const fetchBudgets = async () => {

      try {

        const response = await fetch(
          BUDGET_API_URL,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Failed to load budgets"
          );
          return;
        }

        const budgetList =
          Array.isArray(data)
            ? data
            : data.budgets || [];

        const formattedBudgets =
          budgetList.map(
            (budget) => ({
              id: budget._id || budget.id,
              category: budget.category,
              limit: Number(budget.limit),
            })
          );

        setBudgets(
          formattedBudgets
        );

      } catch (error) {

        console.error(
          "Fetch Budgets Error:",
          error
        );

        alert(
          "Unable to load budgets. Please make sure backend is running."
        );

      }
    };

    if (token) {
      fetchBudgets();
    }

  }, [token]);


  const [showBudgetModal, setShowBudgetModal] =
    useState(false);

  const [editingBudget, setEditingBudget] =
    useState(null);

  const [budgetCategory, setBudgetCategory] =
    useState("Monthly Expenses");

  const [budgetLimit, setBudgetLimit] =
    useState("");


  const budgetCategories = [
    "Monthly Expenses",
    "Food",
    "Rent",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Education",
    "Health",
    "Other",
  ];


  const getBudgetSpent = (category) => {

    if (category === "Monthly Expenses") {

      return transactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .reduce(
          (total, transaction) =>
            total + transaction.amount,
          0
        );

    }


    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category === category
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  };


  const openAddBudgetModal = () => {

    setEditingBudget(null);

    setBudgetCategory(
      "Monthly Expenses"
    );

    setBudgetLimit("");

    setShowBudgetModal(true);

  };


  const openEditBudgetModal = (
    budget
  ) => {

    setEditingBudget(budget);

    setBudgetCategory(
      budget.category
    );

    setBudgetLimit(
      budget.limit
    );

    setShowBudgetModal(true);

  };


  const resetBudgetForm = () => {

    setEditingBudget(null);

    setBudgetCategory(
      "Monthly Expenses"
    );

    setBudgetLimit("");

  };


  const handleBudgetSubmit = async (e) => {

    e.preventDefault();


    if (
      !budgetLimit ||
      Number(budgetLimit) <= 0
    ) {

      alert(
        "Budget limit must be greater than 0."
      );

      return;

    }


    const budgetData = {
      category: budgetCategory,
      limit: Number(budgetLimit),
    };


    try {

      /* =========================
         UPDATE BUDGET
      ========================= */

      if (editingBudget) {

        const response = await fetch(
          `${BUDGET_API_URL}/${editingBudget.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
              budgetData
            ),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Failed to update budget"
          );
          return;
        }

        const updated =
          data.budget || data;

        const updatedBudget = {
          id: updated._id || updated.id,
          category: updated.category,
          limit: Number(updated.limit),
        };

        setBudgets(
          (previousBudgets) =>
            previousBudgets.map(
              (budget) =>
                budget.id ===
                editingBudget.id
                  ? updatedBudget
                  : budget
            )
        );

        alert(
          "Budget updated successfully."
        );

      } else {

        /* =========================
           ADD BUDGET
        ========================= */

        const response = await fetch(
          BUDGET_API_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
              budgetData
            ),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Failed to add budget"
          );
          return;
        }

        const added =
          data.budget || data;

        const newBudget = {
          id: added._id || added.id,
          category: added.category,
          limit: Number(added.limit),
        };

        setBudgets(
          (previousBudgets) => [
            ...previousBudgets,
            newBudget,
          ]
        );

        alert(
          "Budget added successfully."
        );

      }

      resetBudgetForm();
      setShowBudgetModal(false);

    } catch (error) {

      console.error(
        "Budget Error:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure backend is running."
      );

    }

  };


  const handleBudgetDelete = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this budget?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      const response = await fetch(
        `${BUDGET_API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete budget"
        );
        return;
      }

      setBudgets(
        (previousBudgets) =>
          previousBudgets.filter(
            (budget) =>
              budget.id !== id
          )
      );

      alert(
        "Budget deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete Budget Error:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure backend is running."
      );

    }

  };


  /* =========================
     MODAL
  ========================= */

  const [showModal, setShowModal] =
    useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState(null);


  /* =========================
     FORM
  ========================= */

  const [type, setType] =
    useState("expense");

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("Food");

  const [date, setDate] =
    useState("");

  const [description, setDescription] =
    useState("");


  /* =========================
     SEARCH
  ========================= */

  const [searchTerm, setSearchTerm] =
    useState("");


  /* =========================
     FILTER
  ========================= */

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");


  /* =========================
     SORT
  ========================= */

  const [sortBy, setSortBy] =
    useState("newest");


  /* =========================
     TOTAL INCOME
  ========================= */

  const totalIncome = useMemo(() => {

    return transactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  }, [transactions]);


  /* =========================
     TOTAL EXPENSE
  ========================= */

  const totalExpenses = useMemo(() => {

    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );

  }, [transactions]);


  /* =========================
     TOTAL BALANCE
  ========================= */

  const totalBalance =
    totalIncome - totalExpenses;


  /* =========================
     AVAILABLE CATEGORIES
  ========================= */

  const categories = useMemo(() => {

    const uniqueCategories =
      [
        ...new Set(
          transactions.map(
            (transaction) =>
              transaction.category
          )
        ),
      ];


    return uniqueCategories.sort();

  }, [transactions]);


  /* =========================
     FILTER + SEARCH + SORT
  ========================= */

  const filteredTransactions =
    useMemo(() => {

      let result =
        [...transactions];


      /* SEARCH */

      if (searchTerm.trim()) {

        const search =
          searchTerm
            .toLowerCase()
            .trim();


        result =
          result.filter(
            (transaction) =>

              transaction.title
                .toLowerCase()
                .includes(search)

              ||

              transaction.category
                .toLowerCase()
                .includes(search)

              ||

              transaction.description
                .toLowerCase()
                .includes(search)
          );

      }


      /* TYPE FILTER */

      if (
        typeFilter !== "all"
      ) {

        result =
          result.filter(
            (transaction) =>
              transaction.type ===
              typeFilter
          );

      }


      /* CATEGORY FILTER */

      if (
        categoryFilter !==
        "all"
      ) {

        result =
          result.filter(
            (transaction) =>
              transaction.category ===
              categoryFilter
          );

      }


      /* SORT */

      if (
        sortBy === "newest"
      ) {

        result.sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );

      }

      else if (
        sortBy === "oldest"
      ) {

        result.sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );

      }

      else if (
        sortBy === "high"
      ) {

        result.sort(
          (a, b) =>
            b.amount -
            a.amount
        );

      }

      else if (
        sortBy === "low"
      ) {

        result.sort(
          (a, b) =>
            a.amount -
            b.amount
        );

      }


      return result;

    }, [
      transactions,
      searchTerm,
      typeFilter,
      categoryFilter,
      sortBy,
    ]);


  /* =========================
     EXPENSE CATEGORY DATA
  ========================= */

  const expenseData =
    useMemo(() => {

      const categoryTotals =
        {};


      transactions
        .filter(
          (transaction) =>
            transaction.type ===
            "expense"
        )
        .forEach(
          (transaction) => {

            if (
              !categoryTotals[
                transaction.category
              ]
            ) {

              categoryTotals[
                transaction.category
              ] = 0;

            }


            categoryTotals[
              transaction.category
            ] +=
              transaction.amount;

          }
        );


      return Object.entries(
        categoryTotals
      ).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

    }, [transactions]);


  /* =========================
     MONTHLY ANALYTICS
  ========================= */

  const monthlyData =
    useMemo(() => {

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];


      const currentYear =
        2026;


      const data =
        months.map(
          (month, index) => {

            let income = 0;

            let expense = 0;


            transactions.forEach(
              (transaction) => {

                const transactionDate =
                  new Date(
                    `${transaction.date}T00:00:00`
                  );


                if (
                  transactionDate.getFullYear() ===
                    currentYear &&

                  transactionDate.getMonth() ===
                    index
                ) {

                  if (
                    transaction.type ===
                    "income"
                  ) {

                    income +=
                      transaction.amount;

                  }


                  if (
                    transaction.type ===
                    "expense"
                  ) {

                    expense +=
                      transaction.amount;

                  }

                }

              }
            );


            return {
              month,
              income,
              expense,
            };

          }
        );


      return data;

    }, [transactions]);


  /* =========================
     OPEN ADD MODAL
  ========================= */

  const openAddModal = (
    transactionType = "expense"
  ) => {

    resetForm();

    setType(
      transactionType
    );


    if (
      transactionType ===
      "income"
    ) {

      setCategory(
        "Salary"
      );

    } else {

      setCategory(
        "Food"
      );

    }


    setEditingTransaction(
      null
    );

    setShowModal(true);

  };


  /* =========================
     OPEN EDIT MODAL
  ========================= */

  const openEditModal = (
    transaction
  ) => {

    setEditingTransaction(
      transaction
    );

    setType(
      transaction.type
    );

    setTitle(
      transaction.title
    );

    setAmount(
      transaction.amount
    );

    setCategory(
      transaction.category
    );

    setDate(
      transaction.date
    );

    setDescription(
      transaction.description ||
      ""
    );

    setShowModal(true);

  };


  /* =========================
     ADD / UPDATE
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !title.trim() ||
      !amount ||
      !date
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }

    if (
      Number(amount) <= 0
    ) {

      alert(
        "Amount must be greater than 0."
      );

      return;
    }

    const transactionData = {
      title: title.trim(),
      category,
      amount: Number(amount),
      type,
      date,
      description: description.trim(),
    };

    try {

      /* =========================
         UPDATE TRANSACTION
      ========================= */

      if (editingTransaction) {

        const response = await fetch(
          `${API_URL}/${editingTransaction.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
              transactionData
            ),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Failed to update transaction"
          );
          return;
        }

        const updated =
          data.transaction || data;

        const updatedTransaction = {
          id: updated._id || updated.id,
          title: updated.title,
          category: updated.category,
          amount: Number(updated.amount),
          type: updated.type,
          date: updated.date,
          description:
            updated.description || "",
        };

        setTransactions(
          (previousTransactions) =>
            previousTransactions.map(
              (transaction) =>
                transaction.id ===
                editingTransaction.id
                  ? updatedTransaction
                  : transaction
            )
        );

        alert(
          "Transaction updated successfully."
        );

      } else {

        /* =========================
           ADD TRANSACTION
        ========================= */

        const response = await fetch(
          API_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
              transactionData
            ),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message ||
              "Failed to add transaction"
          );
          return;
        }

        const added =
          data.transaction || data;

        const newTransaction = {
          id: added._id || added.id,
          title: added.title,
          category: added.category,
          amount: Number(added.amount),
          type: added.type,
          date: added.date,
          description:
            added.description || "",
        };

        setTransactions(
          (previousTransactions) => [
            newTransaction,
            ...previousTransactions,
          ]
        );

        alert(
          "Transaction added successfully."
        );
      }

      resetForm();
      setShowModal(false);
      setEditingTransaction(null);

    } catch (error) {

      console.error(
        "Transaction Error:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure backend is running."
      );
    }
  };


  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {

    setType(
      "expense"
    );

    setTitle("");

    setAmount("");

    setCategory(
      "Food"
    );

    setDate("");

    setDescription("");

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this transaction?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete transaction"
        );
        return;
      }

      setTransactions(
        (previousTransactions) =>
          previousTransactions.filter(
            (transaction) =>
              transaction.id !== id
          )
      );

      alert(
        "Transaction deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete Transaction Error:",
        error
      );

      alert(
        "Unable to connect to server. Please make sure backend is running."
      );
    }
  };


  /* =========================
     CLEAR FILTERS
  ========================= */

  const clearFilters = () => {

    setSearchTerm("");

    setTypeFilter(
      "all"
    );

    setCategoryFilter(
      "all"
    );

    setSortBy(
      "newest"
    );

  };


  /* =========================
     FORMAT CURRENCY
  ========================= */

  const formatCurrency = (
    value
  ) => {

    return `₹${value.toLocaleString(
      "en-IN"
    )}`;

  };


  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (
    dateValue
  ) => {

    if (!dateValue) {

      return "";

    }


    const dateObject =
      new Date(
        `${dateValue}T00:00:00`
      );


    return dateObject.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  /* =========================
     RENDER
  ========================= */

  return (

    <div className="app-layout">

     <Sidebar onLogout={onLogout} />


      <main className="main-content">

        <Navbar
          searchTerm={
            searchTerm
          }
          setSearchTerm={
            setSearchTerm
          }
        />


        <div className="dashboard-content">


          {/* =========================
              DASHBOARD
          ========================= */}

          <section id="dashboard">

            <div className="page-heading">

              <div>

                <h1>
                  Dashboard
                </h1>

                <p>
                  Here's your financial overview
                </p>

              </div>


              <button
                className="add-transaction-btn"
                onClick={() =>
                  openAddModal(
                    "expense"
                  )
                }
              >
                + Add Transaction
              </button>

            </div>


            {/* STATISTICS */}

            <div className="stats-grid">

              <StatCard
                title="Total Balance"
                amount={formatCurrency(
                  totalBalance
                )}
                type="balance"
              />

              <StatCard
                title="Total Income"
                amount={formatCurrency(
                  totalIncome
                )}
                type="income"
              />

              <StatCard
                title="Total Expenses"
                amount={formatCurrency(
                  totalExpenses
                )}
                type="expense"
              />

            </div>

          </section>


          {/* =========================
              ANALYTICS
          ========================= */}

          <section
            id="analytics"
            className="finance-section"
          >

            <div className="section-heading">

              <div>

                <h2>
                  Analytics
                </h2>

                <p>
                  Understand your financial performance
                </p>

              </div>

            </div>


            <div className="charts-grid">


              {/* LINE CHART */}

              <div className="chart-card">

                <div className="chart-header">

                  <div>

                    <h3>
                      Income vs Expenses
                    </h3>

                    <p>
                      Monthly financial performance
                    </p>

                  </div>

                </div>


                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <LineChart
                      data={
                        monthlyData
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="month"
                      />

                      <YAxis />

                      <Tooltip />

                      <Legend />


                      <Line
                        type="monotone"
                        dataKey="income"
                        name="Income"
                        stroke="#16a34a"
                        strokeWidth={3}
                      />


                      <Line
                        type="monotone"
                        dataKey="expense"
                        name="Expense"
                        stroke="#dc2626"
                        strokeWidth={3}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              </div>


              {/* PIE CHART */}

              <div className="chart-card">

                <div className="chart-header">

                  <div>

                    <h3>
                      Expense Categories
                    </h3>

                    <p>
                      Where your money is going
                    </p>

                  </div>

                </div>


                <div className="chart-container pie-container">

                  {expenseData.length >
                  0 ? (

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={
                            expenseData
                          }
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          label
                        >

                          {expenseData.map(
                            (
                              entry,
                              index
                            ) => (

                              <Cell
                                key={`${entry.name}-${index}`}
                                fill={
                                  categoryColors[
                                    index %
                                      categoryColors.length
                                  ]
                                }
                              />

                            )
                          )}

                        </Pie>

                        <Tooltip />

                        <Legend />

                      </PieChart>

                    </ResponsiveContainer>

                  ) : (

                    <div className="empty-chart">

                      <p>
                        No expense data available.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              INCOME
          ========================= */}

          <section
            id="income"
            className="finance-section"
          >

            <div className="section-heading">

              <div>

                <h2>
                  Income
                </h2>

                <p>
                  Manage your income and earnings
                </p>

              </div>


              <button
                className="add-transaction-btn"
                onClick={() =>
                  openAddModal(
                    "income"
                  )
                }
              >
                + Add Income
              </button>

            </div>


            <div className="finance-summary">

              <div>

                <span>
                  Total Income
                </span>

                <strong className="income-amount">
                  {formatCurrency(
                    totalIncome
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Income Transactions
                </span>

                <strong>
                  {
                    transactions.filter(
                      (transaction) =>
                        transaction.type ===
                        "income"
                    ).length
                  }
                </strong>

              </div>

            </div>


            <div className="finance-list">

              {transactions.filter(
                (transaction) =>
                  transaction.type ===
                  "income"
              ).length > 0 ? (

                transactions
                  .filter(
                    (transaction) =>
                      transaction.type ===
                      "income"
                  )
                  .map(
                    (transaction) => (

                      <div
                        className="finance-item"
                        key={
                          transaction.id
                        }
                      >

                        <div className="finance-item-left">

                          <div className="transaction-icon income">
                            +
                          </div>


                          <div>

                            <strong>
                              {
                                transaction.title
                              }
                            </strong>

                            <p>
                              {
                                transaction.category
                              }
                              {" • "}
                              {
                                formatDate(
                                  transaction.date
                                )
                              }
                            </p>

                          </div>

                        </div>


                        <div className="finance-item-right">

                          <strong className="income-amount">
                            +
                            {formatCurrency(
                              transaction.amount
                            )}
                          </strong>


                          <button
                            className="edit-btn"
                            onClick={() =>
                              openEditModal(
                                transaction
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                transaction.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    )
                  )

              ) : (

                <div className="no-transactions">

                  <p>
                    No income transactions yet.
                  </p>

                  <button
                    onClick={() =>
                      openAddModal(
                        "income"
                      )
                    }
                  >
                    Add Income
                  </button>

                </div>

              )}

            </div>

          </section>


          {/* =========================
              EXPENSES
          ========================= */}

          <section
            id="expenses"
            className="finance-section"
          >

            <div className="section-heading">

              <div>

                <h2>
                  Expenses
                </h2>

                <p>
                  Track and manage your spending
                </p>

              </div>


              <button
                className="add-transaction-btn"
                onClick={() =>
                  openAddModal(
                    "expense"
                  )
                }
              >
                + Add Expense
              </button>

            </div>


            <div className="finance-summary">

              <div>

                <span>
                  Total Expenses
                </span>

                <strong className="expense-amount">
                  {formatCurrency(
                    totalExpenses
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Expense Transactions
                </span>

                <strong>
                  {
                    transactions.filter(
                      (transaction) =>
                        transaction.type ===
                        "expense"
                    ).length
                  }
                </strong>

              </div>

            </div>


            <div className="finance-list">

              {transactions.filter(
                (transaction) =>
                  transaction.type ===
                  "expense"
              ).length > 0 ? (

                transactions
                  .filter(
                    (transaction) =>
                      transaction.type ===
                      "expense"
                  )
                  .map(
                    (transaction) => (

                      <div
                        className="finance-item"
                        key={
                          transaction.id
                        }
                      >

                        <div className="finance-item-left">

                          <div className="transaction-icon expense">
                            -
                          </div>


                          <div>

                            <strong>
                              {
                                transaction.title
                              }
                            </strong>

                            <p>
                              {
                                transaction.category
                              }
                              {" • "}
                              {
                                formatDate(
                                  transaction.date
                                )
                              }
                            </p>

                          </div>

                        </div>


                        <div className="finance-item-right">

                          <strong className="expense-amount">
                            -
                            {formatCurrency(
                              transaction.amount
                            )}
                          </strong>


                          <button
                            className="edit-btn"
                            onClick={() =>
                              openEditModal(
                                transaction
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                transaction.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    )
                  )

              ) : (

                <div className="no-transactions">

                  <p>
                    No expense transactions yet.
                  </p>

                  <button
                    onClick={() =>
                      openAddModal(
                        "expense"
                      )
                    }
                  >
                    Add Expense
                  </button>

                </div>

              )}

            </div>

          </section>
                    {/* =========================
              BUDGETS
          ========================= */}

          <section
            id="budgets"
            className="finance-section"
          >

            <div className="section-heading">

              <div>

                <h2>
                  Budgets
                </h2>

                <p>
                  Manage your spending limits
                </p>

              </div>


              <button
                className="add-transaction-btn"
                onClick={openAddBudgetModal}
              >
                + Create Budget
              </button>

            </div>


            <div className="budget-list">

              {budgets.length > 0 ? (

                budgets.map((budget) => {

                  const spent =
                    getBudgetSpent(
                      budget.category
                    );


                  const percentage =
                    budget.limit > 0
                      ? (spent / budget.limit) * 100
                      : 0;


                  const displayPercentage =
                    Math.round(
                      percentage
                    );


                  const remaining =
                    budget.limit - spent;


                  return (

                    <div
                      className="budget-card"
                      key={budget.id}
                    >

                      <div className="budget-top">

                        <div>

                          <strong>
                            {budget.category}
                          </strong>

                          <p>
                            {formatCurrency(
                              spent
                            )}
                            {" "}
                            spent of{" "}
                            {formatCurrency(
                              budget.limit
                            )}
                          </p>

                        </div>


                        <strong>
                          {displayPercentage}%
                        </strong>

                      </div>


                      <div className="budget-progress">

                        <div
                          className="budget-progress-fill"
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        ></div>

                      </div>


                      <div className="budget-bottom">

                        <p className="budget-remaining">

                          {remaining >= 0
                            ? `${formatCurrency(
                                remaining
                              )} remaining`
                            : `${formatCurrency(
                                Math.abs(
                                  remaining
                                )
                              )} over budget`}

                        </p>


                        <div className="budget-actions">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              openEditBudgetModal(
                                budget
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleBudgetDelete(
                                budget.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  );

                })

              ) : (

                <div className="no-transactions">

                  <p>
                    No budgets created yet.
                  </p>


                  <button
                    onClick={
                      openAddBudgetModal
                    }
                  >
                    Create Budget
                  </button>

                </div>

              )}

            </div>

          </section>


          {/* =========================
              RECENT TRANSACTIONS
          ========================= */}

          <section
            className="transactions-card"
            id="transactions"
          >

            <div className="transactions-header">

              <div>

                <h3>
                  Transactions
                </h3>

                <p>
                  Search, filter and manage your transactions
                </p>

              </div>

            </div>


            {/* =========================
                SEARCH / FILTER / SORT
            ========================= */}

            <div className="transaction-controls">


              {/* SEARCH */}

              <div className="transaction-search">

                <span>
                  🔍
                </span>


                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* TYPE */}

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
                }
              >

                <option value="all">
                  All Types
                </option>

                <option value="income">
                  Income
                </option>

                <option value="expense">
                  Expense
                </option>

              </select>


              {/* CATEGORY */}

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value
                  )
                }
              >

                <option value="all">
                  All Categories
                </option>


                {categories.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>


              {/* SORT */}

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
              >

                <option value="newest">
                  Newest First
                </option>

                <option value="oldest">
                  Oldest First
                </option>

                <option value="high">
                  Amount: High → Low
                </option>

                <option value="low">
                  Amount: Low → High
                </option>

              </select>


              {/* CLEAR */}

              <button
                className="clear-filter-btn"
                onClick={
                  clearFilters
                }
              >
                Clear
              </button>

            </div>


            {/* RESULTS */}

            <div className="filter-result-info">

              Showing{" "}

              <strong>
                {
                  filteredTransactions.length
                }
              </strong>

              {" "}of{" "}

              <strong>
                {
                  transactions.length
                }
              </strong>

              {" "}transactions

            </div>


            <div className="transactions-table">


              {/* HEADER */}

              <div className="transaction-row transaction-heading">

                <span>
                  Transaction
                </span>

                <span>
                  Category
                </span>

                <span>
                  Date
                </span>

                <span>
                  Amount
                </span>

                <span>
                  Action
                </span>

              </div>


              {/* DATA */}

              {filteredTransactions.length >
              0 ? (

                filteredTransactions.map(
                  (transaction) => (

                    <div
                      className="transaction-row"
                      key={
                        transaction.id
                      }
                    >


                      {/* TITLE */}

                      <div className="transaction-title">

                        <div
                          className={`transaction-icon ${transaction.type}`}
                        >
                          {transaction.type ===
                          "income"
                            ? "+"
                            : "-"}
                        </div>


                        <div>

                          <strong>
                            {
                              transaction.title
                            }
                          </strong>


                          {transaction.description && (

                            <small className="transaction-description">

                              {
                                transaction.description
                              }

                            </small>

                          )}

                        </div>

                      </div>


                      {/* CATEGORY */}

                      <span className="category">
                        {
                          transaction.category
                        }
                      </span>


                      {/* DATE */}

                      <span className="date">

                        {formatDate(
                          transaction.date
                        )}

                      </span>


                      {/* AMOUNT */}

                      <strong
                        className={`transaction-amount ${transaction.type}`}
                      >

                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}

                        {formatCurrency(
                          transaction.amount
                        )}

                      </strong>


                      {/* ACTION */}

                      <div className="transaction-actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            openEditModal(
                              transaction
                            )
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              transaction.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )
                )

              ) : (

                <div className="no-transactions">

                  <p>
                    No transactions found.
                  </p>


                  <button
                    onClick={
                      clearFilters
                    }
                  >
                    Clear Filters
                  </button>

                </div>

              )}

            </div>

          </section>


          {/* =========================
              SETTINGS
          ========================= */}

          <section
            id="settings"
            className="finance-section"
          >

            <div className="section-heading">

              <div>

                <h2>
                  Settings
                </h2>

                <p>
                  Manage your FinTrack preferences
                </p>

              </div>

            </div>


            <div className="settings-card">

              <div>

                <strong>
                  Personal Account
                </strong>

                <p>
                  Manage your account preferences
                </p>

              </div>


              <button
                className="settings-btn"
              >
                Manage Settings
              </button>

            </div>

          </section>

        </div>

      </main>
            {/* =========================
          BUDGET MODAL
      ========================= */}

      {showBudgetModal && (

        <div
          className="modal-overlay"
          onClick={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              resetBudgetForm();

              setShowBudgetModal(
                false
              );

            }

          }}
        >

          <div className="transaction-modal">

            <div className="modal-header">

              <div>

                <h2>

                  {editingBudget
                    ? "Edit Budget"
                    : "Create Budget"}

                </h2>


                <p>

                  Set a spending limit
                  for your budget

                </p>

              </div>


              <button
                className="close-btn"
                onClick={() => {

                  resetBudgetForm();

                  setShowBudgetModal(
                    false
                  );

                }}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleBudgetSubmit
              }
            >

              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category *
                </label>


                <select
                  value={
                    budgetCategory
                  }
                  onChange={(e) =>
                    setBudgetCategory(
                      e.target.value
                    )
                  }
                >

                  {budgetCategories.map(
                    (item) => (

                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* BUDGET LIMIT */}

              <div className="form-group">

                <label>
                  Budget Limit *
                </label>


                <input
                  type="number"
                  min="1"
                  placeholder="Enter budget limit"
                  value={
                    budgetLimit
                  }
                  onChange={(e) =>
                    setBudgetLimit(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {

                    resetBudgetForm();

                    setShowBudgetModal(
                      false
                    );

                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-btn"
                >

                  {editingBudget
                    ? "Update Budget"
                    : "Create Budget"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =========================
          ADD / EDIT TRANSACTION MODAL
      ========================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              resetForm();

              setShowModal(
                false
              );

              setEditingTransaction(
                null
              );

            }

          }}
        >

          <div className="transaction-modal">


            {/* HEADER */}

            <div className="modal-header">

              <div>

                <h2>

                  {editingTransaction
                    ? "Edit Transaction"
                    : "Add Transaction"}

                </h2>


                <p>

                  {editingTransaction
                    ? "Update your transaction details"
                    : "Record your income or expense"}

                </p>

              </div>


              <button
                className="close-btn"
                onClick={() => {

                  resetForm();

                  setShowModal(
                    false
                  );

                  setEditingTransaction(
                    null
                  );

                }}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                handleSubmit
              }
            >


              {/* TYPE */}

              <div className="transaction-type">

                <button
                  type="button"
                  className={
                    type === "income"
                      ? "selected income-btn"
                      : ""
                  }
                  onClick={() => {

                    setType(
                      "income"
                    );

                    setCategory(
                      "Salary"
                    );

                  }}
                >
                  Income
                </button>


                <button
                  type="button"
                  className={
                    type === "expense"
                      ? "selected expense-btn"
                      : ""
                  }
                  onClick={() => {

                    setType(
                      "expense"
                    );

                    setCategory(
                      "Food"
                    );

                  }}
                >
                  Expense
                </button>

              </div>


              {/* TITLE */}

              <div className="form-group">

                <label>
                  Title *
                </label>


                <input
                  type="text"
                  placeholder="e.g. Monthly Salary"
                  value={
                    title
                  }
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* AMOUNT */}

              <div className="form-group">

                <label>
                  Amount *
                </label>


                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={
                    amount
                  }
                  onChange={(e) =>
                    setAmount(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* CATEGORY + DATE */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Category
                  </label>


                  <select
                    value={
                      category
                    }
                    onChange={(e) =>
                      setCategory(
                        e.target.value
                      )
                    }
                  >

                    {type ===
                    "expense" ? (

                      <>

                        <option>
                          Food
                        </option>

                        <option>
                          Rent
                        </option>

                        <option>
                          Transport
                        </option>

                        <option>
                          Shopping
                        </option>

                        <option>
                          Bills
                        </option>

                        <option>
                          Entertainment
                        </option>

                        <option>
                          Education
                        </option>

                        <option>
                          Health
                        </option>

                        <option>
                          Other
                        </option>

                      </>

                    ) : (

                      <>

                        <option>
                          Salary
                        </option>

                        <option>
                          Freelance
                        </option>

                        <option>
                          Business
                        </option>

                        <option>
                          Investment
                        </option>

                        <option>
                          Gift
                        </option>

                        <option>
                          Other
                        </option>

                      </>

                    )}

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Date *
                  </label>


                  <input
                    type="date"
                    value={
                      date
                    }
                    onChange={(e) =>
                      setDate(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>


                <textarea
                  placeholder="Add a note..."
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows="3"
                />

              </div>


              {/* BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {

                    resetForm();

                    setShowModal(
                      false
                    );

                    setEditingTransaction(
                      null
                    );

                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-btn"
                >

                  {editingTransaction
                    ? "Update Transaction"
                    : "Add Transaction"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


export default Dashboard;
