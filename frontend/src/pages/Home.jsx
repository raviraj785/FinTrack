import {
  WalletCards,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  ShieldCheck,
  TrendingUp,
  LogIn,
  UserPlus,
} from "lucide-react";

function Home({ onLogin, onSignup }) {
  return (
    <div className="home-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="home-navbar">

        <div className="home-logo">

          <div className="home-logo-box">
            <WalletCards size={22} />
          </div>

          <span>FinTrack</span>

        </div>


        <div className="home-nav-buttons">

          <button
            className="home-login-btn"
            onClick={onLogin}
          >
            <LogIn size={17} />
            Login
          </button>


          <button
            className="home-signup-btn"
            onClick={onSignup}
          >
            Sign Up
          </button>

        </div>

      </header>


      {/* =========================
          HERO
      ========================= */}

      <main className="home-main">

        <section className="home-hero">

          <div className="home-hero-content">

            <div className="home-badge">
              <TrendingUp size={15} />
              Smart Personal Finance
            </div>


            <h1>
              Take control of
              <span> your money.</span>
            </h1>


            <p>
              Track your income, expenses, budgets and
              financial progress — all in one simple
              dashboard.
            </p>


            <div className="home-hero-buttons">

              <button
                className="home-primary-btn"
                onClick={onSignup}
              >
                <UserPlus size={18} />
                Get Started
              </button>


              <button
                className="home-secondary-btn"
                onClick={onLogin}
              >
                <LogIn size={18} />
                Login
              </button>

            </div>

          </div>


          {/* =========================
              DEMO DASHBOARD
          ========================= */}

          <div className="demo-dashboard">

            <div className="demo-topbar">

              <div>

                <strong>
                  FinTrack Dashboard
                </strong>

                <span>
                  Demo Account
                </span>

              </div>

              <div className="demo-online">
                <span></span>
                Demo
              </div>

            </div>


            {/* DEMO STATS */}

            <div className="demo-stats">

              <div className="demo-stat-card">

                <div className="demo-stat-icon balance-icon">
                  <WalletCards size={18} />
                </div>

                <span>
                  Total Balance
                </span>

                <strong>
                  ₹58,700
                </strong>

                <small>
                  This month
                </small>

              </div>


              <div className="demo-stat-card">

                <div className="demo-stat-icon income-icon">
                  <ArrowDownRight size={18} />
                </div>

                <span>
                  Total Income
                </span>

                <strong>
                  ₹70,000
                </strong>

                <small>
                  This month
                </small>

              </div>


              <div className="demo-stat-card">

                <div className="demo-stat-icon expense-icon">
                  <ArrowUpRight size={18} />
                </div>

                <span>
                  Total Expenses
                </span>

                <strong>
                  ₹11,300
                </strong>

                <small>
                  This month
                </small>

              </div>

            </div>


            {/* DEMO CONTENT */}

            <div className="demo-content-grid">

              {/* CHART */}

              <div className="demo-chart-card">

                <div className="demo-card-heading">

                  <div>

                    <strong>
                      Income vs Expenses
                    </strong>

                    <span>
                      Monthly overview
                    </span>

                  </div>

                  <TrendingUp size={18} />

                </div>


                <div className="demo-chart">

                  <div className="chart-y-label label-1">
                    ₹80k
                  </div>

                  <div className="chart-y-label label-2">
                    ₹60k
                  </div>

                  <div className="chart-y-label label-3">
                    ₹40k
                  </div>

                  <div className="chart-y-label label-4">
                    ₹20k
                  </div>


                  <div className="demo-line income-line"></div>

                  <div className="demo-line expense-line"></div>


                  <div className="demo-chart-bottom">

                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>

                  </div>

                </div>

              </div>


              {/* RECENT TRANSACTIONS */}

              <div className="demo-transactions-card">

                <div className="demo-card-heading">

                  <div>

                    <strong>
                      Recent Transactions
                    </strong>

                    <span>
                      Demo records
                    </span>

                  </div>

                </div>


                <div className="demo-transaction">

                  <div className="demo-transaction-left">

                    <div className="demo-transaction-icon income">
                      +
                    </div>

                    <div>

                      <strong>
                        Monthly Salary
                      </strong>

                      <span>
                        Salary
                      </span>

                    </div>

                  </div>


                  <strong className="demo-income">
                    +₹70,000
                  </strong>

                </div>


                <div className="demo-transaction">

                  <div className="demo-transaction-left">

                    <div className="demo-transaction-icon expense">
                      -
                    </div>

                    <div>

                      <strong>
                        House Rent
                      </strong>

                      <span>
                        Rent
                      </span>

                    </div>

                  </div>


                  <strong className="demo-expense">
                    -₹8,000
                  </strong>

                </div>


                <div className="demo-transaction">

                  <div className="demo-transaction-left">

                    <div className="demo-transaction-icon expense">
                      -
                    </div>

                    <div>

                      <strong>
                        Grocery Shopping
                      </strong>

                      <span>
                        Food
                      </span>

                    </div>

                  </div>


                  <strong className="demo-expense">
                    -₹2,500
                  </strong>

                </div>


                <div className="demo-transaction">

                  <div className="demo-transaction-left">

                    <div className="demo-transaction-icon expense">
                      -
                    </div>

                    <div>

                      <strong>
                        Uber Ride
                      </strong>

                      <span>
                        Transport
                      </span>

                    </div>

                  </div>


                  <strong className="demo-expense">
                    -₹800
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            FEATURES
        ========================= */}

        <section className="home-features">

          <div className="home-section-heading">

            <span>
              EVERYTHING YOU NEED
            </span>

            <h2>
              Manage your finances with confidence
            </h2>

            <p>
              FinTrack gives you the tools to understand
              and improve your financial habits.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                <WalletCards size={22} />
              </div>

              <h3>
                Track Transactions
              </h3>

              <p>
                Easily record and manage your income
                and expenses in one place.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <PieChart size={22} />
              </div>

              <h3>
                Understand Spending
              </h3>

              <p>
                Visualize where your money goes with
                simple financial analytics.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <TrendingUp size={22} />
              </div>

              <h3>
                Set Budgets
              </h3>

              <p>
                Create spending limits and keep your
                monthly expenses under control.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                <ShieldCheck size={22} />
              </div>

              <h3>
                Your Personal Dashboard
              </h3>

              <p>
                Login to access your own financial
                dashboard and records.
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            CTA
        ========================= */}

        <section className="home-cta">

          <div>

            <h2>
              Ready to take control?
            </h2>

            <p>
              Create your FinTrack account and start
              managing your finances today.
            </p>

          </div>


          <button
            onClick={onSignup}
            className="home-cta-btn"
          >
            Create Free Account
            <ArrowUpRight size={18} />
          </button>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="home-footer">

        <div className="home-logo">

          <div className="home-logo-box">
            <WalletCards size={18} />
          </div>

          <span>FinTrack</span>

        </div>


        <p>
          © 2026 FinTrack. Personal Finance Tracker.
        </p>

      </footer>

    </div>
  );
}

export default Home;