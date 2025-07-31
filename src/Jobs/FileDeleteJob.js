const fs = require('fs');
const path = require('path');

class FileDeleteJob {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async handle() {
    try {
      console.log('Deleting file:', this.filePath);
      
      // Optional: Ensure file exists
      if (fs.existsSync(this.filePath)) {
        fs.unlinkSync(this.filePath);
        console.log('File deleted successfully.');
      } else {
        console.warn('File does not exist:', this.filePath);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }
}

module.exports = FileDeleteJob;
