import { useEffect, useState } from "react";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend returned " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCustomers(data.data);
        } else {
          setError("Failed to load customers");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Backend not reachable");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading customers...</h2>;
  }

  if (error) {
    return (
      <h2 style={{ padding: 20, color: "red" }}>
        {error}
      </h2>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, -apple-system" }}>
      <h1>AI Customer Service</h1>
      <p>Connected to backend successfully ✅</p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {customers.map((c) => (
          <li key={c._id} style={{ marginBottom: 10 }}>
            <b>{c.name}</b>
            <br />
            📞 {c.phone}
            <br />
            🏢 {c.businessType}
          </li>
        ))}
      </ul>
    </div>
  );
}

