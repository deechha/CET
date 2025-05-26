import { useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "Student",
  });
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setForm({
      username: "",
      email: "",
      password: "",
      role: "Student",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          username: form.username,
          password: form.password,
        });

        const token = res.data.token;
        localStorage.setItem("token", token);

        const { role } = jwtDecode(token);

        // Redirect by role
        if (role === "Admin") navigate("/admin-dashboard");
        else if (role === "Coordinator") navigate("/coordinator-dashboard");
        else navigate("/student-dashboard");
      } else {
        await axios.post("http://localhost:5000/api/auth/register", form);
        alert("Registered successfully. You can now log in.");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        {!isLogin && (
          <>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <select
              style={styles.select}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
              <option value="Coordinator">Coordinator</option>
            </select>
          </>
        )}

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit" style={styles.button}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p style={styles.toggleText}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span style={styles.toggleLink} onClick={toggleForm}>
          {isLogin ? " Sign up" : " Login"}
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "10px",
    marginTop: "4rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.7rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "0.7rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.7rem",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  toggleText: {
    marginTop: "1rem",
    textAlign: "center",
  },
  toggleLink: {
    color: "#007BFF",
    cursor: "pointer",
    marginLeft: "0.5rem",
    textDecoration: "underline",
  },
};

export default AuthPage;
// export default jwtDecode;
