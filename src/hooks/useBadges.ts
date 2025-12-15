import { useState, useEffect } from 'react';
import { badgeService } from '../services/badge.service';
import { useAuth } from './useAuth';
import { UserBadge, Badge } from '../types';

export const useBadges = () => {
  const { user } = useAuth();
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [badges, userOwned] = await Promise.all([
        Promise.resolve(badgeService.getAllBadges()),
        badgeService.getUserBadges(user.id)
      ]);
      
      setAllBadges(badges);
      setUserBadges(userOwned);
    } catch (e) {
      console.error('Error loading badges', e);
    } finally {
      setLoading(false);
    }
  };

  return { userBadges, allBadges, loading, refresh: loadBadges };
};
