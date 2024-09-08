
// eslint-disable-next-line no-undef
module.exports = {
  testTimeout: 10000, // Tiempo máximo por test antes de considerarlo fallido
  clearMocks: true,  // Limpia las instancias de mocks entre cada test
  coverageProvider: "v8", // Utiliza V8 para la cobertura de código, aprovechando la integración con Chrome
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"], // Extensiones de archivo que Jest reconoce
  roots: ["<rootDir>"], // Directorio raíz de los archivos de prueba
  // Añadimos un patrón específico para tests unitarios y de integración
  testMatch: [
    "**/__tests__/unit/**/*.+(ts|tsx|js)", // Ruta para tests unitarios
    "**/__tests__/integration/**/*.+(ts|tsx|js)", // Ruta para tests de integración
    "**/?(*.)+(spec|test).+(ts|tsx|js)", // Patrón estándar para encontrar tests
  ],

  coverageDirectory: "<rootDir>/coverage", // Directorio para los reportes de cobertura
};

