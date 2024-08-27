document.addEventListener("DOMContentLoaded", function() {
    const queriesTbody = document.getElementById("queries-tbody");
    const clearButton = document.getElementById("clear-button");
  
    // Function to load queries from localStorage and populate the table
    function loadQueries() {
      const queries = JSON.parse(localStorage.getItem("queries")) || [];
  
      queries.forEach(query => {
        const row = document.createElement("tr");
  
        const nameCell = document.createElement("td");
        nameCell.textContent = query.name;
        row.appendChild(nameCell);
  
        const userTypeCell = document.createElement("td");
        userTypeCell.textContent = query.userType;
        row.appendChild(userTypeCell);
  
        const registrationCell = document.createElement("td");
        registrationCell.textContent = query.registration || query.parentRegistration || '';
        row.appendChild(registrationCell);
  
        const queryCell = document.createElement("td");
        queryCell.textContent = query.query;
        row.appendChild(queryCell);
  
        const parentTypeCell = document.createElement("td");
        parentTypeCell.textContent = query.parentType || '';
        row.appendChild(parentTypeCell);
  
        const parentStudentNameCell = document.createElement("td");
        parentStudentNameCell.textContent = query.parentStudentName || '';
        row.appendChild(parentStudentNameCell);
  
        const parentRegistrationCell = document.createElement("td");
        parentRegistrationCell.textContent = query.parentRegistration || '';
        row.appendChild(parentRegistrationCell);
  
        queriesTbody.appendChild(row);
      });
    }
  
    // Function to clear all data
    function clearAllData() {
      localStorage.removeItem("queries");
      while (queriesTbody.firstChild) {
        queriesTbody.removeChild(queriesTbody.firstChild);
      }
    }
  
    // Load queries when the page is loaded
    loadQueries();
  
    // Add event listener to the clear button
    clearButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all data?")) {
        clearAllData();
      }
    });
  });
  