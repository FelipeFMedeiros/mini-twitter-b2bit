import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'lucide-react';
import { postsApi } from '@/services/posts.api';
import { postSchema } from '@/features/posts/schemas';
import Button from '@/components/ui/Button';

interface CreatePostProps {
    isAuthenticated: boolean;
    onRequireAuth: (action: 'post') => void;
}

export default function CreatePost({ isAuthenticated, onRequireAuth }: CreatePostProps) {
    const queryClient = useQueryClient();

    const [isPosting, setIsPosting] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState('');

    const validation = postSchema.safeParse({ title: postTitle, content: postContent, image: postImage });
    const canSubmit = validation.success;

    const titleError =
        postTitle.length > 0 &&
        !validation.success &&
        validation.error.issues.find((i) => i.path[0] === 'title')?.message;
    const imageError =
        postImage.length > 0 &&
        !validation.success &&
        validation.error.issues.find((i) => i.path[0] === 'image')?.message;

    const createPostMutation = useMutation({
        mutationFn: () => postsApi.create({ title: postTitle, content: postContent, image: postImage || undefined }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setIsPosting(false);
            setPostTitle('');
            setPostContent('');
            setPostImage('');
        },
    });

    const handleCreatePost = (e: FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return onRequireAuth('post');
        if (!canSubmit) return;
        createPostMutation.mutate();
    };

    return (
        <div className="w-full bg-white dark:bg-[#15202B] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
            {isPosting ? (
                <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
                    <div>
                        <input
                            type="text"
                            placeholder="Título do post"
                            autoFocus
                            className={`w-full bg-transparent text-lg font-bold outline-none ${titleError ? 'text-red-500 dark:text-red-400 border-b border-red-500' : 'text-gray-900 dark:text-white placeholder-gray-400'}`}
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                        />
                        {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
                    </div>
                    <textarea
                        placeholder="E aí, o que está rolando?"
                        rows={3}
                        className="w-full bg-transparent text-gray-800 dark:text-gray-200 outline-none resize-none placeholder-gray-500 mt-2"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                    <div>
                        <input
                            type="text"
                            placeholder="URL de uma imagem (Opcional)"
                            className={`w-full bg-gray-50 dark:bg-twitter-dark-background-secondary border ${imageError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-twitter-blue`}
                            value={postImage}
                            onChange={(e) => setPostImage(e.target.value)}
                        />
                        {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 mt-2 mb-2"></div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors text-twitter-blue"
                            title="Apenas insira a URL acima."
                        >
                            <Image size={24} />
                        </button>
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsPosting(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                isLoading={createPostMutation.isPending}
                                disabled={!canSubmit}
                            >
                                Postar
                            </Button>
                        </div>
                    </div>
                </form>
            ) : (
                <div
                    className="flex flex-col cursor-text"
                    onClick={() => {
                        if (!isAuthenticated) return onRequireAuth('post');
                        setIsPosting(true);
                    }}
                >
                    <textarea
                        placeholder="E aí, o que está rolando?"
                        className="w-full bg-transparent text-lg outline-none resize-none placeholder-gray-500 h-14 cursor-pointer"
                        readOnly
                    />
                    <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                    <div className="flex justify-between items-center">
                        <div className="p-2 rounded-full cursor-not-allowed opacity-70 text-twitter-blue">
                            <Image size={24} />
                        </div>
                        <button
                            className="bg-twitter-blue text-white font-bold py-1.5 px-5 rounded-full"
                            onClick={(e) => {
                                if (!isAuthenticated) {
                                    e.stopPropagation();
                                    return onRequireAuth('post');
                                }
                            }}
                        >
                            Postar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}