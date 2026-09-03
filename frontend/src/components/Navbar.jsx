import {
  Search,
  Bell,
  UserRound,
} from "lucide-react";

function Navbar({
  searchTerm,
  setSearchTerm,
}) {

  const savedUser = localStorage.getItem(
    "fintrack_user"
  );

  const user = savedUser
    ? JSON.parse(savedUser)
    : null;

  const userName = user?.name || "User";

  return (

    <header className="navbar">

      {/* SEARCH */}

      <div className="search-box">

        <Search
          size={20}
        />

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


      {/* RIGHT */}

      <div className="navbar-right">

        <button className="icon-button">

          <Bell size={21} />

        </button>


        <div className="profile">

          <div className="profile-icon">

            <UserRound
              size={20}
            />

          </div>


          <div className="profile-info">

            <span className="profile-name">
              {userName}
            </span>

            <span className="profile-role">
              Personal Account
            </span>

          </div>

        </div>

      </div>

    </header>

  );
}

export default Navbar;