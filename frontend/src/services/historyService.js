const STORAGE_KEY = 'ai_business_decision_history';

/**
 * Service to manage decision history in browser localStorage
 * Modularly architected to swap with SQLite/PostgreSQL REST endpoints in future
 */
export const historyService = {
  /**
   * Retrieves all saved decision analyses, newest first
   * @returns {Array} List of saved analyses
   */
  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error reading decision history from localStorage:', err);
      return [];
    }
  },

  /**
   * Retrieves a single analysis by ID
   * @param {string} id Unique decision id
   * @returns {Object|null}
   */
  getById(id) {
    const list = this.getAll();
    return list.find((item) => item.id === id) || null;
  },

  /**
   * Saves a new decision analysis
   * @param {Object} input The original user decision parameters
   * @param {Object} result The AI strategic response
   * @returns {Object} The saved item
   */
  save(input, result) {
    try {
      const list = this.getAll();
      const newItem = {
        id: 'dec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        timestamp: new Date().toISOString(),
        input: {
          decision: input.decision,
          industry: input.industry,
          company_size: input.company_size,
          budget: input.budget,
          timeline: input.timeline,
          risk_tolerance: input.risk_tolerance,
          additional_context: input.additional_context || '',
        },
        result: {
          recommendation: result.recommendation,
          reasoning: result.reasoning,
          pros: result.pros || [],
          cons: result.cons || [],
          alternatives: result.alternatives || [],
          confidence_score: result.confidence_score,
          risk_level: result.risk_level,
        },
      };

      // Keep up to 50 most recent items
      const updatedList = [newItem, ...list].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return newItem;
    } catch (err) {
      console.error('Error saving decision to localStorage:', err);
      return null;
    }
  },

  /**
   * Deletes a specific item by ID
   * @param {string} id 
   * @returns {boolean}
   */
  delete(id) {
    try {
      const list = this.getAll();
      const filtered = list.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      console.error('Error deleting decision from localStorage:', err);
      return false;
    }
  },

  /**
   * Clears entire decision history
   */
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (err) {
      console.error('Error clearing decision history:', err);
      return false;
    }
  },
};
