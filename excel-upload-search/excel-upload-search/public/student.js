// Get the search input and results elements
const searchInput = document.getElementById('searchInput');
const searchResultsElement = document.getElementById('searchResults');

// Add an event listener to the search button
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchData();
  }
});

// Function to search data
function searchData() {
  const searchQuery = searchInput.value.trim();

  // Send a GET request to the server to retrieve the data
  fetch('/searchData', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      searchQuery: searchQuery
    }
  })
  .then(response => response.json())
  .then(data => {
    // Display the search results
    const searchResultsHtml = '';
    data.forEach((row) => {
      searchResultsHtml += `<p>${row}</p>`;
    });
    searchResultsElement.innerHTML = searchResultsHtml;
  })
  .catch(error => console.error('Error searching data:', error));
}