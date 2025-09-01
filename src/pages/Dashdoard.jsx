import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../Services/authSlice";
import {
  useUploadProblemMutation,
  useGetProblemsQuery,
  useSubmitSolutionMutation
} from "../Services/authapi";
import { useSelector,useDispatch } from "react-redux";
import { Link } from "react-router-dom";


export default function DashboardLayout() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const dispatch=useDispatch();

  const userId= useSelector((state)=>state.auth.user?.id);

  const [uploadProblem, { isLoading, isError, isSuccess }] =
    useUploadProblemMutation();

   const [submitSolution, { 
  isLoading: isSubmitting, 
  isError: isSubmitError, 
  isSuccess: isSubmitSuccess 
}] = useSubmitSolutionMutation();


  const { data: problemsData, isFetching } = useGetProblemsQuery();
  const problems = problemsData?.problems || [];

 const handleLogout = async () => {
  try {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include", 
    });

    
    dispatch(clearToken());

   
    navigate("/");
  } catch (err) {
    console.error("Logout failed:", err);
    navigate("/"); 
  }
};

  const handleUploadProblem = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      image: formData.get("image"),
      location: formData.get("location"),
    };

    try {
      await uploadProblem(data).unwrap();
      alert("Problem created successfully!");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create problem:", err);
      navigate("/login")
    }
  };

  // Open solution form for a particular problem
  const handleGiveSolution = (problem) => {
    setSelectedProblem(problem);
    setShowSolutionForm(true);
  };

  // Submit solution (you can connect to API later)
 const handleSolutionSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const solutionData = {
    problemId: selectedProblem._id,   
    text: formData.get("solution"), 
  };

  try {
    await submitSolution(solutionData).unwrap(); 
    console.log("Solution submitted:", solutionData);
    alert("Solution submitted successfully!");
    setShowSolutionForm(false);
    setSelectedProblem(null);
  } catch (err) {
    console.error("Failed to submit solution:", err);
   navigate('/login')
  }
};


  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          backgroundColor: "#4CAF50",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <div>
          <button
            onClick={handleUploadProblem}
            style={{
              marginRight: "15px",
              padding: "10px 16px",
              backgroundColor: "#fff",
              color: "#4CAF50",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            + Upload Problem
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 16px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content area */}
      <main style={{ padding: "30px" }}>
        <h3 style={{ marginBottom: "20px", color: "#333" }}>All Problems</h3>
        {isFetching ? (
          <p style={{ textAlign: "center" }}>Loading problems...</p>
        ) : problems.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No problems uploaded yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {problems.map((p) => (
             <Link
  to={`/problems/${p._id}`}
  style={{ textDecoration: "none", color: "inherit" }}
  key={p._id}
>
  <div
    key={p._id}
    style={{
      background: "#fff",
      borderRadius: "10px",
      padding: "15px",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.2s",
      cursor: "pointer",
    }}
  >
    {p.image?.url && (
      <img
        src={p.image.url}
        alt={p.title}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      />
    )}
    <h4 style={{ margin: "5px 0", color: "#222" }}>{p.title}</h4>
    <p style={{ fontSize: "14px", color: "#555" }}>{p.description}</p>
    <p style={{ fontSize: "13px", color: "#777", marginTop: "8px" }}>
      📍 <b>{p.location}</b>
    </p>
    <button
      onClick={(e) => {
        e.preventDefault();  // ⛔ stop Link navigation
        e.stopPropagation(); // ⛔ stop bubbling
        handleGiveSolution(p);
      }}
      style={{
        marginTop: "10px",
        padding: "8px 12px",
        backgroundColor: "#2196F3",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Give Solution
    </button>
  </div>
</Link>

            ))}
          </div>
        )}
      </main>

      {/* Modal Form for Upload Problem */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              width: "400px",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "15px", textAlign: "center" }}>Upload Problem</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Title:</label>
                <input type="text" name="title" required style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Description:</label>
                <textarea name="description" required style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Image:</label>
                <input type="file" name="image" accept="image/*" required />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Location:</label>
                <input type="text" name="location" required style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                <button type="submit" disabled={isLoading} style={{ padding: "10px 15px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
                <button type="button" onClick={handleCloseForm} style={{ padding: "10px 15px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                  Cancel
                </button>
              </div>
            </form>
            {isError && <p style={{ color: "red", marginTop: "10px" }}>Error uploading problem</p>}
            {isSuccess && <p style={{ color: "green", marginTop: "10px" }}>Problem uploaded!</p>}
          </div>
        </div>
      )}

      {/* Modal Form for Solution */}
      {showSolutionForm && selectedProblem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              width: "400px",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "15px", textAlign: "center" }}>
              Solution for: {selectedProblem.title}
            </h3>
            <form onSubmit={handleSolutionSubmit}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Your Solution:</label>
                <textarea
                  name="solution"
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", minHeight: "100px" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#2196F3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                {isSubmitting ? "Submitting..." : "Submit"}   
                </button>
                <button
                  type="button"
                  onClick={() => setShowSolutionForm(false)}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
             {isSubmitError && <p style={{ color: "red", marginTop: "10px" }}>Error uploading problem</p>}
            {isSubmitSuccess && <p style={{ color: "green", marginTop: "10px" }}>Problem uploaded!</p>}
          </div>
        </div>
      )}
    </div>
  );
}
