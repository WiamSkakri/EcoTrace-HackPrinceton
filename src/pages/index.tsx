import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Leaf, Sun, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '@/styles/Dashboard.module.css';

interface MetricCardProps {
  icon: typeof Leaf;
  title: string;
  value: string;
  change: string;
  color: string;
}

function MetricCard({ icon: Icon, title, value, change, color }: MetricCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <div className={styles.metricCard} style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
      <Icon size={32} color="#fff" />
      <h3 className={styles.metricTitle}>{title}</h3>
      <p className={styles.metricValue}>{value}</p>
      <p className={styles.metricChange} style={{ color: isPositive ? '#fff' : '#ffa5a5' }}>
        {change}%
      </p>
    </div>
  );
}

interface SustainableInvestment {
  name: string;
  ticker: string;
  price: number;
  marketCap: string;
  sustainabilityRating: number;
  sector: string;
  potentialImprovement: number;
}

function InvestmentCard({ investment }: { investment: SustainableInvestment }) {
  const handleClick = () => {
    window.open(`https://finance.yahoo.com/quote/${investment.ticker}`, '_blank');
  };

  return (
    <div className={styles.investmentCard} onClick={handleClick}>
      <div className={styles.investmentHeader}>
        <div>
          <h3 className={styles.investmentName}>{investment.name}</h3>
          <p className={styles.investmentTicker}>{investment.ticker}</p>
        </div>
        <div>
          <p className={styles.price}>${investment.price}</p>
          <p className={styles.marketCap}>{investment.marketCap}</p>
        </div>
      </div>
      <div className={styles.investmentDetails}>
        <div>
          <p className={styles.label}>Sustainability Rating</p>
          <p className={styles.rating}>{investment.sustainabilityRating}/100</p>
        </div>
        <div>
          <p className={styles.label}>Sector</p>
          <p className={styles.sector}>{investment.sector}</p>
        </div>
        <div>
          <p className={styles.label}>Potential Score Improvement</p>
          <p className={styles.improvement}>+{investment.potentialImprovement} pts</p>
        </div>
      </div>
    </div>
  );
}

function TipCard({ tip }: { tip: { title: string; text: string } }) {
  return (
    <div className={styles.tipCard}>
      <Leaf size={24} color="#4ade80" />
      <div className={styles.tipContent}>
        <h4 className={styles.tipTitle}>{tip.title}</h4>
        <p className={styles.tipText}>{tip.text}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [financeData, setFinanceData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/finance')
      .then(res => res.json())
      .then(data => setFinanceData(data))
      .catch(err => console.error('Error fetching finance data:', err));
  }, []);

  const metrics: MetricCardProps[] = [
    {
      icon: Leaf,
      title: 'Carbon Footprint',
      value: '2.5 tons',
      change: '-12',
      color: '#4ade80',
    },
    {
      icon: Sun,
      title: 'Investment Credit',
      value: '250 pts',
      change: '+25',
      color: '#fbbf24',
    },
  ];

  const investments: SustainableInvestment[] = [
    {
      name: 'Green Energy Fund',
      ticker: 'ICLN',
      price: 78.42,
      marketCap: '$2.8B',
      sustainabilityRating: 92,
      sector: 'Renewable Energy',
      potentialImprovement: 12,
    },
    {
      name: 'Sustainable Tech Corp',
      ticker: 'TAN',
      price: 145.67,
      marketCap: '$4.2B',
      sustainabilityRating: 88,
      sector: 'Clean Technology',
      potentialImprovement: 15,
    },
  ];

  const tips = [
    {
      title: 'Switch to Renewable Energy',
      text: 'Consider switching to a renewable energy provider to reduce your carbon footprint by up to 30%.',
    },
    {
      title: 'Reduce Food Waste',
      text: 'Plan your meals and use leftovers creatively to minimize food waste and save money.',
    },
  ];

  const chartData = [
    { name: 'Jan', score: 65 },
    { name: 'Feb', score: 72 },
    { name: 'Mar', score: 68 },
    { name: 'Apr', score: 78 },
    { name: 'May', score: 82 },
    { name: 'Jun', score: 88 },
  ];

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>My Sustainability Impact</h1>
          <p className={styles.subtitle}>Track your eco-friendly journey</p>
        </header>

        <div className={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {financeData && (
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Financial Summary</h2>
            <div className={styles.financeSummary}>
              <div className={styles.financeItem}>
                <span>Total Transactions</span>
                <span className={styles.financeValue}>{financeData.totalTransactions}</span>
              </div>
              <div className={styles.financeItem}>
                <span>Total Spent</span>
                <span className={styles.financeValue}>${financeData.totalSpent?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            <TrendingUp size={24} color="#4ade80" />
            Sustainability Score Over Time
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(26, 31, 46, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="score" stroke="#4ade80" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Sustainable Investment Opportunities</h2>
          <div className={styles.investmentsGrid}>
            {investments.map((investment, index) => (
              <InvestmentCard key={index} investment={investment} />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Eco Tips</h2>
          <div className={styles.tipsGrid}>
            {tips.map((tip, index) => (
              <TipCard key={index} tip={tip} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
