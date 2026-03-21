import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
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
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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

    const handleGenerateRandomImage = async () => {
        try {
            setIsGeneratingImage(true);
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            if (data.status === 'success') {
                setPostImage(data.message);
            }
        } catch (error) {
            console.error('Erro ao gerar imagem aleatória', error);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleCancel = () => {
        setIsPosting(false);
        setPostTitle('');
        setPostContent('');
        setPostImage('');
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
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="URL de uma imagem (Opcional)"
                                className={`flex-1 bg-gray-50 dark:bg-twitter-dark-background-secondary border ${imageError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-twitter-blue`}
                                value={postImage}
                                onChange={(e) => setPostImage(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleGenerateRandomImage}
                                disabled={isGeneratingImage}
                                className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-md border border-purple-200 dark:border-purple-800 transition-colors text-sm font-medium disabled:opacity-50 hover:cursor-pointer"
                                title="Gerar uma imagem de doguinho aleatória"
                            >
                                <Sparkles size={16} />
                                <span className="hidden sm:inline">
                                    {isGeneratingImage ? 'Gerando...' : 'Gerar Aleatória'}
                                </span>
                            </button>
                        </div>
                        {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
                    </div>

                    {postImage && !imageError && (
                        <div className="w-full mt-2 mb-2 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-[#0B0F19]">
                            <img
                                src={postImage}
                                alt="Post attachment preview"
                                className="w-full h-auto max-h-100 object-contain"
                                loading="lazy"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                                onLoad={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'block';
                                }}
                            />
                        </div>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-800 mt-2 mb-2"></div>

                    <div className="flex justify-between items-center">
                        <div
                            className="p-2 rounded-full opacity-50 text-twitter-blue cursor-not-allowed"
                            title="Insira a URL acima"
                        >
                            <ImageIcon size={24} />
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" onClick={handleCancel}>
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
                        <div className="p-2 rounded-full cursor-not-allowed opacity-50 text-twitter-blue">
                            <ImageIcon size={24} />
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