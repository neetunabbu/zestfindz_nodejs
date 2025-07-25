// services/termService.js

const { TermCondition } = require('../../models'); // Adjust path as needed
const ResponseError = require('../../helpers/ResponseError'); // Adjust path

// Placeholder for your translation utility, assumed async
const setTranslations = async (term, data) => {
  // Implement real translation save logic here
};

class TermService {
  // Create or get terms and set translations
  async create(data) {
    try {
      // Use findOrCreate: first element is the instance, second is created(boolean)
      const [term, created] = await TermCondition.findOrCreate({ where: {} });
      await setTranslations(term, data);

      return {
        status: true,
        code: ResponseError.NO_ERROR,
        data: term
      };
    } catch (e) {
      console.error(e);
      return {
        status: false,
        code: ResponseError.ERROR_501
      };
    }
  }
}

module.exports = TermService;
