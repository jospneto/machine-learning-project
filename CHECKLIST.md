# ✅ Checklist de Verificação - Sistema de Risco de Fogo

Use este checklist para garantir que tudo está funcionando corretamente.

## 📦 Instalação

### Node.js
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Yarn instalado (`yarn --version`)
- [ ] Dependências instaladas (`yarn install`)
- [ ] Pacotes principais instalados:
  - [ ] `mapbox-gl` (3.16.0+)
  - [ ] `recharts` (3.5.0+)
  - [ ] `react-is` (19.0.0+)

### Python
- [ ] Python 3.8+ instalado (`python --version`)
- [ ] pip instalado (`pip --version`)
- [ ] Dependências Python instaladas:
  ```bash
  pip install -r src/scripts/requirements.txt
  ```
  - [ ] `pandas`
  - [ ] `numpy`
  - [ ] `scikit-learn`
  - [ ] `matplotlib`
  - [ ] `seaborn`

## ⚙️ Configuração

### Variáveis de Ambiente
- [ ] Arquivo `.env.local` criado na raiz do projeto
- [ ] `NEXT_PUBLIC_MAPBOX_TOKEN` configurado
  - 💡 Obtenha em: https://www.mapbox.com/
  - [ ] Token válido (começa com `pk.`)

## 🧪 Testes Rápidos

### 1. Verificar API
```bash
# Iniciar servidor
yarn dev
```

- [ ] Servidor iniciou em http://localhost:3000
- [ ] Sem erros no terminal

### 2. Testar Endpoints

Abra no navegador ou use curl:

```bash
# Métricas dos modelos
curl http://localhost:3000/api/fire-risk/metrics

# Predições da semana
curl http://localhost:3000/api/fire-risk/predictions/week

# Dados do mapa
curl http://localhost:3000/api/fire-risk/map-data
```

- [ ] `/api/fire-risk/metrics` retorna JSON com métricas
- [ ] `/api/fire-risk/predictions/week` retorna array de predições
- [ ] `/api/fire-risk/map-data` retorna array de pontos

### 3. Testar Dashboard

Acesse: http://localhost:3000/fire-risk

- [ ] Página carrega sem erros
- [ ] **Cards de Métricas** aparecem
  - [ ] 3 cards (Neural Network, KNN, Random Forest)
  - [ ] Valores de RMSE, MAE, R² visíveis
  - [ ] Barras de progresso funcionando

- [ ] **Mapa Mapbox** renderiza
  - [ ] Mapa carrega (não fica em branco)
  - [ ] Marcadores coloridos aparecem
  - [ ] Click nos marcadores abre popup
  - [ ] Legenda de cores visível
  - [ ] Controles de zoom funcionam

- [ ] **Gráfico de Predições** renderiza
  - [ ] Gráfico de área aparece
  - [ ] 3 linhas (Neural Network, KNN, Random Forest)
  - [ ] Tooltip funciona ao passar mouse
  - [ ] Estatísticas na parte inferior

- [ ] **Detalhes do Ponto** (após clicar em marcador)
  - [ ] Card com detalhes aparece
  - [ ] Informações do município
  - [ ] Coordenadas
  - [ ] Predições dos 3 modelos

## 🎨 Interface

### Visual
- [ ] Cores corretas dos níveis de risco:
  - 🟢 Verde para Baixo (0-25%)
  - 🟡 Amarelo para Médio (25-50%)
  - 🔴 Vermelho para Alto (50-75%)
  - 🟤 Vermelho Escuro para Crítico (75-100%)

- [ ] Animações suaves (fade in, slide)
- [ ] Tema dark/light funciona
- [ ] Responsivo em mobile

### Interatividade
- [ ] Click em marcadores funciona
- [ ] Hover no gráfico mostra valores
- [ ] Navegação no mapa funciona
- [ ] Zoom no mapa funciona

## 🐍 Python ML Script

### Opção 1: Com Dados Reais

1. Baixar dados do BDQueimadas:
   - [ ] Acessar: https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/
   - [ ] Filtrar: Estado = Rio Grande do Norte
   - [ ] Exportar como CSV
   - [ ] Salvar como `src/scripts/bdqueimadas.csv`

2. Executar script:
```bash
cd src/scripts
python fire_risk_prediction.py
```

- [ ] Script executa sem erros
- [ ] Arquivos gerados em `output/`:
  - [ ] `model_metrics.json`
  - [ ] `week_predictions.json`
  - [ ] `model_comparison.png`

### Opção 2: Modo Demo (sem dados)

O script tem dados sintéticos embutidos:

```bash
cd src/scripts
python fire_risk_prediction.py
```

- [ ] Script cria dados de demonstração
- [ ] Modelos treinam com sucesso
- [ ] Resultados salvos em `output/`

## 🔍 Troubleshooting

### Problema: Mapa não carrega
**Soluções:**
- [ ] Verificar se `NEXT_PUBLIC_MAPBOX_TOKEN` está correto
- [ ] Verificar console do navegador para erros
- [ ] Limpar cache: `yarn dev --turbo`
- [ ] Verificar se token é público (começa com `pk.`)

### Problema: Gráfico não aparece
**Soluções:**
- [ ] Verificar se `recharts` está instalado
- [ ] Verificar se `react-is` está instalado
- [ ] Verificar console para erros
- [ ] Reiniciar servidor dev

### Problema: API retorna erro 500
**Soluções:**
- [ ] Verificar se arquivos em `output/` existem
- [ ] Verificar logs do servidor
- [ ] Testar endpoints individualmente

### Problema: Python script falha
**Soluções:**
- [ ] Verificar versão do Python (3.8+)
- [ ] Instalar dependências: `pip install -r requirements.txt`
- [ ] Verificar se arquivo CSV existe (para dados reais)
- [ ] Usar modo demo se não tiver dados

## 📊 Performance

### Tempos Esperados
- [ ] Dashboard carrega em < 3 segundos
- [ ] Mapa renderiza em < 2 segundos
- [ ] Gráfico renderiza em < 1 segundo
- [ ] APIs respondem em < 500ms
- [ ] Script Python executa em < 30 segundos (demo)

## 📱 Responsividade

Testar em diferentes tamanhos:

- [ ] Desktop (1920x1080)
  - [ ] Layout de 2 colunas para mapa e gráfico
  - [ ] Cards em grid de 3 colunas

- [ ] Tablet (768x1024)
  - [ ] Layout responsivo
  - [ ] Mapa e gráfico empilhados

- [ ] Mobile (375x667)
  - [ ] Cards em coluna única
  - [ ] Mapa em largura total
  - [ ] Gráfico scrollável

## 🚀 Deploy (Opcional)

Se for fazer deploy em produção:

- [ ] Build sem erros: `yarn build`
- [ ] Variáveis de ambiente configuradas no host
- [ ] Domínio configurado
- [ ] SSL/HTTPS ativo

## 📚 Documentação

Arquivos de documentação criados:

- [ ] `README_FIRE_RISK.md` - Documentação completa
- [ ] `QUICK_START.md` - Guia rápido
- [ ] `PROJETO_COMPLETO.md` - Visão geral do projeto
- [ ] `CHECKLIST.md` - Este arquivo
- [ ] `.env.example` - Exemplo de configuração

## ✅ Status Final

Marque quando tudo estiver funcionando:

- [ ] ✅ Instalação completa
- [ ] ✅ Configuração correta
- [ ] ✅ API funcionando
- [ ] ✅ Dashboard renderizando
- [ ] ✅ Mapa interativo
- [ ] ✅ Gráficos exibindo
- [ ] ✅ Python script executável
- [ ] ✅ Documentação lida

---

## 🎉 Próximos Passos

Quando tudo estiver ✅:

1. **Explorar o Dashboard**
   - Clicar em diferentes pontos do mapa
   - Analisar predições dos modelos
   - Comparar métricas de performance

2. **Treinar com Dados Reais**
   - Baixar dados do BDQueimadas
   - Executar script Python
   - Recarregar dashboard para ver novos resultados

3. **Customizar**
   - Ajustar cores no `config.ts`
   - Modificar centro do mapa
   - Adicionar novos gráficos

4. **Apresentar**
   - Preparar demonstração
   - Explicar metodologia
   - Mostrar resultados

---

**🎯 Objetivo:** Ter 100% dos itens marcados!

**❓ Dúvidas?** Consulte:
- `README_FIRE_RISK.md` para detalhes técnicos
- `QUICK_START.md` para início rápido
- GitHub Issues para problemas

---

*Última atualização: 02/12/2024*

