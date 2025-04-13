const BASE_URL = 'http://bd-lb-1306888275.ap-south-1.elb.amazonaws.com'

document.addEventListener('DOMContentLoaded', function() {
  const queriesTbody = document.getElementById('queries-tbody');
  const clearButton = document.getElementById('clear-button');
  const loadingSpinner = document.getElementById('loading-spinner');

  // Show/hide loading spinner
  function toggleLoading(show) {
      loadingSpinner.style.display = show ? 'flex' : 'none';
  }

  // Format date
  function formatDate(dateString) {
      return new Date(dateString).toLocaleString();
  }

  // Create table row for a query
  function createQueryRow(query) {
      const row = document.createElement('tr');
      
      const cells = [
          { text: query.name },
          { text: query.userType },
          { text: query.userType === 'Parent' ? query.parentRegistration : query.registration },
          { text: query.query },
          { text: query.parentType || '' },
          { text: query.parentStudentName || '' },
          { text: query.parentRegistration || '' },
          { 
              text: query.status, 
              className: `query-status ${query.status.toLowerCase()}`
          },
          { 
              element: createDoneButton(query._id, query.status === 'Solved'),
              className: 'action-cell'
          }
      ];

      cells.forEach(cell => {
          const td = document.createElement('td');
          if (cell.element) {
              td.appendChild(cell.element);
          } else {
              td.textContent = cell.text;
          }
          if (cell.className) {
              td.className = cell.className;
          }
          row.appendChild(td);
      });

      // Add hover effect class
      row.className = 'query-row';
      
      // Add timestamp as title attribute
      row.title = `Submitted on: ${formatDate(query.createdAt)}`;

      return row;
  }

  // Create done button
  function createDoneButton(queryId, isSolved) {
      const button = document.createElement('button');
      button.className = `done-button ${isSolved ? 'solved' : ''}`;
      button.textContent = isSolved ? 'Solved' : 'Mark as Solved';
      button.disabled = isSolved;
      
      if (!isSolved) {
          button.addEventListener('click', async (e) => {
              e.preventDefault();
              if (confirm('Mark this query as solved?')) {
                  try {
                      toggleLoading(true);
                      const response = await fetch(`${BASE_URL}/api/queries/${queryId}`, {
                          method: 'PATCH',
                          headers: {
                              'Content-Type': 'application/json'
                          }
                      });

                      const result = await response.json();

                      if (result.success) {
                          // Update the UI without reloading all queries
                          const row = button.closest('tr');
                          const statusCell = row.querySelector('.query-status');
                          statusCell.textContent = 'Solved';
                          statusCell.className = 'query-status solved';
                          button.textContent = 'Solved';
                          button.disabled = true;
                          button.className = 'done-button solved';
                      } else {
                          throw new Error(result.message);
                      }
                  } catch (error) {
                      console.error('Error:', error);
                      alert('Error updating query status: ' + error.message);
                  } finally {
                      toggleLoading(false);
                  }
              }
          });
      }

      return button;
  }

  // Sort queries function
  function sortQueries(queries, sortBy = 'createdAt', ascending = false) {
      return [...queries].sort((a, b) => {
          let compareA = a[sortBy];
          let compareB = b[sortBy];
          
          // Handle dates
          if (sortBy === 'createdAt') {
              compareA = new Date(compareA);
              compareB = new Date(compareB);
          }
          
          if (compareA < compareB) return ascending ? -1 : 1;
          if (compareA > compareB) return ascending ? 1 : -1;
          return 0;
      });
  }

  // Load all queries
  async function loadQueries() {
      try {
          toggleLoading(true);
          const response = await fetch(`${BASE_URL}/api/queries`);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();

          if (result.success) {
              queriesTbody.innerHTML = '';
              // Sort queries by creation date (newest first)
              const sortedQueries = sortQueries(result.data, 'createdAt', false);
              sortedQueries.forEach(query => {
                  const row = createQueryRow(query);
                  queriesTbody.appendChild(row);
              });

              // Update UI if no queries exist
              if (sortedQueries.length === 0) {
                  const noDataRow = document.createElement('tr');
                  const noDataCell = document.createElement('td');
                  noDataCell.colSpan = 9;
                  noDataCell.textContent = 'No queries found';
                  noDataCell.className = 'no-data-message';
                  noDataRow.appendChild(noDataCell);
                  queriesTbody.appendChild(noDataRow);
              }
          } else {
              throw new Error(result.message);
          }
      } catch (error) {
          console.error('Error:', error);
          const errorMessage = error.message || 'Error loading queries. Please try again later.';
          
          // Display error message in table
          queriesTbody.innerHTML = '';
          const errorRow = document.createElement('tr');
          const errorCell = document.createElement('td');
          errorCell.colSpan = 9;
          errorCell.className = 'error-message';
          errorCell.textContent = errorMessage;
          errorRow.appendChild(errorCell);
          queriesTbody.appendChild(errorRow);
      } finally {
          toggleLoading(false);
      }
  }

  // Clear all queries
  clearButton.addEventListener('click', async (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to clear all queries? This action cannot be undone.')) {
          try {
              toggleLoading(true);
              const response = await fetch(`${BASE_URL}/api/queries`, {
                  method: 'DELETE'
              });
              
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }

              const result = await response.json();

              if (result.success) {
                  // Clear the table and show success message
                  queriesTbody.innerHTML = '';
                  const messageRow = document.createElement('tr');
                  const messageCell = document.createElement('td');
                  messageCell.colSpan = 9;
                  messageCell.textContent = 'All queries have been cleared';
                  messageCell.className = 'success-message';
                  messageRow.appendChild(messageCell);
                  queriesTbody.appendChild(messageRow);
                  
                  // Disable clear button temporarily
                  clearButton.disabled = true;
                  setTimeout(() => {
                      clearButton.disabled = false;
                  }, 2000);
              } else {
                  throw new Error(result.message);
              }
          } catch (error) {
              console.error('Error:', error);
              alert('Error clearing queries: ' + error.message);
          } finally {
              toggleLoading(false);
          }
      }
  });

  // Add refresh button functionality
  const refreshButton = document.createElement('button');
  refreshButton.textContent = 'Refresh';
  refreshButton.className = 'refresh-btn';
  refreshButton.addEventListener('click', () => loadQueries());
  document.querySelector('.button-container').insertBefore(refreshButton, clearButton);

  // Error handling for network issues
  window.addEventListener('online', () => {
      loadQueries();
  });

  window.addEventListener('offline', () => {
      const errorRow = document.createElement('tr');
      const errorCell = document.createElement('td');
      errorCell.colSpan = 9;
      errorCell.className = 'error-message';
      errorCell.textContent = 'No internet connection. Please check your connection and try again.';
      errorRow.appendChild(errorCell);
      queriesTbody.innerHTML = '';
      queriesTbody.appendChild(errorRow);
  });

  // Export functionality
  function exportToCSV() {
      const rows = Array.from(queriesTbody.getElementsByTagName('tr'));
      const csvContent = [
          ['Name', 'User Type', 'Registration No.', 'Query', 'Parent Type', 'Student Name', 'Student Registration', 'Status'].join(','),
          ...rows.map(row => {
              return Array.from(row.cells)
                  .slice(0, -1) // Exclude the action column
                  .map(cell => `"${cell.textContent.replace(/"/g, '""')}"`)
                  .join(',');
          })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `queries_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
  }

  // Add export button
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export to CSV';
  exportButton.className = 'export-btn';
  exportButton.addEventListener('click', exportToCSV);
  document.querySelector('.button-container').appendChild(exportButton);

  // Initial load of queries
  loadQueries();

  // Optional: Auto-refresh every 5 minutes
  setInterval(loadQueries, 300000);
});