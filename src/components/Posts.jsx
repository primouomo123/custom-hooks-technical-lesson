import React from "react";
import useFetchData from "../hooks/useFetchData";

function Posts() {
  const { data, loading, error, refetch } = useFetchData(
    "https://jsonplaceholder.typicode.com/posts"
  );

  if (loading) return <p className="loading">Loading posts...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <h2>Posts</h2>
      <button onClick={refetch}>Refresh Posts</button>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
