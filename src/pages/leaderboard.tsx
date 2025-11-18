import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import styles from '@/styles/Leaderboard.module.css';

interface LeaderboardUser {
  user_id: string;
  score: number;
}

interface HarmfulProduct {
  product_name: string;
  brand: string;
  store: string;
  score: number;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [harmfulProducts, setHarmfulProducts] = useState<HarmfulProduct[]>([]);

  useEffect(() => {
    fetch('/data/leaderboard.json')
      .then(res => res.json())
      .then(data => {
        setLeaderboardData(data.leaderboard || []);
        setHarmfulProducts(data.harmful_products_user_001 || []);
      })
      .catch(err => console.error('Error loading leaderboard:', err));
  }, []);

  const getRankVariant = (index: number) => {
    if (index === 0) return styles.rankGold;
    if (index === 1) return styles.rankSilver;
    if (index === 2) return styles.rankBronze;
    return '';
  };

  const isNegativeScore = (score: number) => score < 0;

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.content}>
          <section className={styles.header}>
            <p className={styles.pageEyebrow}>Leaderboard</p>
            <h1 className={styles.title}>Global Sustainability Leaderboard</h1>
            <p className={styles.description}>
              Track top community performers and pinpoint the purchases that will move your score upward.
            </p>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.sectionTitle}>Current rankings</h2>
              <p className={styles.sectionSubtitle}>Live snapshot of the strongest sustainability scores</p>
            </div>
            <div className={styles.scrollView}>
              <div className={styles.leaderboardContainer}>
                {leaderboardData.map((item, index) => (
                  <div key={item.user_id} className={styles.leaderItem}>
                    <span className={`${styles.rankBadge} ${getRankVariant(index)}`}>{index + 1}</span>
                    <div className={styles.userInfo}>
                      <h3 className={styles.userName}>{item.user_id}</h3>
                      <p className={styles.userScore}>{item.score.toFixed(2)} points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.sectionTitle}>Improve your standing</h2>
              <p className={styles.sectionSubtitle}>Prioritize replacing the following purchases</p>
            </div>
            <div className={styles.scrollView}>
              <div className={styles.productsContainer}>
                {harmfulProducts.map((item, index) => {
                  const negative = isNegativeScore(Number(item.score));
                  return (
                    <div
                      key={item.product_name + index}
                      className={`${styles.productCard} ${negative ? styles.negative : styles.positive}`}
                    >
                      <h4 className={styles.productName}>{item.product_name}</h4>
                      <p className={styles.productDetails}>
                        Brand: {item.brand} | Store: {item.store}
                      </p>
                      <p className={styles.productScore}>
                        Sustainability Score: <span className={styles.scoreValue}>{item.score}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
