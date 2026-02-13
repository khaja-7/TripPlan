// types.js

// These were TypeScript interfaces.
// JavaScript does not have interfaces, so we export nothing.
// You can keep them as JSDoc comments if you want type hints.

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 */

/**
 * @typedef {Object} Activity
 * @property {string} id
 * @property {string} time
 * @property {string} location
 * @property {number} cost
 * @property {string} notes
 * @property {number} [lat]
 * @property {number} [lng]
 */

/**
 * @typedef {Object} DayPlan
 * @property {number} dayNumber
 * @property {Activity[]} activities
 */

/**
 * @typedef {Object} Trip
 * @property {string} id
 * @property {string} userId
 * @property {string} title
 * @property {string} destination
 * @property {string} startDate
 * @property {string} endDate
 * @property {{ total: number, spent: number }} budget
 * @property {DayPlan[]} itinerary
 * @property {string} [imageUrl]
 */

/**
 * @typedef {Object} Expense
 * @property {string} id
 * @property {string} tripId
 * @property {string} category
 * @property {number} amount
 * @property {string} date
 * @property {string} description
 */

export {};
