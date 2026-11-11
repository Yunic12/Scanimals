import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

interface PostItem {
  id: string;
  petName: string;
  ownerName: string;
  caption: string;
  emoji: string;
  likes: number;
  comments: string[];
  badge: string;
  badgeRed?: boolean;
}

const INITIAL_POSTS: PostItem[] = [
  {
    id: '1',
    petName: 'Biscuit',
    ownerName: 'Sarah Jenkins',
    caption: 'Afternoon walk at the park! SafeNet tag active 🐾✨',
    emoji: '🐕',
    likes: 124,
    comments: ['Super cute dog!', 'Tag looks great!'],
    badge: '🟢 Safe & Verified',
  },
  {
    id: '2',
    petName: 'Luna',
    ownerName: 'Mark R.',
    caption: 'Spotted near Sector 4 backyards! Please scan tag if you see her.',
    emoji: '🐈',
    likes: 88,
    comments: ['I live near Sector 4, keeping an eye out!'],
    badge: '🚨 Active Alert',
    badgeRed: true,
  },
];

export default function FeedScreen() {
  const ins = useSafeAreaInsets();
  const router = useRouter();
  const { owner, activePet } = useApp();

  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [likedMap, setLikedMap] = useState<{ [key: string]: boolean }>({});
  const [activeCommentsPost, setActiveCommentsPost] = useState<PostItem | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newCaption, setNewCaption] = useState('');

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddComment = () => {
    if (!commentInput.trim() || !activeCommentsPost) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === activeCommentsPost.id ? { ...p, comments: [...p.comments, `${owner?.name}: ${commentInput}`] } : p
      )
    );
    setCommentInput('');
  };

  const handleCreatePost = () => {
    if (!newCaption.trim()) return;
    const created: PostItem = {
      id: Date.now().toString(),
      petName: activePet?.name || 'Pet',
      ownerName: owner?.name || 'Owner',
      caption: newCaption,
      emoji: activePet?.emo || '🐾',
      likes: 1,
      comments: [],
      badge: '🟢 Verified Clip',
    };
    setPosts([created, ...posts]);
    setNewCaption('');
    setShowCreatePost(false);
  };

  return (
    <View style={[s.container, { paddingTop: ins.top }]}>
      <View style={s.topBar}>
        <View>
          <Text style={s.topSub}>Scanimals Clips</Text>
          <Text style={s.topTitle}>TikTok Community Radar</Text>
        </View>
        <Pressable style={s.postBtn} onPress={() => setShowCreatePost(true)}>
          <Text style={s.postBtnTxt}>📸 Post Mine</Text>
        </Pressable>
      </View>

      <ScrollView pagingEnabled showsVerticalScrollIndicator={false}>
        {posts.map((post) => {
          const isLiked = likedMap[post.id];
          const currentLikes = post.likes + (isLiked ? 1 : 0);

          return (
            <View key={post.id} style={[s.clipContainer, { height: SCREEN_H - 120 }]}>
              <View style={s.mediaCard}>
                <Text style={{ fontSize: 90 }}>{post.emoji}</Text>
                
                <View style={s.badgeBox}>
                  <Text style={[s.badgeText, post.badgeRed && { color: C.redInk }]}>{post.badge}</Text>
                </View>
              </View>

              <View style={s.floatingActions}>
                <Pressable style={s.actionBtn} onPress={() => toggleLike(post.id)}>
                  <Text style={{ fontSize: 26 }}>{isLiked ? '❤️' : '🤍'}</Text>
                  <Text style={s.actionTxt}>{currentLikes}</Text>
                </Pressable>
                <Pressable style={s.actionBtn} onPress={() => setActiveCommentsPost(post)}>
                  <Text style={{ fontSize: 26 }}>💬</Text>
                  <Text style={s.actionTxt}>{post.comments.length}</Text>
                </Pressable>
                <Pressable style={s.actionBtn} onPress={() => router.push('/finder-view')}>
                  <Text style={{ fontSize: 26 }}>🪪</Text>
                  <Text style={s.actionTxt}>Scan Tag</Text>
                </Pressable>
              </View>

              <View style={s.captionOverlay}>
                <Text style={s.authorTxt}>@{post.petName} ({post.ownerName})</Text>
                <Text style={s.captionTxt}>{post.caption}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={!!activeCommentsPost} animationType="slide" transparent>
        <View style={s.drawerOverlay}>
          <View style={s.drawerCard}>
            <View style={s.drawerHeader}>
              <Text style={s.drawerTitle}>Comments ({activeCommentsPost?.comments.length})</Text>
              <Pressable onPress={() => setActiveCommentsPost(null)}>
                <Text style={{ fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 250 }}>
              {activeCommentsPost?.comments.map((c, i) => (
                <Text key={i} style={s.commentItem}>{c}</Text>
              ))}
            </ScrollView>

            <View style={s.commentInputRow}>
              <TextInput
                style={s.input}
                placeholder="Add a comment..."
                value={commentInput}
                onChangeText={setCommentInput}
              />
              <Pressable style={s.sendBtn} onPress={handleAddComment}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showCreatePost} animationType="slide" transparent>
        <View style={s.drawerOverlay}>
          <View style={s.drawerCard}>
            <Text style={s.drawerTitle}>Post Your Clip / Sighting</Text>
            <TextInput
              style={[s.input, { height: 80 }]}
              placeholder="Write a caption for your pet clip..."
              multiline
              value={newCaption}
              onChangeText={setNewCaption}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Pressable style={[s.sendBtn, { backgroundColor: '#666' }]} onPress={() => setShowCreatePost(false)}>
                <Text style={{ color: '#fff' }}>Cancel</Text>
              </Pressable>
              <Pressable style={s.sendBtn} onPress={handleCreatePost}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Publish Clip</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBar: { position: 'absolute', top: 12, left: 16, right: 16, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
  topTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  postBtn: { backgroundColor: C.pri, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  postBtnTxt: { color: C.ink, fontWeight: '700', fontSize: 12 },
  clipContainer: { width: SCREEN_W, justifyContent: 'center', alignItems: 'center', padding: 16, position: 'relative' },
  mediaCard: { width: '100%', height: '100%', backgroundColor: '#1a1a1a', borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333', overflow: 'hidden' },
  badgeBox: { position: 'absolute', top: 20, left: 20, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: '700', color: C.ink },
  floatingActions: { position: 'absolute', right: 28, bottom: 90, alignItems: 'center', gap: 16 },
  actionBtn: { alignItems: 'center', gap: 4 },
  actionTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  captionOverlay: { position: 'absolute', left: 28, bottom: 36, right: 90, gap: 6 },
  authorTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
  captionTxt: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 18 },
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  drawerCard: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  drawerTitle: { fontSize: 18, fontWeight: '800', color: C.ink },
  commentItem: { paddingVertical: 6, borderBottomWidth: 1, borderColor: C.line, fontSize: 13, color: C.ink },
  commentInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: C.field },
  sendBtn: { backgroundColor: C.pri, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
});