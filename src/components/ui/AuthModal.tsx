import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, MessageSquare } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    action: 'like' | 'post' | null;
}

export default function AuthModal({ isOpen, onClose, action }: AuthModalProps) {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const content = {
        like: {
            icon: <Heart size={40} className="text-twitter-pink mx-auto fill-current" />,
            title: 'Curta um post para compartilhar o amor.',
            description: 'Junte-se ao projeto agora para mostrar que você curtiu o post.',
        },
        post: {
            icon: <MessageSquare size={40} className="text-twitter-blue mx-auto fill-current" />,
            title: 'Faça um post para participar da conversa.',
            description: 'Junte-se ao projeto agora para compartilhar o que está na sua mente.',
        },
    };

    const activeContent = action ? content[action] : content.like;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-[#5b7083]/40"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-md bg-twitter-light-background dark:bg-black rounded-2xl shadow-xl p-8 m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 p-2 text-twitter-light-text dark:text-white hover:bg-twitter-light-background-hover dark:hover:bg-twitter-dark-background-hover rounded-full transition-colors"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="mt-8 text-center flex flex-col gap-6">
                    <div>{activeContent.icon}</div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-twitter-light-text dark:text-white mb-2">
                            {activeContent.title}
                        </h2>
                        <p className="text-twitter-light-text-secondary dark:text-twitter-dark-text-secondary text-[15px]">
                            {activeContent.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-twitter-light-text dark:bg-white text-white dark:text-black font-bold py-3 px-6 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors hover:cursor-pointer"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full bg-transparent border border-twitter-light-border dark:border-twitter-light-text-secondary text-twitter-light-text dark:text-white font-bold py-3 px-6 rounded-full hover:bg-twitter-light-background-hover dark:hover:bg-twitter-dark-background-secondary transition-colors hover:cursor-pointer"
                        >
                            Inscrever-se
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
