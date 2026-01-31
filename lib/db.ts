
import { supabase } from './supabaseClient';
import { User, MoodEntry, ChatMessage, MoodType } from '../types';

export const db = {
  // --- AUTHENTICATION ---
  
  async login(email: string, password?: string): Promise<User> {
    if (!password) throw new Error("A secure password is required to enter the sanctuary.");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase Login Error:", error.message);
      if (error.message.includes('Email not confirmed')) {
        throw new Error("Your email hasn't been confirmed yet. Please check your inbox or disable 'Confirm Email' in your Supabase Authentication settings.");
      }
      throw error;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    return {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name || 'Sanctuary User',
      createdAt: new Date(data.user.created_at).getTime(),
    };
  },

  async register(name: string, email: string, password?: string): Promise<User> {
    if (!password) throw new Error("A secure password is required for your protection.");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) {
      console.error("Supabase Registration Error:", error.message);
      throw error;
    }
    
    if (!data.user) throw new Error('Registration could not be completed at this time.');

    // Attempt to upsert profile, but don't fail registration if it fails (Supabase triggers might handle this)
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: email,
        name: name,
      });
    } catch (profileErr) {
      console.warn("Non-critical: Profile sync deferred", profileErr);
    }

    // If confirmation is required, session will be null
    if (!data.session) {
      throw new Error("Success! Please check your email for a confirmation link to complete your registration.");
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      name: name,
      createdAt: new Date(data.user.created_at).getTime(),
    };
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      return {
        id: session.user.id,
        email: session.user.email!,
        name: profile?.name || 'Sanctuary User',
        createdAt: new Date(session.user.created_at).getTime(),
      };
    } catch (e) {
      return null;
    }
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  // --- MOODS ---

  async getMoods(userId: string): Promise<MoodEntry[]> {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Mood Fetch Error:", error);
      return [];
    }
    
    return data.map(m => ({
      id: m.id,
      userId: m.user_id,
      mood: m.mood as MoodType,
      note: m.note,
      createdAt: new Date(m.created_at).getTime(),
    }));
  },

  async addMood(data: { userId: string; mood: MoodType; note: string }): Promise<MoodEntry> {
    const { data: entry, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: data.userId,
        mood: data.mood,
        note: data.note,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Mood Save Error:", error);
      throw error;
    }
    
    return {
      id: entry.id,
      userId: entry.user_id,
      mood: entry.mood as MoodType,
      note: entry.note,
      createdAt: new Date(entry.created_at).getTime(),
    };
  },

  // --- CHATS ---

  async getChats(userId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Supabase Chat History Fetch Error:", error);
      return [];
    }
    
    return data.map(c => ({
      id: c.id,
      userId: c.user_id,
      role: c.role as 'user' | 'ai',
      content: c.content,
      createdAt: new Date(c.created_at).getTime(),
    }));
  },

  async addChat(data: { userId: string; role: 'user' | 'ai'; content: string }): Promise<ChatMessage> {
    const { data: chat, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: data.userId,
        role: data.role,
        content: data.content,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Chat Message Persistence Error:", error);
      // Fallback for UI if DB fails but AI is still active
      return {
        id: 'local-' + Math.random(),
        ...data,
        createdAt: Date.now()
      };
    }
    
    return {
      id: chat.id,
      userId: chat.user_id,
      role: chat.role as 'user' | 'ai',
      content: chat.content,
      createdAt: new Date(chat.created_at).getTime(),
    };
  }
};
