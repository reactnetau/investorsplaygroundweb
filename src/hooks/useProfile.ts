import { useState, useCallback } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { client, type UserProfile } from '../lib/api';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    setLoading(true);
    try {
      const load = async () => {
        const result = await client.models.UserProfile.list();
        return (result.data ?? [])[0] ?? null;
      };

      let p = await load();

      if (!p) {
        const attributes = await fetchUserAttributes();
        const email = attributes.email;
        if (!email) { setProfile(null); return null; }
        const created = await client.mutations.initializeUserProfile({ email, currency: 'AUD' });
        if (created.data?.error) throw new Error(created.data.error);
        p = await load();
      }

      if (!p) { setProfile(null); return null; }
      setProfile(p);
      return p;
    } catch (err) {
      console.error('[useProfile]', err);
      setProfile(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, fetchProfile, setProfile };
}
