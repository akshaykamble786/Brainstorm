'use client'

import { db } from '@/config/FirebaseConfig';
import { useUser } from '@clerk/nextjs';
import { collection, doc, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'

function UseSubscription(){
 const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
 const { user } = useUser();

 const [snapshot, loading, error] = useDocument(
    user && doc(db, 'users', user?.primaryEmailAddress?.emailAddress),{
    snapshotListenOptions: { includeMetadataChanges: true },
    }
 );

 useEffect(()=>{
    if(!snapshot) return;

    const data = snapshot.data();
    if(!data) return;
    
    setHasActiveSubscription(data.hasActiveSubscription);
 },[snapshot])

 return { hasActiveSubscription, loading, error }
}

export default UseSubscription