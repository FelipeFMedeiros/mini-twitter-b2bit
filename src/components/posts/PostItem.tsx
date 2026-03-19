import { useState } from 'react';
import { Heart, Trash2, Pencil, Check, X } from 'lucide-react';
import type { Post as PostType } from '@/types';
import { formatDate } from '@/utils';
import { postSchema } from '@/features/posts/schemas';

interface PostItemProps {
    post: PostType;
    currentUserId?: number;
    isAuthenticated: boolean;
    onLike: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit?: (id: number, data: { title: string; content: string; image?: string }) => void;
}

export default function PostItem({ post, currentUserId, isAuthenticated, onLike, onDelete, onEdit }: PostItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editContent, setEditContent] = useState(post.content);
    const [editImage, setEditImage] = useState(post.image || '');

    const validation = postSchema.safeParse({ title: editTitle, content: editContent, image: editImage });
    const canSave = validation.success;

    const titleError =
        editTitle.length > 0 &&
        !validation.success &&
        validation.error.issues.find((i) => i.path[0] === 'title')?.message;
    const imageError =
        editImage.length > 0 &&
        !validation.success &&
        validation.error.issues.find((i) => i.path[0] === 'image')?.message;

    const handleSave = () => {
        if (onEdit && canSave) {
            onEdit(post.id, {
                title: editTitle,
                content: editContent,
                image: editImage || undefined,
            });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(post.title);
        setEditContent(post.content);
        setEditImage(post.image || '');
        setIsEditing(false);
    };

    return (
        <div className="w-full bg-white dark:bg-[#15202B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-[15px]">
                    <span className="font-bold text-gray-900 dark:text-white">{post.authorName}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                        @{post.authorName ? post.authorName.toLowerCase().replace(/\s/g, '') : 'desconhecido'}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 px-1">·</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(post.createdAt)}</span>
                </div>

                {isAuthenticated && currentUserId === post.authorId && (
                    <div className="flex items-center gap-1">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={!canSave}
                                    className="text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors p-1.5 rounded-full disabled:opacity-50"
                                    title="Salvar"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors p-1.5 rounded-full"
                                    title="Cancelar"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-gray-400 hover:text-twitter-blue hover:bg-twitter-blue/10 transition-colors p-1.5 rounded-full"
                                    title="Editar Post"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(post.id)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors p-1.5 rounded-full"
                                    title="Deletar Post"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="mb-3">
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <div>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Título..."
                                className={`w-full bg-gray-50 dark:bg-[#1C2733] border ${titleError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-md px-3 py-1.5 text-[17px] font-bold text-gray-900 dark:text-white outline-none focus:border-twitter-blue transition-colors`}
                            />
                            {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
                        </div>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Conteúdo..."
                            rows={3}
                            className="w-full bg-gray-50 dark:bg-[#1C2733] border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-[15px] text-gray-800 dark:text-gray-200 outline-none resize-none focus:border-twitter-blue transition-colors"
                        />
                    </div>
                ) : (
                    <>
                        <h3 className="font-bold text-[17px] text-gray-900 dark:text-white mb-1.5 leading-snug">
                            {post.title}
                        </h3>
                        <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-[15px]">{post.content}</p>
                    </>
                )}
            </div>

            {isEditing && (
                <div className="mb-4">
                    <input
                        type="text"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        placeholder="URL de uma nova imagem (Opcional)"
                        className={`w-full bg-gray-50 dark:bg-[#1C2733] border ${imageError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-twitter-blue transition-colors`}
                    />
                    {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
                </div>
            )}

            {(editImage && isEditing) || (post.image && !isEditing) ? (
                <div className="w-full mt-3 mb-4 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-[#0B0F19]">
                    <img
                        src={isEditing ? editImage : post.image || undefined}
                        alt="Post attachment"
                        className="w-full h-auto max-h-100 object-contain"
                        loading="lazy"
                        onError={(e) => {
                            if (isEditing) {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }
                        }}
                        onLoad={(e) => {
                            if (isEditing) {
                                (e.target as HTMLImageElement).style.display = 'block';
                            }
                        }}
                    />
                </div>
            ) : null}

            <div className="flex items-center gap-1.5 mt-2">
                <button
                    onClick={() => onLike(post.id)}
                    disabled={isEditing}
                    className={`group flex items-center gap-1.5 px-2 py-1 -ml-2 rounded-full transition-colors ${
                        post.likedByMe
                            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Heart
                        size={20}
                        fill={post.likedByMe ? 'currentColor' : 'none'}
                        className={!isEditing ? 'transition-all' : ''}
                    />
                    {post.likesCount > 0 && (
                        <span className={`text-sm ${post.likedByMe ? 'font-semibold' : ''}`}>{post.likesCount}</span>
                    )}
                </button>
            </div>
        </div>
    );
}
