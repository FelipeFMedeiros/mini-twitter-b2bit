import { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
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
                    <div>
                        <Trash2 size={40} className="text-red-500 mx-auto" />
                    </div>

                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-twitter-light-text dark:text-white mb-2">
                            Excluir postagem?
                        </h2>
                        <p className="text-twitter-light-text-secondary dark:text-twitter-dark-text-secondary text-[15px]">
                            Essa ação não pode ser desfeita e a postagem será removida do seu perfil, da timeline de
                            outras pessoas e dos resultados de busca.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-full hover:bg-red-600 transition-colors hover:cursor-pointer"
                        >
                            Excluir
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-transparent border border-twitter-light-border dark:border-twitter-light-text-secondary text-twitter-light-text dark:text-white font-bold py-3 px-6 rounded-full hover:bg-twitter-light-background-hover dark:hover:bg-twitter-dark-background-secondary transition-colors hover:cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
