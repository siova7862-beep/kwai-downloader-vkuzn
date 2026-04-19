
import fs from 'fs';
import path from 'path';

async function publish() {
  const GITHUB_USER = process.env.GITHUB_USER || "siova7862-beep";
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    console.error("❌ Erro: GITHUB_TOKEN não encontrado no ambiente. Adicione-o nas chaves (Secrets).");
    process.exit(1);
  }

  const repoName = `kwai-downloader-${Math.random().toString(36).substring(2, 7)}`;
  console.log(`--- GITHUB REPO PUBLISHER (NODE.JS) ---`);
  console.log(`[1] Criando repositório: ${repoName}`);

  try {
    // 1. Criar o repositório
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'NodeJS-Publisher'
      },
      body: JSON.stringify({ name: repoName, private: false })
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(`Falha ao criar repositório: ${err.message}`);
    }

    console.log(`✅ Repositório '${repoName}' criado!`);

    // 2. Listar arquivos e subir
    const ignoreList = ['node_modules', '.git', 'dist', '.next', 'package-lock.json'];
    
    const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        if (ignoreList.includes(file)) return;
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          getAllFiles(fullPath, arrayOfFiles);
        } else {
          arrayOfFiles.push(fullPath);
        }
      });
      return arrayOfFiles;
    };

    const filesToUpload = getAllFiles(process.cwd());
    console.log(`[2] Subindo ${filesToUpload.length} arquivos...`);

    for (const filePath of filesToUpload) {
      const relativePath = path.relative(process.cwd(), filePath);
      const content = fs.readFileSync(filePath);
      const contentBase64 = content.toString('base64');

      const uploadRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repoName}/contents/${relativePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'NodeJS-Publisher'
        },
        body: JSON.stringify({
          message: `Upload: ${relativePath}`,
          content: contentBase64
        })
      });

      if (uploadRes.ok) {
        console.log(`  ⬆️ Enviado: ${relativePath}`);
      } else {
        const err = await uploadRes.json();
        console.error(`  ❌ Falha ao subir ${relativePath}: ${err.message}`);
      }
    }

    console.log(`\n✨ PROCESSO CONCLUÍDO!`);
    console.log(`🔗 Novo Repositório: https://github.com/${GITHUB_USER}/${repoName}`);

  } catch (error: any) {
    console.error(`❌ Erro Fatal: ${error.message}`);
    process.exit(1);
  }
}

publish();
