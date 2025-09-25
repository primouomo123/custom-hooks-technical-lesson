**Technical Lesson: Refactoring API Calls with Custom Hooks and npm Package Management**
========================================================================================

## Task 1: Define the Problem

In React applications, fetching data from an API is a common task. However, when multiple components need to fetch different data, they often **duplicate the same logic**, leading to code that is:

-   **Difficult to maintain** ❌ -- Updates need to be made in multiple places.
-   **Repetitive** ❌ -- Similar `useEffect` logic is used across components.
-   **Error-prone** ❌ -- Debugging network requests becomes harder.

## Task 2: Determine the Design

To **fix** this, we will:

1.  **Refactor API calls into a Custom Hook** (`useFetchData.js`) to centralize logic.
2.  **Use npm to manage dependencies** and install third-party packages.
3.  **Introduce Chalk for better logging** -- Adding **color-coded debugging messages** to track API calls in the browser console.

* * * * *

## Task 3: Develop, Test, and Refine the Code

### **Step 1: Fork, Clone, and Run the Application**

Fork this [repo](https://github.com/learn-co-curriculum/custom-hooks-technical-lesson) , then open in VSCode:
```bash
# Create a new Vite project
git clone <link to your forked repo>

# Navigate into the project folder and open in VSCode
cd custom-hooks-technical lesson
code .

# Install necessary dependencies
npm install

# Start the development server
npm run dev
```

### **Step 2: Install Additional Dependencies**

To enhance debugging and logging, install the following:
```bash
npm install chalk
```

#### **Why use Chalk?**

-   ✅ **Enhances debugging** -- Color-coded logs help identify success, errors, and warnings.
-   ✅ **Improves readability** -- Makes console output **clearer** when fetching API data.

### **Step 3: Evaluate Current Code**

**Scenario: Why Use a Custom Hook?**

#### **❌ BEFORE (Without a Custom Hook - Current State)**

Right now, both `Posts.jsx` and `Users.jsx` fetch data separately. Each uses `useEffect` with **duplicated API-fetching logic**.

#### **Code for `Posts.jsx` (before refactoring)**
```jsx
import React, { useState, useEffect } from "react";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Loading posts...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
```
Code for `Users.jsx` (before refactoring)
```jsx
import React, { useState, useEffect } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Loading users...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="container">
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
```

### **Step 4: Add a New File for the Custom Hook**

Create a new file inside `src/hooks/` called **`useFetchData.js`**.

📁 **File: `src/hooks/useFetchData.js`**
```jsx
import { useState, useEffect } from "react";
import chalk from "chalk";

/**
 * Custom Hook for fetching API data.
 * @param {string} url - The API endpoint.
 * @param {Object} options - Optional fetch settings.
 * @returns {Object} { data, loading, error, refetch }
 */
function useFetchData(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch function that can be triggered manually
  const fetchData = async () => {
    setLoading(true);
    console.log(chalk.blue(`Fetching data from: ${url}`));

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      console.log(chalk.green("Data fetched successfully!"), result);
      setData(result);
    } catch (err) {
      console.log(chalk.red("Error fetching data:"), err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

export default useFetchData;
```
✅ **Improvements:**

-   **Encapsulates API logic** -- No need to write `useEffect` in every component.
-   **Reusability** -- Works in any component needing API data.
-   **Refetch function** -- Allows manual data fetching with a button click.
-   **Uses Chalk** -- Adds **color-coded console logs** for easier debugging.


### **Step 5: Refactor `Posts.jsx` to Use Custom Hook**

📁 **File: `src/components/Posts.jsx`**
```jsx
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
```

✅ **Refactored Features:**

-   Uses **`useFetchData`** instead of duplicating logic.
-   Includes a **"Refresh" button** to manually re-fetch posts.
-   Chalk logs API requests and errors.

### **Step 6: Refactor `Users.jsx` to Use Custom Hook**

Now, let's replace the old `useEffect` logic in **`Users.jsx`** with our **Custom Hook (`useFetchData`)**.

📁 **File: `src/components/Users.jsx`**

```jsx
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
      <button onClick={refetch}>Refresh Users</button>
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
```
✅ **Refactored Features in `Users.jsx`:**

-   Uses **`useFetchData`** to remove redundant `useEffect` logic.
-   Includes a **"Refresh Users" button** to manually re-fetch users.
-   Improved readability and maintainability.


### **Step 7: View Installed Dependencies and Vulnerabilities**

To list all installed packages:

```sh
npm list --depth=0
```

**Checking for Security Vulnerabilities**  
To scan the project for security vulnerabilities in dependencies, run:  

```sh
npm audit
```

---

## **Task 5: Document and Maintain**
--------------------------------------------

### **Using Git Best Practices**

To track changes efficiently, follow this Git workflow:

1.  **Create a new feature branch:**
```bash
git checkout -b feature-custom-hook
```
2. **Stage and commit changes:**
```bash
git add .
git commit -m "Added useFetchData custom hook and npm dependency management"
```
3. **Push the branch to GitHub:**
```bash
git push origin feature-custom-hook
```
4. ** Create a pull request (PR) on GitHub and merge into `main`
5. ** After merging, delete the feature branch locally:**
```bash
git branch -d feature-custom-hook
```

**Final Considerations**
------------------------

### ✅ **Why Use Custom Hooks?**

-   **Modular Code:** Extracts logic into reusable functions.
-   **Easier Maintenance:** Updates apply to all components using the hook.
-   **Less Repetition:** No need to write `useEffect` API calls in every component.

### ✅ **Why Use npm for Package Management?**

-   **Dependency Tracking:** Manages third-party libraries efficiently.
-   **Security Updates:** Detects and fixes vulnerabilities.
-   **Version Control:** Ensures compatibility across different project setups.

* * * * *

**Summary**
-----------

By completing this lesson, students have: 
✅ **Created a Custom Hook** (`useFetchData`) for API fetching.\
✅ **Used the Custom Hook** in multiple components (`Posts.jsx`, `Users.jsx`).\
✅ **Removed duplicate `useEffect` logic**, making the code more modular.\
✅ **Installed and used Chalk** to log API requests.\
✅ **Followed npm best practices** for package management.
