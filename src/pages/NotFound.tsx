export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-twitter-light-background dark:bg-twitter-dark-background">
            <h1 className="text-6xl font-bold text-twitter-blue">404</h1>
            <p className="text-twitter-light-text-secondary dark:text-twitter-dark-text-secondary text-lg">
                Página não encontrada
            </p>
            <a href="/" className="btn-primary mt-2">
                Voltar para o início
            </a>
        </div>
    );
}
