// src/hooks/useInitializeUser.js
import { useEffect } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

export const useInitializeUser = () => {
  const { userId, setAuth } = useAuthStore();

  useEffect(() => {
    if (!userId) {
      console.log("🔍 Attempting to fetch authenticated user...");

      api.get('/auth/me')
        .then((res) => {
          console.log("✅ User found:", res.data);
          setAuth(res.data.id, res.data.uuid);
        })
        .catch((err) => {
          console.log("❌ User not logged in or auth failed:", err.message);
        });
    }
  }, [userId, setAuth]);
};