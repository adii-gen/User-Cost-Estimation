"use client"
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, MapPin, Link as LinkIcon, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

// Types
interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  location?: string;
  website?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  coverPhoto: string;
  profilePic: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

interface Post {
  id: string;
  title: string;
  description: string;
  photo: string | null;
  createdAt: string;
  likes: number;
  comments: number;
}

interface ProfilePageProps {
  userId: string;
  currentUserId: string;
}

// export default function ProfilePage({ userId, currentUserId }: ProfilePageProps) {
  export default function ProfilePage({ userId, currentUserId }: ProfilePageProps) {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'posts' | 'about'>('posts');

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Fetch profile data
        const profileResponse = await fetch(`/api/users/${currentUserId}`);
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch user's posts
        const postsResponse = await fetch(`/api/posts?id=${currentUserId}`);
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    if (!profile) return;
    
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: profile.isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setProfile(prev => 
          prev ? {
            ...prev,
            isFollowing: !prev.isFollowing,
            followersCount: prev.isFollowing 
              ? prev.followersCount - 1 
              : prev.followersCount + 1
          } : null
        );
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return <div className="text-center py-10">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={profile.coverPhoto || "/background.png"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {userId === currentUserId && (
          <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
            <Pencil className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24">
          {/* Profile Photo */}
          <div className="relative inline-block">
            <img
              src={profile.profilePic || "/profile.jpg"}
              alt={profile.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover"
            />
            {userId === currentUserId && (
              <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Profile Actions */}
          <div className="absolute top-2 right-0 space-x-4">
            {userId === currentUserId ? (
              <Link href="/settings">
                <button className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                  Edit Profile
                </button>
              </Link>
            ) : (
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-full transition-colors ${
                  profile.isFollowing
                    ? 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {profile.isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">@{profile.username}</p>
          
          <p className="mt-4 text-gray-800">{profile.bio}</p>
          
          <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </span>
            )}
            {profile.website && (
              <a 
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <LinkIcon className="w-4 h-4" />
                Website
              </a>
            )}
            {profile.twitterHandle && (
              <a 
                href={`https://twitter.com/${profile.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:underline"
              >
                <Twitter className="w-4 h-4" />
                {profile.twitterHandle}
              </a>
            )}
            {profile.instagramHandle && (
              <a 
                href={`https://instagram.com/${profile.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-pink-600 hover:underline"
              >
                <Instagram className="w-4 h-4" />
                {profile.instagramHandle}
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 flex gap-6">
            <div className="text-center">
              <div className="font-bold text-xl">{profile.followersCount}</div>
              <div className="text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl">{profile.followingCount}</div>
              <div className="text-gray-600">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl">{posts.length}</div>
              <div className="text-gray-600">Posts</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 px-2 ${
                activeTab === 'posts'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 px-2 ${
                activeTab === 'about'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600'
              }`}
            >
              About
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-8">
          {activeTab === 'posts' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">About {profile.name}</h2>
              <p className="text-gray-800 whitespace-pre-line">{profile.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Post Card Component
function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src={post.photo || "/api/placeholder/400/250"}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {post.description}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            <div className="flex gap-4">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Loading Skeleton
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-64 md:h-80 w-full bg-gray-200" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 border-4 border-white" />
        </div>
        <div className="mt-6 space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-20 w-full max-w-2xl bg-gray-200 rounded" />
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 w-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}