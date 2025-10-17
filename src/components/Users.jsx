import React from "react";
import useFetchData from "../hooks/useFetchData";

function Users() {
  const { data, loading, error, refetch } = useFetchData(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (loading) return <p className="loading">Loading users...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <h2>Users</h2>
      <button onClick={refetch}>Refresh Posts</button>
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
