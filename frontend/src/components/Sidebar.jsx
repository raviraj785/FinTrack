import { useState } from "react";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpToLine,
  PieChart,
  WalletCards,
  Settings,
  X,
  Menu,
  LogOut,
} from "lucide-react";

function Sidebar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);

    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      {/* HAMBURGER BUTTON */}

      {!isOpen && (
        <button
          className="menu-button"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={22} />
        </button>
      )}


      {/* OVERLAY */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}


      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        {/* HEADER */}

        <div className="sidebar-header">

          <div className="logo">

            <div className="logo-box">
              <WalletCards size={23} />
            </div>

            <span>
              FinTrack
            </span>

          </div>


          <button
            className="sidebar-close"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <X size={20} />
          </button>

        </div>


        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <a
            href="#dashboard"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <LayoutDashboard size={20} />

            <span>
              Dashboard
            </span>
          </a>


          <a
            href="#income"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <ArrowDownToLine size={20} />

            <span>
              Income
            </span>
          </a>


          <a
            href="#expenses"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <ArrowUpToLine size={20} />

            <span>
              Expenses
            </span>
          </a>


          <a
            href="#analytics"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <PieChart size={20} />

            <span>
              Analytics
            </span>
          </a>


          <a
            href="#budgets"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <WalletCards size={20} />

            <span>
              Budgets
            </span>
          </a>


          <a
            href="#settings"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <Settings size={20} />

            <span>
              Settings
            </span>
          </a>

        </nav>


        {/* FOOTER */}

        <div className="sidebar-footer">

          <div className="sidebar-footer-text">

            <span className="footer-dot"></span>

            <span>
              Finance Tracker
            </span>

          </div>


          {/* LOGOUT */}

          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;