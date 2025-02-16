"use client";

import Logo from '@/components/global/Logo'
import { OrganizationSwitcher, useAuth, UserButton, useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';

const Header = () => {
  const { orgId } = useAuth();
  const { user } = useUser();

  
  useEffect(()=>{
    user && saveUserData();
  },[user])

  // const saveUserData = async () => {
  //   const docId = user?.primaryEmailAddress?.emailAddress
  //   try {
  //     await setDoc(doc(db, 'users', docId), {
  //       name: user?.fullName,
  //       avatar: user?.imageUrl,
  //       email: user?.primaryEmailAddress?.emailAddress,
  //     }, { merge: true })  // Add merge: true option
  //   } catch (e) {
  //     console.log("Error saving user:", e)
  //   }
  // }

  const saveUserData = async () => {
    const docId = user?.primaryEmailAddress?.emailAddress
    try {
      const docRef = doc(db, 'users', docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user?.fullName,
          avatar: user?.imageUrl,
          email: user?.primaryEmailAddress?.emailAddress,
          hasActiveSubscription: false 
        });
      } else {
        await updateDoc(docRef, {
          name: user?.fullName,
          avatar: user?.imageUrl,
          email: user?.primaryEmailAddress?.emailAddress
        });
      }
    } catch (e) {
      console.log("Error saving user:", e)
    }
  }

  return (
    <div className='flex items-center justify-around p-4 shadow dark:shadow-gray-800 shadow-gray-300'>
      <Logo />
      <OrganizationSwitcher
        afterCreateOrganizationUrl={'/dashboard'}
        afterLeaveOrganizationUrl={'/dashboard'}
      />

      <ThemeToggle />
      <UserButton />
    </div>
  )
}

export default Header