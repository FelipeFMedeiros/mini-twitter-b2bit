export default function Footer() {
    return (
        <footer className="bg-white dark:bg-twitter-dark-background border-t border-gray-100 dark:border-gray-800 px-6 py-5 flex items-center justify-between transition-colors duration-200 text-sm text-gray-500 dark:text-gray-400">
            <div className="font-bold text-twitter-blue">
                Mini Twitter
            </div>
            <div>
                Desenvolvido por{' '}
                <a
                    href="https://github.com/FelipeFMedeiros"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-twitter-blue hover:opacity-80 transition-opacity"
                >
                    @FelipeFMedeiros
                </a>
            </div>
        </footer>
    );
}
