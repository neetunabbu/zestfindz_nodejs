// src/providers/RepositoryProvider.js

const BrandService = require('../services/BrandService/BrandService');
const Interfaces = require('../services/Interfaces/BrandServiceInterface');

// Simulating an IoC Container
const container = {
  services: {},
  
  bind: function (key, implementation) {
    this.services[key] = implementation;
  },

  get: function (key) {
    const ServiceClass = this.services[key];
    return new ServiceClass();
  },
};

function registerRepositories() {
  container.bind('BrandServiceInterface', BrandService);
}

module.exports = {
  registerRepositories,
  container,
};
