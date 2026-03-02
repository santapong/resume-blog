export default function Footer() {
    return (
        <footer className="bg-dark-wood border-t-2 border-gold">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Decorative top */}
                <div className="flex justify-center mb-6">
                    <span className="text-gold text-2xl">⚜️</span>
                </div>

                {/* Content */}
                <div className="text-center space-y-3">
                    <p className="font-[family-name:var(--font-heading)] text-gold text-sm tracking-[0.2em] uppercase">
                        The Scribe&apos;s Mark
                    </p>
                    <p className="text-parchment/60 text-sm">
                        Forged with dedication and craftsmanship
                    </p>
                    <p className="text-parchment/40 text-xs">
                        &copy; {new Date().getFullYear()} &middot; All rights reserved
                    </p>
                </div>

                {/* Decorative bottom */}
                <div className="mt-6 flex items-center gap-3 justify-center">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
                    <span className="text-gold/50 text-xs">✦</span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
                </div>
            </div>
        </footer>
    );
}
