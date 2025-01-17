import { db } from '@/config/FirebaseConfig';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  query,
  where,
  getDocs,
  increment, 
  serverTimestamp,
  orderBy,
  limit 
} from 'firebase/firestore';

const USAGE_COLLECTION = 'usage';
const FREE_TIER_DAILY_MESSAGES_LIMIT = process.env.NEXT_PUBLIC_DAILY_MESSAGES_LIMIT;

export const rateLimitService = {
  async checkAndIncrementUsage(userId) {
    const today = new Date().toISOString().split('T')[0];
    const usageRef = doc(db, USAGE_COLLECTION, `${userId}_${today}`);
    
    try {
      const usageDoc = await getDoc(usageRef);
      
      if (!usageDoc.exists()) {
        await setDoc(usageRef, {
          userId,
          date: today,
          messageCount: 1,
          lastUpdated: serverTimestamp()
        });
        return { allowed: true, remainingMessages: FREE_TIER_DAILY_MESSAGES_LIMIT - 1 };
      }

      const currentCount = usageDoc.data().messageCount;
      
      if (currentCount >= FREE_TIER_DAILY_MESSAGES_LIMIT) {
        return { allowed: false, remainingMessages: 0 };
      }

      await setDoc(usageRef, {
        userId,
        date: today,
        messageCount: increment(1),
        lastUpdated: serverTimestamp()
      }, { merge: true });

      return { 
        allowed: true, 
        remainingMessages: FREE_TIER_DAILY_MESSAGES_LIMIT - (currentCount + 1)
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      throw error;
    }
  },

  async getUserUsageHistory(userId, daysToLookBack = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToLookBack);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const usageQuery = query(
      collection(db, USAGE_COLLECTION),
      where('userId', '==', userId),
      where('date', '>=', startDateStr),
      where('date', '<=', endDateStr),
      orderBy('date', 'desc'),
      limit(daysToLookBack)
    );

    const querySnapshot = await getDocs(usageQuery);
    return querySnapshot.docs.map(doc => doc.data());
  },

  async getRemainingMessages(userId) {
    const today = new Date().toISOString().split('T')[0];
    const usageRef = doc(db, USAGE_COLLECTION, `${userId}_${today}`);
    
    const usageDoc = await getDoc(usageRef);
    
    if (!usageDoc.exists()) {
      return FREE_TIER_DAILY_MESSAGES_LIMIT;
    }

    const currentCount = usageDoc.data().messageCount;
    return Math.max(0, FREE_TIER_DAILY_MESSAGES_LIMIT - currentCount);
  }
};