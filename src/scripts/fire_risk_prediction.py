"""
Script de Predição de Risco de Fogo - Mossoró e Região
Utiliza dados do BDQueimadas (INPE) para treinar e avaliar modelos de ML

Modelos implementados:
1. Rede Neural (MLP)
2. K-Nearest Neighbors (KNN)
3. Random Forest (para comparação)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import json

# Scikit-learn
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.neighbors import KNeighborsRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.neural_network import MLPRegressor

# Visualização
import warnings
warnings.filterwarnings('ignore')

class FireRiskPredictor:
    """
    Classe principal para predição de risco de fogo
    """

    def __init__(self, data_path=None):
        """
        Inicializa o preditor

        Args:
            data_path: caminho para o arquivo CSV com dados do BDQueimadas
        """
        self.data_path = data_path
        self.df = None
        self.df_mossoro = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.scaler = StandardScaler()
        self.label_encoders = {}

        # Modelos
        self.models = {}
        self.predictions = {}
        self.metrics = {}

    def load_and_prepare_data(self):
        """
        Carrega e prepara os dados do BDQueimadas
        """
        print("📊 Carregando dados do BDQueimadas...")

        if self.data_path:
            self.df = pd.read_csv(self.data_path)
        else:
            # Usar dados do notebook original
            print("⚠️  Usando dados de exemplo. Configure data_path para usar dados reais.")
            # Aqui você pode carregar os dados do BDQueimadas
            return

        # Converter DataHora para datetime
        self.df['DataHora'] = pd.to_datetime(self.df['DataHora'])

        # Extrair features temporais
        self.df['Ano'] = self.df['DataHora'].dt.year
        self.df['Mes'] = self.df['DataHora'].dt.month
        self.df['Dia'] = self.df['DataHora'].dt.day
        self.df['DiaSemana'] = self.df['DataHora'].dt.dayofweek
        self.df['Hora'] = self.df['DataHora'].dt.hour

        # Filtrar dados de Mossoró e região (Rio Grande do Norte)
        print("🎯 Filtrando dados de Mossoró e região (RN)...")
        self.df_mossoro = self.df[
            (self.df['Estado'] == 'RIO GRANDE DO NORTE') |
            (self.df['Municipio'].str.contains('MOSSORÓ', case=False, na=False))
        ].copy()

        print(f"✅ Dados carregados: {len(self.df_mossoro)} registros de Mossoró/RN")

        # Tratamento de outliers (capping)
        self._normalize_outliers()

        return self.df_mossoro

    def _normalize_outliers(self):
        """
        Normaliza outliers usando técnica de capping (IQR)
        """
        print("🔧 Normalizando outliers...")

        numeric_cols = ['DiaSemChuva', 'Precipitacao', 'RiscoFogo', 'FRP']

        for col in numeric_cols:
            if col in self.df_mossoro.columns:
                q1 = self.df_mossoro[col].quantile(0.25)
                q3 = self.df_mossoro[col].quantile(0.75)
                iqr = q3 - q1

                lower_limit = q1 - 1.5 * iqr
                upper_limit = q3 + 1.5 * iqr

                self.df_mossoro.loc[self.df_mossoro[col] < lower_limit, col] = lower_limit
                self.df_mossoro.loc[self.df_mossoro[col] > upper_limit, col] = upper_limit

        print("✅ Outliers normalizados")

    def prepare_features(self):
        """
        Prepara features para treinamento dos modelos
        """
        print("🔨 Preparando features...")

        # Features numéricas
        numeric_features = [
            'DiaSemChuva', 'Precipitacao', 'FRP',
            'Latitude', 'Longitude',
            'Mes', 'Dia', 'DiaSemana', 'Hora'
        ]

        # Features categóricas para encoding
        categorical_features = ['Bioma', 'Municipio']

        # Criar DataFrame de features
        X = self.df_mossoro[numeric_features].copy()

        # Encoding de features categóricas
        for col in categorical_features:
            if col in self.df_mossoro.columns:
                le = LabelEncoder()
                X[f'{col}_encoded'] = le.fit_transform(self.df_mossoro[col].astype(str))
                self.label_encoders[col] = le

        # Target: RiscoFogo
        y = self.df_mossoro['RiscoFogo'].copy()

        # Split train/test
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Normalização
        self.X_train_scaled = self.scaler.fit_transform(self.X_train)
        self.X_test_scaled = self.scaler.transform(self.X_test)

        print(f"✅ Features preparadas:")
        print(f"   - Training set: {len(self.X_train)} amostras")
        print(f"   - Test set: {len(self.X_test)} amostras")
        print(f"   - Features: {X.columns.tolist()}")

        return self.X_train_scaled, self.X_test_scaled, self.y_train, self.y_test

    def train_neural_network(self):
        """
        Treina Rede Neural (MLP) para predição de risco
        """
        print("\n🧠 Treinando Rede Neural (MLP)...")

        mlp = MLPRegressor(
            hidden_layer_sizes=(100, 50, 25),
            activation='relu',
            solver='adam',
            alpha=0.001,
            batch_size='auto',
            learning_rate='adaptive',
            learning_rate_init=0.001,
            max_iter=1000,
            random_state=42,
            early_stopping=True,
            validation_fraction=0.1,
            n_iter_no_change=20,
            verbose=False
        )

        mlp.fit(self.X_train_scaled, self.y_train)

        # Predições
        y_pred_train = mlp.predict(self.X_train_scaled)
        y_pred_test = mlp.predict(self.X_test_scaled)

        # Métricas
        metrics = self._calculate_metrics(
            self.y_train, y_pred_train,
            self.y_test, y_pred_test,
            'Neural Network'
        )

        self.models['neural_network'] = mlp
        self.predictions['neural_network'] = y_pred_test
        self.metrics['neural_network'] = metrics

        print(f"✅ Rede Neural treinada!")
        self._print_metrics(metrics)

        return mlp

    def train_knn(self):
        """
        Treina K-Nearest Neighbors para predição de risco
        """
        print("\n🎯 Treinando K-Nearest Neighbors (KNN)...")

        # Grid Search para encontrar melhor K
        param_grid = {
            'n_neighbors': [3, 5, 7, 9, 11],
            'weights': ['uniform', 'distance'],
            'metric': ['euclidean', 'manhattan']
        }

        knn = KNeighborsRegressor()
        grid_search = GridSearchCV(
            knn, param_grid, cv=5,
            scoring='neg_mean_squared_error',
            n_jobs=-1
        )

        grid_search.fit(self.X_train_scaled, self.y_train)
        best_knn = grid_search.best_estimator_

        print(f"   Melhores parâmetros: {grid_search.best_params_}")

        # Predições
        y_pred_train = best_knn.predict(self.X_train_scaled)
        y_pred_test = best_knn.predict(self.X_test_scaled)

        # Métricas
        metrics = self._calculate_metrics(
            self.y_train, y_pred_train,
            self.y_test, y_pred_test,
            'KNN'
        )

        self.models['knn'] = best_knn
        self.predictions['knn'] = y_pred_test
        self.metrics['knn'] = metrics

        print(f"✅ KNN treinado!")
        self._print_metrics(metrics)

        return best_knn

    def train_random_forest(self):
        """
        Treina Random Forest para comparação
        """
        print("\n🌲 Treinando Random Forest...")

        rf = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )

        rf.fit(self.X_train_scaled, self.y_train)

        # Predições
        y_pred_train = rf.predict(self.X_train_scaled)
        y_pred_test = rf.predict(self.X_test_scaled)

        # Métricas
        metrics = self._calculate_metrics(
            self.y_train, y_pred_train,
            self.y_test, y_pred_test,
            'Random Forest'
        )

        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.X_train.columns,
            'importance': rf.feature_importances_
        }).sort_values('importance', ascending=False)

        metrics['feature_importance'] = feature_importance.to_dict('records')

        self.models['random_forest'] = rf
        self.predictions['random_forest'] = y_pred_test
        self.metrics['random_forest'] = metrics

        print(f"✅ Random Forest treinado!")
        self._print_metrics(metrics)

        return rf

    def _calculate_metrics(self, y_train, y_pred_train, y_test, y_pred_test, model_name):
        """
        Calcula métricas de avaliação dos modelos
        """
        return {
            'model_name': model_name,
            'train': {
                'mse': float(mean_squared_error(y_train, y_pred_train)),
                'rmse': float(np.sqrt(mean_squared_error(y_train, y_pred_train))),
                'mae': float(mean_absolute_error(y_train, y_pred_train)),
                'r2': float(r2_score(y_train, y_pred_train))
            },
            'test': {
                'mse': float(mean_squared_error(y_test, y_pred_test)),
                'rmse': float(np.sqrt(mean_squared_error(y_test, y_pred_test))),
                'mae': float(mean_absolute_error(y_test, y_pred_test)),
                'r2': float(r2_score(y_test, y_pred_test))
            }
        }

    def _print_metrics(self, metrics):
        """
        Imprime métricas de forma formatada
        """
        print(f"\n   📈 Métricas - {metrics['model_name']}:")
        print(f"      Test RMSE: {metrics['test']['rmse']:.4f}")
        print(f"      Test MAE:  {metrics['test']['mae']:.4f}")
        print(f"      Test R²:   {metrics['test']['r2']:.4f}")

    def compare_models(self):
        """
        Compara os modelos treinados
        """
        print("\n📊 Comparação de Modelos:")
        print("=" * 80)

        comparison = []
        for model_name, metrics in self.metrics.items():
            comparison.append({
                'Modelo': metrics['model_name'],
                'RMSE (Test)': f"{metrics['test']['rmse']:.4f}",
                'MAE (Test)': f"{metrics['test']['mae']:.4f}",
                'R² (Test)': f"{metrics['test']['r2']:.4f}"
            })

        df_comparison = pd.DataFrame(comparison)
        print(df_comparison.to_string(index=False))
        print("=" * 80)

        return df_comparison

    def predict_next_week(self, location_data=None):
        """
        Prediz risco de fogo para a próxima semana

        Args:
            location_data: dados da localização (lat, lon, etc)

        Returns:
            DataFrame com predições diárias
        """
        print("\n🔮 Gerando predições para próxima semana...")

        # Criar dados para próxima semana
        today = datetime.now()
        week_dates = [today + timedelta(days=i) for i in range(7)]

        predictions_data = []

        for date in week_dates:
            # Features baseadas na data
            features = {
                'Mes': date.month,
                'Dia': date.day,
                'DiaSemana': date.weekday(),
                'Hora': 14,  # Hora do pico (14h)
                'DiaSemChuva': 0,  # Valor padrão
                'Precipitacao': 0.0,  # Valor padrão
                'FRP': 0.0,  # Será estimado
                'Latitude': -5.1894,  # Mossoró
                'Longitude': -37.3444,  # Mossoró
            }

            # Se tiver dados de localização, usar
            if location_data:
                features.update(location_data)

            # Adicionar encoding categórico (usando valores médios)
            features['Bioma_encoded'] = 0
            features['Municipio_encoded'] = 0

            # Criar array de features na ordem correta
            feature_array = np.array([[
                features['DiaSemChuva'],
                features['Precipitacao'],
                features['FRP'],
                features['Latitude'],
                features['Longitude'],
                features['Mes'],
                features['Dia'],
                features['DiaSemana'],
                features['Hora'],
                features['Bioma_encoded'],
                features['Municipio_encoded']
            ]])

            # Normalizar
            feature_scaled = self.scaler.transform(feature_array)

            # Predições de cada modelo
            predictions = {}
            for model_name, model in self.models.items():
                pred = model.predict(feature_scaled)[0]
                predictions[model_name] = max(0, pred)  # Garantir que não seja negativo

            predictions_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'day_name': date.strftime('%A'),
                'predictions': predictions
            })

        print("✅ Predições geradas!")
        return predictions_data

    def save_results(self, output_dir='./output'):
        """
        Salva resultados em JSON para uso na API
        """
        import os
        os.makedirs(output_dir, exist_ok=True)

        print(f"\n💾 Salvando resultados em {output_dir}...")

        # Salvar métricas
        with open(f'{output_dir}/model_metrics.json', 'w') as f:
            json.dump(self.metrics, f, indent=2)

        # Salvar predições da próxima semana
        week_predictions = self.predict_next_week()
        with open(f'{output_dir}/week_predictions.json', 'w') as f:
            json.dump(week_predictions, f, indent=2)

        print("✅ Resultados salvos!")
        print(f"   - model_metrics.json")
        print(f"   - week_predictions.json")

    def plot_comparison(self):
        """
        Plota gráficos de comparação dos modelos
        """
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))

        # 1. Comparação de RMSE
        ax1 = axes[0, 0]
        models = list(self.metrics.keys())
        rmse_values = [self.metrics[m]['test']['rmse'] for m in models]
        ax1.bar(models, rmse_values, color=['#3b82f6', '#10b981', '#f59e0b'])
        ax1.set_title('RMSE por Modelo (Test Set)', fontsize=14, fontweight='bold')
        ax1.set_ylabel('RMSE')
        ax1.tick_params(axis='x', rotation=45)

        # 2. Comparação de R²
        ax2 = axes[0, 1]
        r2_values = [self.metrics[m]['test']['r2'] for m in models]
        ax2.bar(models, r2_values, color=['#3b82f6', '#10b981', '#f59e0b'])
        ax2.set_title('R² Score por Modelo (Test Set)', fontsize=14, fontweight='bold')
        ax2.set_ylabel('R² Score')
        ax2.tick_params(axis='x', rotation=45)
        ax2.axhline(y=0, color='gray', linestyle='--', alpha=0.5)

        # 3. Predições vs Real (primeiro modelo)
        ax3 = axes[1, 0]
        first_model = models[0]
        ax3.scatter(self.y_test, self.predictions[first_model], alpha=0.5)
        ax3.plot([self.y_test.min(), self.y_test.max()],
                 [self.y_test.min(), self.y_test.max()],
                 'r--', lw=2)
        ax3.set_title(f'Predições vs Real - {self.metrics[first_model]["model_name"]}',
                     fontsize=14, fontweight='bold')
        ax3.set_xlabel('Valores Reais')
        ax3.set_ylabel('Predições')

        # 4. Distribuição de erros
        ax4 = axes[1, 1]
        for model in models:
            errors = self.y_test - self.predictions[model]
            ax4.hist(errors, alpha=0.5, label=self.metrics[model]['model_name'], bins=30)
        ax4.set_title('Distribuição de Erros', fontsize=14, fontweight='bold')
        ax4.set_xlabel('Erro')
        ax4.set_ylabel('Frequência')
        ax4.legend()
        ax4.axvline(x=0, color='red', linestyle='--', alpha=0.5)

        plt.tight_layout()
        plt.savefig('./output/model_comparison.png', dpi=300, bbox_inches='tight')
        print("\n📊 Gráfico de comparação salvo em: ./output/model_comparison.png")
        plt.show()


def main():
    """
    Função principal para executar o pipeline completo
    """
    print("🔥 Sistema de Predição de Risco de Fogo - Mossoró/RN")
    print("=" * 80)

    # Inicializar preditor
    predictor = FireRiskPredictor(data_path='./bdqueimadas.csv')

    # Carregar e preparar dados
    # predictor.load_and_prepare_data()

    # NOTA: Para demonstração, vamos criar dados sintéticos
    # Em produção, use dados reais do BDQueimadas
    print("\n⚠️  Modo de demonstração: Criando dados sintéticos...")
    predictor._create_demo_data()

    # Preparar features
    predictor.prepare_features()

    # Treinar modelos
    predictor.train_neural_network()
    predictor.train_knn()
    predictor.train_random_forest()

    # Comparar modelos
    predictor.compare_models()

    # Gerar predições
    predictor.predict_next_week()

    # Salvar resultados
    predictor.save_results()

    # Plotar comparação
    predictor.plot_comparison()

    print("\n✅ Pipeline completo executado com sucesso!")
    print("=" * 80)


# Método auxiliar para demo
def _create_demo_data(self):
    """Cria dados sintéticos para demonstração"""
    np.random.seed(42)
    n_samples = 500

    data = {
        'DataHora': pd.date_range(start='2024-01-01', periods=n_samples, freq='6H'),
        'Satelite': ['AQUA_M-T'] * n_samples,
        'Pais': ['Brasil'] * n_samples,
        'Estado': ['RIO GRANDE DO NORTE'] * n_samples,
        'Municipio': np.random.choice(['MOSSORÓ', 'NATAL', 'PARNAMIRIM'], n_samples),
        'Bioma': ['Caatinga'] * n_samples,
        'DiaSemChuva': np.random.randint(0, 30, n_samples),
        'Precipitacao': np.random.exponential(2, n_samples),
        'FRP': np.random.gamma(2, 10, n_samples),
        'Latitude': np.random.uniform(-6, -5, n_samples),
        'Longitude': np.random.uniform(-38, -37, n_samples),
    }

    # RiscoFogo baseado em outras variáveis (correlação realista)
    data['RiscoFogo'] = (
        0.3 * data['DiaSemChuva'] / 30 +
        0.3 * (10 - np.minimum(data['Precipitacao'], 10)) / 10 +
        0.2 * data['FRP'] / 100 +
        0.2 * np.random.random(n_samples)
    ) * 100

    self.df_mossoro = pd.DataFrame(data)
    self.df = self.df_mossoro.copy()

    # Extrair features temporais
    self.df_mossoro['Ano'] = self.df_mossoro['DataHora'].dt.year
    self.df_mossoro['Mes'] = self.df_mossoro['DataHora'].dt.month
    self.df_mossoro['Dia'] = self.df_mossoro['DataHora'].dt.day
    self.df_mossoro['DiaSemana'] = self.df_mossoro['DataHora'].dt.dayofweek
    self.df_mossoro['Hora'] = self.df_mossoro['DataHora'].dt.hour

    print(f"✅ Dados sintéticos criados: {len(self.df_mossoro)} registros")

# Adicionar método à classe
FireRiskPredictor._create_demo_data = _create_demo_data


if __name__ == "__main__":
    main()

