<p align="center">
  <img src="https://raw.githubusercontent.com/xcentralnn/Curator-Draft/main/docs/curator-logo.png" width="400" alt="Curator Platypus Mascot & Logo"/>
</p>

<h1 align="center">Curator</h1>

<p align="center">
  Kubernetes-native intelligent control plane featuring ML-driven predictive autoscaling and anomaly detection.
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/xcentralnn/Curator?style=social" alt="GitHub stars"/>
  <img src="https://img.shields.io/github/forks/xcentralnn/Curator?style=social" alt="GitHub forks"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License"/>
  <img src="https://img.shields.io/badge/React-Vite-blue?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Go-1.25+-blue?logo=go" alt="Go"/>
  <img src="https://img.shields.io/badge/Python-ML_Engine-green?logo=python" alt="Python"/>
  <img src="https://img.shields.io/badge/Prometheus-Integration-orange?logo=prometheus" alt="Prometheus"/>
</p>

---

## Overview

Curator is a modern, intelligent Kubernetes control plane designed to optimize workloads and reduce misconfigurations through predictive autoscaling.

By combining a Go-based Kubernetes Operator with a Python FastAPI ML Engine and a React/TypeScript Admin Dashboard, Curator continuously observes cluster state via Prometheus, analyzes traffic patterns using time-series forecasting (Prophet/P95), and scales resources proactively.

## Features & Progress

- **Dashboard UI**: Fully responsive, dark-mode ready React control panel.
- **ML Analytics**: Real-time traffic anomaly detection and capacity forecasting with customizable ML configurations (Training Strategy, Fallback Policy, Anomaly Sensitivity).
- **CuratorScaler CRD**: Declarative Kubernetes config encompassing Prometheus queries and ML parameter boundaries.
- **Go Controller**: Reconciles the custom resource and interfaces with the Python ML Engine.
- **Python ML Predictor**: Connects to Prometheus, fetches historical metrics, and applies AI thresholds.

## UI Dashboard (Admin Control Panel)

The React-based operator dashboard provides a complete control loop for cluster management:
- **Global Overview**: Real-time CPU, Memory, and Network load metrics across clusters.
- **Scalers View**: Monitor and configure `CuratorScaler` resources globally.
- **ML Engine Intelligence**: Configure training windows, retraining intervals, and trigger auto-detection thresholds.
- **Panic Override**: Instant emergency scaling freezes across namespaces.

## Setup & Configuration

1. **Deploy Go Controller**: Apply the CRDs and deploy the operator to your cluster.
2. **Setup ML Engine**: Ensure the Python API is running and connected to your Prometheus instance.
3. **Run Dashboard**: 
   ```bash
   npm install
   npm run dev
   ```

## License

MIT License