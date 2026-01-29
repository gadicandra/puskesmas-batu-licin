export default function DemoPage() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-primary">
                        Puskesmas Batu Licin - Design System
                    </h1>
                    <p className="text-tertiary">
                        Demo halaman untuk semua warna, font, dan weight
                    </p>
                </div>

                {/* Font Weights Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-heavy text-primary border-b border-tertiary-200 pb-2">
                        Font Avenir - Weights
                    </h2>
                    <div className="grid gap-4">
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-tertiary-100">
                            <p className="font-avenir font-light text-2xl text-primary">
                                font-light (300) - Avenir Light
                            </p>
                            <code className="text-sm text-tertiary">className=&quot;font-avenir font-light&quot;</code>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-tertiary-100">
                            <p className="font-avenir font-book text-2xl text-primary">
                                font-book (400) - Avenir Book
                            </p>
                            <code className="text-sm text-tertiary">className=&quot;font-avenir font-book&quot;</code>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-tertiary-100">
                            <p className="font-avenir font-regular text-2xl text-primary">
                                font-regular (500) - Avenir Regular
                            </p>
                            <code className="text-sm text-tertiary">className=&quot;font-avenir font-regular&quot;</code>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-tertiary-100">
                            <p className="font-avenir font-heavy text-2xl text-primary">
                                font-heavy (700) - Avenir Heavy
                            </p>
                            <code className="text-sm text-tertiary">className=&quot;font-avenir font-heavy&quot;</code>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-tertiary-100">
                            <p className="font-avenir font-black text-2xl text-primary">
                                font-black (900) - Avenir Black
                            </p>
                            <code className="text-sm text-tertiary">className=&quot;font-avenir font-black&quot;</code>
                        </div>
                    </div>
                </section>

                {/* Primary Colors Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-heavy text-primary border-b border-tertiary-200 pb-2">
                        Primary Colors
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                            <div key={shade} className="space-y-2">
                                <div
                                    className={`h-20 rounded-lg bg-primary-${shade} border border-tertiary-200`}
                                    style={{ backgroundColor: `var(--color-primary-${shade})` }}
                                />
                                <div className="text-center">
                                    <p className="font-regular text-sm text-primary">primary-{shade}</p>
                                    <code className="text-xs text-tertiary">bg-primary-{shade}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Text Colors */}
                    <div className="grid gap-2 mt-4">
                        <p className="text-primary-50 bg-primary-900 p-2 rounded">text-primary-50</p>
                        <p className="text-primary-100 bg-primary-900 p-2 rounded">text-primary-100</p>
                        <p className="text-primary-200 bg-primary-900 p-2 rounded">text-primary-200</p>
                        <p className="text-primary-300 bg-primary-800 p-2 rounded">text-primary-300</p>
                        <p className="text-primary-400 bg-primary-800 p-2 rounded">text-primary-400</p>
                        <p className="text-primary-500 bg-primary-100 p-2 rounded">text-primary-500</p>
                        <p className="text-primary-600 bg-primary-100 p-2 rounded">text-primary-600</p>
                        <p className="text-primary-700 bg-primary-100 p-2 rounded">text-primary-700</p>
                        <p className="text-primary-800 bg-primary-100 p-2 rounded">text-primary-800</p>
                        <p className="text-primary-900 bg-primary-100 p-2 rounded">text-primary-900</p>
                        <p className="text-primary-950 bg-primary-100 p-2 rounded">text-primary-950</p>
                    </div>
                </section>

                {/* Secondary Colors Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-heavy text-secondary border-b border-secondary-200 pb-2">
                        Secondary Colors (Green)
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                            <div key={shade} className="space-y-2">
                                <div
                                    className={`h-20 rounded-lg border border-tertiary-200`}
                                    style={{ backgroundColor: `var(--color-secondary-${shade})` }}
                                />
                                <div className="text-center">
                                    <p className="font-regular text-sm text-primary">secondary-{shade}</p>
                                    <code className="text-xs text-tertiary">bg-secondary-{shade}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Text Colors */}
                    <div className="grid gap-2 mt-4">
                        <p className="text-secondary-50 bg-secondary-900 p-2 rounded">text-secondary-50</p>
                        <p className="text-secondary-100 bg-secondary-900 p-2 rounded">text-secondary-100</p>
                        <p className="text-secondary-200 bg-secondary-900 p-2 rounded">text-secondary-200</p>
                        <p className="text-secondary-300 bg-secondary-800 p-2 rounded">text-secondary-300</p>
                        <p className="text-secondary-400 bg-secondary-800 p-2 rounded">text-secondary-400</p>
                        <p className="text-secondary-500 bg-secondary-100 p-2 rounded">text-secondary-500</p>
                        <p className="text-secondary-600 bg-secondary-100 p-2 rounded">text-secondary-600</p>
                        <p className="text-secondary-700 bg-secondary-100 p-2 rounded">text-secondary-700</p>
                        <p className="text-secondary-800 bg-secondary-100 p-2 rounded">text-secondary-800</p>
                        <p className="text-secondary-900 bg-secondary-100 p-2 rounded">text-secondary-900</p>
                        <p className="text-secondary-950 bg-secondary-100 p-2 rounded">text-secondary-950</p>
                    </div>
                </section>

                {/* Tertiary Colors Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-heavy text-tertiary border-b border-tertiary-200 pb-2">
                        Tertiary Colors (Gray)
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                            <div key={shade} className="space-y-2">
                                <div
                                    className={`h-20 rounded-lg border border-tertiary-200`}
                                    style={{ backgroundColor: `var(--color-tertiary-${shade})` }}
                                />
                                <div className="text-center">
                                    <p className="font-regular text-sm text-primary">tertiary-{shade}</p>
                                    <code className="text-xs text-tertiary">bg-tertiary-{shade}</code>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Text Colors */}
                    <div className="grid gap-2 mt-4">
                        <p className="text-tertiary-50 bg-tertiary-900 p-2 rounded">text-tertiary-50</p>
                        <p className="text-tertiary-100 bg-tertiary-900 p-2 rounded">text-tertiary-100</p>
                        <p className="text-tertiary-200 bg-tertiary-900 p-2 rounded">text-tertiary-200</p>
                        <p className="text-tertiary-300 bg-tertiary-800 p-2 rounded">text-tertiary-300</p>
                        <p className="text-tertiary-400 bg-tertiary-800 p-2 rounded">text-tertiary-400</p>
                        <p className="text-tertiary-500 bg-tertiary-100 p-2 rounded">text-tertiary-500</p>
                        <p className="text-tertiary-600 bg-tertiary-100 p-2 rounded">text-tertiary-600</p>
                        <p className="text-tertiary-700 bg-tertiary-100 p-2 rounded">text-tertiary-700</p>
                        <p className="text-tertiary-800 bg-tertiary-100 p-2 rounded">text-tertiary-800</p>
                        <p className="text-tertiary-900 bg-tertiary-100 p-2 rounded">text-tertiary-900</p>
                        <p className="text-tertiary-950 bg-tertiary-100 p-2 rounded">text-tertiary-950</p>
                    </div>
                </section>

                {/* Base Color */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-heavy text-primary border-b border-tertiary-200 pb-2">
                        Base Color
                    </h2>
                    <div className="flex gap-4">
                        <div className="space-y-2">
                            <div className="h-20 w-40 rounded-lg bg-base border-2 border-tertiary-300" />
                            <div className="text-center">
                                <p className="font-regular text-sm text-primary">Base (#FFFFFF)</p>
                                <code className="text-xs text-tertiary">bg-base</code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Combined Examples */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-heavy text-primary border-b border-tertiary-200 pb-2">
                        Combined Examples
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Card Example 1 */}
                        <div className="p-6 bg-primary-900 rounded-xl text-base">
                            <h3 className="font-avenir font-heavy text-xl mb-2">Card Primary Dark</h3>
                            <p className="font-avenir font-light text-primary-200">
                                Background: bg-primary-900, Text: text-base
                            </p>
                        </div>

                        {/* Card Example 2 */}
                        <div className="p-6 bg-secondary-500 rounded-xl text-base">
                            <h3 className="font-avenir font-heavy text-xl mb-2">Card Secondary</h3>
                            <p className="font-avenir font-light text-secondary-100">
                                Background: bg-secondary-500, Text: text-base
                            </p>
                        </div>

                        {/* Card Example 3 */}
                        <div className="p-6 bg-tertiary-100 rounded-xl text-primary">
                            <h3 className="font-avenir font-heavy text-xl mb-2">Card Tertiary Light</h3>
                            <p className="font-avenir font-regular text-tertiary-600">
                                Background: bg-tertiary-100, Text: text-primary
                            </p>
                        </div>

                        {/* Card Example 4 */}
                        <div className="p-6 bg-gradient-to-r from-primary-800 to-secondary-600 rounded-xl text-base">
                            <h3 className="font-avenir font-black text-xl mb-2">Gradient Card</h3>
                            <p className="font-avenir font-book">
                                Gradient dari primary ke secondary
                            </p>
                        </div>
                    </div>
                </section>

                {/* Border Examples */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-heavy text-primary border-b border-tertiary-200 pb-2">
                        Border Colors
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 border-2 border-primary rounded-lg">
                            <p className="text-primary font-regular">border-primary</p>
                        </div>
                        <div className="p-4 border-2 border-secondary rounded-lg">
                            <p className="text-secondary font-regular">border-secondary</p>
                        </div>
                        <div className="p-4 border-2 border-tertiary rounded-lg">
                            <p className="text-tertiary font-regular">border-tertiary</p>
                        </div>
                        <div className="p-4 border-2 border-primary-300 rounded-lg">
                            <p className="text-primary font-regular">border-primary-300</p>
                        </div>
                        <div className="p-4 border-2 border-secondary-300 rounded-lg">
                            <p className="text-secondary font-regular">border-secondary-300</p>
                        </div>
                        <div className="p-4 border-2 border-tertiary-300 rounded-lg">
                            <p className="text-tertiary font-regular">border-tertiary-300</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center py-8 border-t border-tertiary-200">
                    <p className="text-tertiary font-light">
                        Puskesmas Batu Licin Design System © 2026
                    </p>
                </footer>
            </div>
        </div>
    );
}
