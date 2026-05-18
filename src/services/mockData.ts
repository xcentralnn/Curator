interface CuratorScaler {
  id: string;
  name: string;
  targetWorkload: string;
  triggerType: 'CPU' | 'Memory' | 'Prometheus';
  minReplicas: number;
  currentReplicas: number;
  maxReplicas: number;
  status: 'Healthy' | 'Scaling' | 'Panic Mode' | 'Paused' | 'Warning';
}

export const generateMockScalers = (): CuratorScaler[] => {
  return [
    {
      id: '1',
      name: 'kong-internal-gateway-curatorscaler',
      targetWorkload: 'kong-internal-internal-alb-demo-eks-gateway',
      triggerType: 'Prometheus',
      minReplicas: 1,
      currentReplicas: 3,
      maxReplicas: 10,
      status: 'Healthy',
    },
    {
      id: '2',
      name: 'payment-service-scaler',
      targetWorkload: 'payment-service',
      triggerType: 'CPU',
      minReplicas: 2,
      currentReplicas: 5,
      maxReplicas: 20,
      status: 'Scaling',
    },
    {
      id: '3',
      name: 'auth-gateway-scaler',
      targetWorkload: 'auth-gateway',
      triggerType: 'Memory',
      minReplicas: 3,
      currentReplicas: 15,
      maxReplicas: 15,
      status: 'Panic Mode',
    },
    {
      id: '4',
      name: 'inventory-worker-scaler',
      targetWorkload: 'inventory-worker',
      triggerType: 'Prometheus',
      minReplicas: 1,
      currentReplicas: 1,
      maxReplicas: 5,
      status: 'Paused',
    },
    {
      id: '5',
      name: 'recommendation-engine-scaler',
      targetWorkload: 'recommendation-engine',
      triggerType: 'CPU',
      minReplicas: 5,
      currentReplicas: 8,
      maxReplicas: 50,
      status: 'Warning',
    },
  ];
};

export const generateMLTimeSeriesData = (count: number = 60) => {
  const data = [];
  const now = new Date();
  
  for (let i = count; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60000);
    const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // actualTraffic (randomized sine wave)
    const trafficBase = Math.abs(Math.sin((count - i) * 0.1) * 100);
    const noise = Math.random() * 20 - 10;
    const actualTraffic = Math.max(0, trafficBase + 50 + noise);
    
    // predictedThreshold (slightly smoothed sine wave ahead of time)
    const thresholdBase = Math.abs(Math.sin((count - i + 2) * 0.1) * 100);
    const predictedThreshold = thresholdBase + 60;
    
    // Anomaly if actual traffic is significantly higher than predicted or drops strangely
    const isAnomaly = actualTraffic > predictedThreshold + 15 || (i % 15 === 0 && Math.random() > 0.5);
    
    data.push({
      timestamp: timeStr,
      actualTraffic: Math.floor(actualTraffic),
      predictedThreshold: Math.floor(predictedThreshold),
      isAnomaly,
    });
  }
  
  return data;
};
