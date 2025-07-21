// Equivalent to: namespace App\Repositories\ProjectRepository;
// Node.js uses directory structure, already in ProjectRepository folder

// Equivalent to: use App\Repositories\CoreRepository;
const CoreRepository = require('../CoreRepository');

// Equivalent to: class ProjectRepository extends CoreRepository
class ProjectRepository extends CoreRepository {

  // Equivalent to Laravel constructor and getModelClass
  constructor() {
    // You must pass the Project model to the parent class
    const { Project } = require('../../models');
    super(Project);
  }

  // You can define more custom methods here if needed
}

// Equivalent to exporting the class
module.exports = ProjectRepository;
