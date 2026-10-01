/**
 * Bagian Node.js-only dari instrumentation — tidak boleh di-import langsung oleh
 * edge runtime.
 *
 * Menangkap unhandledRejection dari race condition TransformStream internal
 * Node.js v22+/v24 yang muncul saat SSR streaming di-cancel klien.
 */

const originalEmit = process.emit

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(process as any).emit = function (event: string, ...args: any[]) {
    if (event === 'unhandledRejection') {
        const error = args[0]
        if (
            error instanceof TypeError &&
            error.message?.includes('transformAlgorithm')
        ) {
            // Diam-diam — error ini tidak berbahaya.
            return false
        }
    }
    return originalEmit.call(process, event, ...args)
}
