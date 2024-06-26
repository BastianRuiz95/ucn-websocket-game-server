export const configMocks = {
  getAppPort: {
    varName: 'PORT',
    varType: 'number',
    varValue: 3000,
  },
  getDatabaseUrl: {
    varName: 'DATABASE_URL',
    varType: 'string',
    varValue: 'db://name:pass@host:port/name',
  },
  getJwtSecret: {
    varName: 'JWT_SECRET',
    varType: 'string',
    varValue: 'secret_word_for_jwt_encrypt',
  },
};
