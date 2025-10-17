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