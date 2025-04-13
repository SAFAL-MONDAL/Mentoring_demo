const Query = require('../models/Query');

// Submit new query
const submitQuery = async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();
    res.status(201).json({ 
      success: true, 
      message: 'Query submitted successfully',
      data: query 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all queries
const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find()
      .sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      data: queries 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update query status to solved
const updateQueryStatus = async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { status: 'Solved' },
      { new: true }
    );
    
    if (!query) {
      return res.status(404).json({ 
        success: false, 
        message: 'Query not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: query 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete all queries
const clearAllQueries = async (req, res) => {
  try {
    await Query.deleteMany({});
    res.status(200).json({ 
      success: true, 
      message: 'All queries cleared successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  submitQuery,
  getAllQueries,
  updateQueryStatus,
  clearAllQueries
};