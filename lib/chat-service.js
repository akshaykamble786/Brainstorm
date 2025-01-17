import { db } from '@/config/FirebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';

const CHATS_COLLECTION = 'chats';

const generateChatTitle = (messages) => {
  if (!messages || messages.length === 0) return 'New Chat';
  
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (!firstUserMessage) return 'New Chat';

  const content = firstUserMessage.content;
  const title = content.split('.')[0].trim();
  return title.length > 50 ? `${title.substring(0, 47)}...` : title;
};

export const chatService = {
  subscribeToUserChats(userId, callback) {
    const chatsQuery = query(
      collection(db, CHATS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(chatsQuery, (snapshot) => {
      const chats = snapshot.docs.map(doc => {
        const data = doc.data();
        const messages = data.messages || [];
        return {
          id: doc.id,
          ...data,
          messages: messages.map(msg => ({
            id: msg.id || `msg-${Date.now()}-${Math.random()}`,
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt || Date.now()
          }))
        };
      });
      callback(chats);
    });
  },

  async createChat(userId, initialMessage = null, customTitle = null) {
    const initialMessages = [];
    
    if (initialMessage) {
      initialMessages.push({
        id: `msg-${Date.now()}-${Math.random()}`,
        role: 'user',
        content: initialMessage,
        createdAt: Date.now()
      });
    }

    const chat = await addDoc(collection(db, CHATS_COLLECTION), {
      userId,
      title: customTitle || initialMessage ? generateChatTitle(initialMessages) : 'New Chat',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messages: initialMessages
    });
    return chat.id;
  },

  async hasExistingChats(userId) {
    const chatsQuery = query(
      collection(db, CHATS_COLLECTION),
      where('userId', '==', userId),
      limit(1)
    );
    
    const snapshot = await getDocs(chatsQuery);
    return !snapshot.empty;
  },

  async updateChat(chatId, messages) {
    const chatRef = doc(db, CHATS_COLLECTION, chatId);
    
    const messageMap = new Map();
    messages.forEach(msg => {
      messageMap.set(msg.id, {
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt || Date.now()
      });
    });

    const uniqueMessages = Array.from(messageMap.values());

    await updateDoc(chatRef, {
      messages: uniqueMessages,
      title: generateChatTitle(uniqueMessages),
      updatedAt: serverTimestamp()
    });
  },

  async deleteChat(chatId) {
    await deleteDoc(doc(db, CHATS_COLLECTION, chatId));
  }
};