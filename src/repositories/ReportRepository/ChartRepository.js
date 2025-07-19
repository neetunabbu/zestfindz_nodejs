// ChartRepository.js

class ChartRepository {
  /**
   * Process chart data and group by time
   * @param {Array<Object>} chart 
   * @param {string} key 
   * @returns {Array<Object>}
   */
  static chart(chart, key) {
    const result = {};

    for (let item of chart) {
      // Ensure item is a plain object
      if (typeof item !== 'object' || item === null) {
        continue;
      }

      const time = item['time'] ?? null;

      if (!time) {
        continue;
      }

      let value = item[key] ?? null;
      value = (key === 'count' && value === 1) ? 1 : value;

      if (!result[time]) {
        result[time] = {
          time: time,
          [key]: value
        };
        continue;
      }

      const previousValue = result[time][key] ?? 0;
      result[time] = {
        time: time,
        [key]: previousValue + value
      };
    }

    // Return only the values of the result object as an array
    return Object.values(result);
  }
}

module.exports = ChartRepository;
