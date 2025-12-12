import { useState, useRef, useEffect } from 'react';
import { Music, Download, Upload, AlertCircle, Loader } from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export default function AudioConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [format, setFormat] = useState('mp3');
    const [bitrate, setBitrate] = useState('192k');
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const fileInputRef = useRef<HTMLInputElement>(null);

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on('progress', ({ progress }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setLoaded(true);
        } catch (err: any) {
            console.error(err);
            setError('Failed to load FFmpeg. Your browser might not support SharedArrayBuffer or blocked the script.');
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setResult(null);
            setError('');
        }
    };

    const fetchFile = async (file: File) => {
        return new Uint8Array(await file.arrayBuffer());
    };

    const handleConvert = async () => {
        if (!file || !loaded) return;
        setLoading(true);
        setError('');
        setResult(null);
        setProgress(0);

        const ffmpeg = ffmpegRef.current;

        try {
            const inputName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
            const outputName = `output.${format}`;

            await ffmpeg.writeFile(inputName, await fetchFile(file));

            // Bitrate mapping
            const bitrateMap: Record<string, string> = {
                '128k': '128k',
                '192k': '192k',
                '256k': '256k',
                '320k': '320k'
            };

            await ffmpeg.exec(['-i', inputName, '-b:a', bitrateMap[bitrate], outputName]);

            const data = await ffmpeg.readFile(outputName);
            const blob = new Blob([data as any], { type: `audio/${format}` });
            const url = URL.createObjectURL(blob);
            setResult(url);
        } catch (err: any) {
            console.error(err);
            setError('Conversion failed. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setResult(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Music className="w-6 h-6 text-green-500" />
                    Audio Converter (Client-Side)
                </h2>

                {!loaded && !error && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center gap-2 mb-6">
                        <Loader className="w-5 h-5 animate-spin" />
                        Loading Audio Processing Engine...
                    </div>
                )}

                <label className="cursor-pointer block mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-green-500 transition-colors">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 dark:text-slate-400">
                                {file ? file.name : 'Click to upload audio file'}
                            </p>
                            <p className="text-sm text-slate-500">Supports most audio formats</p>
                        </div>
                    </div>
                </label>

                {file && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Output Format</label>
                                <select value={format} onChange={(e) => setFormat(e.target.value)} className="input-field">
                                    <option value="mp3">MP3</option>
                                    <option value="wav">WAV</option>
                                    <option value="ogg">OGG</option>
                                    <option value="m4a">M4A</option>
                                    <option value="aac">AAC</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bitrate</label>
                                <select value={bitrate} onChange={(e) => setBitrate(e.target.value)} className="input-field">
                                    <option value="128k">128 kbps</option>
                                    <option value="192k">192 kbps</option>
                                    <option value="256k">256 kbps</option>
                                    <option value="320k">320 kbps</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleConvert}
                            disabled={loading || !loaded}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin inline mr-2" />
                                    Converting... {progress}%
                                </>
                            ) : (
                                'Convert Audio'
                            )}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {result && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                        <p className="text-green-800 dark:text-green-200 mb-2 font-medium">Conversion Successful!</p>
                        <audio controls src={result} className="w-full mb-2" />
                        <a href={result} download={`converted.${format}`} className="btn-primary inline-flex items-center gap-2">
                            <Download className="w-4 h-4" /> Download Converted File
                        </a>
                    </div>
                )}

                {file && (
                    <button onClick={handleClear} className="btn-secondary w-full mt-4">Clear</button>
                )}
            </div>
        </div>
    );
}
