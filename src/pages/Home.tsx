import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/store/useAuthStore';
import { postsApi } from '@/services/posts.api';
import { useDebounce } from '@/hooks/useDebounce';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostItem from '@/components/posts/PostItem';
import AuthModal from '@/components/ui/AuthModal';
import DeleteModal from '@/components/ui/DeleteModal';
import CreatePost from '@/components/posts/CreatePost';

export default function HomePage() {
    const queryClient = useQueryClient();

    const { user, isAuthenticated } = useAuthStore();

    // Modal de Autenticação
    const [authModalConfig, setAuthModalConfig] = useState<{ isOpen: boolean; action: 'like' | 'post' | null }>({
        isOpen: false,
        action: null,
    });
    const handleOpenAuthModal = (action: 'like' | 'post') => setAuthModalConfig({ isOpen: true, action });
    const handleCloseAuthModal = () => setAuthModalConfig({ isOpen: false, action: null });

    // Modal de Exclusão
    const [deleteModalConfig, setDeleteModalConfig] = useState<{ isOpen: boolean; postId: number | null }>({
        isOpen: false,
        postId: null,
    });
    const handleOpenDeleteModal = (postId: number) => setDeleteModalConfig({ isOpen: true, postId });
    const handleCloseDeleteModal = () => setDeleteModalConfig({ isOpen: false, postId: null });

    // Busca / Carregamento
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 500);
    const querySearch = debouncedSearch.length >= 2 ? debouncedSearch : '';
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['posts', querySearch],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await postsApi.getAll({ page: pageParam, search: querySearch });
            return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.posts) return undefined;
            const currentCount = allPages.reduce((acc, page) => acc + (page.posts?.length || 0), 0);
            if (currentCount < lastPage.total) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 },
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const toggleLikeMutation = useMutation({
        mutationFn: (id: number) => postsApi.like(id),
        onSuccess: (_, id) => {
            if (user?.id) {
                const likedKey = `liked_posts_${user.id}`;
                const likedList = JSON.parse(localStorage.getItem(likedKey) || '[]');
                if (likedList.includes(id)) {
                    localStorage.setItem(likedKey, JSON.stringify(likedList.filter((postId: number) => postId !== id)));
                } else {
                    localStorage.setItem(likedKey, JSON.stringify([...likedList, id]));
                }
            }
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const updatePostMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: { title: string; content: string; image?: string } }) =>
            postsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const deletePostMutation = useMutation({
        mutationFn: (id: number) => postsApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });

    const handleLike = (id: number) => {
        if (!isAuthenticated) return handleOpenAuthModal('like');
        toggleLikeMutation.mutate(id);
    };

    const handleDelete = (id: number) => {
        if (!isAuthenticated) return;
        handleOpenDeleteModal(id);
    };

    const handleEdit = (id: number, data: { title: string; content: string; image?: string }) => {
        if (!isAuthenticated) return;
        updatePostMutation.mutate({ id, data });
    };

    const confirmDelete = () => {
        if (deleteModalConfig.postId !== null) {
            deletePostMutation.mutate(deleteModalConfig.postId);
        }
    };

    const likedPostsStr = user?.id ? localStorage.getItem(`liked_posts_${user.id}`) : null;
    const likedPosts: number[] = likedPostsStr ? JSON.parse(likedPostsStr) : [];

    const posts = (data?.pages.flatMap((page) => page.posts ?? []) ?? []).map(post => ({
        ...post,
        likedByMe: post.likedByMe || likedPosts.includes(post.id)
    }));

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-twitter-dark-background flex flex-col font-sans transition-colors duration-200">
            <Header searchInput={searchInput} onSearchChange={setSearchInput} />

            <AuthModal isOpen={authModalConfig.isOpen} onClose={handleCloseAuthModal} action={authModalConfig.action} />

            <DeleteModal isOpen={deleteModalConfig.isOpen} onClose={handleCloseDeleteModal} onConfirm={confirmDelete} />

            <main className="flex-1 w-full max-w-170 mx-auto py-8 px-4 flex flex-col gap-6">
                <CreatePost isAuthenticated={isAuthenticated} onRequireAuth={handleOpenAuthModal} />

                {/* Posts Feed */}
                <div className="flex flex-col gap-6 font-twitter">
                    {isLoading && posts.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">Carregando posts...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                            Nenhum post encontrado.
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                isAuthenticated={isAuthenticated}
                                currentUserId={user?.id}
                                onLike={handleLike}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        ))
                    )}
                </div>

                <div ref={loadMoreRef} className="h-10 w-full flex justify-center items-center">
                    {isFetchingNextPage && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm py-4">Carregando mais...</span>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
