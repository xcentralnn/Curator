# Curator: AI-Powered Kubernetes Autoscaling

Curator is a modern Kubernetes autoscaling solution that uses Machine Learning to predict traffic spikes and proactively scale deployments.

## Project Structure

- `api/`: Kubernetes CRD definitions (CuratorScaler).
- `cmd/controller`: Main Go entrypoint for the K8s Controller.
- `internal/`: Core logic for reconciliation and K8s API interaction.
- `ml-engine/`: Python-based ML Engine (FastAPI + Time-series models).
- `ui/`: Admin Dashboard (React + Vite + Tailwind).
- `deploy/`: Manifests and Helm Charts.

## Key Features

- **Predictive Scaling**: Move beyond reactive HPA using historical traffic patterns.
- **Anomaly Detection**: Identify DDoS or loop conditions before they exhaust resources.
- **Panic Button**: Instant global override for emergency situations.
- **AI Explanations**: Gemini-integrated logic explanations for scaling decisions.

## Quick Start

```bash
# Install the controller
helm install curator ./deploy/charts/curator

# Access the dashboard
kubectl port-forward svc/curator-ui 3000:3000
```
