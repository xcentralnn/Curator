<p align="center">
  <img src="./docs/curator-logo.png" width="220"/>
</p>

<h1 align="center">Curator</h1>

<p align="center">
  Kubernetes-native intelligent control plane.
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/xcentralnn/Curator?style=social" alt="GitHub stars"/>
  <img src="https://img.shields.io/github/forks/xcentralnn/Curator?style=social" alt="GitHub forks"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License"/>
  <img src="https://img.shields.io/badge/Go-1.25+-blue?logo=go" alt="Go"/>
  <img src="https://img.shields.io/badge/Prometheus-Alertmanager-orange?logo=prometheus" alt="Prometheus"/>
  <img src="https://img.shields.io/badge/Webhook-Driven-lightgrey" alt="Webhook"/>
  <img src="https://img.shields.io/badge/status-active-success" alt="Status"/>
  <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg" alt="Contributions welcome"/>
</p>

---

## Overview

Curator is a Kubernetes-native intelligent control plane designed to optimize workloads, reduce misconfigurations, and improve resource efficiency.

It operates as a set of custom controllers that continuously observe cluster state, analyze system behavior, and apply corrective or optimizing actions. 

This repository also includes the **Curator AI Operator Panel** – a modern frontend interface configured with Firebase Authentication for securely gaining real-time insights, interacting with predictive capabilities, and executing scale overrides.

## Problem

Modern Kubernetes environments face three core challenges:

- Unpredictable workload scaling
- Frequent misconfigurations in manifests
- Resource inefficiency (idle, unused, or improperly scheduled objects)

These issues lead to:

- Increased infrastructure cost
- Reduced system reliability
- Operational complexity and drift

## Solution

Curator introduces an intelligent reconciliation layer:

- Machine learning for predictive autoscaling
- Policy-based validation for configuration correctness
- Heuristic and anomaly detection for resource optimization

## UI Dashboard (Admin Control Panel)

The React-based operator dashboard provides a complete control loop for cluster management:
- **Scalers View**: Monitor `CuratorScaler` resources globally.
- **Predictive Mode Insights**: AI-assisted anomaly detection readouts.
- **Panic Override**: Instant emergency scaling freezes across namespaces.
- **Dark/Light Theming**: Accessible console UI with mobile-first responsiveness.
- Installed natively via Firebase Cloud Services.

## License

MIT License

## Contributing

Contributions are welcome. Please keep changes minimal, focused, and aligned with the project's goals.