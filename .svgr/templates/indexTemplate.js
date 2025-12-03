const fs = require('fs');
const path = require('path');

const indexTemplate = (filePaths) => {
  if (filePaths.length === 0) return ''; // Se não houver ícones, não faça nada

  // Obtém o diretório dinâmico a partir do primeiro arquivo em filePaths
  const firstIconPath = filePaths[0].path;
  const iconsDir = path.dirname(firstIconPath); // Diretório dinâmico
  const indexPath = path.join(iconsDir, 'index.ts');

  // Verifica se o arquivo index.ts já existe
  let existingContent = '';
  if (fs.existsSync(indexPath)) {
    // Lê o conteúdo atual do index.ts
    existingContent = fs.readFileSync(indexPath, 'utf-8');
  }

  // Mapeia os caminhos para gerar as novas exportações
  const newExportEntries = filePaths.map(({ path: filePath }) => {
    // Extrai o nome do ícone a partir do caminho do arquivo
    const iconName = path
      .basename(filePath) // Obtém o nome do arquivo com a extensão
      .replace('.tsx', ''); // Remove a extensão .tsx

    return `export { default as ${iconName} } from './${iconName}';`;
  });

  // Função auxiliar para combinar exportações sem duplicação e remover linhas em branco
  const combineExports = (existingContent, newExportEntries) => {
    // Remove linhas vazias e espaços desnecessários
    const existingLines = existingContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newLines = newExportEntries.filter((entry) => !existingLines.includes(entry));

    // Combina as exportações existentes com as novas, sem duplicatas e sem linhas em branco
    return [...existingLines, ...newLines].join('\n');
  };

  // Combina o conteúdo existente com as novas exportações sem duplicações
  return combineExports(existingContent, newExportEntries);
};

module.exports = indexTemplate;
