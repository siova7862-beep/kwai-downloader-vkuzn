# Instruções de Deployment e GitHub

## 1. Deploy no Render
O erro "Application exited early" no Render acontecia porque o servidor não estava ativado corretamente para o modo de produção.

### Como corrigir:
1. No painel do Render, vá em **Settings**.
2. Certifique-se de que o **Build Command** seja: `npm install; npm run build`.
3. Certifique-se de que o **Start Command** seja: `npm start`.
4. Adicione uma variável de ambiente (Environment Variable):
   - `NODE_ENV`: `production`

O servidor agora detecta automaticamente a porta fornecida pelo Render (`process.env.PORT`) e inicia o serviço corretamente.

## 2. Publicação no GitHub
O arquivo `publish_to_github.py` foi integrado ao projeto. Ele automatiza a criação de um novo repositório e o upload dos arquivos.

### Como usar:
Você pode rodar o script manualmente ou via comando se tiver o Python instalado:
```bash
python3 publish_to_github.py
```

### Notas Importantes:
- O script usa o seu Token do GitHub que você forneceu. **Mantenha-o seguro**.
- Ele cria um nome de repositório aleatório (ex: `kwai-clone-a1b2c`) para evitar conflitos.
- Este processo é para a publicação inicial. Para atualizações futuras, recomenda-se usar os comandos padrão do Git:
  ```bash
  git add .
  git commit -m "Atualização"
  git push origin main
  ```
