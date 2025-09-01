import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSolutionsQuery, useVoteSolutionMutation } from "../Services/authapi";

const ProblemSolutionsPage = () => {
  const { id: problemId } = useParams(); 
  const { data, isLoading, isError, refetch } = useGetSolutionsQuery(problemId);
  const [voteSolution] = useVoteSolutionMutation();
  const [loadingVotes, setLoadingVotes] = useState({}); 

  if (isLoading) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        fontSize: "20px",
        color: "#4a5568",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "15px"
        }}></div>
        <p>Loading solutions...</p>
      </div>
    </div>
  );
  
  if (isError) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        textAlign: "center",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "#fed7d7",
        color: "#c53030",
        maxWidth: "500px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Error</h2>
        <p>Failed to fetch solutions. Please try again later.</p>
      </div>
    </div>
  );

  const handleVote = async (solutionId) => {
    try {
      setLoadingVotes((prev) => ({ ...prev, [solutionId]: true }));
      await voteSolution(solutionId).unwrap();
      await refetch();
    } catch (err) {
      console.error("Error voting solution:", err);
    } finally {
      setLoadingVotes((prev) => ({ ...prev, [solutionId]: false }));
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh"
      }}
    >
      {/* Problem Details */}
      {data.solutions.length > 0 && (
        <div
          style={{
            marginBottom: "40px",
            padding: "25px",
            border: "none",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            boxShadow: "0 10px 25px -5px rgba(102, 126, 234, 0.4)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 15px 30px -5px rgba(102, 126, 234, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(102, 126, 234, 0.4)";
          }}
        >
          {data.solutions[0].problem?.image?.url && (
            <img
              src={data.solutions[0].problem.image.url}
              alt="Problem"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
              }}
            />
          )}
          <h2 style={{ 
            fontSize: "28px", 
            fontWeight: "700", 
            marginBottom: "15px",
            letterSpacing: "0.5px"
          }}>
            {data.solutions[0].problem?.title}
          </h2>
          <p style={{ 
            fontSize: "17px", 
            color: "rgba(255, 255, 255, 0.9)",
            lineHeight: "1.6"
          }}>
            {data.solutions[0].problem?.description}
          </p>
        </div>
      )}

      {/* Solutions Section */}
      <div style={{
        padding: "25px",
        borderRadius: "16px",
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
      }}>
        <h2 style={{ 
          fontSize: "24px", 
          fontWeight: "600", 
          marginBottom: "25px",
          color: "#2d3748",
          display: "flex",
          alignItems: "center"
        }}>
          <span style={{
            marginRight: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Solutions
          </span>
          <span style={{
            padding: "4px 12px",
            backgroundColor: "#e9d8fd",
            color: "#6b46c1",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "500",
            marginLeft: "10px"
          }}>
            {data.solutions.length}
          </span>
        </h2>
        
        {data.solutions.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#718096"
          }}>
            <div style={{
              fontSize: "60px",
              marginBottom: "15px",
              opacity: "0.5"
            }}>💡</div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "500",
              marginBottom: "10px",
              color: "#4a5568"
            }}>No solutions yet</h3>
            <p>Be the first to submit a solution!</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gap: "20px"
          }}>
            {data.solutions.map((solution) => (
              <div
                key={solution._id}
                style={{
                  padding: "20px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "4px",
                  height: "100%",
                  background: "linear-gradient(to bottom, #667eea, #764ba2)",
                  borderRadius: "4px 0 0 4px"
                }}></div>
                
                <p style={{ 
                  fontSize: "16px", 
                  color: "#2d3748",
                  lineHeight: "1.6",
                  marginLeft: "10px",
                  marginBottom: "20px"
                }}>
                  {solution.text}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                    fontSize: "14px",
                    color: "#718096",
                    marginLeft: "10px",
                    flexWrap: "wrap",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#e9d8fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                      fontWeight: "600",
                      color: "#6b46c1"
                    }}>
                      {solution.author?.name ? solution.author.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <span>By: {solution.author?.name || "Anonymous"}</span>
                  </div>
                  <span>{new Date(solution.createdAt).toLocaleString()}</span>
                </div>

                {/* Like Button */}
                <button
                  style={{
                    marginTop: "15px",
                    padding: "8px 16px",
                    background: loadingVotes[solution._id] 
                      ? "#cbd5e0" 
                      : "linear-gradient(135deg, #68d391 0%, #48bb78 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: loadingVotes[solution._id] ? "default" : "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 5px rgba(72, 187, 120, 0.2)",
                    marginLeft: "10px",
                    opacity: loadingVotes[solution._id] ? 0.7 : 1
                  }}
                  onClick={() => handleVote(solution._id)}
                  disabled={loadingVotes[solution._id]}
                  onMouseEnter={(e) => {
                    if (!loadingVotes[solution._id]) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(72, 187, 120, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loadingVotes[solution._id]) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 5px rgba(72, 187, 120, 0.2)";
                    }
                  }}
                >
                  {loadingVotes[solution._id] ? (
                    <>
                      <div style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid transparent",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>👍</span> 
                      Like ({solution.upvotes?.length || 0})
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add CSS animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ProblemSolutionsPage;